import numpy as np

class MovementAnalyzer:
    def __init__(self):
        self.previous_pose = None
        self.previous_timestamp = None

    def analyze(self, current_pose, current_timestamp):
        movement_data = {}
        
        if self.previous_pose and self.previous_timestamp:
            dt = current_timestamp - self.previous_timestamp
            if dt > 0:
                for part, (x, y, vis) in current_pose.items():
                    if part in self.previous_pose and vis > 0.5:
                        px, py, pvis = self.previous_pose[part]
                        if pvis > 0.5:
                            # d_t = sqrt((x_t-x_(t-1))^2 + (y_t-y_(t-1))^2)
                            dist = np.sqrt((x - px)**2 + (y - py)**2)
                            velocity = dist / dt
                            movement_data[part] = {
                                "distance": dist,
                                "velocity": velocity
                            }
        
        self.previous_pose = current_pose
        self.previous_timestamp = current_timestamp
        
        return movement_data
