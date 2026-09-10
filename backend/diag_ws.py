"""
Quick diagnostic: connect to the running backend WebSocket,
send a test frame, then send set_target_pose and watch for response.
"""
import asyncio
import websockets
import json
import base64
import cv2
import numpy as np
import time

async def test():
    print("Connecting to ws://localhost:8001/api/ws/session ...")
    try:
        async with websockets.connect("ws://localhost:8001/api/ws/session") as ws:
            print("Connected!")
            
            # Create a simple 320x240 test frame (grey)
            frame = np.ones((240, 320, 3), dtype=np.uint8) * 128
            _, buf = cv2.imencode('.jpg', frame, [cv2.IMWRITE_JPEG_QUALITY, 70])
            b64 = base64.b64encode(buf).decode('utf-8')
            
            # Send a frame
            msg = json.dumps({"type": "frame", "image": b64, "session_id": "diag_test"})
            await ws.send(msg)
            print(f"Sent frame ({len(b64)} chars)")
            
            # Wait for telemetry response
            try:
                resp = await asyncio.wait_for(ws.recv(), timeout=5.0)
                data = json.loads(resp)
                print(f"Got response: {json.dumps(data, indent=2)}")
            except asyncio.TimeoutError:
                print("TIMEOUT - no response from backend within 5 seconds")
            
            # Now set target pose
            await ws.send(json.dumps({"type": "set_target_pose", "pose": "RAISE_ONE_HAND"}))
            print("Sent set_target_pose=RAISE_ONE_HAND")
            
            # Send 5 more frames
            for i in range(5):
                await ws.send(msg)
                try:
                    resp = await asyncio.wait_for(ws.recv(), timeout=3.0)
                    data = json.loads(resp)
                    print(f"Frame {i+1} response type={data.get('type')} engagement={data.get('engagement')}")
                    if data.get("type") == "pose_success":
                        print(f"POSE SUCCESS RECEIVED! pose={data.get('pose')}")
                except asyncio.TimeoutError:
                    print(f"Frame {i+1}: TIMEOUT")
                await asyncio.sleep(0.2)
                
    except Exception as e:
        print(f"ERROR: {e}")

asyncio.run(test())
