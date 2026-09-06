import math

class MovementFeatureExtractor:
    def __init__(self):
        self.previous_pose = None
        self.previous_timestamp = None

    def extract(self, perception_packet):
        """
        Converts raw landmark coordinates into physical features 
        like velocity and amplitude (d_t = sqrt(dx^2 + dy^2)).
        """
        timestamp = perception_packet.get("timestamp")
        pose = perception_packet.get("pose", {})
        
        features = {
            "timestamp": timestamp,
            "velocities": {
                "left_wrist": 0.0,
                "right_wrist": 0.0,
                "left_shoulder": 0.0,
                "right_shoulder": 0.0
            },
            "amplitudes": {
                "left_wrist": 0.0,
                "right_wrist": 0.0,
                "left_shoulder": 0.0,
                "right_shoulder": 0.0
            }
        }

        if self.previous_pose is not None and self.previous_timestamp is not None:
            dt = timestamp - self.previous_timestamp
            if dt > 0:
                for joint in features["velocities"].keys():
                    curr = pose.get(joint)
                    prev = self.previous_pose.get(joint)
                    
                    if curr and prev and len(curr) >= 3 and len(prev) >= 3:
                        # PDF Rule: reject/down-weight low-visibility landmarks
                        if curr[2] > 0.5 and prev[2] > 0.5:
                            dx = curr[0] - prev[0]
                            dy = curr[1] - prev[1]
                            # Distance calculation d_t
                            d_t = math.sqrt(dx*dx + dy*dy)
                            
                            features["amplitudes"][joint] = d_t
                            features["velocities"][joint] = d_t / dt

        self.previous_pose = pose
        self.previous_timestamp = timestamp
        
        return features
