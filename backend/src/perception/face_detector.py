import mediapipe as mp
import cv2

class FaceDetector:
    def __init__(self, min_detection_confidence=0.5, min_tracking_confidence=0.5):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=False,
            min_detection_confidence=min_detection_confidence,
            min_tracking_confidence=min_tracking_confidence
        )

    def process_frame(self, frame):
        image_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.face_mesh.process(image_rgb)
        
        face_data = {
            "head_yaw": 0.0,
            "head_pitch": 0.0,
            "orientation": "AWAY"  # Default if no face found
        }
        
        if results.multi_face_landmarks:
            landmarks = results.multi_face_landmarks[0].landmark
            
            # Simple heuristic for coarse yaw/pitch
            nose = landmarks[1]
            left_eye = landmarks[33]   # Left eye outer corner
            right_eye = landmarks[263] # Right eye outer corner
            chin = landmarks[152]
            
            eye_dist_x = abs(right_eye.x - left_eye.x)
            if eye_dist_x > 0:
                # 0.5 means nose is perfectly centered between eyes
                yaw_ratio = (nose.x - left_eye.x) / eye_dist_x
                # Map roughly to degrees (-90 to 90)
                face_data["head_yaw"] = (yaw_ratio - 0.5) * 180.0
            
            eye_center_y = (left_eye.y + right_eye.y) / 2.0
            face_height_y = abs(chin.y - eye_center_y)
            if face_height_y > 0:
                pitch_ratio = (nose.y - eye_center_y) / face_height_y
                face_data["head_pitch"] = (pitch_ratio - 0.5) * 180.0
                
            # Classify orientation based on PDF rules
            yaw = face_data["head_yaw"]
            pitch = face_data["head_pitch"]
            
            if pitch > 20:
                face_data["orientation"] = "DOWN"
            elif yaw > 25:
                face_data["orientation"] = "RIGHT"
            elif yaw < -25:
                face_data["orientation"] = "LEFT"
            elif abs(yaw) <= 25 and pitch <= 20:
                face_data["orientation"] = "FORWARD"
            else:
                face_data["orientation"] = "AWAY"
                
        return face_data
