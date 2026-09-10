import json
from db import save_activity_metrics

class Activity4Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path
        
    def process_submission(self, session_id: str, metrics: dict) -> dict:
        """
        Process the A4 (Mini Movie Studio) submission.
        """
        # Calculate summary metrics
        accuracy = metrics.get("accuracy", 0.0)
        avg_latency = metrics.get("avg_latency", 0.0)
        
        # Save to database using the unified telemetry handler
        save_activity_metrics(
            self.db_path,
            session_id=session_id,
            activity_id="A4",
            accuracy=accuracy,
            avg_latency=avg_latency,
            metrics_json=json.dumps(metrics)
        )
        
        return {
            "status": "success",
            "accuracy": accuracy,
            "avg_latency": avg_latency
        }
