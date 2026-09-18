import sqlite3
from typing import List
import uuid
import json
import time as _time
import os


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
                    name TEXT,
                    age INTEGER,
                    created_at REAL
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS sessions (
                    session_id TEXT,
                    participant_id TEXT,
                    start_time REAL,
                    end_time REAL,
                    activity_id TEXT,
                    difficulty TEXT,
                    accuracy REAL,
                    response_time_sec REAL,
                    PRIMARY KEY (session_id, activity_id)
                )
            ''')

            # Unified events schema (6 columns only)
            cursor.execute('''
                CREATE TABLE IF NOT EXISTS events (
                    event_id TEXT PRIMARY KEY,
                    session_id TEXT,
                    timestamp REAL,
                    event_type TEXT,
                    severity TEXT DEFAULT 'MEDIUM',
                    details TEXT DEFAULT ''
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
                    status TEXT DEFAULT 'ACTIVE'
                )
            ''')

            cursor.execute('''
                CREATE TABLE IF NOT EXISTS telemetry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    timestamp REAL,
                    pitch REAL DEFAULT 0,
                    yaw REAL DEFAULT 0,
                    roll REAL DEFAULT 0,
                    ear REAL DEFAULT 0,
                    blinks INTEGER DEFAULT 0,
                    aversions INTEGER DEFAULT 0,
                    flapping_events INTEGER DEFAULT 0,
                    posture_stable INTEGER DEFAULT 1,
                    status TEXT DEFAULT ''
                )
            ''')

            conn.commit()

        # Safe schema migrations for older DBs
        migrations = [
            ("telemetry", "ear", "REAL DEFAULT 0"),
            ("telemetry", "blinks", "INTEGER DEFAULT 0"),
            ("telemetry", "aversions", "INTEGER DEFAULT 0"),
            ("telemetry", "flapping_events", "INTEGER DEFAULT 0"),
            ("telemetry", "posture_stable", "INTEGER DEFAULT 1"),
            ("events", "severity", "TEXT DEFAULT 'MEDIUM'"),
            ("events", "details", "TEXT DEFAULT ''"),
        ]
        with sqlite3.connect(self.db_path) as conn:
            for table, col, col_type in migrations:
                try:
                    conn.execute(f"ALTER TABLE {table} ADD COLUMN {col} {col_type}")
                    conn.commit()
                except Exception:
                    pass

    # ──────────────────────────────────────────────
    # Participants
    # ──────────────────────────────────────────────
    def add_participant(self, participant_id: str, name: str = None,
                        age: int = None, created_at: float = None):
        created_at = created_at or __time.time()
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR IGNORE INTO participants (participant_id, name, age, created_at) VALUES (?,?,?,?)",
                (participant_id, name, age, created_at)
            )

    # ──────────────────────────────────────────────
    # Sessions
    # ──────────────────────────────────────────────
    def start_session(self, session_id: str, participant_id: str = None,
                      start_time: float = None, activity_id: str = None,
                      difficulty=None):
        start_time = start_time or __time.time()
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT OR REPLACE INTO sessions (session_id, participant_id, start_time, activity_id, difficulty) VALUES (?,?,?,?,?)",
                (session_id, participant_id, start_time, activity_id, str(difficulty))
            )

    def end_session(self, session_id: str, end_time: float,
                    accuracy: float, response_time_sec: float):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE sessions SET end_time=?, accuracy=?, response_time_sec=? WHERE session_id=?",
                (end_time, accuracy, response_time_sec, session_id)
            )

    def get_recent_sessions(self, participant_id: str, limit: int = 5) -> list:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            # Group by session_id to get the master visit, returning the earliest start time and avg accuracy
            rows = conn.execute(
                """
                SELECT session_id, participant_id, MIN(start_time) as start_time, MAX(end_time) as end_time, 
                       GROUP_CONCAT(activity_id, ', ') as activity_id, AVG(accuracy) as accuracy, AVG(response_time_sec) as response_time_sec
                FROM sessions 
                WHERE participant_id=? 
                GROUP BY session_id
                ORDER BY MIN(start_time) DESC 
                LIMIT ?
                """,
                (participant_id, limit)
            ).fetchall()
        return [dict(r) for r in rows]

    def get_session_history(self, participant_id: str, activity_id: str) -> list:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT session_id, accuracy, response_time_sec, start_time FROM sessions WHERE participant_id=? AND activity_id=? ORDER BY start_time ASC",
                (participant_id, activity_id)
            ).fetchall()
        return [dict(r) for r in rows]

    # ──────────────────────────────────────────────
    # Events
    # ──────────────────────────────────────────────
    def insert_event(self, session_id: str, timestamp: float,
                     event_type: str, severity: str = "MEDIUM", details: str = ""):
        event_id = f"EVT-{uuid.uuid4().hex[:8]}"
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO events (event_id, session_id, timestamp, event_type, severity, details) VALUES (?,?,?,?,?,?)",
                (event_id, session_id, timestamp, event_type, severity, details)
            )

    def get_events_for_session(self, session_id: str) -> list:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM events WHERE session_id=? ORDER BY timestamp ASC",
                (session_id,)
            ).fetchall()
        return [dict(r) for r in rows]

    # ──────────────────────────────────────────────
    # Telemetry
    # ──────────────────────────────────────────────
    def insert_telemetry(self, session_id: str, timestamp: float,
                         pitch: float, yaw: float, roll: float, status: str,
                         ear: float = 0, blinks: int = 0, aversions: int = 0,
                         flapping_events: int = 0, posture_stable: int = 1):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO telemetry (session_id,timestamp,pitch,yaw,roll,status,ear,blinks,aversions,flapping_events,posture_stable) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                (session_id, timestamp, pitch, yaw, roll, status, ear, blinks,
                 aversions, flapping_events, posture_stable)
            )

    def get_telemetry_summary(self, session_id: str) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            row = conn.execute(
                """SELECT
                     COUNT(*) as total_points,
                     AVG(ear) as avg_ear,
                     AVG(ABS(yaw)) as avg_yaw,
                     AVG(ABS(pitch)) as avg_pitch,
                     SUM(CASE WHEN status LIKE 'Focused%' THEN 1 ELSE 0 END) as focus_frames,
                     SUM(aversions) as avoidance_events,
                     SUM(blinks) as total_blinks
                   FROM telemetry WHERE session_id=?""",
                (session_id,)
            ).fetchone()
        if not row or row[0] == 0:
            return {"total_points": 0}
        total = row[0]
        return {
            "total_points": total,
            "avg_ear": round(row[1] or 0, 3),
            "avg_yaw": round(row[2] or 0, 1),
            "avg_pitch": round(row[3] or 0, 1),
            "focus_percent": round((row[4] or 0) / total * 100, 1),
            "avoidance_events": row[5] or 0,
            "total_blinks": row[6] or 0,
        }

    # ──────────────────────────────────────────────
    # Goals
    # ──────────────────────────────────────────────
    def get_all_goals(self, participant_id: str) -> list:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM goals WHERE participant_id=?",
                (participant_id,)
            ).fetchall()
        return [dict(r) for r in rows]

    def upsert_goal(self, participant_id: str, domain: str, goal_text: str,
                    baseline: str, target: str, status: str = "ACTIVE") -> str:
        goal_id = f"G-{uuid.uuid4().hex[:6].upper()}"
        with sqlite3.connect(self.db_path) as conn:
            # Check if goal for this domain already exists
            existing = conn.execute(
                "SELECT goal_id FROM goals WHERE participant_id=? AND domain=?",
                (participant_id, domain)
            ).fetchone()
            if existing:
                conn.execute(
                    "UPDATE goals SET goal_text=?, baseline=?, target=?, status=? WHERE goal_id=?",
                    (goal_text, baseline, target, status, existing[0])
                )
                return existing[0]
            else:
                conn.execute(
                    "INSERT INTO goals (goal_id, participant_id, domain, goal_text, baseline, target, status) VALUES (?,?,?,?,?,?,?)",
                    (goal_id, participant_id, domain, goal_text, baseline, target, status)
                )
                return goal_id

    def update_goal_baseline(self, participant_id: str, domain: str, new_baseline: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "UPDATE goals SET baseline=? WHERE participant_id=? AND domain=?",
                (new_baseline, participant_id, domain)
            )

    # ──────────────────────────────────────────────
    # Dashboard Aggregations
    # ──────────────────────────────────────────────
    def get_user_by_email(self, email: str) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            row = conn.execute("SELECT * FROM users WHERE email=?", (email,)).fetchone()
            return dict(row) if row else None

    def create_user(self, user_id: str, email: str, password_hash: str, name: str, role: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO users (id, email, password_hash, name, role) VALUES (?, ?, ?, ?, ?)",
                (user_id, email, password_hash, name, role)
            )

    def get_children_for_parent(self, parent_id: str) -> list:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT participant_id as id, name, age FROM participants WHERE parent_id=?", (parent_id,)).fetchall()
            return [dict(r) for r in rows]

    def create_participant(self, participant_id: str, name: str, age: int, parent_name: str, parent_id: str):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO participants (participant_id, name, age, created_at, parent_name, parent_id) VALUES (?, ?, ?, ?, ?, ?)",
                (participant_id, name, age, _time.time(), parent_name, parent_id)
            )

    def get_dashboard_metrics(self, participant_id: str, date: str = None) -> dict:
        """Returns aggregated real-time metrics for the professional dashboard."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            date_filter = ""
            params = [participant_id]
            if date:
                date_filter = " AND strftime('%Y-%m-%d', datetime(s.start_time, 'unixepoch', 'localtime')) = ?"
                params.append(date)

            total_sessions = conn.execute(
                f"SELECT COUNT(DISTINCT s.session_id) FROM sessions s WHERE s.participant_id=?{date_filter}", params
            ).fetchone()[0]

            avg_acc_row = conn.execute(
                f"SELECT AVG(s.accuracy) FROM sessions s WHERE s.participant_id=? AND s.accuracy IS NOT NULL{date_filter}", params
            ).fetchone()[0]
            avg_accuracy = round((avg_acc_row or 0) * 100, 1)

            focus_row = conn.execute(
                f"""SELECT
                     COUNT(CASE WHEN t.status LIKE 'Focused%' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0)
                   FROM telemetry t
                   JOIN sessions s ON t.session_id = s.session_id
                   WHERE s.participant_id=?{date_filter}""",
                params
            ).fetchone()[0]
            focus_percent = round(focus_row or 0, 1)

            posture_row = conn.execute(
                f"""SELECT
                     SUM(t.posture_stable) * 100.0 / NULLIF(COUNT(*), 0)
                   FROM telemetry t
                   JOIN sessions s ON t.session_id = s.session_id
                   WHERE s.participant_id=?{date_filter}""",
                params
            ).fetchone()[0]
            posture_percent = round(posture_row or 0, 1)

            motor_rows = conn.execute(
                f"""SELECT
                     e.event_type, COUNT(*) as cnt
                   FROM events e
                   JOIN sessions s ON e.session_id = s.session_id
                   WHERE s.participant_id=?{date_filter}
                   GROUP BY e.event_type""",
                params
            ).fetchall()

        metrics = {
            "total_sessions": total_sessions,
            "avg_accuracy": avg_accuracy,
            "focus_percent": focus_percent,
            "posture_percent": posture_percent,
            "hand_flapping": 0,
            "body_rocking": 0,
            "motor_events_total": 0,
            "aversions": 0
        }

        for row in motor_rows:
            ev_type = row["event_type"]
            cnt = row["cnt"]
            if ev_type == "hand_flapping":
                metrics["hand_flapping"] = cnt
                metrics["motor_events_total"] += cnt
            elif ev_type == "body_rocking":
                metrics["body_rocking"] = cnt
                metrics["motor_events_total"] += cnt
            elif ev_type == "gaze_aversion":
                metrics["aversions"] = cnt

        return metrics

    def get_session_full_summary(self, session_id: str) -> dict:
        """Returns full session data for report generation."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            session = conn.execute(
                """SELECT session_id, participant_id, MIN(start_time) as start_time, MAX(end_time) as end_time, 
                          GROUP_CONCAT(activity_id, ', ') as activity_id, AVG(accuracy) as accuracy, AVG(response_time_sec) as response_time_sec
                   FROM sessions WHERE session_id=?""", (session_id,)
            ).fetchone()
            
            breakdown = conn.execute(
                "SELECT activity_id, accuracy, response_time_sec FROM sessions WHERE session_id=? ORDER BY start_time ASC", (session_id,)
            ).fetchall()
            events = conn.execute(
                "SELECT * FROM events WHERE session_id=? ORDER BY timestamp ASC", (session_id,)
            ).fetchall()
            telemetry = conn.execute(
                """SELECT COUNT(*) as frames,
                          AVG(ear) as avg_ear,
                          AVG(ABS(yaw)) as avg_yaw,
                          AVG(ABS(pitch)) as avg_pitch,
                          SUM(CASE WHEN status LIKE 'Focused%' THEN 1 ELSE 0 END) as focus_frames,
                          SUM(aversions) as total_aversions,
                          SUM(blinks) as total_blinks,
                          SUM(flapping_events) as total_flapping
                   FROM telemetry WHERE session_id=?""",
                (session_id,)
            ).fetchone()

        session_dict = dict(session) if session else {}
        events_list = [dict(e) for e in events]
        telem_dict = dict(telemetry) if telemetry else {}

        # Count events by type
        event_counts: dict = {}
        for e in events_list:
            event_counts[e["event_type"]] = event_counts.get(e["event_type"], 0) + 1

        return {
            "session": session_dict,
            "event_counts": event_counts,
            "events": events_list,
            "telemetry": telem_dict,
        }
