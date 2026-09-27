# 📂 Backend Modules Breakdown

This document provides a technical overview of each core file inside the `backend/src/` directory. Our architecture is heavily decoupled, separating raw feature extraction from high-level behavioral analysis and therapy adaptation.

---

## 🌐 Core API
- **`api.py`**
  The main entry point for the FastAPI server. It handles REST endpoints, establishes high-frequency WebSockets (`/api/ws/session`) for real-time video telemetry streaming, and routes incoming frames to the AI engines.

---

## 👁️ Feature Extraction (`/features`)
These modules interface directly with MediaPipe to extract raw biometric data (coordinates, landmarks, and angles) from video frames.
- **`eye_features.py`**: Calculates the Eye Aspect Ratio (EAR) and pupil coordinates to detect blinks and gaze direction.
- **`head_features.py`**: Computes head pose estimations (Pitch, Yaw, Roll) to determine where the child is looking.
- **`movement_features.py`**: Extracts wrist, shoulder, and elbow landmarks to track arm positioning.
- **`stimming_features.py`**: Tracks high-frequency oscillations in wrist coordinates.
- **`engagement_features.py`**: Aggregates basic presence detection (e.g., is a face visible in the frame).

---

## 🧠 Behavioral Classification (`/behavior`)
These modules take the raw numerical features and classify them into recognizable human behaviors.
- **`engagement_analyzer.py`**: Uses head yaw and eye tracking to classify if the child is "Engaged", "Distracted", or exhibiting "Gaze Aversion".
- **`movement_analyzer.py`**: Analyzes torso and shoulder displacement over time to classify "Body Rocking" or posture instability.
- **`repetition_detector.py`**: Uses sliding windows and frequency analysis on wrist coordinates to detect "Hand Flapping" or repetitive tics.

---

## 📈 Analytics & Pattern Recognition (`/analytics`)
These modules look at behavioral classifications over the entire duration of a session to find long-term trends.
- **`pattern_engine.py`**: Identifies correlations (e.g., "The child exhibits gaze aversions when the game difficulty increases").
- **`evidence_engine.py`**: Logs the exact timestamps and video frame references where specific behaviors occurred for clinical review.
- **`session_analyzer.py`**: Calculates the overall session metrics (accuracy, latency, total behavioral events) when an activity ends.

---

## 🌱 Dynamic Adaptation (`/grow`)
These modules act on the real-time analytics to dynamically alter the therapy environment.
- **`adaptation_engine.py`**: The core "Zone of Proximal Development" engine. It intercepts frustration signals (e.g., increased stimming, low accuracy) and tells the frontend to decrease the game's difficulty or sensory load.
- **`goal_engine.py`**: Tracks long-term therapy goals across multiple sessions.
- **`recommendation_engine.py`**: Suggests new activities or modules based on the child's progress.

---

## 📝 Clinical Reporting (`/reporting`)
These modules integrate with LLMs to generate readable clinical notes for parents and therapists.
- **`prompt_builder.py`**: Ingests the raw session metrics and constructs a highly specific, clinically formatted prompt for the AI.
- **`report_templates.py`**: Contains the baseline prompt templates and formatting guidelines.
- **`report_generator.py`**: Interfaces with **AWS Bedrock (Claude)** to execute the prompt and return a beautifully written, professional session report.
