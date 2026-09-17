import cv2
import mediapipe as mp
import logging

class HandDetector:
    def __init__(self):
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=2,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )

    def process(self, frame, timestamp):
        # MediaPipe needs RGB
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        results = self.hands.process(rgb_frame)
        hands_data = []

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Get the 21 landmarks for this hand
                landmarks = []
                for lm in hand_landmarks.landmark:
                    # Append x, y, z
                    landmarks.append([lm.x, lm.y, lm.z])
                hands_data.append(landmarks)

        return {
            "timestamp": timestamp,
            "hands": hands_data
        }
