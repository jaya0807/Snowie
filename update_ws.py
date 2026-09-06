import sys

with open("backend/src/api.py", "r") as f:
    content = f.read()

# Add import
import_stmt = "from perception_pipeline import PerceptionPipeline\n"
if "PerceptionPipeline" not in content:
    content = content.replace("class ConnectionManager:", import_stmt + "\nclass ConnectionManager:")

# Replace websocket_endpoint
new_endpoint = """
pipeline = PerceptionPipeline()

@app.websocket("/api/ws/session")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.parse(data_str) if '}' in data_str else json.loads(data_str)
            
            if data.get("type") == "frame":
                # Process actual video frame!
                telemetry = pipeline.process_base64_frame(data["image"])
                await manager.broadcast(json.dumps(telemetry))
            elif data.get("type") == "session_end":
                await manager.broadcast(json.dumps({"type": "session_end", "sessionActive": False}))
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        print(f"WS Error: {e}")
"""

# Simple replacement
content = content[:content.find("@app.websocket(\"/api/ws/session\")")] + new_endpoint

with open("backend/src/api.py", "w") as f:
    f.write(content)
