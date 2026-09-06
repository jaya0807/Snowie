class RecommendationEngine:
    """
    Maps professional goals to developmental activities.
    """
    def __init__(self):
        # Domain to Activity mappings based on MVP definitions
        self.domain_map = {
            "instruction_following": "A2",
            "target_selection": "A3",
            "action_imitation": "A4",
            "social_emotional": "A5",
            "response_to_demand": "A6"
        }

    def recommend_activity(self, goal, recent_performance=None):
        domain = goal.get("domain")
        activity_id = self.domain_map.get(domain)
        
        if not activity_id:
            return None
            
        # Default difficulty
        difficulty = "Low"
        
        # Determine difficulty from recent performance
        if recent_performance:
            accuracy = recent_performance.get("accuracy", 0.0)
            if accuracy >= 0.8:
                difficulty = "High"
            elif accuracy >= 0.5:
                difficulty = "Medium"
                
        return {
            "activity_id": activity_id,
            "recommended_difficulty": difficulty,
            "goal_id": goal.get("goal_id")
        }
