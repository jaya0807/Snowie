"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Play, Square, ArrowLeft, Camera as CameraIcon, Star } from "lucide-react";

export default function ChildMode() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activityId = searchParams.get("activity") || "A1";
  
  const [isRunning, setIsRunning] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streamActive, setStreamActive] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);

  // Helper to stop camera & WS
  const stopAll = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setStreamActive(false);
    
    if (telemetryInterval.current) clearInterval(telemetryInterval.current);
    if (wsRef.current) wsRef.current.close();
  };

  useEffect(() => {
    return () => stopAll();
  }, []);

  const toggleSession = async () => {
    if (!isRunning) {
      // Turn on camera FIRST
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setStreamActive(true);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        alert("Camera access is required to play this activity!");
        return;
      }

      // Start backend session
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=${activityId}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
        setIsRunning(true);
        
        // Open WS connection to broadcast telemetry
        const ws = new WebSocket("ws://localhost:8001/api/ws/session");
        wsRef.current = ws;
        
        ws.onopen = () => {
          // Send mock telemetry every 1.5 seconds
          let tick = 0;
          telemetryInterval.current = setInterval(() => {
            tick++;
            // Generate some fluctuating fake data
            const baseEngagement = 75 + Math.random() * 20;
            const latency = 2.0 + Math.random() * 1.5;
            
            const eventType = tick % 5 === 0 
              ? { time: "Live", msg: "Distraction detected", type: "warn" } 
              : { time: "Live", msg: "Maintained focus", type: "ok" };

            ws.send(JSON.stringify({
              type: "telemetry",
              engagement: Math.round(baseEngagement),
              latency: latency.toFixed(1),
              event: eventType,
              sessionActive: true
            }));
          }, 1500);
        };

      } catch (e) {
        console.error(e);
        stopAll();
      }
    }
  };

  const endSession = async () => {
    if (sessionId) {
      try {
        await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId}`, { method: 'POST' });
      } catch (e) {
        console.error(e);
      }
    }
    
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
       wsRef.current.send(JSON.stringify({ type: "session_end", sessionActive: false }));
    }
    
    stopAll();
    router.push('/sessions');
  };

  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/50 to-transparent">
        <button 
          onClick={() => {
            stopAll();
            router.push('/activities');
          }}
          className="flex items-center gap-2 text-white/70 hover:text-white bg-black/30 px-4 py-2 rounded-full backdrop-blur-md transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Exit Child Mode</span>
        </button>
        
        <div className="flex items-center gap-2 text-white bg-black/30 px-5 py-2 rounded-full backdrop-blur-md">
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          <span className="font-bold tracking-wide">Activity: {activityId}</span>
        </div>
      </div>

      <div className="relative w-full h-full flex items-center justify-center">
        {!streamActive && (
          <div className="absolute flex flex-col items-center text-zinc-500">
            <CameraIcon className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">Click "Start Playing" to turn on camera!</p>
          </div>
        )}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover opacity-90 scale-x-[-1]"
        />
        
        {isRunning && (
          <div className="absolute inset-0 border-8 border-brand/80 animate-pulse pointer-events-none"></div>
        )}
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10">
        {!isRunning ? (
          <button 
            onClick={toggleSession}
            className="flex items-center gap-3 bg-brand hover:bg-brand-dark text-white px-10 py-5 rounded-full shadow-2xl transition-transform hover:scale-105 active:scale-95"
          >
            <Play className="w-8 h-8 fill-current" />
            <span className="text-2xl font-black uppercase tracking-wider">Start Playing!</span>
          </button>
        ) : (
          <button 
            onClick={endSession}
            className="flex items-center gap-3 bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-full shadow-[0_0_30px_rgba(239,68,68,0.4)] transition-transform hover:scale-105 active:scale-95"
          >
            <Square className="w-8 h-8 fill-current" />
            <span className="text-2xl font-black uppercase tracking-wider">I'm All Done!</span>
          </button>
        )}
      </div>
    </div>
  );
}
