class EvidenceEngine:
    """
    Generates structured, traceable evidence insights from session event data.
    Uses observed-association framing — never causal language.
    Supports all event types produced by the current HiddenCameraProcessor.
    """

    MOTOR_EVENT_TYPES = {
        "HAND_FLAPPING": "Hand Flapping",
        "BODY_ROCKING": "Body Rocking",
        "WRIST_POSTURING": "Wrist Posturing",
        "FINGER_FLICKING": "Finger Flicking",
        "HEAD_TIC": "Head Tic",
    }

    ATTENTION_EVENT_TYPES = {
        "GAZE_AVERSION": "Gaze Aversion",
        "POSTURE_UNSTABLE": "Posture Instability",
    }

    def __init__(self):
        self.insights: list = []

    def generate_insight(
        self,
        statement: str,
        evidence_data: dict,
        limitations: list = None,
    ) -> dict:
        return {
            "statement": statement,
            "evidence": evidence_data,
            "limitations": limitations or [
                "observational system only",
                "limited session count",
                "not a clinical diagnosis",
            ],
        }

    def analyze_repetition_context(self, events: list) -> dict | None:
        """
        Analyses motor and attention events for a session.
        Returns a single insight dict or None if no events of interest found.
        """
        if not events:
            return None

        motor_counts: dict = {}
        attention_counts: dict = {}

        for event in events:
            etype = event.get("event_type", "")
            if etype in self.MOTOR_EVENT_TYPES:
                motor_counts[etype] = motor_counts.get(etype, 0) + 1
            elif etype in self.ATTENTION_EVENT_TYPES:
                attention_counts[etype] = attention_counts.get(etype, 0) + 1

        total_motor = sum(motor_counts.values())
        total_attention = sum(attention_counts.values())
        total_events = total_motor + total_attention

        if total_events == 0:
            return None

        # Build readable summary
        motor_parts = [
            f"{count} {self.MOTOR_EVENT_TYPES[etype]}"
            for etype, count in sorted(motor_counts.items())
        ]
        attention_parts = [
            f"{count} {self.ATTENTION_EVENT_TYPES[etype]}"
            for etype, count in sorted(attention_counts.items())
        ]
        all_parts = motor_parts + attention_parts

        statement = (
            f"An observed association was noted between task engagement and "
            f"the following behavioural markers: {', '.join(all_parts)}. "
            f"This is an observational finding and does not imply causation."
        )

        return self.generate_insight(
            statement=statement,
            evidence_data={
                "total_events": total_events,
                "motor_events": total_motor,
                "attention_events": total_attention,
                "high_demand_events": motor_counts.get("HAND_FLAPPING", 0)
                + motor_counts.get("HEAD_TIC", 0)
                + attention_counts.get("GAZE_AVERSION", 0),
                "breakdown": {**motor_counts, **attention_counts},
            },
        )
