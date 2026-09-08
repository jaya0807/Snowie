# 🚀 Activity Development Guide

Welcome! If you are a developer tasked with building one of the upcoming Activities (A2 through A6), this guide will explain exactly how to build it using our **Mirrored Vertical Slicing** architecture.

## 🏗️ Architecture Overview

To keep the codebase perfectly clean, every Activity has its own dedicated folder in the Frontend and an exact matching folder in the Backend. 

The structure is already scaffolded for you:

### Frontend (Next.js) -> `frontend/src/activities/`
- `a1_natural_interaction/` *(✅ Completed Example)*
- `a2_follow_instruction/`
- `a3_target_finding/`
- `a4_imitation/`
- `a5_emotion_social/`
- `a6_controlled_challenge/`

### Backend (FastAPI) -> `backend/src/activities/`
- `a1_natural_interaction/` *(✅ Completed Example)*
- `a2_follow_instruction/`
- `a3_target_finding/`
- `a4_imitation/`
- `a5_emotion_social/`
- `a6_controlled_challenge/`

---

## 🛠️ Step-by-Step Implementation Guide

### 1. Build the Frontend UI
Navigate to your specific activity folder in the frontend (e.g., `frontend/src/activities/a2_follow_instruction/`).
Create a main UI component file (e.g., `Activity2UI.tsx`).

**Important UI Rules:**
- The activity should be a `fixed` or `absolute` overlay (`z-index: 10`).
- The webcam video feed will automatically render *behind* your UI in the core `child/page.tsx` wrapper. Make sure your UI has a transparent or semi-transparent background so the child can see themselves!
- Use Tailwind CSS and `framer-motion` (or standard CSS animations) for interactive elements.

**Wire it into the Router:**
Once your component is ready, go to `frontend/src/app/child/page.tsx` and add your component to the render loop:
```tsx
import Activity2UI from "@/activities/a2_follow_instruction/Activity2UI";

// Inside the return block of child/page.tsx:
<div className="absolute inset-0 z-10">
    {activityId === 'A2' && <Activity2UI />}
</div>
```

### 2. Build the Backend Logic
Navigate to your specific activity folder in the backend (e.g., `backend/src/activities/a2_follow_instruction/`).
Create a logic file (e.g., `logic.py`).

**What this file should do:**
- Process the telemetry or voice data sent from the frontend.
- Calculate scores (e.g., Accuracy, Response Time).
- Save events to the SQLite Database (`observe.db`) into the `events` table.

### 3. Wire them together (REST or WebSockets)
If your activity requires real-time Computer Vision (like tracking a hand touching a target):
- The `child/page.tsx` wrapper is already silently extracting video frames at 5 FPS and sending them to `ws://localhost:8001/api/ws/session`.
- You can hook into the `PerceptionPipeline` in `backend/src/api.py` to analyze those frames using MediaPipe.
- Send WebSocket messages back to the frontend to trigger animations (e.g., `{"event": "target_hit"}`).

If your activity is purely voice/click based (like A1):
- You can expose a standard REST endpoint in `backend/src/api.py` (e.g., `@app.post("/api/activities/a2/submit")`).
- Your frontend component can simply `fetch()` that endpoint when the activity is finished.

---
*Happy coding! Keep the files inside their respective folders so our core routing logic stays completely uncluttered!*
