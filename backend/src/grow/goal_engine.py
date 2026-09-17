import sqlite3
import os
import uuid

_DB_DEFAULT = os.environ.get(
    "DB_PATH",
    os.path.join(os.path.dirname(__file__), "..", "observe.db")
)

# Default goals seeded for new participants
_DEFAULT_GOALS = [
    {
        "domain": "Instruction Following",
        "goal_text": "Improve completion rate of two-step verbal instructions",
        "baseline": "60%",
        "target": "80%",
        "status": "ACTIVE",
    },
    {
        "domain": "Action Imitation",
        "goal_text": "Improve mirrored motor imitation latency",
        "baseline": "4.2s",
        "target": "< 2.0s",
        "status": "ACTIVE",
    },
    {
        "domain": "Social / Emotion",
        "goal_text": "Correctly identify basic emotions in visual stimuli",
        "baseline": "40%",
        "target": "75%",
        "status": "REVIEW",
    },
    {
        "domain": "Visual Attention",
        "goal_text": "Sustain visual focus on stimulus for 10+ consecutive seconds",
        "baseline": "5s",
        "target": "10s",
        "status": "ACTIVE",
    },
    {
        "domain": "Motor Regulation",
        "goal_text": "Reduce frequency of repetitive motor behaviours during structured tasks",
        "baseline": "8 events/session",
        "target": "< 4 events/session",
        "status": "ACTIVE",
    },
]


class GoalEngine:
    """
    Manages participant therapy goals backed by the SQLite goals table.
    All reads and writes go to the real database.
    """

    def __init__(self, db_path: str = None, db_connection: str = None):
        # Accept both db_path and legacy db_connection kwarg
        self.db_path = db_path or db_connection or _DB_DEFAULT

    def get_active_goals(self, participant_id: str) -> list:
        """Returns all goals for the participant from the DB."""
        with sqlite3.connect(self.db_path) as conn:
            conn.row_factory = sqlite3.Row
            rows = conn.execute(
                "SELECT * FROM goals WHERE participant_id=? ORDER BY status, domain",
                (participant_id,),
            ).fetchall()
        return [dict(r) for r in rows]

    def create_goal(
        self,
        participant_id: str,
        domain: str,
        goal_text: str,
        baseline,
        target,
        status: str = "ACTIVE",
    ) -> dict:
        """Create or update a goal for this participant+domain pair."""
        goal_id = f"G-{uuid.uuid4().hex[:6].upper()}"
        baseline_str = str(baseline)
        target_str = str(target)

        with sqlite3.connect(self.db_path) as conn:
            existing = conn.execute(
                "SELECT goal_id FROM goals WHERE participant_id=? AND domain=?",
                (participant_id, domain),
            ).fetchone()

            if existing:
                conn.execute(
                    "UPDATE goals SET goal_text=?, baseline=?, target=?, status=? WHERE goal_id=?",
                    (goal_text, baseline_str, target_str, status, existing[0]),
                )
                goal_id = existing[0]
            else:
                conn.execute(
                    "INSERT INTO goals (goal_id, participant_id, domain, goal_text, baseline, target, status) "
                    "VALUES (?,?,?,?,?,?,?)",
                    (goal_id, participant_id, domain, goal_text, baseline_str, target_str, status),
                )

        return {
            "goal_id": goal_id,
            "participant_id": participant_id,
            "domain": domain,
            "goal_text": goal_text,
            "baseline": baseline_str,
            "target": target_str,
            "status": status,
        }

    def seed_default_goals(self, participant_id: str) -> list:
        """Insert default goals for a new participant if none exist."""
        existing = self.get_active_goals(participant_id)
        if existing:
            return existing
        goals = []
        for g in _DEFAULT_GOALS:
            result = self.create_goal(
                participant_id,
                g["domain"],
                g["goal_text"],
                g["baseline"],
                g["target"],
                g["status"],
            )
            goals.append(result)
        return goals
