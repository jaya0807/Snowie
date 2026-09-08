with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

# 1. Add video and canvas refs, and stream state
import_code = """import { useState, useEffect, useRef } from "react";
import { Mic, CheckCircle2, ChevronRight, X, Camera } from "lucide-react";"""
content = content.replace('import { Mic, CheckCircle2, ChevronRight, X } from "lucide-react";', import_code)

state_code = """  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);"""
new_state_code = """  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Camera and Telemetry state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);
  const [cameraActive, setCameraActive] = useState(false);"""
content = content.replace(state_code, new_state_code)

# 2. Start camera and WebSocket when session starts
start_session_old = """  useEffect(() => {
    fetch(`http://localhost:8001/api/session/start?patient_id=P1&activity_id=A1`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setSessionId(data.session_id))
      .catch(err => console.error(err));
  }, []);"""

start_session_new = """  useEffect(() => {
    let ws: WebSocket;
    
    const initCameraAndSession = async () => {
      // 1. Start Session
      let sid = "";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?patient_id=P1&activity_id=A1`, { method: 'POST' });
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      } catch(e) { console.error(e); }
      
      // 2. Start Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch(e) { console.error("Camera access denied", e); }
      
      // 3. Start Telemetry WebSocket
      ws = new WebSocket("ws://localhost:8001/api/ws/session");
      wsRef.current = ws;
      
      ws.onopen = () => {
        telemetryInterval.current = setInterval(() => {
          if (videoRef.current && canvasRef.current && ws.readyState === WebSocket.OPEN) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx && video.videoWidth > 0) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const base64Frame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
              ws.send(JSON.stringify({ type: "frame", image: base64Frame, session_id: sid }));
            }
          }
        }, 200); // 5 FPS
      };
    };
    
    initCameraAndSession();
    
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (telemetryInterval.current) clearInterval(telemetryInterval.current);
      if (ws) ws.close();
    };
  }, []);"""
content = content.replace(start_session_old, start_session_new)

# 3. Add the PIP Video element to the render loop
video_jsx = """      {/* 2. The Interactive Overlay (Foreground Layer) */}
      
      {/* Hidden canvas for extracting frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* PIP Camera Mirror */}
      <div className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500">
        {!cameraActive ? (
          <Camera className="w-8 h-8 text-zinc-400 animate-pulse" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
          />
        )}
      </div>"""
content = content.replace("{/* 2. The Interactive Overlay (Foreground Layer) */}", video_jsx)

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
