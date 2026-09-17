import cv2
import numpy as np
import base64
import time
from perception.pose_detector import PoseDetector
from perception.face_detector import FaceDetector
from features.movement_features import MovementFeatureExtractor
from features.head_features import HeadFeatureExtractor
from features.engagement_features import EngagementFeatureExtractor
from perception.hand_detector import HandDetector
from features.stimming_features import StimmingFeatureExtractor

class PerceptionPipeline:
    def __init__(self):
        self.pose_detector = PoseDetector()
        self.face_detector = FaceDetector()
        self.movement_extractor = MovementFeatureExtractor()
        self.head_extractor = HeadFeatureExtractor()
        self.engagement_extractor = EngagementFeatureExtractor()
        self.hand_detector = HandDetector()
        self.stimming_extractor = StimmingFeatureExtractor()
        
        # A4 Pose Validation State
        self.target_pose = None
        self.consecutive_frames_matched = 0
        self.success_already_emitted = False
        self.FRAMES_TO_CONFIRM = 2
        self.MIN_VISIBILITY = 0.4
        self._debug_frame_count = 0
        
    def set_target_pose(self, pose_id):
        self.target_pose = pose_id
        self.consecutive_frames_matched = 0
        self.success_already_emitted = False
        
    def _validate_pose(self, pose_data, target):
        if not pose_data: return False
        
        def get_y(name):
            if name in pose_data and pose_data[name][2] >= self.MIN_VISIBILITY:
                return pose_data[name][1]
            return None

        def get_x(name):
            if name in pose_data and pose_data[name][2] >= self.MIN_VISIBILITY:
                return pose_data[name][0]
            return None
            
        lw_y, rw_y = get_y("left_wrist"), get_y("right_wrist")
        lw_x, rw_x = get_x("left_wrist"), get_x("right_wrist")
        nose_y = get_y("nose")
        ls_y, rs_y = get_y("left_shoulder"), get_y("right_shoulder")

        if target == "RAISE_ONE_HAND":
            if nose_y is None: return False
            return (lw_y is not None and lw_y < nose_y) or (rw_y is not None and rw_y < nose_y)
            
        elif target == "RAISE_BOTH_HANDS":
            if nose_y is None: return False
            return (lw_y is not None and lw_y < nose_y) and (rw_y is not None and rw_y < nose_y)
            
        elif target == "CLAP":
            if lw_x is None or rw_x is None or lw_y is None or rw_y is None: return False
            return abs(lw_x - rw_x) < 0.15 and abs(lw_y - rw_y) < 0.15
            
        elif target == "TOUCH_HEAD":
            if nose_y is None: return False
            if lw_y is None and rw_y is None: return False
            left_near = lw_y is not None and abs(lw_y - nose_y) < 0.2
            right_near = rw_y is not None and abs(rw_y - nose_y) < 0.2
            return left_near or right_near
            
        elif target == "TOUCH_SHOULDERS":
            if ls_y is None or rs_y is None: return False
            left_near = lw_y is not None and abs(lw_y - ls_y) < 0.15
            right_near = rw_y is not None and abs(rw_y - rs_y) < 0.15
            return left_near or right_near

        return False
        
    def process_base64_frame(self, base64_img):
        if ',' in base64_img:
            base64_img = base64_img.split(',')[1]
            
        img_bytes = base64.b64decode(base64_img)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        timestamp = time.time()
        
        pose_res = self.pose_detector.process(frame, timestamp)
        face_res = self.face_detector.process(frame, timestamp)
        hand_res = self.hand_detector.process(frame, timestamp)
        
        pose_data = pose_res.get("pose", {})
        hands_data = hand_res.get("hands", [])
        
        # Debug every 25 frames
        self._debug_frame_count += 1
        if self._debug_frame_count % 25 == 0:
            print(f"[A4-DEBUG] target={self.target_pose} | landmarks={list(pose_data.keys())} | consec={self.consecutive_frames_matched}")
            if self.target_pose and pose_data:
                check = self._validate_pose(pose_data, self.target_pose)
                print(f"[A4-DEBUG] validate({self.target_pose})={check}")
                for key in ['nose', 'left_wrist', 'right_wrist', 'left_shoulder', 'right_shoulder']:
                    if key in pose_data:
                        x, y, vis = pose_data[key]
                        print(f"  {key}: x={x:.3f} y={y:.3f} vis={vis:.2f}")
        
        perception_packet = {
            "timestamp": timestamp,
            "pose": pose_data,
            "face": face_res.get("face", {}),
            "hands": hands_data
        }
        
        move_feat = self.movement_extractor.extract(perception_packet)
        head_feat = self.head_extractor.extract(perception_packet)
        eng_feat = self.engagement_extractor.extract(perception_packet)
        stim_feat = self.stimming_extractor.extract(perception_packet)
        
        velocity = move_feat.get("velocity", 0.0)
        orientation = face_res.get("face", {}).get("orientation", "AWAY")
        
        eng_score = 95
        if orientation in ["LEFT", "RIGHT"]:
            eng_score = 60
        elif orientation in ["AWAY", "DOWN"]:
            eng_score = 20
            
        result = {
            "type": "telemetry",
            "engagement": eng_score,
            "latency": "0.0",
            "event": {
                "time": "Live",
                "msg": f"Head: {orientation} | Motion: {velocity:.2f}",
                "type": "ok" if eng_score > 50 else "warn"
            },
            "sessionActive": True,
            "stimming": stim_feat
        }
        
        # A4 pose validation (was dead code before — early return bug fixed)
        if self.target_pose and not self.success_already_emitted:
            if self._validate_pose(pose_data, self.target_pose):
                self.consecutive_frames_matched += 1
                print(f"[A4-DEBUG] MATCHED! consecutive={self.consecutive_frames_matched}/{self.FRAMES_TO_CONFIRM}")
                if self.consecutive_frames_matched >= self.FRAMES_TO_CONFIRM:
                    self.success_already_emitted = True
                    print(f"[A4-DEBUG] *** POSE SUCCESS: {self.target_pose} ***")
                    result["a4_success_event"] = {
                        "type": "pose_success",
                        "pose": self.target_pose
                    }
            else:
                self.consecutive_frames_matched = 0
                
        return result