class HeadFeatureExtractor:
    def __init__(self):
        self.previous_orientation = None
        self.last_timestamp = None
        self.continuous_duration = 0.0

    def extract(self, perception_packet):
        """
        Tracks head orientation changes and continuous duration in a state
        to detect sustained attention or looking away.
        """
        timestamp = perception_packet.get("timestamp")
        face = perception_packet.get("face", {})
        orientation = face.get("orientation", "AWAY")
        
        features = {
            "timestamp": timestamp,
            "current_orientation": orientation,
            "orientation_changed": False,
            "continuous_duration_sec": 0.0
        }

        if self.last_timestamp is not None:
            dt = timestamp - self.last_timestamp
            if self.previous_orientation == orientation:
                self.continuous_duration += dt
            else:
                features["orientation_changed"] = True
                self.continuous_duration = 0.0

        features["continuous_duration_sec"] = self.continuous_duration
        self.previous_orientation = orientation
        self.last_timestamp = timestamp
        
        return features
