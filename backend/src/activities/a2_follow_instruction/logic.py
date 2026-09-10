import sqlite3
import time

class Activity2Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def process_submission(self, session_id: str, data: dict):
        """
        Process the submitted data for A2 and return final computed accuracy/latency.
        Also record the sequence details if needed.
        """
        metrics = data.get("metrics", {})
        accuracy = data.get("accuracy", 0.0)
        avg_latency = data.get("avg_latency", 0.0)
        
        # Save to database 
        # (Assuming we have a generic way or we just update the session metrics)
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            # The session will also be ended by /api/session/end, but we can store 
            # extra A2 specific details here if we had an a2_metrics table.
            # For MVP, we just return the calculated values for api.py to log.
            pass
            
        return {
            "accuracy": accuracy,
            "avg_latency": avg_latency,
            "errors": metrics.get("errors", 0),
            "total_attempts": metrics.get("totalAttempts", 0)
        }
