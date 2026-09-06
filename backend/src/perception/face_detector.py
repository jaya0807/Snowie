import cv2
import mediapipe as mp
import numpy as np

class FaceDetector:
    def __init__(self, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process(self, frame, timestamp):
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(rgb_frame)
        
        face_data = {
            "head_yaw": 0.0,
            "head_pitch": 0.0,
            "orientation": "AWAY"
        }
        
        if results.multi_face_landmarks:
            face_landmarks = results.multi_face_landmarks[0]
            ih, iw, _ = frame.shape
            
            # 33 is typical nose tip, 263 right eye, 33 left eye, 152 chin etc.
            # A coarse way to estimate head pose without solving PnP for MVP:
            nose_tip = face_landmarks.landmark[1]
            left_eye = face_landmarks.landmark[33]
            right_eye = face_landmarks.landmark[263]
            
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
