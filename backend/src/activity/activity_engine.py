import time
from events.event_engine import EventEngine

class ActivityRuntime:
    def __init__(self, session_id, activity_id, activity_type, difficulty):
        self.session_id = session_id
        self.activity_id = activity_id
        self.activity_type = activity_type
        self.difficulty = difficulty
        self.start_time = None
        self.event_engine = EventEngine(session_id)
        self.context = {}

    def start(self):
        self.start_time = time.time()
        self.event_engine.log_event(
            event_type="ACTIVITY_STARTED",
            timestamp=self.start_time,
            activity_id=self.activity_id,
            difficulty=self.difficulty,
            context={"activity_type": self.activity_type}
        )

    def finish(self, completion_status="COMPLETED", accuracy=None, response_time=None):
        end_time = time.time()
        duration = end_time - self.start_time if self.start_time else 0
        
        self.event_engine.log_event(
            event_type="ACTIVITY_COMPLETED" if completion_status == "COMPLETED" else "ACTIVITY_INCOMPLETE",
            timestamp=end_time,
            duration=duration,
            activity_id=self.activity_id,
            difficulty=self.difficulty,
            context={"accuracy": accuracy, "response_time": response_time, "completion_status": completion_status}
        )
        
        return {
            "activity_id": self.activity_id,
            "session_id": self.session_id,
            "activity_type": self.activity_type,
            "difficulty": self.difficulty,
            "response_time_sec": response_time,
            "accuracy": accuracy,
            "completion_status": completion_status
        }
