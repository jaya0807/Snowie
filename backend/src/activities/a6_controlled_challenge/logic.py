import sqlite3
import json
from datetime import datetime
from db import save_activity_metrics

class Activity6Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path
        
    def process_submission(self, session_id: str, metrics: dict) -> dict:
        """
        Process the A6 (Space Mission) submission.
        """
        # Calculate summary metrics
        accuracy = metrics.get("accuracy", 0.0)
        avg_latency = metrics.get("avg_latency", 0.0)
        
        # Save to database using the unified telemetry handler
        save_activity_metrics(
            self.db_path,
            session_id=session_id,
            activity_id="A6",
            accuracy=accuracy,
            avg_latency=avg_latency,
            metrics_json=json.dumps(metrics)
        )
        
        return {
            "status": "success",
            "accuracy": accuracy,
            "avg_latency": avg_latency
        }
