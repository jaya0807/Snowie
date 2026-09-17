import sqlite3
import json
import uuid
import os
import time

_DB_DEFAULT = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "..", "observe.db")
)


class EventEngine:
    """
    Logs clinical/behavioural events to the unified 6-column events schema.
    Compatible with Database.insert_event — same table, same columns.
    """

    SEVERITY_MAP = {
        "ACTIVITY_STARTED": "LOW",
        "ACTIVITY_COMPLETED": "LOW",
        "ACTIVITY_INCOMPLETE": "MEDIUM",
        "HAND_FLAPPING": "HIGH",
        "BODY_ROCKING": "HIGH",
        "HEAD_TIC": "HIGH",
        "GAZE_AVERSION": "HIGH",
        "POSTURE_UNSTABLE": "MEDIUM",
        "WRIST_POSTURING": "MEDIUM",
        "FINGER_FLICKING": "MEDIUM",
    }

    def __init__(self, session_id: str, db_path: str = None):
        self.session_id = session_id
        self.db_path = db_path or _DB_DEFAULT

    def log_event(
        self,
        event_type: str,
        timestamp: float = None,
        duration: float = None,
        body_region: str = None,
        confidence: float = None,
        context: dict = None,
        activity_id: str = None,
        difficulty: str = None,
    ) -> str:
        timestamp = timestamp or time.time()
        severity = self.SEVERITY_MAP.get(event_type, "MEDIUM")

        # Pack optional metadata into the details JSON field
        details_dict: dict = {}
        if duration is not None:
            details_dict["duration"] = duration
        if body_region:
            details_dict["body_region"] = body_region
        if confidence is not None:
            details_dict["confidence"] = confidence
        if context:
            details_dict["context"] = context
        if activity_id:
            details_dict["activity_id"] = activity_id
        if difficulty:
            details_dict["difficulty"] = difficulty

        details_str = json.dumps(details_dict) if details_dict else ""
        event_id = f"EVT-{uuid.uuid4().hex[:8]}"

        with sqlite3.connect(self.db_path) as conn:
            conn.execute(
                "INSERT INTO events (event_id, session_id, timestamp, event_type, severity, details) "
                "VALUES (?,?,?,?,?,?)",
                (event_id, self.session_id, timestamp, event_type, severity, details_str),
            )
        return event_id
