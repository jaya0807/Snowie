"use client";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Wifi } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { VideoFeed } from "./components/VideoFeed";
import { TelemetryPanel } from "./components/TelemetryPanel";
import { RecentActivities } from "./components/RecentActivities";

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity") || "A2";
  
  const [sessionActive, setSessionActive] = useState(false);
  const [telemetry, setTelemetry] = useState({
    engagement: 0,
    latency: "0.0",
    events: [] as any[]
  });
  
  const [recentSessions, setRecentSessions] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setIsMounted(true);
    fetch("http://localhost:8001/api/dashboard")
      .then(res => res.json())
      .then(json => {
        if (json.recentSessions) setRecentSessions(json.recentSessions);
      })
      .catch(err => console.error(err));
      
    const ws = new WebSocket("ws://localhost:8001/api/ws/session");
    wsRef.current = ws;
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "telemetry") {
          setSessionActive(true);
          setTelemetry(prev => {
            const newEvents = [data.event, ...prev.events].slice(0, 5);
            return {
              engagement: data.engagement,
              latency: data.latency,
              events: newEvents
            };
          });
        } else if (data.type === "session_end") {
          setSessionActive(false);
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Parent Monitor</h1>
          <p className="text-sm text-zinc-500">Watching Activity: {activityId}</p>
        </div>
        <div className="flex gap-3 items-center">
          {sessionActive ? (
            <Badge className="bg-green-500 hover:bg-green-600 animate-pulse flex gap-1 items-center px-3 py-1 text-sm">
              <Wifi className="w-4 h-4" /> Receiving Live Data
            </Badge>
          ) : (
            <Badge variant="outline" className="text-zinc-500 flex gap-1 items-center px-3 py-1 text-sm">
              Waiting for Child...
            </Badge>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <VideoFeed sessionActive={sessionActive} />
        </div>
        <div className="space-y-4">
          <TelemetryPanel sessionActive={sessionActive} telemetry={telemetry} />
        </div>
      </div>

      <RecentActivities isMounted={isMounted} recentSessions={recentSessions} />
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
