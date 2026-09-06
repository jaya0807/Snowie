class EngagementAnalyzer:
    def __init__(self):
        self.current_state = "FORWARD"
        self.state_start_time = None

    def analyze(self, face_data, timestamp):
        events = []
        orientation = face_data.get("orientation", "AWAY")
        
        if self.state_start_time is None:
            self.current_state = orientation
            self.state_start_time = timestamp
            
        elif orientation != self.current_state:
            duration = timestamp - self.state_start_time
            
            events.append({
                "event_type": "HEAD_ORIENTATION_CHANGE",
                "previous_state": self.current_state,
                "new_state": orientation,
                "duration_in_prev_state": duration
            })
            
            if orientation == "AWAY":
                events.append({
                    "event_type": "LOOKING_AWAY_ESTIMATE",
                    "confidence": 0.7
                })
                
            self.current_state = orientation
            self.state_start_time = timestamp
            
        return events
