class EvidenceEngine:
    def __init__(self):
        self.insights = []

    def generate_insight(self, statement, evidence_data, limitations=None):
        """
        Creates a structured insight with traceable evidence.
        Prefer 'observed association' over causal language.
        """
        if limitations is None:
            limitations = ["prototype detector", "limited session count"]
            
        insight = {
            "statement": statement,
            "evidence": evidence_data,
            "limitations": limitations
        }
        self.insights.append(insight)
        return insight

    def analyze_repetition_context(self, events):
        """
        Example rule-based pattern extraction tying repetitive events to task demand.
        """
        high_demand = 0
        low_medium = 0
        total = 0
        
        for event in events:
            if event.get("event_type") == "REPEATED_MOVEMENT":
                total += 1
                difficulty = event.get("difficulty", "LOW")
                if difficulty == "HIGH":
                    high_demand += 1
                else:
                    low_medium += 1

        if total > 0:
            statement = "Repetitive movement was observed."
            if high_demand > low_medium:
                statement = "More repetitive movement was observed during high-demand tasks."
                
            return self.generate_insight(
                statement=statement,
                evidence_data={
                    "total_events": total,
                    "high_demand_events": high_demand,
                    "low_medium_events": low_medium,
                    "sessions_observed": 1 # For single session analysis
                }
            )
        return None
