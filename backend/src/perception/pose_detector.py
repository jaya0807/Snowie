import mediapipe as mp
import cv2

class PoseDetector:
    def __init__(self, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_frame(self, frame):
        # MediaPipe requires RGB images
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(image_rgb)
        
        # Default empty structure as defined by PDF
        pose_data = {
            "left_wrist": [0.0, 0.0, 0.0],
            "right_wrist": [0.0, 0.0, 0.0],
            "left_shoulder": [0.0, 0.0, 0.0],
            "right_shoulder": [0.0, 0.0, 0.0]
        }
        
        if results.pose_landmarks:
            landmarks = results.pose_landmarks.landmark
            
            def get_lm(landmark_enum):
                lm = landmarks[landmark_enum.value]
                return [lm.x, lm.y, lm.visibility]
                
            pose_data["left_shoulder"] = get_lm(self.mp_pose.PoseLandmark.LEFT_SHOULDER)
            pose_data["right_shoulder"] = get_lm(self.mp_pose.PoseLandmark.RIGHT_SHOULDER)
            pose_data["left_wrist"] = get_lm(self.mp_pose.PoseLandmark.LEFT_WRIST)
            pose_data["right_wrist"] = get_lm(self.mp_pose.PoseLandmark.RIGHT_WRIST)
            
        return pose_data
