from .pose_detector import PoseDetector
from .face_detector import FaceDetector

class PerceptionEngine:
    def __init__(self):
        self.pose_detector = PoseDetector()
        self.face_detector = FaceDetector()

    def process(self, frame_packet):
        """
        Receives a frame_packet from the Capture Engine and returns 
        the unified perception JSON schema defined in the PDF.
        """
        frame = frame_packet.get("frame")
        timestamp = frame_packet.get("timestamp")
        
        if frame is None:
            return None
            
        pose_data = self.pose_detector.process_frame(frame)
        face_data = self.face_detector.process_frame(frame)
        
        perception_packet = {
            "timestamp": timestamp,
            "pose": pose_data,
            "face": face_data
        }
        
        return perception_packet
