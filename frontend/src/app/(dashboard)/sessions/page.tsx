"use client";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { useState, useEffect, useRef } from "react";
import { Play, Pause, Camera, Activity, Square, Settings, Wifi } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams.get("activity") || "A2";
  
  const [sessionActive, setSessionActive] = useState(false);
  const [telemetry, setTelemetry] = useState({
    engagement: 0,
    latency: "0.0",
    events: [] as any[]
  });
  
  const wsRef = useRef<WebSocket | null>(null);

  


    useEffect(() => {
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
          <Card className="border-0 shadow-sm bg-zinc-950 text-white overflow-hidden">
            <div className="aspect-video bg-zinc-900 relative flex items-center justify-center border-b border-white/10">
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                  <Camera className="w-3 h-3 mr-1" />
                  Remote Feed (Simulated)
                </Badge>
              </div>
              
              <div className="flex flex-col items-center">
                <Camera className={`w-12 h-12 mb-4 ${sessionActive ? "text-brand animate-pulse" : "text-white/10"}`} />
                <p className="text-sm text-white/30">
                  {sessionActive ? "Child is performing the activity..." : "Camera feed is off"}
                </p>
              </div>
            </div>
            <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-zinc-400 mb-1">Gaze</p>
                <p className={`font-semibold ${sessionActive ? "text-green-400" : "text-zinc-500"}`}>
                  {sessionActive ? "Focused" : "N/A"}
                </p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-xs text-zinc-400 mb-1">Posture</p>
                <p className={`font-semibold ${sessionActive ? "text-zinc-200" : "text-zinc-500"}`}>
                  {sessionActive ? "Stable" : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">Movements</p>
                <p className={`font-semibold ${sessionActive ? "text-zinc-200" : "text-zinc-500"}`}>
                  {sessionActive ? "Expected" : "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-sm bg-zinc-50 border border-black/5">
            <CardHeader className="pb-3 border-b border-black/5">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Real-time Telemetry</span>
                <Activity className={`w-4 h-4 ${sessionActive ? "text-brand animate-pulse" : "text-zinc-300"}`} />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-900">Task Engagement</span>
                  <span className="text-zinc-500">{sessionActive ? telemetry.engagement : 0}%</span>
                </div>
                <Progress value={sessionActive ? telemetry.engagement : 0} className="h-1.5 [&>div]:bg-brand transition-all duration-500" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-900">Response Latency</span>
                  <span className="text-zinc-500">{sessionActive ? telemetry.latency : "0.0"}s avg</span>
                </div>
                <Progress value={sessionActive ? Math.min(100, parseFloat(telemetry.latency)*20) : 0} className="h-1.5 [&>div]:bg-brand transition-all duration-500" />
              </div>

              <div className="pt-3 mt-3 border-t border-black/5">
                <p className="text-xs font-bold text-zinc-900 mb-2">Live Event Stream</p>
                <div className="space-y-2 max-h-[150px] overflow-hidden">
                  {!sessionActive && <p className="text-xs text-zinc-400 italic">Waiting for events...</p>}
                  {telemetry.events.map((ev, i) => (
                    <div key={i} className="text-[10px] bg-white p-2 rounded border border-black/5 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <span className={`font-mono ${ev.type === 'warn' ? 'text-warning-dark' : 'text-brand'}`}>
                        {ev.time}
                      </span>
                      <span className="text-zinc-600">{ev.msg}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
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
