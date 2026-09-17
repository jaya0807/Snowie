import sqlite3
import json
import time

class Activity6Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def process_submission(self, session_id: str, metrics: dict) -> dict:
        accuracy = metrics.get("accuracy", 0.0)
        avg_latency = metrics.get("avg_latency", 0.0)

        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute(
                "UPDATE sessions SET accuracy = ?, response_time_sec = ?, end_time = ? WHERE session_id = ?",
                (accuracy, avg_latency, time.time(), session_id)
            )
            conn.commit()

        return {
            "status": "success",
            "accuracy": accuracy,
            "avg_latency": avg_latency
        }
