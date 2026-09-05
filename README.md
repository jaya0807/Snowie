# Observe AI

Observe AI is an intelligent behavioral tracking and analytics platform. It consists of a modern, Stripe-inspired Next.js frontend and a FastAPI backend designed to process clinical and behavioral data.

## 📂 Project Structure

This repository is strictly organized into three core directories to maintain a clean separation of concerns:

```text
sih-2/
├── frontend/     # Next.js 15 UI Application (App Router, Tailwind v4)
├── backend/      # FastAPI Python Server (SQLite, MediaPipe processing)
├── docs/         # Project documentation, architecture diagrams, and guidelines
└── start.ps1     # Windows PowerShell script to spin up both servers instantly
```

### 1. Frontend (`/frontend`)
The frontend is a pure presentation and routing layer. It contains **no complex backend logic**.
- **`/src/app`**: Contains all page routes (`/dashboard`, `/activities`, `/sessions`, etc.).
- **`/src/components`**: Reusable UI elements (Buttons, Cards, Layouts, Charts).
- **Styling**: Built on Tailwind CSS v4 using a strict tokenized design system.

### 2. Backend (`/backend`)
The backend is a pure API layer powering the dashboard.
- **`/src/api.py`**: The main FastAPI entry point exposing endpoints.
- **`/src/perception/`**: Dedicated space for AI processing modules (e.g., MediaPipe Pose/Face detectors).
- **`/src/db/`**: SQLite database models and setup.

### 3. Documentation (`/docs`)
Contains all `.md` files detailing project specifications, AI instructions, and system architecture.

---

## 🎨 Design System & Styling Rules

The frontend utilizes a highly strict, **Stripe-inspired** design system. To maintain this clean, elevated aesthetic, the following rules apply:

1. **Single Source of Truth**: All colors, radiuses, and shadows are defined as semantic CSS variables in `frontend/src/app/globals.css` (inside the `@theme inline` block).
2. **No Hardcoded Colors**: The use of arbitrary hex codes (e.g., `bg-[#176B9C]`) is strictly forbidden in React components. Always use tokens like `bg-brand`, `text-zinc-900`, or `text-success`.
3. **Elevated Cards**: Elevated UI elements (cards, headers, sidebars) use the `.glass` utility class to automatically apply the signature diffuse bluish shadow and pure white background.
4. **Primary Aesthetics**: 
   - Background: Very light blue-gray (`#EEF4F9`)
   - Text & Buttons: Sharp dark slate/black (`zinc-900`)

_Note: AI assistants are bound by the rules in `frontend/AGENTS.md` to automatically enforce these styling guidelines when generating code._

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### Quick Start (Windows)
If you are on Windows, you can start both the frontend and backend simultaneously using the provided script:
```powershell
.\start.ps1
```

### Manual Start

**Terminal 1: Start the Backend**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn src.api:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2: Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).
