"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, Eye, Focus, Wifi, WifiOff, Camera } from "lucide-react";
import { useSearchParams } from "next/navigation";

/**
 * PARENT'S LIVE SESSION DASHBOARD
 *
 * Architecture:
 *   Child's device  →  /api/ws/capture/{session_id}  →  Backend broadcasts
 *   Parent's device ←  /api/ws/session               ←  Backend broadcasts
 *
 * The parent does NOT activate a local camera.
 * Metrics arrive via the WebSocket broadcast from the child's HiddenCameraProcessor.
 */

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams?.get("activity") || "—";

  // Connection state
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const lastDataRef = useRef<number>(0);

  // Logs
  const [logs, setLogs] = useState<{ time: string; event: string; details: string }[]>([]);
  const lastAversionRef = useRef(0);
  const lastFlapRef = useRef(0);
  const lastRockRef = useRef(0);
  const lastPostureRef = useRef(0);
  const lastFlickRef = useRef(0);
  const lastTicRef = useRef(0);

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    pitch: 0, yaw: 0,
    status: "Waiting for child's device…",
    ear: 0, blinks: 0, blinkRate: "0",
    aversions: 0, irisPosition: "—",
    flappingEvents: 0,
    bodyRockEvents: 0,
    wristPostureEvents: 0,
    flickingEvents: 0,
    ticEvents: 0,
    postureStable: true,
  });

  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket("ws://localhost:8001/api/ws/session");
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        console.log("[Parent] Connected to broadcast channel");
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);

          // We receive telemetry broadcasts from the child's HiddenCameraProcessor
          if (msg.type === "telemetry" && msg.metrics) {
            const m = msg.metrics;
            lastDataRef.current = Date.now();
            setReceiving(true);
            if (msg.image) setFrame(msg.image);

            const newTelemetry = {
              pitch: m.pitch ?? 0,
              yaw: m.yaw ?? 0,
              status: m.status ?? "Active",
              ear: m.ear ?? 0,
              blinks: m.blinks ?? 0,
              blinkRate: String(m.blinkRate ?? "0"),
              aversions: m.aversions ?? 0,
              irisPosition: m.irisPosition ?? "CENTER",
              flappingEvents: m.flappingEvents ?? 0,
              bodyRockEvents: m.bodyRockEvents ?? 0,
              wristPostureEvents: m.wristPostureEvents ?? 0,
              flickingEvents: m.flickingEvents ?? 0,
              ticEvents: m.ticEvents ?? 0,
              postureStable: m.postureStable ?? true,
            };

            setTelemetry(newTelemetry);


            // Aversion log
            if (newTelemetry.aversions > lastAversionRef.current) {
              setLogs((prev) => [
                { time: new Date().toLocaleTimeString(), event: "Gaze Aversion Detected", details: "Child looked away from the screen." },
                ...prev,
              ]);
              lastAversionRef.current = newTelemetry.aversions;
            }

            // Hand flapping log
            if (newTelemetry.flappingEvents > lastFlapRef.current) {
              setLogs((prev) => [
                { time: new Date().toLocaleTimeString(), event: "Hand Flapping Detected", details: "Rapid wrist oscillation recognised by AI." },
                ...prev,
              ]);
              lastFlapRef.current = newTelemetry.flappingEvents;
            }

            // Posture instability log (on transition)
            if (!newTelemetry.postureStable) {
              setLogs((prev) => {
                if (prev.length > 0 && prev[0].event === "Posture Instability") return prev;
                return [
                  { time: new Date().toLocaleTimeString(), event: "Posture Instability", details: "Head moving erratically." },
                  ...prev,
                ];
              });
            }

            // New Stimming logs
            if (newTelemetry.bodyRockEvents > lastRockRef.current) {
              setLogs(prev => [{ time: new Date().toLocaleTimeString(), event: "Body Rocking Detected", details: "Rhythmic torso oscillation detected." }, ...prev]);
              lastRockRef.current = newTelemetry.bodyRockEvents;
            }
            if (newTelemetry.wristPostureEvents > lastPostureRef.current) {
              setLogs(prev => [{ time: new Date().toLocaleTimeString(), event: "Wrist Posturing Detected", details: "Sustained atypical wrist elevation." }, ...prev]);
              lastPostureRef.current = newTelemetry.wristPostureEvents;
            }
            if (newTelemetry.flickingEvents > lastFlickRef.current) {
              setLogs(prev => [{ time: new Date().toLocaleTimeString(), event: "Finger Flicking Detected", details: "Repetitive finger movements near face." }, ...prev]);
              lastFlickRef.current = newTelemetry.flickingEvents;
            }
            if (newTelemetry.ticEvents > lastTicRef.current) {
              setLogs(prev => [{ time: new Date().toLocaleTimeString(), event: "Head Tic Detected", details: "Rapid involuntary head movement." }, ...prev]);
              lastTicRef.current = newTelemetry.ticEvents;
            }
          }
        } catch (e) {
          console.warn("[Parent] WS parse error:", e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        setReceiving(false);
        // Auto-reconnect after 3s
        setTimeout(connect, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    connect();

    // Monitor for stale data (no signal for >5s)
    const staleness = setInterval(() => {
      if (Date.now() - lastDataRef.current > 5000 && lastDataRef.current > 0) {
        setReceiving(false);
      }
    }, 2000);

    return () => {
      clearInterval(staleness);
      wsRef.current?.close();
    };
  }, []);

  const isTracking = receiving && telemetry.status !== "Waiting for child's device…";

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-auto">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Parents Monitor</h1>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1">
              <Wifi className="w-3.5 h-3.5" /> Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="text-zinc-400 flex items-center gap-1">
              <WifiOff className="w-3.5 h-3.5" /> Reconnecting…
            </Badge>
          )}
          {isTracking ? (
            <Badge className="bg-success-bg text-success-dark flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Live Tracking
            </Badge>
          ) : (
            <Badge variant="outline" className="text-warning-dark border-warning-light bg-warning-bg flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Awaiting Stream…
            </Badge>
          )}
        </div>
      </div>

      {/* No signal banner */}
      {!receiving && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center">
          <WifiOff className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="font-semibold text-zinc-600">Waiting for child's device</p>
          <p className="text-sm text-zinc-400 mt-1">
            Ask the child to open the mini-games at <code className="bg-zinc-100 px-1 rounded text-xs">localhost:3000/child?activity={activityId}</code>
          </p>
        </div>
      )}

      <div className="mb-6 w-full">


          {/* Child's Camera Stream */}
          {receiving && (
            <Card className="border-black/5 shadow-sm ">
              <CardHeader className="border-b border-black/5 pb-4 shrink-0">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-zinc-50 flex items-center justify-center">
                <div className="relative w-full aspect-video max-h-[450px] bg-zinc-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  {frame ? (
                    <img src={frame} alt="Child Stream" className="w-full h-full object-cover transform scale-x-[-1]" />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
                      <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6">
                        <Camera className="w-8 h-8 text-zinc-600" />
                      </div>
                      <h3 className="text-white font-semibold mb-2">No Active Session</h3>
                      <p className="text-zinc-400 text-sm mb-6">Start an activity to begin monitoring live telemetry and video.</p>
                      <div className="flex flex-col gap-3 text-left w-full text-xs text-zinc-300">
                        <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                          <div className="w-6 h-6 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">1</div>
                          <span>Go to <b>Activity Library</b></span>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                          <div className="w-6 h-6 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">2</div>
                          <span>Click <b>Launch Activity</b></span>
                        </div>
                        <div className="flex items-center gap-3 bg-zinc-800/50 p-3 rounded-lg border border-zinc-700/50">
                          <div className="w-6 h-6 rounded-full bg-brand/20 text-brand flex items-center justify-center font-bold">3</div>
                          <span>Return here to watch the stream</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-4">          {/* 6 Metric Cards */}
          <Card className="border-black/5 shadow-sm flex flex-col overflow-hidden h-full">
            <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
                <Activity className="w-4 h-4 text-brand" /> Live Telemetry
              </CardTitle>
              <Badge className={`text-[9px] px-2 py-0.5 border ${
                telemetry.status.includes("Avoidance") || telemetry.status.includes("Distracted")
                  ? "bg-warning-bg text-warning-dark border-warning-light hover:bg-warning-bg"
                  : telemetry.status.includes("Focused")
                  ? "bg-success-bg text-success-dark border-success-light hover:bg-success-bg"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
              }`}>
                {telemetry.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-3 overflow-y-auto space-y-4">
              
              {/* Dense 3x2 Grid for Core Metrics */}
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Core Metrics</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Iris Pos</p>
                    <p className={`text-lg font-black ${telemetry.irisPosition !== "CENTER" && telemetry.irisPosition !== "—" ? "text-amber-600" : "text-zinc-900"}`}>
                      {telemetry.irisPosition}
                    </p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Aversions</p>
                    <p className={`text-lg font-black ${telemetry.aversions > 0 ? "text-red-500" : "text-zinc-900"}`}>{telemetry.aversions}</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Blinks</p>
                    <p className="text-lg font-black text-blue-600">
                      {telemetry.blinks} <span className="text-[10px] text-zinc-400">({telemetry.blinkRate})</span>
                    </p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">EAR</p>
                    <p className={`text-lg font-black ${telemetry.ear < 0.22 && telemetry.ear > 0 ? "text-amber-500" : "text-zinc-700"}`}>
                      {Number(telemetry.ear).toFixed(2)}
                    </p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Yaw</p>
                    <p className="text-lg font-black text-zinc-700">{telemetry.yaw}°</p>
                  </div>
                  <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex flex-col justify-between">
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Pitch</p>
                    <p className="text-lg font-black text-zinc-700">{telemetry.pitch}°</p>
                  </div>
                </div>
              </div>

              {/* Posture Stability (Compact list item) */}
              <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posture Stability</p>
                </div>
                <Badge variant="outline" className={`text-[10px] h-6 ${telemetry.postureStable ? "bg-success-bg text-success-dark border-success-light" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {telemetry.postureStable ? "STABLE" : "UNSTABLE"}
                </Badge>
              </div>

              {/* Compact Motor Events Grid (3 columns) */}
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Motor Events</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${telemetry.flappingEvents > 0 ? "bg-amber-50 border-amber-200" : "bg-zinc-50 border-black/5"}`}>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Flap</p>
                    <p className={`text-lg font-black ${telemetry.flappingEvents > 0 ? "text-amber-600" : "text-zinc-300"}`}>{telemetry.flappingEvents}</p>
                  </div>
                  <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${telemetry.bodyRockEvents > 0 ? "bg-purple-50 border-purple-200" : "bg-zinc-50 border-black/5"}`}>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Rock</p>
                    <p className={`text-lg font-black ${telemetry.bodyRockEvents > 0 ? "text-purple-600" : "text-zinc-300"}`}>{telemetry.bodyRockEvents}</p>
                  </div>
                  <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${telemetry.wristPostureEvents > 0 ? "bg-indigo-50 border-indigo-200" : "bg-zinc-50 border-black/5"}`}>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Wrist</p>
                    <p className={`text-lg font-black ${telemetry.wristPostureEvents > 0 ? "text-indigo-600" : "text-zinc-300"}`}>{telemetry.wristPostureEvents}</p>
                  </div>
                  <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${telemetry.flickingEvents > 0 ? "bg-pink-50 border-pink-200" : "bg-zinc-50 border-black/5"}`}>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Flick</p>
                    <p className={`text-lg font-black ${telemetry.flickingEvents > 0 ? "text-pink-600" : "text-zinc-300"}`}>{telemetry.flickingEvents}</p>
                  </div>
                  <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${telemetry.ticEvents > 0 ? "bg-rose-50 border-rose-200" : "bg-zinc-50 border-black/5"}`}>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tic</p>
                    <p className={`text-lg font-black ${telemetry.ticEvents > 0 ? "text-rose-600" : "text-zinc-300"}`}>{telemetry.ticEvents}</p>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

        </div>

        <div className="h-full">


          {/* Session Log */}
          <Card className="border-black/5 shadow-sm flex flex-col h-full">
            <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
                <svg className="w-4 h-4 text-brand" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
                Session Tracking Logs
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-hidden relative">
              <div className="absolute inset-0 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="px-4 py-3 w-24">Time</th>
                      <th className="px-4 py-3 w-40">Event</th>
                      <th className="px-4 py-3 w-full">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5">
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-zinc-400">
                          Clinical events will appear here once the child starts playing…
                        </td>
                      </tr>
                    ) : (
                      logs.map((log, i) => (
                        <tr key={i} className="hover:bg-zinc-50">
                          <td className="px-4 py-3 text-zinc-500 font-mono text-xs whitespace-nowrap">{log.time}</td>
                          <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">{log.event}</td>
                          <td className="px-4 py-3 text-zinc-600">{log.details}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
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
    <Suspense fallback={<div className="p-8 text-zinc-500">Loading session…</div>}>
      <LiveSessionContent />
    </Suspense>
  );
}
