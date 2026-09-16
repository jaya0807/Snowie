import sqlite3
from typing import List
import uuid
import json
import time as _time

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
            # Unified clinical events table (fixed schema)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS events (
                    event_id TEXT PRIMARY KEY,
                    session_id TEXT,
                    timestamp REAL,
                    event_type TEXT,
                    severity TEXT DEFAULT 'MEDIUM',
                    details TEXT DEFAULT '',
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
            # Expanded telemetry table with all 6 metrics + posture
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS telemetry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    timestamp REAL,
                    pitch REAL,
                    yaw REAL,
                    roll REAL,
                    ear REAL DEFAULT 0,
                    blinks INTEGER DEFAULT 0,
                    aversions INTEGER DEFAULT 0,
                    flapping_events INTEGER DEFAULT 0,
                    posture_stable INTEGER DEFAULT 1,
                    status TEXT
                )
            ''')
            conn.commit()

            # Migrate existing telemetry table if columns are missing
            try:
                cursor.execute("ALTER TABLE telemetry ADD COLUMN ear REAL DEFAULT 0")
                cursor.execute("ALTER TABLE telemetry ADD COLUMN blinks INTEGER DEFAULT 0")
                cursor.execute("ALTER TABLE telemetry ADD COLUMN aversions INTEGER DEFAULT 0")
                cursor.execute("ALTER TABLE telemetry ADD COLUMN flapping_events INTEGER DEFAULT 0")
                cursor.execute("ALTER TABLE telemetry ADD COLUMN posture_stable INTEGER DEFAULT 1")
                conn.commit()
            except Exception:
                pass  # Columns already exist

            # Migrate events table if using old schema
            try:
                cursor.execute("ALTER TABLE events ADD COLUMN severity TEXT DEFAULT 'MEDIUM'")
                cursor.execute("ALTER TABLE events ADD COLUMN details TEXT DEFAULT ''")
                conn.commit()
            except Exception:
                pass

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

    def insert_event(self, session_id: str, timestamp: float, event_type: str,
                     severity: str = "MEDIUM", details: str = ""):
        """Insert a clinical event. Unified schema."""
        event_id = str(uuid.uuid4())
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO events (event_id, session_id, timestamp, event_type, severity, details)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (event_id, session_id, timestamp, event_type, severity, details))
            conn.commit()

    def insert_telemetry(self, session_id: str, timestamp: float, pitch: float, yaw: float,
                         roll: float, status: str, ear: float = 0, blinks: int = 0,
                         aversions: int = 0, flapping_events: int = 0, posture_stable: int = 1):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO telemetry (session_id, timestamp, pitch, yaw, roll, ear, blinks,
                                       aversions, flapping_events, posture_stable, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (session_id, timestamp, pitch, yaw, roll, ear, blinks,
                  aversions, flapping_events, posture_stable, status))
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

    def get_telemetry_summary(self, session_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''SELECT * FROM telemetry WHERE session_id = ? ORDER BY timestamp DESC''', (session_id,))
            rows = cursor.fetchall()
            if not rows:
                return None
            
            avoidance_count = sum(1 for r in rows if r["status"] and "Avoidance" in r["status"])
            distracted_count = sum(1 for r in rows if r["status"] and "Distracted" in r["status"])
            focused_count = sum(1 for r in rows if r["status"] and "Focused" in r["status"])
            total = len(rows)
            focus_percent = int((focused_count / total) * 100) if total > 0 else 0
            
            return {
                "total_points": total,
                "avoidance_events": avoidance_count,
                "distracted_events": distracted_count,
                "focus_percent": focus_percent,
                "max_aversions": max((r["aversions"] or 0) for r in rows),
                "max_blinks": max((r["blinks"] or 0) for r in rows),
                "max_flapping": max((r["flapping_events"] or 0) for r in rows),
            }

    def get_events_for_session(self, session_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('''SELECT * FROM events WHERE session_id = ? ORDER BY timestamp''', (session_id,))
            return [dict(row) for row in cursor.fetchall()]
