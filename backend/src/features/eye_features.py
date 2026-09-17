class EyeFeatureExtractor:
    def __init__(self):
        self.total_blinks = 0
        self.is_currently_blinking = False
        self.gaze_aversions = 0
        self.last_gaze = "CENTER"
        
        self.session_start_time = None
        self.gaze_durations = {
            "CENTER": 0.0,
            "LEFT": 0.0,
            "RIGHT": 0.0
        }
        self.last_timestamp = None

    def extract(self, perception_packet, activity_context=None):
        timestamp = perception_packet.get("timestamp")
        face = perception_packet.get("face", {})
        
        # Blink tracking
        is_blinking = face.get("is_blinking", False)
        if is_blinking and not self.is_currently_blinking:
            self.total_blinks += 1
        self.is_currently_blinking = is_blinking
        
        # Gaze tracking
        gaze_direction = face.get("gaze_direction", "CENTER")
        
        if self.last_timestamp is not None:
            dt = timestamp - self.last_timestamp
            if gaze_direction in self.gaze_durations:
                self.gaze_durations[gaze_direction] += dt
                
            # Track gaze aversions (transitioning away from CENTER)
            if self.last_gaze == "CENTER" and gaze_direction != "CENTER":
                self.gaze_aversions += 1
                
        else:
            self.session_start_time = timestamp
            
        self.last_gaze = gaze_direction
        self.last_timestamp = timestamp
        
        # Calculate blink rate (blinks per minute)
        elapsed = 0
        if self.session_start_time and timestamp > self.session_start_time:
            elapsed = timestamp - self.session_start_time
            
        blink_rate = 0.0
        if elapsed > 0:
            blink_rate = (self.total_blinks / elapsed) * 60.0
            
        return {
            "timestamp": timestamp,
            "total_blinks": self.total_blinks,
            "blink_rate_bpm": blink_rate,
            "gaze_aversions": self.gaze_aversions,
            "current_gaze": gaze_direction,
            "gaze_durations_sec": self.gaze_durations.copy()
        }
