import cv2
import logging

class Camera:
    def __init__(self, camera_id=0, width=640, height=480):
        self.camera_id = camera_id
        self.width = width
        self.height = height
        self.cap = None

    def start(self):
        self.cap = cv2.VideoCapture(self.camera_id)
        if not self.cap.isOpened():
            logging.error(f"Failed to open camera {self.camera_id}")
            return False
            
        self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
        self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
        logging.info(f"Camera {self.camera_id} started at {self.width}x{self.height}")
        return True

    def get_frame(self):
        if not self.cap or not self.cap.isOpened():
            return False, None
            
        ret, frame = self.cap.read()
        if not ret:
            logging.warning("Failed to grab frame from camera")
            return False, None
            
        # Optional: Flip horizontally for a mirror effect (more natural for the participant)
        frame = cv2.flip(frame, 1)
        return True, frame

    def stop(self):
        if self.cap:
            self.cap.release()
            logging.info(f"Camera {self.camera_id} released")
