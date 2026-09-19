import re

with open("backend/src/api.py", "r") as f:
    content = f.read()

media_endpoint = """
from pydantic import BaseModel
import base64

class MediaUploadRequest(BaseModel):
    session_id: str
    event_type: str
    timestamp: float
    image_base64: str

@app.post("/api/media/upload")
def upload_media(data: MediaUploadRequest):
    try:
        # Create directory if it doesn't exist
        os.makedirs("data/media", exist_ok=True)
        
        # Decode base64 image
        image_data = base64.b64decode(data.image_base64.split(",")[1] if "," in data.image_base64 else data.image_base64)
        
        filename = f"data/media/{data.session_id}_{int(data.timestamp)}_{data.event_type}.jpg"
        with open(filename, "wb") as img_file:
            img_file.write(image_data)
            
        # Log to events table
        db = Database(DB_PATH)
        with sqlite3.connect(db.db_path) as conn:
            event_id = f"EV-{uuid.uuid4().hex[:8]}"
            conn.execute(
                "INSERT INTO events (event_id, session_id, timestamp, event_type, details) VALUES (?, ?, ?, ?, ?)",
                (event_id, data.session_id, data.timestamp, data.event_type, f"Screenshot saved: {filename}")
            )
            
        return {"status": "success", "filename": filename}
    except Exception as e:
        return {"status": "error", "message": str(e)}

from fastapi.responses import FileResponse

@app.get("/api/media/{filename}")
def get_media(filename: str):
    path = f"data/media/{filename}"
    if os.path.exists(path):
        return FileResponse(path)
    return {"status": "error", "message": "File not found"}
"""

if "/api/media/upload" not in content:
    content = content + "\n" + media_endpoint

with open("backend/src/api.py", "w") as f:
    f.write(content)
