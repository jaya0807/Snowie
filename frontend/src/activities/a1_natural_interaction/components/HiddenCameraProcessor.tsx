"use client";

import { useEffect, useRef } from "react";

export default function HiddenCameraProcessor({ sessionId, activityId }: { sessionId: string, activityId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    
    let ws: WebSocket;
    
    const initCameraAndSession = async () => {
      // 1. Start Camera (Invisibly)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch(e: any) { 
        console.error("Camera access denied or unavailable", e); 
      }
      
      // 2. Start Telemetry WebSocket
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
              ws.send(JSON.stringify({ type: "frame", image: base64Frame, session_id: sessionId }));
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
  }, [sessionId]);

  return (
    <>
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
