"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { VideoFeed } from "./components/VideoFeed";

const ACTIVITY_NAMES: Record<string, string> = {
  A1: "🐾 Animal Adventure",
  A2: "✨ Magic Mission",
  A3: "🏴☠️ Treasure Hunt",
  A4: "🧠✨ Memory Quest",
  A5: "😊 Feel-O-Meter",
  A6: "🚀 Super Challenge"
};

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const [activeActivityId, setActiveActivityId] = useState<string | null>(searchParams.get("activity"));
  
  const [sessionActive, setSessionActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setIsMounted(true);
      
    const ws = new WebSocket("ws://localhost:8001/api/ws/session");
    wsRef.current = ws;
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "telemetry") {
          setSessionActive(true);
          // Dynamically update activity if backend sends it
          if (data.activity_id) setActiveActivityId(data.activity_id);
          else if (data.activityId) setActiveActivityId(data.activityId);
        } else if (data.type === "session_end") {
          setSessionActive(false);
          setActiveActivityId(null);
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  const currentActivityName = activeActivityId ? ACTIVITY_NAMES[activeActivityId] || `Activity ${activeActivityId}` : null;
  const isPlaying = sessionActive || currentActivityName;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Child Monitoring</h1>
          <p className="text-sm text-zinc-500 mt-1">
            {isPlaying ? `Currently playing: ${currentActivityName}` : "Waiting for child to start an activity"}
          </p>
        </div>
        <div className="flex items-center">
          <div className={`flex items-center gap-2 text-sm font-medium ${sessionActive ? 'text-green-600' : 'text-zinc-400'}`}>
            <span className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-green-500 animate-pulse' : 'bg-zinc-300'}`}></span>
            {sessionActive ? "Camera Active" : "Camera Off"}
          </div>
        </div>
      </div>

      <div className="max-w-5xl">
        <VideoFeed sessionActive={sessionActive} />
      </div>
    </div>
  );
}

export default function LiveSession() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading session...</div>}>
      <LiveSessionContent />
    </Suspense>
  );
}
