import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import logging
from pathlib import Path

class PoseDetector:
    def __init__(self):
        model_path = str(Path(__file__).resolve().parent.parent.parent / 'pose_landmarker_lite.task')
        base_options = python.BaseOptions(model_asset_path=model_path)
        # Use IMAGE mode — stateless, no monotonic timestamp requirement
        options = vision.PoseLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE
        )
        self.detector = vision.PoseLandmarker.create_from_options(options)
        
        self.landmark_indices = {
            0: "nose",
            7: "left_ear",
            8: "right_ear",
            11: "left_shoulder",
            12: "right_shoulder",
            13: "left_elbow",
            14: "right_elbow",
            15: "left_wrist",
            16: "right_wrist",
            23: "left_hip",
            24: "right_hip",
            25: "left_knee",
            26: "right_knee",
            27: "left_ankle",
            28: "right_ankle"
        }

    def process(self, frame, timestamp):
        # MediaPipe needs RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        
        # IMAGE mode — no timestamp needed, fully stateless
        detection_result = self.detector.detect(mp_image)
        
        pose_data = {}
        if detection_result.pose_landmarks:
            landmarks = detection_result.pose_landmarks[0]
            for idx, name in self.landmark_indices.items():
                if idx < len(landmarks):
                    landmark = landmarks[idx]
                    pose_data[name] = [landmark.x, landmark.y, getattr(landmark, 'visibility', 1.0)]
                
        return {
            "timestamp": timestamp,
            "pose": pose_data
        }
