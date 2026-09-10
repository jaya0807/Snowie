import sqlite3
import time

class Activity3Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path

    def process_submission(self, session_id: str, data: dict):
        """
        Process the submitted data for A3 and record it.
        Expected data format:
        {
            "session_id": str,
            "accuracy": float,
            "avg_latency": float,
            "metrics": {
                "errors": int,
                "totalAttempts": int,
                "levelsCompleted": int
            }
        }
        """
        accuracy = data.get("accuracy", 0.0)
        avg_latency = data.get("avg_latency", 0.0)
        metrics = data.get("metrics", {})
        
        # Save to DB
        try:
            conn = sqlite3.connect(self.db_path)
            c = conn.cursor()
            
            c.execute("""
                CREATE TABLE IF NOT EXISTS activity3_results (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    session_id TEXT,
                    accuracy REAL,
                    avg_latency REAL,
                    errors INTEGER,
                    total_attempts INTEGER,
                    levels_completed INTEGER,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            """)
            
            c.execute("""
                INSERT INTO activity3_results 
                (session_id, accuracy, avg_latency, errors, total_attempts, levels_completed)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (
                session_id, 
                accuracy, 
                avg_latency, 
                metrics.get("errors", 0),
                metrics.get("totalAttempts", 0),
                metrics.get("levelsCompleted", 0)
            ))
            
            conn.commit()
            conn.close()
            
        except Exception as e:
            print(f"Database error in A3: {e}")
            
        return {
            "status": "success",
            "accuracy": accuracy,
            "avg_latency": avg_latency
        }
