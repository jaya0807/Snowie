import collections
import math
import numpy as np

class StimmingFeatureExtractor:
    def __init__(self, window_size=30):
        # Sliding window for 30 frames (approx 1-2 seconds)
        self.window_size = window_size
        self.history = collections.deque(maxlen=window_size)
        
    def extract(self, perception_packet):
        timestamp = perception_packet.get("timestamp", 0)
        pose = perception_packet.get("pose", {})
        face = perception_packet.get("face", {})
        hands = perception_packet.get("hands", [])
        
        self.history.append({
            "timestamp": timestamp,
            "pose": pose,
            "face": face,
            "hands": hands
        })

        features = {
            "is_body_rocking": False,
            "is_head_tic": False,
            "is_wrist_posturing": False,
            "is_finger_flicking": False,
            "stimming_score": 0.0
        }

        if len(self.history) < 15:
            return features

        # 1. Body Rocking (Shoulder X or Y oscillation)
        shoulder_x = []
        shoulder_y = []
        for frame in self.history:
            ls = frame["pose"].get("left_shoulder")
            rs = frame["pose"].get("right_shoulder")
            if ls and rs:
                mid_x = (ls[0] + rs[0]) / 2.0
                mid_y = (ls[1] + rs[1]) / 2.0
                shoulder_x.append(mid_x)
                shoulder_y.append(mid_y)
                
        if len(shoulder_x) > 15:
            dx = np.diff(shoulder_x)
            dy = np.diff(shoulder_y)
            zc_x = np.sum(np.diff(np.sign(dx)) != 0)
            zc_y = np.sum(np.diff(np.sign(dy)) != 0)
            amp_x = np.max(shoulder_x) - np.min(shoulder_x)
            amp_y = np.max(shoulder_y) - np.min(shoulder_y)
            
            if (zc_x > 5 and amp_x > 0.05) or (zc_y > 5 and amp_y > 0.05):
                features["is_body_rocking"] = True

        # 2. Head Tic (Yaw oscillation)
        yaws = [frame["face"].get("head_yaw", 0) for frame in self.history if "head_yaw" in frame["face"]]
        if len(yaws) > 15:
            dyaw = np.diff(yaws)
            zc_yaw = np.sum(np.diff(np.sign(dyaw)) != 0)
            amp_yaw = np.max(yaws) - np.min(yaws)
            if zc_yaw > 6 and amp_yaw > 0.15:
                features["is_head_tic"] = True

        # 3. Wrist Posturing (Elevated wrists with near-zero velocity)
        wrist_y_history = []
        shoulder_y_history = []
        for frame in self.history:
            lw = frame["pose"].get("left_wrist")
            rw = frame["pose"].get("right_wrist")
            ls = frame["pose"].get("left_shoulder")
            rs = frame["pose"].get("right_shoulder")
            
            # Use left arm for estimation if available
            if lw and ls:
                wrist_y_history.append(lw[1])
                shoulder_y_history.append(ls[1])
                
        if len(wrist_y_history) > 15:
            avg_w_y = np.mean(wrist_y_history)
            avg_s_y = np.mean(shoulder_y_history)
            var_w_y = np.var(wrist_y_history)
            
            # Note: in image coords, smaller Y is "higher" up.
            # If wrist is above shoulder (avg_w_y < avg_s_y) and not moving (low var)
            if avg_w_y < avg_s_y and var_w_y < 0.0005:
                features["is_wrist_posturing"] = True

        # 4. Finger Flicking (Index to Thumb distance oscillation)
        flick_distances = []
        for frame in self.history:
            h_data = frame.get("hands", [])
            if h_data and len(h_data) > 0:
                hand = h_data[0] # check first hand
                if len(hand) > 8:
                    thumb_tip = hand[4]
                    index_tip = hand[8]
                    dist = math.sqrt((thumb_tip[0]-index_tip[0])**2 + (thumb_tip[1]-index_tip[1])**2)
                    flick_distances.append(dist)
                    
        if len(flick_distances) > 15:
            ddist = np.diff(flick_distances)
            zc_dist = np.sum(np.diff(np.sign(ddist)) != 0)
            amp_dist = np.max(flick_distances) - np.min(flick_distances)
            
            if zc_dist > 6 and amp_dist > 0.05:
                features["is_finger_flicking"] = True

        # 5. Composite Score
        score = 0.0
        if features["is_body_rocking"]: score += 25.0
        if features["is_head_tic"]: score += 25.0
        if features["is_wrist_posturing"]: score += 25.0
        if features["is_finger_flicking"]: score += 25.0
        features["stimming_score"] = score

        return features
