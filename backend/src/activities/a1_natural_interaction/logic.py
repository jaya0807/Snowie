import json
import sqlite3
from typing import Dict, Any

class Activity1Logic:
    def __init__(self, db_path: str):
        self.db_path = db_path
        
    def process_submission(self, session_id: str, data: Dict[str, Any]):
        """
        Process the conversational data from the A1 Animal Journey.
        In a real clinical setting, this text data would be passed to an LLM 
        to analyze vocabulary, mood, and sentence complexity.
        """
        name = data.get("name", "")
        feeling = data.get("feeling", "")
        animal = data.get("animal", "")
        day_text = data.get("day_text", "")
        
        # Calculate a basic "accuracy" or "engagement" score for the database
        # If they answered the open-ended question (day_text) with more than 3 words, they get high score
        word_count = len(day_text.split())
        accuracy = min(1.0, word_count / 10.0) if word_count > 0 else 0.5
        
        # Log the conversational event
        context = {
            "name_provided": name,
            "self_reported_mood": feeling,
            "favorite_animal": animal,
            "day_reflection_transcript": day_text,
            "word_count": word_count
        }
        
        import uuid
        import time
        event_id = f"evt_{uuid.uuid4().hex[:8]}"
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO events (event_id, session_id, timestamp, event_type, duration, context)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (event_id, session_id, time.time(), "CONVERSATION_COMPLETE", 0, json.dumps(context)))
            conn.commit()
            
        return {"accuracy": accuracy}
