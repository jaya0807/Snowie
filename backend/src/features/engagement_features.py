class EngagementFeatureExtractor:
    def __init__(self):
        self.state_durations = {
            "FORWARD": 0.0,
            "LEFT": 0.0,
            "RIGHT": 0.0,
            "DOWN": 0.0,
            "AWAY": 0.0
        }
        self.transitions = 0
        self.last_timestamp = None
        self.previous_orientation = None

    def extract(self, perception_packet, activity_context=None):
        """
        Calculates time spent in each head orientation state and counts transitions.
        """
        timestamp = perception_packet.get("timestamp")
        face = perception_packet.get("face", {})
        orientation = face.get("orientation", "AWAY")
        
        # Keep them distinct and allow downstream to group them as LEFT/RIGHT.
        if orientation in self.state_durations and self.last_timestamp is not None:
            dt = timestamp - self.last_timestamp
            self.state_durations[orientation] += dt
            
            if self.previous_orientation and self.previous_orientation != orientation:
                self.transitions += 1
                
        self.last_timestamp = timestamp
        self.previous_orientation = orientation
        
        features = {
            "timestamp": timestamp,
            "state_durations_sec": self.state_durations.copy(),
            "total_transitions": self.transitions,
            "current_target": activity_context.get("current_target") if activity_context else None
        }
        
        return features
