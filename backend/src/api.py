from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

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
def get_dashboard_data():
    if not os.path.exists(DB_PATH):
        return {
            "stats": {"totalSessions": 0, "avgEngagement": 0, "avgDuration": 0, "goalAchievement": 0},
            "recentSessions": [],
            "chartData": []
        }

    with sqlite3.connect(DB_PATH) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        # Get recent sessions joining with participants
        cursor.execute('''
            SELECT s.session_id as id, p.name as patient, s.start_time, s.end_time
            FROM sessions s
            JOIN participants p ON s.participant_id = p.participant_id
            ORDER BY s.start_time DESC
            LIMIT 4
        ''')
        
        recent_sessions = []
        for row in cursor.fetchall():
            recent_sessions.append({
                "id": row["id"],
                "patient": row["patient"],
                "time": row["start_time"],
                "duration": "Nil",
                "accuracy": "Nil",
                "status": "Completed"
            })

    # Return structured data matching what the frontend expects
    return {
        "stats": {
            "totalSessions": {"value": len(recent_sessions), "trend": "Nil", "isPositive": True},
            "avgEngagement": {"value": "Nil", "trend": "Nil", "isPositive": True},
            "avgDuration": {"value": "Nil", "trend": "Nil", "isPositive": True},
            "goalAchievement": {"value": 0, "trend": "Nil", "isPositive": True}
        },
        "recentSessions": recent_sessions,
        "chartData": []
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

@app.get("/api/grow/goals")
def get_goals(patient_id: str = "P1"):
    engine = GoalEngine(db_connection=DB_PATH)
    # Stub returning a mock goal for the UI
    return {
        "goals": [
            engine.create_goal(patient_id, "instruction_following", "Improve completion of two-step instructions", 0.60, 0.80)
        ]
    }

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
    tracker = ProgressTracker(db_connection=DB_PATH)
    
    # We will mock the history inside compute_trends for the demo if it's empty, 
    # but since our tracker returns "No data" if empty, let's inject some mock history
    # for the frontend to render the Recharts graph.
    mock_history = [
        {"session_id": "S1", "accuracy": 0.45, "response_time_sec": 4.8},
        {"session_id": "S2", "accuracy": 0.50, "response_time_sec": 4.2},
        {"session_id": "S3", "accuracy": 0.48, "response_time_sec": 4.5},
        {"session_id": "S4", "accuracy": 0.65, "response_time_sec": 3.8},
        {"session_id": "S5", "accuracy": 0.72, "response_time_sec": 3.1},
        {"session_id": "S6", "accuracy": 0.80, "response_time_sec": 2.8}
    ]
    
    trend_data = tracker.compute_trends(patient_id, activity_id)
    # Override history for UI rendering since DB is empty
    trend_data["history"] = mock_history
    trend_data["accuracy_trend"] = "Improving"
    trend_data["sessions_supported"] = len(mock_history)
    
    return trend_data

# --- SESSION & ACTIVITY API ---
from activity.activity_engine import ActivityRuntime
from activity.scoring import ScoringEngine

# Store active sessions in memory for the demo
active_sessions = {}

@app.post("/api/session/start")
def start_session(activity_id: str, patient_id: str = "P1"):
    # In a real app we'd fetch the type and difficulty from activity_definitions
    session_id = f"sess_{len(active_sessions) + 1}"
    
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    
    active_sessions[session_id] = runtime
    
    return {"status": "started", "session_id": session_id}

@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id not in active_sessions:
        return {"error": "Session not found"}
        
    runtime = active_sessions[session_id]
    
    # Mocking a response for the demo (child got 2 out of 3 steps right)
    accuracy = ScoringEngine.calculate_multi_step_accuracy(correct_steps=2, total_steps=3)
    response_time = 4.2
    
    result = runtime.finish(completion_status="COMPLETED", accuracy=accuracy, response_time=response_time)
    
    del active_sessions[session_id]
    
    return {"status": "ended", "result": result}

# --- REPORT API ---
from analytics.evidence_engine import EvidenceEngine
from reporting.report_templates import ReportTemplates

@app.get("/api/reports/{report_id}")
def get_report_detail(report_id: str):
    # Initialize engines
    evidence = EvidenceEngine()
    
    # Mocking a repeated movement event to trigger the evidence engine
    mock_events = [
        {"event_type": "REPEATED_MOVEMENT", "difficulty": "HIGH"},
        {"event_type": "REPEATED_MOVEMENT", "difficulty": "HIGH"},
        {"event_type": "REPEATED_MOVEMENT", "difficulty": "HIGH"},
        {"event_type": "REPEATED_MOVEMENT", "difficulty": "LOW"}
    ]
    
    insight = evidence.analyze_repetition_context(mock_events)
    
    # Use the mandated MVP report template
    report_content = ReportTemplates.get_empty_template()
    
    report_content["1_session_overview"]["content"] = f"24-minute session completed for {report_id}. 5 out of 6 assigned activities were completed."
    report_content["2_domain_observations"]["content"] = "Accuracy on multi-step instructions was 67%."
    report_content["3_key_events"]["content"] = f"Event 1: 4 repetitive cycles identified at 01:24."
    
    # Inject the strictly validated evidence insight here!
    if insight:
        report_content["4_contextual_patterns"]["content"] = (
            f"{insight['statement']} "
            f"Evidence: {insight['evidence']['total_events']} total events recorded. "
            f"({insight['evidence']['high_demand_events']} in High Demand)."
        )
    
    report_content["5_longitudinal_trends"]["content"] = "Accuracy has improved by 15% across the last 3 sessions."
    report_content["6_professional_review"]["content"] = "Reviewer Notes: Pattern matches caregiver observations."
    
    return {"id": report_id, "sections": report_content}
