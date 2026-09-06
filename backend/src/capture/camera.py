import cv2
import time
import logging

logger = logging.getLogger(__name__)

class CameraEngine:
    def __init__(self, camera_id=0, width=640, height=480):
        self.camera_id = camera_id
        self.width = width
        self.height = height
        self.cap = None
        self.frame_index = 0
        self.is_running = False

    def start(self):
        try:
            self.cap = cv2.VideoCapture(self.camera_id)
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, self.width)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, self.height)
            
            if not self.cap.isOpened():
                logger.error(f"Failed to open camera {self.camera_id}")
                return False
                
            self.is_running = True
            self.frame_index = 0
            logger.info(f"Camera started at {self.width}x{self.height}")
            return True
        except Exception as e:
            logger.error(f"Camera start exception: {e}")
            return False

    def read(self):
        if not self.is_running or self.cap is None:
            return None
            
        ret, frame = self.cap.read()
        if not ret:
            logger.warning("Failed to read frame from camera")
            return None
            
        self.frame_index += 1
        
        return {
            "frame": frame,
            "timestamp": time.time(),
            "frame_index": self.frame_index
        }

    def stop(self):
        self.is_running = False
        if self.cap:
            self.cap.release()
            self.cap = None
        logger.info("Camera stopped")
