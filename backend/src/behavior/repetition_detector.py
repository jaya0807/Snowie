import numpy as np
import time

class RepetitionDetector:
    def __init__(self, cycle_threshold=4, time_window=5.0):
        # A starting prototype rule is approximately 4+ cycles within 5 seconds.
        self.cycle_threshold = cycle_threshold
        self.time_window = time_window
        self.history = {} # part -> list of (timestamp, y_pos)

    def process_movement(self, pose_data, timestamp):
        events = []
        
        for part, (x, y, vis) in pose_data.items():
            if vis < 0.5:
                continue
                
            if part not in self.history:
                self.history[part] = []
                
            self.history[part].append((timestamp, y))
            
            # Keep only history within the time window
            self.history[part] = [(t, pos) for t, pos in self.history[part] if timestamp - t <= self.time_window]
            
            # Need minimum points to detect peaks
            if len(self.history[part]) > 10:
                y_vals = [pos for _, pos in self.history[part]]
                
                # Simple peak/trough detection (direction reversals)
                reversals = 0
                direction = 0 # 1 for up, -1 for down
                
                for i in range(1, len(y_vals)):
                    diff = y_vals[i] - y_vals[i-1]
                    if abs(diff) > 0.02: # noise threshold (normalized coordinates)
                        new_dir = 1 if diff > 0 else -1
                        if direction != 0 and new_dir != direction:
                            reversals += 1
                        direction = new_dir
                        
                cycles = reversals / 2.0
                
                if cycles >= self.cycle_threshold:
                    events.append({
                        "event_type": "REPEATED_MOVEMENT",
                        "body_region": part.upper(),
                        "cycles": cycles,
                        "duration_sec": timestamp - self.history[part][0][0],
                        "confidence": 0.8 # Prototype constant
                    })
                    # Clear history to avoid rapid re-triggering
                    self.history[part] = []
                    
        return events
