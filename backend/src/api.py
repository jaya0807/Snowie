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

# Initialize database tables on startup to prevent crashing on empty DBs
from database.database import Database
Database(os.path.join(os.path.dirname(__file__), "observe.db"))

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
def get_dashboard_data(patient_id: str = "P1", date: str = None):
    db = Database(DB_PATH)
    metrics = db.get_dashboard_metrics(patient_id, date)
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        all_sessions = conn.execute(
            "SELECT session_id, MIN(start_time) as start_time, MAX(end_time) as end_time, GROUP_CONCAT(activity_id, ', ') as activity_id, AVG(response_time_sec) as response_time_sec "
            "FROM sessions WHERE participant_id=? GROUP BY session_id ORDER BY MIN(start_time) DESC", 
            (patient_id,)
        ).fetchall()
        all_sessions = [dict(r) for r in all_sessions]
        
    if date:
        filtered = []
        for s in all_sessions:
            start_ts = float(s["start_time"])
            s_date = datetime.datetime.fromtimestamp(start_ts).strftime("%Y-%m-%d")
            if s_date == date:
                filtered.append(s)
        recent = filtered[-10:] # last 10 of that day
    else:
        recent = all_sessions[:5]

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
            latency_val = s.get("response_time_sec")
            if latency_val is not None:
                latency_val = round(float(latency_val), 1)
            response_latency_data.append({
                "name":    label,
                "latency": latency_val,
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
def get_reports(patient_id: str = None):
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        query = """SELECT s.session_id as id, COALESCE(p.name, s.participant_id) as patient,
                      MIN(s.start_time) as date, GROUP_CONCAT(s.activity_id, ', ') as activity_id
               FROM sessions s
               LEFT JOIN participants p ON s.participant_id = p.participant_id"""
        
        if patient_id:
            query += f" WHERE s.participant_id = '{patient_id}'"
            
        query += """ GROUP BY s.session_id
               ORDER BY MIN(s.start_time) DESC"""
               
        rows = conn.execute(query).fetchall()
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
    activities_str = session.get('activity_id', 'N/A')
    
    breakdown = session_data.get("activities_breakdown", [])
    breakdown_str = " | ".join([f"{b['activity_id']}: {int(b['accuracy']*100)}% acc" for b in breakdown if b['accuracy'] is not None])
    if breakdown_str:
        breakdown_str = f" Breakdown: {breakdown_str}."
        
    report_content["1_session_overview"]["content"] = (
        f"Session {session_id[:8]} completed for Activities: {activities_str}. "
        f"Child achieved {acc_str} overall accuracy.{breakdown_str} "
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
def get_trends(patient_id: str = "P1", activity_id: str = "all", date: str = None):
    tracker = ProgressTracker(db_path=DB_PATH)
    data = tracker.compute_trends(participant_id=patient_id, activity_id=activity_id)
    
    if date and data.get("history"):
        filtered = []
        for s in data["history"]:
            try:
                start_ts = float(s["start_time"])
                s_date = datetime.datetime.fromtimestamp(start_ts).strftime("%Y-%m-%d")
                if s_date == date:
                    filtered.append(s)
            except Exception:
                pass
        data["history"] = filtered
        
    return data


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
def start_session(activity_id: str, patient_id: str = "P1", force_new: bool = False):
    start_time = time.time()
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(DISTINCT session_id) FROM sessions").fetchone()[0]
        session_id = f"sess-{count + 1:02d}"
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    active_sessions[session_id] = runtime
    db = Database(DB_PATH)
    db.add_participant(patient_id, "Child", 5, time.time())
    db.start_session(session_id, patient_id, time.time(), activity_id, "Low")
    return {"status": "started", "session_id": session_id}


@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id in active_sessions:
        runtime = active_sessions.pop(session_id)
        result = runtime.finish(completion_status="COMPLETED")
        accuracy = result.get("accuracy") or 0.0
        response_time = result.get("response_time_sec") or 0.0
        db = Database(DB_PATH)
        db.end_session(session_id, time.time(), accuracy, response_time)
        return {"status": "ended", "result": result}
    else:
        # Fallback for new architecture
        with sqlite3.connect(DB_PATH) as conn:
            conn.execute("UPDATE sessions SET end_time=COALESCE(end_time, ?) WHERE session_id=?", (time.time(), session_id))
        return {"status": "ended", "note": "session closed without runtime"}


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
    start_time = time.time()
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(DISTINCT session_id) FROM sessions").fetchone()[0]
        session_id = f"sess-{count + 1:02d}"
            
    db = Database(DB_PATH)
    db.add_participant(req.participant_id, "Child", 5, start_time)
    
    # Try to start session. If they restart the exact same activity today, it replaces the old row due to INSERT OR REPLACE
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

    # Master session analysis is now triggered manually via /api/master/end

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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, 0.0)
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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, result.get("avg_latency", 0))
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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, result.get("avg_latency", 0))
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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, result.get("avg_latency", 0))
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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, result.get("avg_latency", 0))
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
    db = Database(DB_PATH)
    db.end_session(data.session_id, time.time(), result.get("accuracy", 0) / 100.0, result.get("avg_latency", 0))
    return {"status": "success", "accuracy": result["accuracy"], "avg_latency": result["avg_latency"]}


# ═══════════════════════════════════════════════════════════════
# Authentication (MVP — accepts any email, returns user context)
# ═══════════════════════════════════════════════════════════════
class ParentLoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""


import hashlib

class ParentSignupRequest(BaseModel):
    fullName: str
    email: str
    password: str
    relationship: str
    childName: str
    childDob: str
    childGender: str

@app.post("/api/auth/parent/signup")
def parent_signup_endpoint(data: ParentSignupRequest):
    email = data.email.strip()
    if not email:
        return {"status": "error", "message": "Email is required"}
    
    db = Database(DB_PATH)
    
    # Check if user already exists
    existing_user = db.get_user_by_email(email)
    if existing_user:
        return {"status": "error", "message": "User with this email already exists"}
        
    # Hash password
    password_hash = hashlib.sha256(data.password.encode()).hexdigest()
    
    # Create user
    user_id = "U-" + str(uuid.uuid4())[:8]
    db.create_user(user_id, email, password_hash, data.fullName, "parent")
    
    # Calculate age roughly from DOB (YYYY-MM-DD)
    try:
        birth_year = int(data.childDob.split('-')[0])
        import datetime
        current_year = datetime.datetime.now().year
        age = current_year - birth_year
    except:
        age = 6
        
    # Create participant (child)
    child_id = "P-" + str(uuid.uuid4())[:8]
    db.create_participant(child_id, data.childName, age, data.fullName, user_id)
    
    children = db.get_children_for_parent(user_id)
    
    return {
        "status": "success",
        "user": {
            "role":     "parent",
            "email":    email,
            "name":     data.fullName,
            "token":    f"auth_tok_{user_id}_{int(time.time())}",
            "children": children,
        },
    }


@app.post("/api/auth/parent/login")
def parent_login_endpoint(data: ParentLoginRequest):
    email = data.email.strip()
    password = data.password or "default_pass"
    child_name = data.childName or "Child"
    
    if not email:
        return {"status": "error", "message": "Email is required"}
    
    db = Database(DB_PATH)
    
    # Simple hash for prototype
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    user = db.get_user_by_email(email)
    
    if not user:
        # Auto-register
        user_id = "U-" + str(uuid.uuid4())[:8]
        username = email.split("@")[0].replace(".", " ").title()
        db.create_user(user_id, email, password_hash, username, "parent")
        
        # Create a default child for the new parent
        child_id = "P-" + str(uuid.uuid4())[:8]
        db.create_participant(child_id, child_name, 6, username, user_id)
        
        user = {"id": user_id, "email": email, "name": username, "role": "parent"}
    else:
        if user["password_hash"] != password_hash:
            return {"status": "error", "message": "Invalid credentials"}
    
    children = db.get_children_for_parent(user["id"])
    
    return {
        "status": "success",
        "user": {
            "role":     user["role"],
            "email":    user["email"],
            "name":     user["name"],
            "token":    f"auth_tok_{user['id']}_{int(time.time())}",
            "children": children,
        },
    }



@app.post("/api/auth/clinician/login")
def clinician_login_endpoint(data: ParentLoginRequest):
    email = data.email.strip()
    password = data.password or "default_pass"
    
    if not email:
        return {"status": "error", "message": "Email is required"}
    
    db = Database(DB_PATH)
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    
    user = db.get_user_by_email(email)
    
    if not user:
        # Auto-register Clinician
        user_id = "U-" + str(uuid.uuid4())[:8]
        username = email.split("@")[0].replace(".", " ").title()
        db.create_user(user_id, email, password_hash, username, "clinician")
        user = {"id": user_id, "email": email, "name": username, "role": "clinician"}
    else:
        if user["password_hash"] != password_hash:
            return {"status": "error", "message": "Invalid credentials"}
        if user["role"] != "clinician":
            return {"status": "error", "message": "Account is not a clinician account"}
            
    return {
        "status": "success",
        "user": {
            "id":       user["id"],
            "role":     user["role"],
            "email":    user["email"],
            "name":     user["name"],
            "token":    f"auth_tok_{user['id']}_{int(time.time())}",
        },
    }

@app.post("/api/auth/logout")
def logout_endpoint():
    return {"status": "success", "message": "Logged out successfully"}

@app.post("/api/master/start")
def master_start():
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(DISTINCT session_id) FROM sessions").fetchone()[0]
        session_id = f"sess-{count + 1:02d}"
    return {"session_id": session_id}

@app.post("/api/master/resume")
def master_resume(patient_id: str = "P1"):
    with sqlite3.connect(DB_PATH) as conn:
        row = conn.execute("SELECT session_id FROM sessions WHERE participant_id=? ORDER BY start_time DESC LIMIT 1", (patient_id,)).fetchone()
        session_id = row[0] if row else "sess-01"
    return {"session_id": session_id}

@app.post("/api/master/end")
def master_end(session_id: str):
    analyzer = SessionAnalyzer(session_id=session_id, db_path=DB_PATH)
    analyzer.analyze()
    return {"status": "analyzed"}

@app.get("/api/master/status")
def master_status(patient_id: str = "P1"):
    with sqlite3.connect(DB_PATH) as conn:
        count = conn.execute("SELECT COUNT(DISTINCT session_id) FROM sessions WHERE participant_id=?", (patient_id,)).fetchone()[0]
    return {"has_history": count > 0}

# ═══════════════════════════════════════════════════════════════
# Clinician Portal
# ═══════════════════════════════════════════════════════════════
@app.get("/api/clinician/patients")
def get_clinician_patients():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        rows = conn.execute("SELECT * FROM participants").fetchall()
        
        patients = []
        for r in rows:
            pid = r["participant_id"]
            # get last session
            last_sess = conn.execute("SELECT start_time FROM sessions WHERE participant_id=? ORDER BY start_time DESC LIMIT 1", (pid,)).fetchone()
            
            import datetime
            if last_sess:
                last_time = datetime.datetime.fromtimestamp(last_sess[0]).strftime("%b %d, %Y, %I:%M %p")
            else:
                last_time = "No sessions yet"
                
            name = r["name"] or "Unknown"
            initials = "".join([n[0] for n in name.split() if n])[:2].upper()
            
            
            import time
            from datetime import datetime
            
            # Try to fetch real DOB from DB if it exists, otherwise just approximate from age
            approx_dob = datetime.fromtimestamp(time.time() - (r["age"] * 31536000)).strftime("%b %d, %Y") if r["age"] else "Unknown"
            
            # Get real metrics to determine status
            db = Database(DB_PATH)
            p_metrics = db.get_dashboard_metrics(pid)
            
            status = "Stable"
            if p_metrics.get("total_sessions", 0) > 0 and p_metrics.get("avg_accuracy", 0) < 50:
                status = "Requires Review"
                
            
            created_at = r["created_at"] if "created_at" in r.keys() else None
            date_of_admission = datetime.fromtimestamp(created_at).strftime("%Y-%m-%d") if created_at else "Unknown"
            parent_name = r["parent_name"] if "parent_name" in r.keys() else "Unknown Parent"
            
            patients.append({
                "id": pid,
                "name": name,
                "age": r["age"],
                "dob": approx_dob,
                "lastSession": last_time,
                "status": status,
                "initials": initials,
                "date_of_admission": date_of_admission,
                "parent_name": parent_name
            })
    return patients

@app.get("/api/clinician/patients/{patient_id}")
def get_clinician_patient_detail(patient_id: str):
    db = Database(DB_PATH)
    metrics = db.get_dashboard_metrics(patient_id)
    
    # Fetch real clinical notes from database (Currently no notes table exists, so returning empty)
    real_notes = []

    # Calculate real trends based on metrics
    total_sessions = metrics.get('total_sessions', 0)
    
    # Calculate a real review alert
    review_alert = None
    if total_sessions > 0 and metrics.get('avg_accuracy', 0) < 50:
        review_alert = f"Patient accuracy has dropped to {metrics.get('avg_accuracy')}%. Consider adjusting activity difficulty."

    # Use real metrics, default to 0 or N/A if no sessions
    visual_focus = f"{metrics.get('focus_percent', 0)}%" if total_sessions > 0 else "N/A"
    gaze_shifts = f"{metrics.get('aversions', 0)} / min" if total_sessions > 0 else "N/A"
    
    return {
        "visualFocus": visual_focus,
        "gazeShifts": gaze_shifts,
        "sustainedGaze": "N/A", # No real metric for this yet
        "trends": {
            "visualAttention": metrics.get('focus_percent', 0) if total_sessions > 0 else 0,
            "emotionalRegulation": metrics.get('posture_percent', 0) if total_sessions > 0 else 0,
            "taskCompletion": metrics.get('avg_accuracy', 0) if total_sessions > 0 else 0
        },
        "notes": real_notes,
        "reviewAlert": review_alert
    }


from pydantic import BaseModel
import base64

class MediaUploadRequest(BaseModel):
    session_id: str
    event_type: str
    timestamp: float
    image_base64: str

@app.post("/api/media/upload")
def upload_media(data: MediaUploadRequest):
    try:
        # Create directory if it doesn't exist
        os.makedirs("data/media", exist_ok=True)
        
        # Decode base64 image
        image_data = base64.b64decode(data.image_base64.split(",")[1] if "," in data.image_base64 else data.image_base64)
        
        filename = f"data/media/{data.session_id}_{int(data.timestamp)}_{data.event_type}.jpg"
        with open(filename, "wb") as img_file:
            img_file.write(image_data)
            
        # Log to events table
        db = Database(DB_PATH)
        with sqlite3.connect(db.db_path) as conn:
            event_id = f"EV-{uuid.uuid4().hex[:8]}"
            conn.execute(
                "INSERT INTO events (event_id, session_id, timestamp, event_type, details) VALUES (?, ?, ?, ?, ?)",
                (event_id, data.session_id, data.timestamp, data.event_type, f"Screenshot saved: {filename}")
            )
            
        return {"status": "success", "filename": filename}
    except Exception as e:
        return {"status": "error", "message": str(e)}

from fastapi.responses import FileResponse

@app.get("/api/media/{filename}")
def get_media(filename: str):
    path = f"data/media/{filename}"
    if os.path.exists(path):
        return FileResponse(path)
    return {"status": "error", "message": "File not found"}
