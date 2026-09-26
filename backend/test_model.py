import cv2
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision
import numpy as np
from pathlib import Path

def check_model():
    model_path = r"c:\Users\USER\OneDrive\Desktop\snowie\backend\face_landmarker.task"
    base_options = python.BaseOptions(model_asset_path=model_path)
    options = vision.FaceLandmarkerOptions(
        base_options=base_options,
        running_mode=vision.RunningMode.IMAGE,
        num_faces=1
    )
    detector = vision.FaceLandmarker.create_from_options(options)
    
    # Create a dummy image with a face-like structure or just a blank image. 
    # MediaPipe FaceLandmarker requires an actual face to detect landmarks,
    # but we might just inspect the detector or run on a stock image.
    # Actually, we can just check if we can run it, but maybe just outputting a face image is better.
    # To really verify, let's create a black image and see what happens, or download a test face image.
    
    # Let's download a small sample face image.
    import urllib.request
    url = "https://raw.githubusercontent.com/opencv/opencv/master/samples/data/lena.jpg"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            with open("test_face.jpg", "wb") as f:
                f.write(response.read())
        img = cv2.imread("test_face.jpg")
        rgb_frame = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=rgb_frame)
        results = detector.detect(mp_image)
        
        if results.face_landmarks:
            print(f"Number of landmarks detected: {len(results.face_landmarks[0])}")
            if len(results.face_landmarks[0]) >= 478:
                print("Model SUPPORTS iris landmarks (478+).")
            else:
                print("Model DOES NOT support iris landmarks.")
        else:
            print("No face detected in test image.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == '__main__':
    check_model()
