class RecommendationEngine:
    """
    Maps participant goals to specific activities and recommends
    appropriate difficulty based on real recent-session performance.
    """

    # Maps goal domain → activity ID
    DOMAIN_MAP: dict = {
        "instruction following": "A2",
        "target selection": "A3",
        "action imitation": "A4",
        "social / emotion": "A5",
        "response to demand": "A6",
        "visual attention": "A1",
        "motor regulation": "A1",
    }

    def recommend_activity(
        self, goal: dict, recent_performance: dict = None
    ) -> dict | None:
        domain = goal.get("domain", "").lower().strip()
        activity_id = self.DOMAIN_MAP.get(domain)
        if not activity_id:
            # Fuzzy fallback: check if any key is a substring of domain
            for key, aid in self.DOMAIN_MAP.items():
                if key in domain or domain in key:
                    activity_id = aid
                    break
        if not activity_id:
            return None

        # Determine difficulty from real accuracy
        accuracy = None
        if recent_performance:
            accuracy = recent_performance.get("accuracy")

        if accuracy is None:
            recommended_difficulty = "Low"
        elif accuracy >= 0.8:
            recommended_difficulty = "High"
        elif accuracy >= 0.5:
            recommended_difficulty = "Medium"
        else:
            recommended_difficulty = "Low"

        return {
            "goal_id": goal.get("goal_id", ""),
            "goal_domain": goal.get("domain", ""),
            "goal_text": goal.get("goal_text", ""),
            "activity_id": activity_id,
            "recommended_difficulty": recommended_difficulty,
            "current_accuracy": accuracy,
            "rationale": (
                f"Based on recent accuracy of {int((accuracy or 0) * 100)}%, "
                f"recommending Activity {activity_id} at {recommended_difficulty} difficulty."
            )
            if accuracy is not None
            else f"No prior data. Starting Activity {activity_id} at Low difficulty.",
        }

    def recommend_all(self, goals: list, recent_performance: dict = None) -> list:
        """Returns a recommendation for each goal."""
        results = []
        for goal in goals:
            rec = self.recommend_activity(goal, recent_performance)
            if rec:
                results.append(rec)
        return results
