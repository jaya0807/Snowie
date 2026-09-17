import cv2
import sys
import os

# Ensure src is in the path so imports work
sys.path.append(os.path.join(os.path.dirname(__file__), "src"))

from perception_pipeline import PerceptionPipeline

def main():
    print("Initializing Perception Pipeline...")
    pipeline = PerceptionPipeline()
    
    print("Opening camera (this may take a few seconds)...")
    cap = cv2.VideoCapture(0)
    
    if not cap.isOpened() or not cap.read()[0]:
        print("\n" + "="*50)
        print("ERROR: Failed to open camera!")
        print("This usually happens because:")
        print("1. Another app (like Zoom, Teams, Windows Camera) is using your webcam.")
        print("2. You need to allow Python to access your camera in Windows Privacy Settings.")
        print("3. You don't have a webcam connected at index 0.")
        print("="*50 + "\n")
        return

    print("Camera opened. Press 'q' to quit.")

    # Start a dummy session so we track blinks/gaze duration
    pipeline.reset_session()

    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame. Did the camera disconnect?")
            break
            
        # Flip the frame horizontally for a more natural mirror view
        frame = cv2.flip(frame, 1)

        # Process the frame
        result = pipeline.process_frame(frame)
        
        # Extract data to display
        engagement = result.get("engagement", 0)
        event_msg = result.get("event", {}).get("msg", "")
        
        eye_track = result.get("eye_tracking", {})
        gaze = eye_track.get("gaze_direction", "UNKNOWN")
        blinks = eye_track.get("blinks", 0)
        bpm = eye_track.get("blink_rate", 0.0)
        pupils = eye_track.get("pupils", None)

        # Draw overlays
        cv2.putText(frame, f"Engagement: {engagement}", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
        cv2.putText(frame, f"{event_msg}", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 0), 2)
        cv2.putText(frame, f"Gaze: {gaze}", (10, 90), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
        cv2.putText(frame, f"Blinks: {blinks} (BPM: {bpm:.1f})", (10, 120), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

        # Draw pupil trackers so you can physically see the eye tracking
        if pupils:
            right_pupil = pupils.get("right")
            left_pupil = pupils.get("left")
            if right_pupil:
                # Need to reflect X since we flipped the frame horizontally
                h, w, _ = frame.shape
                rx, ry = right_pupil
                rx = w - rx
                cv2.circle(frame, (rx, ry), 4, (0, 0, 255), -1)
                cv2.circle(frame, (rx, ry), 8, (0, 255, 0), 1)
            if left_pupil:
                h, w, _ = frame.shape
                lx, ly = left_pupil
                lx = w - lx
                cv2.circle(frame, (lx, ly), 4, (0, 0, 255), -1)
                cv2.circle(frame, (lx, ly), 8, (0, 255, 0), 1)

        # Show the frame
        cv2.imshow("Observe AI - Live Camera Feed", frame)

        # Quit on 'q'
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()
    
    # Print final session metrics
    metrics = pipeline.get_session_metrics()
    print("\n--- Final Session Metrics ---")
    print(metrics)

if __name__ == "__main__":
    main()
