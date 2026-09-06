import cv2
import mediapipe as mp
import logging

class PoseDetector:
    def __init__(self, static_image_mode=False, model_complexity=1, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=static_image_mode,
            model_complexity=model_complexity,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )
        
        # We focus on upper limbs for the MVP as per spec, but we can extract all.
        self.landmark_names = {
            self.mp_pose.PoseLandmark.LEFT_SHOULDER: "left_shoulder",
            self.mp_pose.PoseLandmark.RIGHT_SHOULDER: "right_shoulder",
            self.mp_pose.PoseLandmark.LEFT_ELBOW: "left_elbow",
            self.mp_pose.PoseLandmark.RIGHT_ELBOW: "right_elbow",
            self.mp_pose.PoseLandmark.LEFT_WRIST: "left_wrist",
            self.mp_pose.PoseLandmark.RIGHT_WRIST: "right_wrist",
            self.mp_pose.PoseLandmark.LEFT_HIP: "left_hip",
            self.mp_pose.PoseLandmark.RIGHT_HIP: "right_hip",
            self.mp_pose.PoseLandmark.LEFT_KNEE: "left_knee",
            self.mp_pose.PoseLandmark.RIGHT_KNEE: "right_knee",
            self.mp_pose.PoseLandmark.LEFT_ANKLE: "left_ankle",
            self.mp_pose.PoseLandmark.RIGHT_ANKLE: "right_ankle"
        }

    def process(self, frame, timestamp):
        # MediaPipe needs RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.pose.process(rgb_frame)
        
        pose_data = {}
        if results.pose_landmarks:
            for landmark_enum, name in self.landmark_names.items():
                landmark = results.pose_landmarks.landmark[landmark_enum]
                pose_data[name] = [landmark.x, landmark.y, landmark.visibility]
                
        return {
            "timestamp": timestamp,
            "pose": pose_data
        }
