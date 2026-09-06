import cv2
import numpy as np
import base64
import time
from perception.pose_detector import PoseDetector
from perception.face_detector import FaceDetector
from features.movement_features import MovementFeatureExtractor
from features.head_features import HeadFeatureExtractor
from features.engagement_features import EngagementFeatureExtractor

class PerceptionPipeline:
    def __init__(self):
        self.pose_detector = PoseDetector()
        self.face_detector = FaceDetector()
        self.movement_extractor = MovementFeatureExtractor()
        self.head_extractor = HeadFeatureExtractor()
        self.engagement_extractor = EngagementFeatureExtractor()
        
    def process_base64_frame(self, base64_img):
        # Decode base64 to OpenCV frame
        # Strip header (data:image/jpeg;base64,...)
        if ',' in base64_img:
            base64_img = base64_img.split(',')[1]
            
        img_bytes = base64.b64decode(base64_img)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        
        timestamp = time.time()
        
        # Run perception
        pose_res = self.pose_detector.process(frame, timestamp)
        face_res = self.face_detector.process(frame, timestamp)
        
        perception_packet = {
            "timestamp": timestamp,
            "pose": pose_res.get("pose", {}),
            "face": face_res.get("face", {})
        }
        
        # Extract features
        move_feat = self.movement_extractor.extract(perception_packet)
        head_feat = self.head_extractor.extract(perception_packet)
        eng_feat = self.engagement_extractor.extract(perception_packet)
        
        # Combine into telemetry
        velocity = move_feat.get("velocity", 0.0)
        orientation = face_res.get("face", {}).get("orientation", "AWAY")
        
        # Simple engagement heuristic for UI demo: 
        # FORWARD = 90-100%, LEFT/RIGHT = 50-70%, AWAY = 10-30%
        eng_score = 95
        if orientation in ["LEFT", "RIGHT"]:
            eng_score = 60
        elif orientation in ["AWAY", "DOWN"]:
            eng_score = 20
            
        return {
            "type": "telemetry",
            "engagement": eng_score,
            "latency": "0.0", # Need game logic for latency
            "event": {
                "time": "Live",
                "msg": f"Head: {orientation} | Motion: {velocity:.2f}",
                "type": "ok" if eng_score > 50 else "warn"
            },
            "sessionActive": True
        }
