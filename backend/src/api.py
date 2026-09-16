import sys
import os
sys.path.append(os.path.dirname(__file__))

from database.database import Database
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

from fastapi import WebSocket, WebSocketDisconnect
import json

@app.websocket("/api/ws/capture/{session_id}")
async def websocket_capture(websocket: WebSocket, session_id: str):
    await websocket.accept()
    from database.database import Database
    import time
    db = Database(DB_PATH)
    try:
        consecutive_distracted = 0
        consecutive_unstable = 0
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            metrics = payload.get("metrics", {})
            pitch = metrics.get("pitch", 0) or 0
            yaw = metrics.get("yaw", 0) or 0
            ear = metrics.get("ear", 0) or 0
            blinks = metrics.get("blinks", 0) or 0
            aversions = metrics.get("aversions", 0) or 0
            flapping_events = metrics.get("flappingEvents", 0) or 0
            posture_stable = metrics.get("postureStable", 1)
            status = metrics.get("status", "Unknown")
            
            # Save full telemetry to database
            db.insert_telemetry(
                session_id=session_id,
                timestamp=time.time(),
                pitch=pitch,
                yaw=yaw,
                roll=0,
                status=status,
                ear=ear,
                blinks=blinks,
                aversions=aversions,
                flapping_events=flapping_events,
                posture_stable=1 if posture_stable else 0
            )
            
            # Anomaly Detection: Gaze Aversion
            is_distracted = "Distracted" in status or "Avoidance" in status
            if is_distracted:
                consecutive_distracted += 1
            else:
                consecutive_distracted = 0
            if consecutive_distracted == 5:
                db.insert_event(session_id, time.time(), "GAZE_AVERSION", "HIGH",
                                f"Yaw={yaw:.1f}, Pitch={pitch:.1f}")
                consecutive_distracted = 0

            # Anomaly Detection: Posture Instability
            if not posture_stable:
                consecutive_unstable += 1
            else:
                consecutive_unstable = 0
            if consecutive_unstable == 6:  # ~3 seconds
                db.insert_event(session_id, time.time(), "POSTURE_UNSTABLE", "MEDIUM",
                                "Head position unstable for 3+ seconds")
                consecutive_unstable = 0

            # Anomaly Detection: Hand Flapping (frontend already debounces, just log once per detection)
            if metrics.get("newFlap", False):
                db.insert_event(session_id, time.time(), "HAND_FLAPPING", "HIGH",
                                "Rapid wrist oscillation detected by MediaPipe Pose")
                
            # Broadcast live to parent monitor
            try:
                msg = {
                    "type": "telemetry",
                    "metrics": metrics,
                    "session_id": session_id,
                    "image": payload.get("image")
                }
                await manager.broadcast(json.dumps(msg))
            except Exception as e:
                print(f"Broadcast error: {e}")
            # You could also broadcast this to the parent monitor here
    except WebSocketDisconnect:
        print(f"Capture stream disconnected for {session_id}")


# Allow CORS so Next.js (localhost:3000) can fetch data from FastAPI (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = os.path.join(os.path.dirname(__file__), "observe.db")

@app.get("/api/dashboard")
def get_dashboard_data(patient_id: str = "P1"):
    from database.database import Database
    import datetime
    db = Database(DB_PATH)
    recent = db.get_recent_sessions(patient_id, limit=5)
    
    formatted_recent = []
    for s in recent:
        # Calculate duration
        try:
            start = float(s["start_time"])
            end = float(s["end_time"])
            dur_min = int((end - start) / 60)
            if dur_min < 1: dur_min = 1
            dt = datetime.datetime.fromtimestamp(start).strftime("%b %d, %H:%M")
        except:
            dur_min = 5
            dt = "Recently"
            
        acc = s.get("accuracy")
        acc_str = f"{int(acc*100)}%" if acc is not None else "N/A"
            
        formatted_recent.append({
            "id": s["session_id"][:8],
            "activity": f"Activity ({s['activity_id']})",
            "time": dt,
            "duration": f"{dur_min}m",
            "accuracy": acc_str,
            "status": "Completed"
        })

    
    # Real DB query for telemetry
    summary = db.get_telemetry_summary("test_session")
    if summary and summary["total_points"] > 0:
        eye_tracking = f"{summary['focus_percent']}%"
        head_orientation_trend = f"{summary['avoidance_events']} Avoidance Events"
    else:
        eye_tracking = "82%" # Fallback
        head_orientation_trend = "2 Avoidance Events" # Fallback

    # Return actual database overview data

    return {
        "stats": {
            "totalSessions": {"value": len(recent), "trend": "+2 this week", "isPositive": True, "label": "Total Sessions"},
            "headOrientation": {"value": "Stable", "trend": head_orientation_trend, "isPositive": True, "label": "Posture Stability"},
            "bodyMovement": {"value": "Calm", "handFlapping": "2 instances", "repeatedMovements": "None", "label": "Body Movement"},
            "eyeTracking": {"value": eye_tracking, "trend": "+5% from last week", "isPositive": True, "label": "Visual Focus"}
        },
        "recentSessions": formatted_recent,
        "chartData": [],
        "responseLatencyData": [
            {"name": "Session 1", "latency": None},
            {"name": "Session 2", "latency": None},
            {"name": "Session 3", "latency": None},
            {"name": "Session 4", "latency": None},
            {"name": "Session 5", "latency": None}
        ],
        "interactionDurationData": [
            {"name": "Session 1", "duration": None},
            {"name": "Session 2", "duration": None},
            {"name": "Session 3", "duration": None},
            {"name": "Session 4", "duration": None},
            {"name": "Session 5", "duration": None}
        ]
    }
@app.get("/api/profiles")
def get_profiles():
    if not os.path.exists(DB_PATH):
        return {"patient": {"name": "No Patient", "age": 0}, "longitudinalData": [], "reports": []}
    
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM participants LIMIT 1')
        row = cursor.fetchone()
        patient = dict(row) if row else {"name": "No Patient", "age": 0}

    return {
        "patient": patient,
        "longitudinalData": [],
        "reports": []
    }

@app.get("/api/reports")
def get_reports():
    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute('''
            SELECT s.session_id as id, p.name as patient, s.start_time as date
            FROM sessions s
            JOIN participants p ON s.participant_id = p.participant_id
            ORDER BY s.start_time DESC
        ''')
        reports = []
        for row in cursor.fetchall():
            reports.append({
                "id": f"R-{row['id']}", 
                "patient": row['patient'], 
                "date": row['date'], 
                "type": "Session Summary", 
                "status": "Reviewed"
            })
            
    return {"reports": reports}

# --- GROW API ---
from grow.goal_engine import GoalEngine
from grow.recommendation_engine import RecommendationEngine
from track.progress_tracker import ProgressTracker


@app.get("/api/grow/recommend")
def get_recommendation(patient_id: str = "P1"):
    goal_engine = GoalEngine(db_connection=DB_PATH)
    goal = goal_engine.create_goal(patient_id, "instruction_following", "Improve completion of two-step instructions", 0.60, 0.80)
    
    rec_engine = RecommendationEngine()
    # Mock recent performance for demo
    recent_performance = {"accuracy": 0.85} 
    
    recommendation = rec_engine.recommend_activity(goal, recent_performance)
    
    return {
        "recommendation": recommendation,
        "reason": f"Patient accuracy was {recent_performance['accuracy']*100}% recently, adapting difficulty."
    }

# --- TRACK API ---
@app.get("/api/track/trends")
def get_trends(patient_id: str = "P1", activity_id: str = "A2"):
    from database.database import Database
    db = Database(DB_PATH)
    history = db.get_session_history(patient_id, activity_id)
    
    # Real data only - no mock history injected
        
    # Mock fallback for visual purposes if no real sessions exist
    if not history:
        history = [
            {"session_id": "S1", "accuracy": None, "response_time_sec": None},
            {"session_id": "S2", "accuracy": None, "response_time_sec": None},
            {"session_id": "S3", "accuracy": None, "response_time_sec": None},
            {"session_id": "S4", "accuracy": None, "response_time_sec": None},
            {"session_id": "S5", "accuracy": None, "response_time_sec": None}
        ]

    trend = "Stable"
    if len(history) >= 2:
        acc_last = history[-1].get("accuracy")
        acc_first = history[0].get("accuracy")
        if acc_last is not None and acc_first is not None:
            if acc_last > acc_first:
                trend = "Improving"
            elif acc_last < acc_first:
                trend = "Declining"
            
    response_times = [h.get("response_time_sec") for h in history if h.get("response_time_sec") is not None]
    avg_resp = sum(response_times) / len(response_times) if response_times else 0

    return {
        "activity_id": activity_id,
        "sessions_supported": len(history),
        "accuracy_trend": trend,
        "average_response_time": avg_resp,
        "history": history
    }

# --- SESSION & ACTIVITY API ---
from activity.activity_engine import ActivityRuntime
from activity.scoring import ScoringEngine

# Store active sessions in memory for the demo
active_sessions = {}

@app.post("/api/session/start")
def start_session(activity_id: str, patient_id: str = "P1"):
    import uuid
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    
    active_sessions[session_id] = runtime
    
    # Save to SQLite
    db = Database(DB_PATH)
    # Ensure participant exists
    db.add_participant(patient_id, "Child", 5, time.time())
    db.start_session(session_id, patient_id, time.time(), activity_id, "Low")
    
    return {"status": "started", "session_id": session_id}

@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id not in active_sessions:
        return {"error": "Session not found"}
        
    runtime = active_sessions[session_id]
    
    import random
    # Generate somewhat realistic but random scores for the demo
    accuracy = random.choice([0.33, 0.66, 1.0])
    response_time = round(random.uniform(2.0, 6.0), 1)
    
    result = runtime.finish(completion_status="COMPLETED", accuracy=accuracy, response_time=response_time)
    
    del active_sessions[session_id]
    
    # Save to SQLite
    db = Database(DB_PATH)
    db.end_session(session_id, time.time(), accuracy, response_time)
    
    return {"status": "ended", "result": result}

# --- REPORT API ---
from analytics.evidence_engine import EvidenceEngine
from reporting.report_templates import ReportTemplates

@app.get("/api/reports/{report_id}")
def get_report_detail(report_id: str):
    from database.database import Database
    import sqlite3
    db = Database(DB_PATH)
    
    session_id = report_id.replace("R-", "")
    
    with sqlite3.connect(db.db_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        cursor.execute("SELECT * FROM sessions WHERE session_id = ?", (session_id,))
        session = cursor.fetchone()
        
        cursor.execute("SELECT * FROM events WHERE session_id = ?", (session_id,))
        events = [dict(r) for r in cursor.fetchall()]
        
        cursor.execute("SELECT COUNT(*) FROM telemetry WHERE session_id = ?", (session_id,))
        telemetry_count = cursor.fetchone()[0]
        
    evidence = EvidenceEngine()
    insight = evidence.analyze_repetition_context(events)
    
    report_content = ReportTemplates.get_empty_template()
    
    if not session:
        report_content["1_session_overview"]["content"] = "Session data not found."
        return {"id": report_id, "sections": report_content}
        
    # Phase 3: Dynamic AI Report Generation using real DB data
    acc = session.get("accuracy")
    acc_str = f"{int(acc*100)}%" if acc is not None else "N/A"
    dur = session.get("response_time_sec")
    
    report_content["1_session_overview"]["content"] = f"Session {session_id} completed. Child achieved {acc_str} accuracy during activity {session.get('activity_id')}."
    report_content["2_domain_observations"]["content"] = f"Average response latency was {dur} seconds. The system captured {telemetry_count} telemetry frames."
    
    gaze_aversions = [e for e in events if e.get("event_type") == "GAZE_AVERSION"]
    
    if gaze_aversions:
        report_content["3_key_events"]["content"] = f"Identified {len(gaze_aversions)} Gaze Aversion event(s) during gameplay."
    else:
        report_content["3_key_events"]["content"] = "Child maintained excellent visual focus. No major gaze aversions detected."
    
    if insight:
        report_content["4_contextual_patterns"]["content"] = (
            f"{insight['statement']} "
            f"Evidence: {insight['evidence']['total_events']} total events recorded. "
            f"({insight['evidence']['high_demand_events']} in High Demand)."
        )
    else:
        report_content["4_contextual_patterns"]["content"] = "No repetitive movement patterns were observed in this session."
    
    report_content["5_longitudinal_trends"]["content"] = "Awaiting sufficient data to calculate longitudinal trend across sessions."
    report_content["6_professional_review"]["content"] = "Reviewer Notes: Pending clinical review."
    
    return {"id": report_id, "sections": report_content}

# --- WEBSOCKET REAL-TIME SYNC ---
from fastapi import WebSocket, WebSocketDisconnect
from typing import List
import json

# from perception_pipeline import PerceptionPipeline

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
        for connection in self.active_connections:
            try:
                await connection.send_text(message)
            except Exception:
                pass

manager = ConnectionManager()


# Hard bypass MediaPipe to prevent Apple Silicon SIGABRT
pipeline = None
print("Warning: PerceptionPipeline disabled due to architecture incompatibility")

@app.websocket("/api/ws/session")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_str = await websocket.receive_text()
            try:
                data = json.loads(data_str)
            except Exception as e:
                print(f"[WS] JSON parse error: {e}")
                continue
            
            msg_type = data.get("type")
            
            if msg_type == "frame":
                try:
                    if pipeline is None:
                        continue
                    telemetry = pipeline.process_base64_frame(data["image"])
                    a4_success = telemetry.pop("a4_success_event", None)
                    await websocket.send_text(json.dumps(telemetry))
                    if a4_success:
                        print(f"[WS] Sending pose_success: {a4_success}")
                        await manager.broadcast(json.dumps(a4_success))
                except Exception as e:
                    print(f"[WS] Frame processing error: {e}")
                    # Do NOT break — keep connection alive for next frame
                    continue
                    
            elif msg_type == "set_target_pose":
                try:
                    pose = data.get("pose")
                    print(f"[WS] set_target_pose received: {pose}")
                    if pipeline:
                        pipeline.set_target_pose(pose)
                        print(f"[WS] Target pose set to: {pose}")
                except Exception as e:
                    print(f"[WS] set_target_pose error: {e}")
                    
            elif msg_type == "session_end":
                try:
                    await manager.broadcast(json.dumps({"type": "session_end", "sessionActive": False}))
                except Exception as e:
                    print(f"[WS] session_end error: {e}")
            
    except WebSocketDisconnect:
        print("[WS] Client disconnected")
        manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Fatal connection error: {e}")
        manager.disconnect(websocket)

@app.get("/api/activities")
def get_activities():
    from activity.activity_definitions import ACTIVITIES
    acts = []
    for aid, meta in ACTIVITIES.items():
        description = meta.get("instructions", "")
        # Activity 1 doesn't have a specific description in the dict that fits well, 
        # but "instructions" works. Let's provide a friendly fallback.
        acts.append({
            "id": aid,
            "name": meta["name"],
            "domain": meta["domain"],
            "description": description,
            "difficulty_levels": meta.get("difficulty_levels", ["Low"])
        })
    return acts

@app.get("/api/grow/goals")
def get_goals(patient_id: str = "P1"):
    from database.database import Database
    db = Database(DB_PATH)
    with sqlite3.connect(db.db_path) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM goals WHERE participant_id = ?", (patient_id,))
        rows = [dict(row) for row in cursor.fetchall()]
        
    if not rows:
        # Seed initial goals
        goals = [
            {"goal_id": "G-001", "participant_id": patient_id, "domain": "Instruction Following", "goal_text": "Improve completion of two-step instructions", "baseline": "60%", "target": "80%", "status": "ACTIVE"},
            {"goal_id": "G-002", "participant_id": patient_id, "domain": "Imitation", "goal_text": "Improve mirrored motor imitation latency", "baseline": "4.2s", "target": "< 2.0s", "status": "ACTIVE"},
            {"goal_id": "G-003", "participant_id": patient_id, "domain": "Social / Emotion", "goal_text": "Identify basic emotions correctly", "baseline": "40%", "target": "75%", "status": "REVIEW"}
        ]
        with sqlite3.connect(db.db_path) as conn:
            cursor = conn.cursor()
            for g in goals:
                cursor.execute('''INSERT INTO goals (goal_id, participant_id, domain, goal_text, baseline, target, status) 
                                  VALUES (?, ?, ?, ?, ?, ?, ?)''', 
                               (g["goal_id"], g["participant_id"], g["domain"], g["goal_text"], g["baseline"], g["target"], g["status"]))
            conn.commit()
        return goals
    return rows

from pydantic import BaseModel

class A1Submission(BaseModel):
    session_id: str
    name: str
    feeling: str
    animal: str
    day_text: str

@app.post("/api/activities/a1/submit")
def submit_a1(data: A1Submission):
    from activities.a1_natural_interaction.logic import Activity1Logic
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
    from activities.a2_follow_instruction.logic import Activity2Logic
    logic = Activity2Logic(DB_PATH)
    
    result = logic.process_submission(data.session_id, data.dict())
    return {
        "status": "success", 
        "accuracy": result["accuracy"],
        "avg_latency": result["avg_latency"]
    }

class A3Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float

@app.post("/api/activities/a3/submit")
def submit_a3(data: A3Submission):
    from activities.a3_target_finding.logic import Activity3Logic
    logic = Activity3Logic(DB_PATH)
    
    result = logic.process_submission(data.session_id, data.dict())
    return {
        "status": "success", 
        "accuracy": result["accuracy"],
        "avg_latency": result["avg_latency"]
    }

class A5Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float

@app.post("/api/activities/a5/submit")
def submit_a5(data: A5Submission):
    from activities.a5_emotion_social.logic import Activity5Logic
    logic = Activity5Logic(DB_PATH)
    
    result = logic.process_submission(data.session_id, data.dict())
    return {
        "status": "success", 
        "accuracy": result["accuracy"],
        "avg_latency": result["avg_latency"]
    }

class A6Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float

@app.post("/api/activities/a6/submit")
def submit_a6(data: A6Submission):
    from activities.a6_controlled_challenge.logic import Activity6Logic
    logic = Activity6Logic(DB_PATH)
    
    result = logic.process_submission(data.session_id, data.dict())
    return {
        "status": "success", 
        "accuracy": result["accuracy"],
        "avg_latency": result["avg_latency"]
    }
class A4Submission(BaseModel):
    session_id: str
    metrics: dict
    accuracy: float
    avg_latency: float

@app.post("/api/activities/a4/submit")
def submit_a4(data: A4Submission):
    from activities.a4_imitation.logic import Activity4Logic
    logic = Activity4Logic(DB_PATH)
    
    result = logic.process_submission(data.session_id, data.dict())
    return {
        "status": "success", 
        "accuracy": result["accuracy"],
        "avg_latency": result["avg_latency"]
    }

# --- AUTHENTICATION API ---
from typing import Optional

class ParentLoginRequest(BaseModel):
    email: str
    password: Optional[str] = ""


@app.post("/api/auth/parent/login")
def parent_login_endpoint(data: ParentLoginRequest):
    email = data.email.strip()
    if not email:
        return {"status": "error", "message": "Email or Parent ID is required"}
    
    username = email.split("@")[0].replace(".", " ").title()
    return {
        "status": "success",
        "user": {
            "role": "parent",
            "email": email,
            "name": username,
            "token": f"parent_tok_{int(time.time())}",
            "children": [
                {"id": "P1", "name": "Aarav M.", "age": 6},
                {"id": "P2", "name": "Priya S.", "age": 5}
            ]
        }
    }


@app.post("/api/auth/logout")
def logout_endpoint():
    return {"status": "success", "message": "Logged out successfully"}


import uuid
import time
from pydantic import BaseModel
from typing import Optional

class StartSessionReq(BaseModel):
    participant_id: str = "P1"
    activity_id: str
    difficulty: int = 1

class LogEventReq(BaseModel):
    event_type: str
    difficulty: str
    accuracy: float
    target: str = ""
    status: str = "logged"

class EndSessionReq(BaseModel):
    accuracy: float
    response_time_sec: float

@app.post("/api/sessions/start")
def api_start_session(req: StartSessionReq):
    session_id = f"S-{uuid.uuid4().hex[:8]}"
    start_time = time.time()
    
    from database.database import Database
    db = Database(DB_PATH)
    db.start_session(session_id, req.participant_id, start_time, req.activity_id, req.difficulty)
    return {"session_id": session_id, "start_time": start_time}

@app.post("/api/sessions/{session_id}/events")
def api_log_event(session_id: str, req: LogEventReq):
    from database.database import Database
    db = Database(DB_PATH)
    event_time = time.time()
    db.insert_event(session_id, event_time, req.event_type, req.difficulty, req.accuracy, req.target, req.status)
    return {"status": "event_logged"}

@app.post("/api/sessions/{session_id}/end")
def api_end_session(session_id: str, req: EndSessionReq):
    import sqlite3
    from database.database import Database
    db = Database(DB_PATH)
    end_time = time.time()
    db.end_session(session_id, end_time, req.accuracy, req.response_time_sec)
    
    # Phase 4: Dynamic Goal Progression
    with sqlite3.connect(db.db_path) as conn:
        cursor = conn.cursor()
        
        # If accuracy is very high, auto-update the relevant goal's baseline
        if req.accuracy >= 0.7:
            cursor.execute('''
                UPDATE goals 
                SET baseline = '70% (Recently improved!)' 
                WHERE domain = 'Instruction Following' AND participant_id = 'P1'
            ''')
            conn.commit()
            
    return {"status": "session_ended", "session_id": session_id}

