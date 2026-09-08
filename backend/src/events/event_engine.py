import sqlite3
import os
import json
import uuid

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "observe.db")

class EventEngine:
    def __init__(self, session_id):
        self.session_id = session_id

    def log_event(self, event_type, timestamp, duration=None, body_region=None, confidence=None, context=None, activity_id=None, difficulty=None):
        event_id = f"EVT-{str(uuid.uuid4())[:8]}"
        context_str = json.dumps(context) if context else "{}"
        
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            # Ensure the table exists
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS events (
                    event_id TEXT PRIMARY KEY,
                    session_id TEXT NOT NULL,
                    timestamp TEXT NOT NULL,
                    event_type TEXT NOT NULL,
                    duration REAL,
                    body_region TEXT,
                    confidence REAL,
                    activity_id TEXT,
                    difficulty TEXT,
                    context TEXT,
                    FOREIGN KEY (session_id) REFERENCES sessions(session_id)
                )
            ''')
            
            cursor.execute('''
                INSERT INTO events (event_id, session_id, timestamp, event_type, duration, body_region, confidence, context)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (event_id, self.session_id, str(timestamp), event_type, duration, body_region, confidence, context_str))
            
            conn.commit()
            
        return event_id
