import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "observe.db")

class SessionAnalyzer:
    def __init__(self, session_id):
        self.session_id = session_id

    def analyze(self):
        # Gather deterministic stats for a single session
        with sqlite3.connect(DB_PATH) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            
            # Events
            cursor.execute("SELECT * FROM events WHERE session_id = ?", (self.session_id,))
            events = cursor.fetchall()
            
            activities = [e for e in events if e['event_type'] == 'ACTIVITY_COMPLETED']
            movements = [e for e in events if e['event_type'] == 'REPEATED_MOVEMENT']
            head_changes = [e for e in events if e['event_type'] == 'HEAD_ORIENTATION_CHANGE']
            
            # Basic analysis
            return {
                "session_id": self.session_id,
                "activities_completed": len(activities),
                "repetitive_movement_events": len(movements),
                "head_orientation_changes": len(head_changes),
                "movement_total_duration_sec": sum(m['duration'] for m in movements if m['duration'])
            }
