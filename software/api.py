from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import os

app = FastAPI()

# Allow CORS so Next.js (localhost:3000) can fetch data from FastAPI (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
