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
            conn.commit()

    def add_participant(self, participant_id, name, age, created_at):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT OR REPLACE INTO participants (participant_id, name, age, created_at)
                VALUES (?, ?, ?, ?)
            ''', (participant_id, name, age, created_at))
            conn.commit()

    def start_session(self, session_id, participant_id, start_time, activity_id, difficulty):
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO sessions (session_id, participant_id, start_time, activity_id, difficulty)
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
