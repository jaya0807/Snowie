import collections

class RepetitionDetector:
    def __init__(self, window_size_sec=5.0, min_cycles=4):
        self.window_size_sec = window_size_sec
        self.min_cycles = min_cycles
        # Stores tuples of (timestamp, amplitude, velocity) for each joint
        self.history = {
            "left_wrist": collections.deque(),
            "right_wrist": collections.deque(),
            "left_shoulder": collections.deque(),
            "right_shoulder": collections.deque()
        }

    def process(self, movement_features):
        """
        Looks for repetitive movement patterns (e.g. flapping, tapping)
        based on the PDF's threshold: ~4+ cycles within 5 seconds.
        """
        timestamp = movement_features["timestamp"]
        velocities = movement_features.get("velocities", {})
        amplitudes = movement_features.get("amplitudes", {})
        
        events = []
        
        for joint in self.history.keys():
            v = velocities.get(joint, 0.0)
            a = amplitudes.get(joint, 0.0)
            
            # Add to rolling window
            self.history[joint].append((timestamp, a, v))
            
            # Prune old data outside the window
            while self.history[joint] and (timestamp - self.history[joint][0][0] > self.window_size_sec):
                self.history[joint].popleft()
                
            # Need sufficient data to detect patterns
            if len(self.history[joint]) > 10:
                event = self._analyze_window(joint, self.history[joint])
                if event:
                    events.append(event)
                    # Clear history to prevent rapid-fire duplicate events
                    self.history[joint].clear()
                    
        return events

    def _analyze_window(self, joint, window):
        # A very basic signal processing heuristic for MVP
        # Count direction reversals (velocity changing sign) as half-cycles
        reversals = 0
        total_duration = window[-1][0] - window[0][0]
        
        if total_duration < 1.0: # Need at least 1 second of data
            return None
            
        for i in range(1, len(window) - 1):
            prev_v = window[i-1][2]
            curr_v = window[i][2]
            
            # If velocity crosses zero (and has some magnitude to avoid micro-jitter)
            if (prev_v > 0.01 and curr_v < -0.01) or (prev_v < -0.01 and curr_v > 0.01):
                reversals += 1
                
        # 1 cycle = 2 reversals (back and forth)
        cycles = reversals / 2.0
        
        if cycles >= self.min_cycles:
            return {
                "event_type": "REPEATED_MOVEMENT",
                "body_region": joint.upper(),
                "cycles": cycles,
                "duration_sec": round(total_duration, 2),
                "frequency_hz": round(cycles / total_duration, 2) if total_duration > 0 else 0,
                "confidence": 0.85 # Prototype confidence
            }
            
        return None
