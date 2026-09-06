from .pose_detector import PoseDetector
from .face_detector import FaceDetector

class LandmarkProcessor:
    def __init__(self):
        self.pose_detector = PoseDetector()
        self.face_detector = FaceDetector()
        
    def process_frame(self, frame, timestamp):
        pose_result = self.pose_detector.process(frame, timestamp)
        face_result = self.face_detector.process(frame, timestamp)
        
        return {
            "timestamp": timestamp,
            "pose": pose_result["pose"],
            "face": face_result["face"]
        }
