from database.database import Database
import time

class Activity5Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path
        self.db = Database(db_path)

    def process_submission(self, session_id: str, data: dict):
        accuracy = data.get("accuracy", 0.0)
        avg_latency = data.get("avg_latency", 0.0)
        
        # We can store metrics if needed, but we'll use the main end_session 
        # API to close out the session or just update here if needed.
        # This matches the pattern of A2 and A3 where they just return the processed metrics
        # and rely on the frontend calling /api/session/end.
        
        return {
            "accuracy": accuracy,
            "avg_latency": avg_latency,
            "metrics": data.get("metrics", {})
        }
