"use client";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

import { useState, useEffect } from "react";
import { Play, Pause, Camera, Eye, Activity, Square, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function LiveSession() {
  const searchParams = useSearchParams();
  const hasActivePatient = searchParams.get("patient") !== "none";
  const activityId = searchParams.get("activity") || "A2";
  
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const toggleSession = async () => {
    if (!isRunning) {
      // Start session
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=${activityId}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
        setIsRunning(true);
      } catch (e) {
        console.error(e);
      }
    } else {
      // Pause
      setIsRunning(false);
    }
  };

  const endSession = async () => {
    setIsRunning(false);
    setSessionTime(0);
    
    if (sessionId) {
      try {
        const res = await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId}`, { method: 'POST' });
        const data = await res.json();
        alert(`Session saved! Accuracy: ${Math.round(data.result.accuracy * 100)}%, Response Time: ${data.result.response_time_sec}s`);
      } catch (e) {
        console.error(e);
      }
      setSessionId(null);
    } else {
      alert("Session ended.");
    }
  };

  if (!hasActivePatient) return <EmptyState title="Live Session" />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Session: {activityId}</h1>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={toggleSession}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRunning ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'btn-primary hover:bg-zinc-800'
            }`}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
          </button>
          <button 
            onClick={endSession}
            className="flex items-center gap-2 btn-secondary px-4 py-2 text-sm font-medium"
          >
            <Square className="w-4 h-4" />
            End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="border-0 shadow-sm bg-zinc-950 text-white overflow-hidden">
            <div className="aspect-video bg-zinc-900 relative flex items-center justify-center border-b border-white/10">
              <div className="absolute top-4 left-4 flex gap-2">
                <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
                  <Camera className="w-3 h-3 mr-1" />
                  Cam 1
                </Badge>
                {isRunning && (
                  <Badge className="bg-red-500 hover:bg-red-600 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    REC
                  </Badge>
                )}
              </div>
              <div className="absolute top-4 right-4 text-sm font-mono bg-black/50 px-2 py-1 rounded backdrop-blur-md border border-white/20">
                {formatTime(sessionTime)}
              </div>
              <Camera className="w-12 h-12 text-white/10" />
            </div>
            <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-zinc-400 mb-1">Gaze</p>
                <p className="font-semibold text-zinc-200">Focused</p>
              </div>
              <div className="border-x border-white/10">
                <p className="text-xs text-zinc-400 mb-1">Posture</p>
                <p className="font-semibold text-zinc-200">Stable</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400 mb-1">Movements</p>
                <p className="font-semibold text-zinc-200">Expected</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="border-0 shadow-sm bg-zinc-50 border border-black/5">
            <CardHeader className="pb-3 border-b border-black/5">
              <CardTitle className="text-sm font-bold flex items-center justify-between">
                <span>Real-time Metrics</span>
                <Activity className="w-4 h-4 text-brand" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-900">Task Engagement</span>
                  <span className="text-zinc-500">85%</span>
                </div>
                <Progress value={85} className="h-1.5 [&>div]:bg-brand" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-zinc-900">Response Latency</span>
                  <span className="text-zinc-500">2.4s avg</span>
                </div>
                <Progress value={60} className="h-1.5 [&>div]:bg-brand" />
              </div>

              <div className="pt-3 mt-3 border-t border-black/5">
                <p className="text-xs font-bold text-zinc-900 mb-2">Recent Events</p>
                <div className="space-y-2">
                  <div className="text-[10px] bg-white p-2 rounded border border-black/5 flex items-start gap-2">
                    <span className="text-brand font-mono">01:24</span>
                    <span className="text-zinc-600">Successfully matched target object (Low latency)</span>
                  </div>
                  <div className="text-[10px] bg-white p-2 rounded border border-black/5 flex items-start gap-2">
                    <span className="text-warning-dark font-mono">01:12</span>
                    <span className="text-zinc-600">Brief distraction detected (Head turned left)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
