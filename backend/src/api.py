"""
Observe AI — FastAPI Backend
────────────────────────────
Architecture:
  Child device  →  /api/ws/capture/{session_id}  →  Saves to DB + broadcasts to parents
  Parent device ←  /api/ws/session               ←  Receives live telemetry + video frame

All AI tracking runs client-side (MediaPipe JS in browser).
Report generation uses Amazon Bedrock (Claude).
"""

import sys
import os
import time
import uuid
import json
import sqlite3
import datetime
from typing import List, Optional

# Ensure src/ is on path so relative imports work
sys.path.append(os.path.dirname(__file__))

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from database.database import Database
from analytics.evidence_engine import EvidenceEngine
from analytics.session_analyzer import SessionAnalyzer
from reporting.report_templates import ReportTemplates
from reporting.report_generator import ReportGenerator
from grow.goal_engine import GoalEngine
from grow.recommendation_engine import RecommendationEngine
from track.progress_tracker import ProgressTracker
from activity.activity_engine import ActivityRuntime
from activity.scoring import ScoringEngine
from activity.activity_definitions import ACTIVITIES
from activities.a1_natural_interaction.logic import Activity1Logic
from activities.a2_follow_instruction.logic import Activity2Logic
from activities.a3_target_finding.logic import Activity3Logic
from activities.a4_imitation.logic import Activity4Logic
from activities.a5_emotion_social.logic import Activity5Logic
from activities.a6_controlled_challenge.logic import Activity6Logic


# ═══════════════════════════════════════════════════════════════
# App + CORS
# ═══════════════════════════════════════════════════════════════
app = FastAPI(title="Observe AI API", version="2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# DB path — configurable via env var for AWS deployment
DB_PATH = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "observe.db")
)


# ═══════════════════════════════════════════════════════════════
# WebSocket Connection Manager
# ═══════════════════════════════════════════════════════════════
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in list(self.active_connections):
            try:
                await connection.send_text(message)
            except Exception:
                self.disconnect(connection)


manager = ConnectionManager()


# ═══════════════════════════════════════════════════════════════
# WS: Child capture → DB → broadcast to parent
# ═══════════════════════════════════════════════════════════════
@app.websocket("/api/ws/capture/{session_id}")
async def websocket_capture(websocket: WebSocket, session_id: str):
    await websocket.accept()
    db = Database(DB_PATH)
    consecutive_distracted = 0
    consecutive_unstable = 0
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            metrics = payload.get("metrics", {})

            pitch             = metrics.get("pitch", 0) or 0
            yaw               = metrics.get("yaw", 0) or 0
            ear               = metrics.get("ear", 0) or 0
            blinks            = metrics.get("blinks", 0) or 0
            aversions         = metrics.get("aversions", 0) or 0
            flapping_events   = metrics.get("flappingEvents", 0) or 0
            posture_stable    = metrics.get("postureStable", True)
            status            = metrics.get("status", "Unknown")

            # Persist full telemetry row
            db.insert_telemetry(
                session_id=session_id,
                timestamp=time.time(),
                pitch=pitch, yaw=yaw, roll=0, status=status,
                ear=ear, blinks=blinks, aversions=aversions,
                flapping_events=flapping_events,
                posture_stable=1 if posture_stable else 0,
            )

            # ── Clinical anomaly detection ────────────────────────────
            # Gaze aversion (5 consecutive distracted frames ≈ 2.5 s)
            is_distracted = "Distracted" in status or "Avoidance" in status
            consecutive_distracted = (consecutive_distracted + 1) if is_distracted else 0
            if consecutive_distracted == 5:
                db.insert_event(session_id, time.time(), "GAZE_AVERSION", "HIGH",
                                f"Yaw={yaw:.1f}, Pitch={pitch:.1f}")
                consecutive_distracted = 0

            # Posture instability (6 consecutive unstable frames ≈ 3 s)
            consecutive_unstable = (consecutive_unstable + 1) if not posture_stable else 0
            if consecutive_unstable == 6:
                db.insert_event(session_id, time.time(), "POSTURE_UNSTABLE", "MEDIUM",
                                "Head position unstable for 3+ seconds")
                consecutive_unstable = 0

            # One-shot motor events (frontend already debounces)
            for flag, etype, sev, detail in [
                ("newFlap",    "HAND_FLAPPING",   "HIGH",   "Rapid wrist oscillation"),
                ("newRock",    "BODY_ROCKING",    "HIGH",   "Rhythmic shoulder oscillation"),
                ("newPosture", "WRIST_POSTURING", "MEDIUM", "Elevated wrists, low velocity"),
                ("newFlick",   "FINGER_FLICKING", "MEDIUM", "Rapid thumb-index oscillation"),
                ("newTic",     "HEAD_TIC",        "HIGH",   "Rapid involuntary head movement"),
            ]:
                if metrics.get(flag, False):
                    db.insert_event(session_id, time.time(), etype, sev, detail)

            # ── Broadcast to parent dashboard ─────────────────────────
            try:
                await manager.broadcast(json.dumps({
                    "type":       "telemetry",
                    "metrics":    metrics,
                    "session_id": session_id,
                    "image":      payload.get("image"),
                }))
            except Exception as e:
                print(f"[Broadcast error] {e}")

    except WebSocketDisconnect:
        print(f"[WS capture] Disconnected: {session_id}")


# ═══════════════════════════════════════════════════════════════
# WS: Parent session monitor
# ═══════════════════════════════════════════════════════════════
@app.websocket("/api/ws/session")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_str = await websocket.receive_text()
            try:
                data = json.loads(data_str)
            except Exception:
                continue

            msg_type = data.get("type")
            if msg_type == "session_end":
                try:
                    await manager.broadcast(json.dumps({"type": "session_end", "sessionActive": False}))
                except Exception as e:
                    print(f"[WS session] session_end broadcast error: {e}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS session] Fatal error: {e}")
        manager.disconnect(websocket)


# ═══════════════════════════════════════════════════════════════
# Dashboard
# ═══════════════════════════════════════════════════════════════
@app.get("/api/dashboard")
def get_dashboard_data(patient_id: str = "P1"):
    db = Database(DB_PATH)
    metrics = db.get_dashboard_metrics(patient_id)
    recent = db.get_recent_sessions(patient_id, limit=5)

    formatted_recent = []
    for s in recent:
        try:
            start = float(s["start_time"])
            end = float(s["end_time"] or start + 300)
            dur_min = max(1, int((end - start) / 60))
            dt = datetime.datetime.fromtimestamp(start).strftime("%b %d, %H:%M")
        except Exception:
            dur_min = 5
            dt = "Recently"

        acc = s.get("accuracy")
        acc_str = f"{int(acc * 100)}%" if acc is not None else "N/A"
        formatted_recent.append({
            "id":       s["session_id"][:8],
            "activity": f"Activity ({s['activity_id']})" if s.get("activity_id") else "Activity",
            "time":     dt,
            "duration": f"{dur_min}m",
            "accuracy": acc_str,
            "status":   "Completed",
        })

    # Build chart data from real history
    response_latency_data = []
    interaction_duration_data = []
    
    if not recent:
        # Provide an empty grid structure so the frontend graph axes render
        for i in range(1, 6):
            response_latency_data.append({"name": f"Session {i}", "latency": None})
            interaction_duration_data.append({"name": f"Session {i}", "duration": None})
    else:
        for i, s in enumerate(reversed(recent), start=1):
            label = f"Session {i}"
            response_latency_data.append({
                "name":    label,
                "latency": s.get("response_time_sec"),
            })
            try:
                start = float(s["start_time"])
                end = float(s["end_time"] or start)
                dur = round((end - start) / 60, 1)
            except Exception:
                dur = None
            interaction_duration_data.append({"name": label, "duration": dur})

    total_sessions = metrics["total_sessions"]
    hand_flapping = metrics["hand_flapping"]
    body_rocking  = metrics["body_rocking"]
    motor_total   = metrics["motor_events_total"]
    focus_pct     = metrics["focus_percent"]
    posture_pct   = metrics["posture_percent"]
    aversions     = metrics["aversions"]

    posture_label = "No Data" if total_sessions == 0 else ("Stable" if posture_pct >= 70 else "Unstable")
    movement_label = "No Data" if total_sessions == 0 else ("Calm" if motor_total == 0 else "Active")
    focus_label = "No Data" if total_sessions == 0 else f"{focus_pct}%"

    return {
        "stats": {
            "totalSessions": {
                "value":      total_sessions,
                "trend":      f"+{min(total_sessions, 2)} this week",
                "isPositive": True,
                "label":      "Total Sessions",
            },
            "headOrientation": {
                "value":      posture_label,
                "trend":      f"{aversions} Aversion Event(s)",
                "isPositive": posture_pct >= 70,
                "label":      "Posture Stability",
            },
            "bodyMovement": {
                "value":              movement_label,
                "handFlapping":       f"{hand_flapping} instance(s)",
                "repeatedMovements":  f"{body_rocking} instance(s)" if body_rocking else "None",
                "motorEventsTotal":   motor_total,
                "label":              "Body Movement",
            },
            "eyeTracking": {
                "value":      focus_label,
                "trend":      f"{aversions} gaze aversion(s)",
                "isPositive": focus_pct >= 70,
                "label":      "Visual Focus",
            },
        },
        "recentSessions":        formatted_recent,
        "chartData":             [],
        "responseLatencyData":   response_latency_data,
        "interactionDurationData": interaction_duration_data,
    }


# ═══════════════════════════════════════════════════════════════
# Profiles
# ═══════════════════════════════════════════════════════════════
@app.get("/api/profiles")
def get_profiles():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        row = conn.execute("SELECT * FROM participants LIMIT 1").fetchone()
    patient = dict(row) if row else {"name": "No Patient", "age": 0}
    return {"patient": patient, "longitudinalData": [], "reports": []}


# ═══════════════════════════════════════════════════════════════
# Reports list
# ═══════════════════════════════════════════════════════════════
@app.get("/api/reports")
def get_reports():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute(
            """SELECT s.session_id as id, COALESCE(p.name, s.participant_id) as patient,
                      s.start_time as date, s.activity_id
               FROM sessions s
               LEFT JOIN participants p ON s.participant_id = p.participant_id
               ORDER BY s.start_time DESC"""
        ).fetchall()
    reports = []
    for row in rows:
        reports.append({
            "id":      f"R-{row['id']}",
            "patient": row["patient"],
            "date":    row["date"],
            "activity": row["activity_id"],
            "type":    "Session Summary",
            "status":  "Reviewed",
        })
    return {"reports": reports}


# ═══════════════════════════════════════════════════════════════
# Report detail (Bedrock AI report)
# ═══════════════════════════════════════════════════════════════
@app.get("/api/reports/{report_id}")
def get_report_detail(report_id: str):
    session_id = report_id.replace("R-", "")
    db = Database(DB_PATH)
    session_data = db.get_session_full_summary(session_id)

    evidence_engine = EvidenceEngine()
    insight = evidence_engine.analyze_repetition_context(session_data.get("events", []))

    report_content = ReportTemplates.get_empty_template()

    session = session_data.get("session", {})
    if not session:
        report_content["1_session_overview"]["content"] = "Session data not found."
        return {"id": report_id, "sections": report_content, "ai_report": None}

    acc = session.get("accuracy")
    acc_str = f"{int(acc * 100)}%" if acc is not None else "N/A"
    telem = session_data.get("telemetry", {})
    frames = telem.get("frames", 0) or 0
    focus_frames = telem.get("focus_frames", 0) or 0
    focus_pct = round(focus_frames / frames * 100, 1) if frames > 0 else 0
    event_counts = session_data.get("event_counts", {})
    gaze_aversions = event_counts.get("GAZE_AVERSION", 0)
    motor_total = sum(event_counts.get(k, 0) for k in [
        "HAND_FLAPPING", "BODY_ROCKING", "WRIST_POSTURING", "FINGER_FLICKING", "HEAD_TIC"
    ])

    # Populate template sections with real data
    report_content["1_session_overview"]["content"] = (
        f"Session {session_id[:8]} completed for Activity {session.get('activity_id', 'N/A')}. "
        f"Child achieved {acc_str} accuracy. "
        f"{frames} telemetry frames were captured during the session."
    )
    report_content["2_domain_observations"]["content"] = (
        f"Visual focus was maintained for {focus_pct}% of the session. "
        f"Average response latency: {session.get('response_time_sec', 'N/A')}s. "
        f"EAR (eye-aperture ratio): {round(float(telem.get('avg_ear') or 0), 3)}."
    )
    report_content["3_key_events"]["content"] = (
        f"{gaze_aversions} gaze aversion event(s) detected. "
        f"{motor_total} motor behaviour event(s) detected total. "
        + (f"Breakdown: {json.dumps(event_counts)}." if event_counts else "No notable events.")
    )

    if insight:
        report_content["4_contextual_patterns"]["content"] = (
            f"{insight['statement']} "
            f"Evidence: {insight['evidence']['total_events']} total events recorded."
        )
    else:
        report_content["4_contextual_patterns"]["content"] = (
            "No repetitive behavioural patterns were detected in this session."
        )

    # Longitudinal trend from ProgressTracker
    tracker = ProgressTracker(db_path=DB_PATH)
    trends = tracker.compute_trends(
        participant_id=session.get("participant_id", "P1"),
        activity_id=session.get("activity_id", ""),
    )
    report_content["5_longitudinal_trends"]["content"] = (
        f"Accuracy trend across {trends['sessions_supported']} session(s): "
        f"{trends['accuracy_trend']}. "
        f"Average response time: {trends['average_response_time']}s."
    )
    report_content["6_professional_review"]["content"] = "Pending clinical review."

    # Generate AI narrative via Bedrock
    generator = ReportGenerator()
    ai_result = generator.generate_report(session_data, insight)

    return {
        "id":         report_id,
        "sections":   report_content,
        "ai_report":  ai_result,
    }


# ═══════════════════════════════════════════════════════════════
# Grow — Recommendations
# ═══════════════════════════════════════════════════════════════
@app.get("/api/grow/recommend")
def get_recommendation(patient_id: str = "P1"):
    goal_engine = GoalEngine(db_path=DB_PATH)
    rec_engine = RecommendationEngine()
    db = Database(DB_PATH)

    goals = goal_engine.get_active_goals(patient_id)
    if not goals:
        goals = goal_engine.seed_default_goals(patient_id)

    # Real recent accuracy from DB
    recent = db.get_recent_sessions(patient_id, limit=5)
    valid_acc = [s["accuracy"] for s in recent if s.get("accuracy") is not None]
    avg_accuracy = sum(valid_acc) / len(valid_acc) if valid_acc else None
    recent_performance = {"accuracy": avg_accuracy}

    recommendations = rec_engine.recommend_all(goals, recent_performance)

    return {
        "recommendations": recommendations,
        "goals_count":     len(goals),
        "sessions_analysed": len(recent),
        "avg_accuracy":    round((avg_accuracy or 0) * 100, 1),
    }


# ═══════════════════════════════════════════════════════════════
# Track — Progress Trends
# ═══════════════════════════════════════════════════════════════
@app.get("/api/track/trends")
def get_trends(patient_id: str = "P1", activity_id: str = "A2"):
    tracker = ProgressTracker(db_path=DB_PATH)
    return tracker.compute_trends(participant_id=patient_id, activity_id=activity_id)


# ═══════════════════════════════════════════════════════════════
# Activities
# ═══════════════════════════════════════════════════════════════
@app.get("/api/activities")
def get_activities():
    acts = []
    for aid, meta in ACTIVITIES.items():
        acts.append({
            "id":               aid,
            "name":             meta["name"],
            "domain":           meta["domain"],
            "description":      meta.get("instructions", ""),
            "difficulty_levels": meta.get("difficulty_levels", ["Low"]),
        })
    return acts


# ═══════════════════════════════════════════════════════════════
# Goals
# ═══════════════════════════════════════════════════════════════
@app.get("/api/grow/goals")
def get_goals(patient_id: str = "P1"):
    goal_engine = GoalEngine(db_path=DB_PATH)
    goals = goal_engine.get_active_goals(patient_id)
    if not goals:
        goals = goal_engine.seed_default_goals(patient_id)
    return goals


# ═══════════════════════════════════════════════════════════════
# Session lifecycle (legacy endpoints used by old activities)
# ═══════════════════════════════════════════════════════════════
active_sessions: dict = {}


@app.post("/api/session/start")
def start_session(activity_id: str, patient_id: str = "P1"):
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    active_sessions[session_id] = runtime
    db = Database(DB_PATH)
    db.add_participant(patient_id, "Child", 5, time.time())
    db.start_session(session_id, patient_id, time.time(), activity_id, "Low")
    return {"status": "started", "session_id": session_id}


@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id not in active_sessions:
        return {"error": "Session not found"}
    runtime = active_sessions.pop(session_id)
    result = runtime.finish(completion_status="COMPLETED")
    # Use actual runtime accuracy if available, otherwise 0
    accuracy = result.get("accuracy") or 0.0
    response_time = result.get("response_time_sec") or 0.0
    db = Database(DB_PATH)
    db.end_session(session_id, time.time(), accuracy, response_time)
    return {"status": "ended", "result": result}


# ═══════════════════════════════════════════════════════════════
# Sessions API (new endpoints used by activities via HCP)
# ═══════════════════════════════════════════════════════════════
class StartSessionReq(BaseModel):
    participant_id: str = "P1"
    activity_id: str
    difficulty: int = 1


class LogEventReq(BaseModel):
    event_type: str
    severity: str = "MEDIUM"
    details: str = ""


class EndSessionReq(BaseModel):
    accuracy: float = 0.0
    response_time_sec: float = 0.0


@app.post("/api/sessions/start")
def api_start_session(req: StartSessionReq):
    session_id = f"S-{uuid.uuid4().hex[:8]}"
    start_time = time.time()
    db = Database(DB_PATH)
    db.add_participant(req.participant_id, "Child", 5, start_time)
    db.start_session(session_id, req.participant_id, start_time, req.activity_id, req.difficulty)
    return {"session_id": session_id, "start_time": start_time}


@app.post("/api/sessions/{session_id}/events")
def api_log_event(session_id: str, req: LogEventReq):
    db = Database(DB_PATH)
    db.insert_event(session_id, time.time(), req.event_type, req.severity, req.details)
    return {"status": "event_logged"}


@app.post("/api/sessions/{session_id}/end")
def api_end_session(session_id: str, req: EndSessionReq):
    db = Database(DB_PATH)
    end_time = time.time()
    db.end_session(session_id, end_time, req.accuracy, req.response_time_sec)

    # Run full session analysis and update goals if accuracy is good
    analyzer = SessionAnalyzer(session_id=session_id, db_path=DB_PATH)
    summary = analyzer.analyze()

    # Auto-advance goal baseline if accuracy improved
    if req.accuracy >= 0.7:
        participant_id = "P1"  # Will be available from session row in summary
        db.update_goal_baseline(
            participant_id=participant_id,
            domain="Instruction Following",
            new_baseline=f"{int(req.accuracy * 100)}% (recent session)"
        )

    return {
        "status":     "session_ended",
        "session_id": session_id,
        "summary":    summary,
    }


# ═══════════════════════════════════════════════════════════════
# Activity submissions
# ═══════════════════════════════════════════════════════════════
class A1Submission(BaseModel):
    session_id: str
    name: str
    feeling: str
    animal: str
    day_text: str


@app.post("/api/activities/a1/submit")
def submit_a1(data: A1Submission):
    logic = Activity1Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"]}


class A2Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float


@app.post("/api/activities/a2/submit")
def submit_a2(data: A2Submission):
    logic = Activity2Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


class A3Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float


@app.post("/api/activities/a3/submit")
def submit_a3(data: A3Submission):
    logic = Activity3Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


class A4Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float


@app.post("/api/activities/a4/submit")
def submit_a4(data: A4Submission):
    logic = Activity4Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


class A5Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float


@app.post("/api/activities/a5/submit")
def submit_a5(data: A5Submission):
    logic = Activity5Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


class A6Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float


@app.post("/api/activities/a6/submit")
def submit_a6(data: A6Submission):
    logic = Activity6Logic(DB_PATH)
    result = logic.process_submission(data.session_id, data.dict())
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


# ═══════════════════════════════════════════════════════════════
# Authentication (MVP — accepts any email, returns user context)
# ═══════════════════════════════════════════════════════════════
class ParentLoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""


@app.post("/api/auth/parent/login")
def parent_login_endpoint(data: ParentLoginRequest):
    email = data.email.strip()
    if not email:
        return {"status": "error", "message": "Email is required"}
    username = email.split("@")[0].replace(".", " ").title()
    # Look up children from DB participants
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT participant_id, name, age FROM participants").fetchall()
    children = [{"id": r["participant_id"], "name": r["name"] or "Child", "age": r["age"] or 6}
                for r in rows] or [{"id": "P1", "name": "Child", "age": 6}]
    return {
        "status": "success",
        "user": {
            "role":     "parent",
            "email":    email,
            "name":     username,
            "token":    f"parent_tok_{int(time.time())}",
            "children": children,
        },
    }


@app.post("/api/auth/logout")
def logout_endpoint():
    return {"status": "success", "message": "Logged out successfully"}
