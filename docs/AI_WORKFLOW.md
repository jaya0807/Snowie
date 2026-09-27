# 🧠 AI Pipeline & Behavioral Analysis Workflow

This document outlines the core backend architecture and AI data pipeline used during a therapy session.

## 1. Data Ingestion (Real-Time WebSocket)
- The child interacts with the frontend activities.
- Real-time video frames (base64) and audio events are streamed to the FastAPI backend via WebSockets (`api.py`).
- The `event_engine.py` intercepts this high-frequency telemetry.

## 2. Feature Extraction (MediaPipe)
Raw frames are passed through the `features/` modules to extract structured biometric data:
- **`eye_features.py`**: Calculates Eye Aspect Ratio (EAR), blink rates, and pupil tracking for gaze aversions.
- **`head_features.py`**: Computes Pitch, Yaw, and Roll for head pose estimation and posture stability.
- **`movement_features.py`**: Tracks wrist and shoulder coordinates.
- **`stimming_features.py`**: Specialized logic for detecting rapid hand oscillation.

## 3. Behavioral Classification
The extracted raw features are fed into our specialized `behavior/` engines:
- **`engagement_analyzer.py`**: Determines if the child is focused on the screen, looking away, or distracted based on head yaw and eye tracking.
- **`repetition_detector.py`**: Analyzes frequency spectrums of wrist movements over a sliding window to detect repetitive behaviors (e.g., hand flapping).
- **`movement_analyzer.py`**: Classifies body rocking by analyzing periodic torso displacement.

## 4. Session Analytics & Dynamic Adaptation
- **`analytics/pattern_engine.py`**: Aggregates behavioral events over the course of the session to identify triggers (e.g., "Hand flapping increases when visual complexity is high").
- **`grow/adaptation_engine.py`**: Using real-time analytics, this engine dynamically adjusts the difficulty or sensory load of the ongoing activity to keep the child in the optimal zone of proximal development.

## 5. Clinical Reporting (AWS Bedrock Integration)
- Upon session completion, `analytics/session_analyzer.py` calculates overall accuracy, latency, and behavioral event totals.
- **`reporting/prompt_builder.py`**: Constructs a specialized LLM prompt injecting the session metrics.
- **`reporting/report_generator.py`**: Calls **AWS Bedrock (Claude)** to generate a comprehensive, clinically formatted narrative report outlining the child's performance, behavioral insights, and future therapy recommendations.
