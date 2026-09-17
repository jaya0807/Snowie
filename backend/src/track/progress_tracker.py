import sqlite3
import os

_DB_DEFAULT = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "..", "observe.db")
)


class ProgressTracker:
    """
    Computes longitudinal accuracy and response-time trends
    for a participant+activity pair by querying real session data.
    """

    def __init__(self, db_path: str = None, db_connection: str = None):
        # Accept both db_path and legacy db_connection kwarg
        self.db_path = db_path or db_connection or _DB_DEFAULT

    def compute_trends(self, participant_id: str, activity_id: str) -> dict:
        """Returns trend data built from real DB sessions."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                """SELECT session_id, accuracy, response_time_sec, start_time
                   FROM sessions
                   WHERE participant_id=? AND activity_id=?
                   ORDER BY start_time ASC""",
                (participant_id, activity_id),
            ).fetchall()

        history = [dict(r) for r in rows]

        if not history:
            return {
                "activity_id": activity_id,
                "sessions_supported": 0,
                "accuracy_trend": "No data",
                "average_response_time": 0,
                "history": [],
                "message": "No sessions found for this participant and activity.",
            }

        # Accuracy trend
        trend = "Stable"
        valid_acc = [h["accuracy"] for h in history if h["accuracy"] is not None]
        if len(valid_acc) >= 2:
            if valid_acc[-1] > valid_acc[0]:
                trend = "Improving"
            elif valid_acc[-1] < valid_acc[0]:
                trend = "Declining"

        # Average response time
        response_times = [
            h["response_time_sec"]
            for h in history
            if h["response_time_sec"] is not None
        ]
        avg_resp = (
            round(sum(response_times) / len(response_times), 2)
            if response_times
            else 0
        )

        # Chart-ready points
        chart_points = []
        for i, h in enumerate(history, start=1):
            chart_points.append({
                "label": f"Session {i}",
                "session_id": h["session_id"],
                "accuracy": h["accuracy"],
                "response_time_sec": h["response_time_sec"],
                "start_time": h["start_time"],
            })

        return {
            "activity_id": activity_id,
            "sessions_supported": len(history),
            "accuracy_trend": trend,
            "average_response_time": avg_resp,
            "history": chart_points,
        }
