class ProgressTracker:
    """
    Computes longitudinal trends across multiple sessions.
    Every trend should show how many sessions support it.
    """
    def __init__(self, db_connection=None):
        self.db = db_connection

    def compute_trends(self, participant_id, activity_id):
        """
        Calculates trends over time for:
        - Activity scores over time
        - Response-time trends
        - Task difficulty history
        """
        # Stub for database retrieval of performance history
        performance_history = [] 
        
        if not performance_history:
            return {
                "message": "No data available",
                "sessions_supported": 0
            }

        sessions_supported = len(performance_history)
        
        accuracies = [p.get("accuracy", 0.0) for p in performance_history]
        response_times = [p.get("response_time_sec", 0.0) for p in performance_history]
        
        trend = "Stable"
        if len(accuracies) >= 2:
            if accuracies[-1] > accuracies[0]:
                trend = "Improving"
            elif accuracies[-1] < accuracies[0]:
                trend = "Declining"

        return {
            "activity_id": activity_id,
            "sessions_supported": sessions_supported,
            "accuracy_trend": trend,
            "average_response_time": sum(response_times) / sessions_supported if sessions_supported > 0 else 0,
            "history": performance_history
        }
