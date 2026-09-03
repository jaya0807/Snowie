import sqlite3
from typing import List
import uuid
from .models import Participant, Session, Event

class Database:
    def __init__(self, db_path: str = "observe.db"):
        self.db_path = db_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Create Participants Table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS participants (
                    participant_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    age INTEGER,
                    created_at TEXT
                )
            ''')
            
            # Create Sessions Table
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT PRIMARY KEY,
                    participant_id TEXT,
                    start_time TEXT,
                    end_time TEXT,
                    FOREIGN KEY (participant_id) REFERENCES participants (participant_id)
                )
            ''')
            
            # Create Events Table
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
            conn.commit()

    def add_participant(self, participant: Participant):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO participants (participant_id, name, age, created_at)
                VALUES (?, ?, ?, ?)
            ''', (participant.participant_id, participant.name, participant.age, participant.created_at))
            conn.commit()

    def start_session(self, session: Session):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO sessions (session_id, participant_id, start_time, end_time)
                VALUES (?, ?, ?, ?)
            ''', (session.session_id, session.participant_id, session.start_time, session.end_time))
            conn.commit()

    def end_session(self, session_id: str, end_time: str):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                UPDATE sessions SET end_time = ? WHERE session_id = ?
            ''', (end_time, session_id))
            conn.commit()

    def log_event(self, event: Event):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO events (event_id, session_id, timestamp, event_type, duration, body_region, confidence, context)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                event.event_id, 
                event.session_id, 
                event.timestamp, 
                event.event_type, 
                event.duration, 
                event.body_region, 
                event.confidence, 
                event.context_to_json()
            ))
            conn.commit()

    def get_events_for_session(self, session_id: str) -> List[dict]:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM events WHERE session_id = ? ORDER BY timestamp ASC', (session_id,))
            return [dict(row) for row in cursor.fetchall()]
