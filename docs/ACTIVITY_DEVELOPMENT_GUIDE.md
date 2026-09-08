# 🚀 Activity Development Guide

Welcome! If you are a developer tasked with building one of the upcoming Activities (A2 through A6), this guide explains our **Mirrored Vertical Slicing** architecture.

## 🏗️ Architecture Overview

Every Activity has its own dedicated folder in the Frontend and an exact matching folder in the Backend. 

The structure is already **fully scaffolded** and wired up for you!

### Frontend (Next.js) -> `frontend/src/activities/`
- `a1_natural_interaction/` *(✅ Completed Example)*
- `a2_follow_instruction/` *(Scaffolded)*
- `a3_target_finding/` *(Scaffolded)*
- `a4_imitation/` *(Scaffolded)*
- `a5_emotion_social/` *(Scaffolded)*
- `a6_controlled_challenge/` *(Scaffolded)*

### Backend (FastAPI) -> `backend/src/activities/`
- `a1_natural_interaction/` *(✅ Completed Example)*
- `a2_follow_instruction/` *(Scaffolded)*
- `a3_target_finding/` *(Scaffolded)*
- `a4_imitation/` *(Scaffolded)*
- `a5_emotion_social/` *(Scaffolded)*
- `a6_controlled_challenge/` *(Scaffolded)*

---

## 🛠️ Step-by-Step Implementation Guide

### 1. Develop the Frontend UI
Navigate to your specific activity folder (e.g., `frontend/src/activities/a2_follow_instruction/`). 
You will find an existing `Activity2UI.tsx` file. You do NOT need to wire this into the Next.js router; it is already rendering automatically when the child clicks the game!

**Important UI Rules:**
- **Overlay:** The activity is a `fixed` or `absolute` overlay (`z-index: 10`).
- **Camera Background:** The webcam video feed will automatically render *behind* your UI in the core `child/page.tsx` wrapper. Make sure your UI has a transparent or semi-transparent background so the child can see themselves!
- **Modularity:** To keep the main `ActivityXUI.tsx` file strictly under 200 lines, extract large UI chunks into a local `components/` folder (e.g., `components/TargetBubble.tsx`). See `a1_natural_interaction` for a perfect example of this modularity.

### 2. Develop the Backend Logic
Navigate to your specific activity folder in the backend (e.g., `backend/src/activities/a2_follow_instruction/`).
You will find an existing `logic.py` file containing a class wrapper.

**What this file should do:**
- Process the telemetry or voice data sent from the frontend.
- Calculate metrics (e.g., Accuracy, Response Time).
- Save events to the SQLite Database (`observe.db`) into the `events` table.

### 3. Wire them together (REST or WebSockets)
If your activity requires **real-time Computer Vision** (like tracking a hand touching a target):
- The `child/page.tsx` wrapper is already silently extracting video frames at 5 FPS and sending them to `ws://localhost:8001/api/ws/session`.
- Hook into the `PerceptionPipeline` in `backend/src/api.py` to analyze those frames using MediaPipe.
- Send WebSocket messages back to the frontend to trigger animations (e.g., `{"event": "target_hit"}`).

If your activity is **purely voice/click based** (like A1):
- Expose a standard REST endpoint in `backend/src/api.py` (e.g., `@app.post("/api/activities/a2/submit")`).
- Your frontend component can simply `fetch()` that endpoint.

---
*Happy coding! Keep your feature logic isolated inside these folders so our core application remains completely uncluttered!*
