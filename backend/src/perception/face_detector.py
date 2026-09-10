import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
from pathlib import Path

class FaceDetector:
    def __init__(self):
        model_path = str(Path(__file__).resolve().parent.parent.parent / 'face_landmarker.task')
        base_options = python.BaseOptions(model_asset_path=model_path)
        options = vision.FaceLandmarkerOptions(
            base_options=base_options,
            running_mode=vision.RunningMode.IMAGE,
            num_faces=1
        )
        self.detector = vision.FaceLandmarker.create_from_options(options)

    def process(self, frame, timestamp):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        results = self.detector.detect(mp_image)
        
        face_data = {
            "head_yaw": 0.0,
            "head_pitch": 0.0,
            "orientation": "AWAY"
        }
        
        if results.face_landmarks:
            face_landmarks_list = results.face_landmarks[0]
            ih, iw, _ = frame.shape
            
            # 33 is typical nose tip, 263 right eye, 33 left eye, 152 chin etc.
            # A coarse way to estimate head pose without solving PnP for MVP:
            nose_tip = face_landmarks_list[1]
            left_eye = face_landmarks_list[33]
            right_eye = face_landmarks_list[263]
            
            # Convert to pixel coordinates for basic estimation
            nx, ny = int(nose_tip.x * iw), int(nose_tip.y * ih)
            lx, ly = int(left_eye.x * iw), int(left_eye.y * ih)
            rx, ry = int(right_eye.x * iw), int(right_eye.y * ih)
            
            # Simple heuristic for Yaw: compare nose distance to left vs right eye
            dist_left = abs(nx - lx)
            dist_right = abs(nx - rx)
            
            if dist_left + dist_right > 0:
                yaw_ratio = dist_left / (dist_left + dist_right)
                face_data["head_yaw"] = yaw_ratio
                
                if yaw_ratio < 0.35:
                    face_data["orientation"] = "LEFT"
                elif yaw_ratio > 0.65:
                    face_data["orientation"] = "RIGHT"
                else:
                    # Very coarse pitch check: nose vs eyes vertically
                    eye_y = (ly + ry) / 2
                    pitch_diff = ny - eye_y
                    
                    # Positive means nose is below eyes (normal forward). 
                    # If pitch_diff is very small or negative, looking UP. 
                    # If pitch_diff is very large, looking DOWN.
                    # This is highly dependent on camera angle, so we just use a basic threshold for MVP
                    if pitch_diff > (ih * 0.15):
                        face_data["orientation"] = "DOWN"
                    else:
                        face_data["orientation"] = "FORWARD"
        
        return {
            "timestamp": timestamp,
            "face": face_data
        }
