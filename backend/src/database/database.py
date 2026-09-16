import sqlite3
from typing import List
import uuid
import json

class Database:
    def __init__(self, db_path: str = "observe.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS participants (
                    participant_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    age INTEGER,
                    created_at TEXT
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    participant_id TEXT,
                    start_time TEXT,
                    end_time TEXT,
                    activity_id TEXT,
                    difficulty TEXT,
                    accuracy REAL,
                    response_time_sec REAL
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS events (
                    event_id TEXT PRIMARY KEY,
                    session_id TEXT,
                    timestamp TEXT,
                    event_type TEXT,
                    duration REAL,
                    body_region TEXT,
                    confidence REAL,
                    context TEXT,
                    FOREIGN KEY (session_id) REFERENCES sessions (session_id)
                )
            ''')
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS goals (
                    goal_id TEXT PRIMARY KEY,
                    participant_id TEXT,
                    domain TEXT,
                    goal_text TEXT,
                    baseline TEXT,
                    target TEXT,
                    status TEXT
                )
            ''')
            cursor.execute('''\n                CREATE TABLE IF NOT EXISTS telemetry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    timestamp TEXT,
                    pitch REAL,
                    yaw REAL,
                    roll REAL,
                    status TEXT
                )
            ''')
            conn.commit()

    def add_participant(self, participant_id, name=None, age=None, created_at=None):
        if hasattr(participant_id, "participant_id"):
            p = participant_id
            participant_id, name, age, created_at = p.participant_id, p.name, p.age, getattr(p, "created_at", None)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO participants (participant_id, name, age, created_at)
                VALUES (?, ?, ?, ?)
            ''', (participant_id, name, age, created_at))
            conn.commit()

    def start_session(self, session_id, participant_id=None, start_time=None, activity_id=None, difficulty=None):
        if hasattr(session_id, "session_id"):
            s = session_id
            session_id = s.session_id
            participant_id = s.participant_id
            start_time = s.start_time
            activity_id = getattr(s, "activity_id", "A1")
            difficulty = getattr(s, "difficulty", "Low")
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO sessions (session_id, participant_id, start_time, activity_id, difficulty)
                VALUES (?, ?, ?, ?, ?)
            ''', (session_id, participant_id, start_time, activity_id, difficulty))
            conn.commit()

    def end_session(self, session_id, end_time, accuracy, response_time_sec):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE sessions 
                SET end_time = ?, accuracy = ?, response_time_sec = ?
                WHERE session_id = ?
            ''', (end_time, accuracy, response_time_sec, session_id))
            conn.commit()
            
    def insert_event(self, session_id, event_time, event_type, difficulty, accuracy, target, status):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO events (session_id, event_time, event_type, difficulty, accuracy, target, status)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (session_id, event_time, event_type, difficulty, accuracy, target, status))
            conn.commit()

    def get_recent_sessions(self, participant_id, limit=5):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM sessions 
                WHERE participant_id = ? AND end_time IS NOT NULL
                ORDER BY start_time DESC LIMIT ?
            ''', (participant_id, limit))
            return [dict(row) for row in cursor.fetchall()]
            
    def get_session_history(self, participant_id, activity_id):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''
                SELECT * FROM sessions 
                WHERE participant_id = ? AND activity_id = ? AND end_time IS NOT NULL
                ORDER BY start_time ASC
            ''', (participant_id, activity_id))
            return [dict(row) for row in cursor.fetchall()]

    def insert_telemetry(self, session_id: str, timestamp: str, pitch: float, yaw: float, roll: float, status: str):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO telemetry (session_id, timestamp, pitch, yaw, roll, status)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (session_id, timestamp, pitch, yaw, roll, status))
            conn.commit()

    def get_telemetry_summary(self, session_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''SELECT * FROM telemetry WHERE session_id = ? ORDER BY timestamp DESC''', (session_id,))
            rows = cursor.fetchall()
            if not rows:
                return None
            
            avoidance_count = sum(1 for r in rows if "Avoidance" in r["status"])
            focused_count = sum(1 for r in rows if "Focused" in r["status"])
            total = len(rows)
            focus_percent = int((focused_count / total) * 100) if total > 0 else 0
            
            return {
                "total_points": total,
                "avoidance_events": avoidance_count,
                "focus_percent": focus_percent
            }
