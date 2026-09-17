import sqlite3
import os

_DB_DEFAULT = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "..", "observe.db")
)


class SessionAnalyzer:
    """
    Analyzes a completed session's telemetry and events,
    returning a rich summary used by report generation and session-end API.
    Works with the unified 6-column events schema.
    """

    # Behavioural event types tracked by the system
    MOTOR_EVENTS = {
        "HAND_FLAPPING",
        "BODY_ROCKING",
        "WRIST_POSTURING",
        "FINGER_FLICKING",
        "HEAD_TIC",
    }
    ATTENTION_EVENTS = {"GAZE_AVERSION"}
    POSTURE_EVENTS = {"POSTURE_UNSTABLE"}

    def __init__(self, session_id: str, db_path: str = None):
        self.session_id = session_id
        self.db_path = db_path or _DB_DEFAULT

    def analyze(self) -> dict:
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row

            # ── Events ────────────────────────────────────────────────────
            events = conn.execute(
                "SELECT event_type, severity, details FROM events WHERE session_id=? ORDER BY timestamp ASC",
                (self.session_id,),
            ).fetchall()

            # ── Telemetry summary ─────────────────────────────────────────
            telem = conn.execute(
                """SELECT
                     COUNT(*) as frames,
                     AVG(ear) as avg_ear,
                     AVG(ABS(yaw)) as avg_yaw,
                     AVG(ABS(pitch)) as avg_pitch,
                     SUM(CASE WHEN status LIKE 'Focused%' THEN 1 ELSE 0 END) as focus_frames,
                     SUM(aversions) as total_aversions,
                     SUM(blinks) as total_blinks,
                     SUM(flapping_events) as total_flapping,
                     SUM(posture_stable) as stable_frames
                   FROM telemetry WHERE session_id=?""",
                (self.session_id,),
            ).fetchone()

            # ── Session row ───────────────────────────────────────────────
            session_row = conn.execute(
                "SELECT accuracy, response_time_sec, activity_id, start_time, end_time FROM sessions WHERE session_id=?",
                (self.session_id,),
            ).fetchone()

        # Count events by type
        event_counts: dict = {}
        for e in events:
            etype = e["event_type"]
            event_counts[etype] = event_counts.get(etype, 0) + 1

        motor_events_total = sum(
            event_counts.get(t, 0) for t in self.MOTOR_EVENTS
        )
        gaze_aversions = event_counts.get("GAZE_AVERSION", 0)
        posture_unstable_events = event_counts.get("POSTURE_UNSTABLE", 0)

        # Telemetry ratios
        frames = telem["frames"] if telem else 0
        focus_pct = 0.0
        posture_pct = 0.0
        if frames > 0:
            focus_pct = round((telem["focus_frames"] or 0) / frames * 100, 1)
            posture_pct = round((telem["stable_frames"] or 0) / frames * 100, 1)

        # Duration
        duration_sec = 0.0
        activity_id = ""
        accuracy = None
        response_time = None
        if session_row:
            activity_id = session_row["activity_id"] or ""
            accuracy = session_row["accuracy"]
            response_time = session_row["response_time_sec"]
            try:
                s = float(session_row["start_time"] or 0)
                e = float(session_row["end_time"] or 0)
                if e > s:
                    duration_sec = round(e - s, 1)
            except Exception:
                pass

        # Attention quality label
        if focus_pct >= 75:
            attention_quality = "Good"
        elif focus_pct >= 50:
            attention_quality = "Moderate"
        else:
            attention_quality = "Low"

        return {
            "session_id": self.session_id,
            "activity_id": activity_id,
            "duration_sec": duration_sec,
            "accuracy": accuracy,
            "response_time_sec": response_time,
            # Attention
            "focus_percent": focus_pct,
            "attention_quality": attention_quality,
            "gaze_aversions": gaze_aversions,
            "total_blinks": int(telem["total_blinks"] or 0) if telem else 0,
            "avg_ear": round(float(telem["avg_ear"] or 0), 3) if telem else 0,
            # Posture
            "posture_stable_percent": posture_pct,
            "posture_unstable_events": posture_unstable_events,
            "avg_yaw_deg": round(float(telem["avg_yaw"] or 0), 1) if telem else 0,
            "avg_pitch_deg": round(float(telem["avg_pitch"] or 0), 1) if telem else 0,
            # Motor
            "motor_events_total": motor_events_total,
            "event_counts": event_counts,
            "telemetry_frames": frames,
        }
