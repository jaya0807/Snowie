"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, Eye, Focus, Wifi, WifiOff } from "lucide-react";
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

  // Telemetry state
  const [telemetry, setTelemetry] = useState({
    pitch: 0, yaw: 0,
    status: "Waiting for child's device…",
    ear: 0, blinks: 0, blinkRate: "0",
    aversions: 0, irisPosition: "—",
    flappingEvents: 0,
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
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Child Monitoring</h1>
          <p className="text-zinc-500 mt-1">
            Activity: <span className="font-semibold text-zinc-800">{activityId}</span>
            <span className="ml-3 text-xs text-zinc-400">Metrics stream from child's device</span>
          </p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Left: Graph + Logs ─────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Child's Camera Stream */}
          {receiving && (
            <Card className="border-black/5 shadow-sm">
              <CardHeader className="border-b border-black/5 pb-4">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Live Camera Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 bg-zinc-50">
                <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
                  {frame ? (
                    <img src={frame} alt="Child Stream" className="w-full h-full object-cover transform scale-x-[-1]" />
                  ) : (
                    <p className="text-zinc-500 text-sm">Waiting for video frames...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Session Log */}
          <Card className="border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-lg">Session Tracking Logs</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-64 overflow-y-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-semibold sticky top-0">
                    <tr>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Event</th>
                      <th className="px-4 py-3">Details</th>
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

        {/* ── Right: Telemetry ───────────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Status */}
          <Card className="border-black/5 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Status</p>
              <div className={`p-3 rounded-xl font-bold text-base border text-center transition-colors duration-300 ${
                telemetry.status.includes("Avoidance") || telemetry.status.includes("Distracted")
                  ? "bg-warning-bg text-warning-dark border-warning-light"
                  : telemetry.status.includes("Focused")
                  ? "bg-success-bg text-success-dark border-success-light"
                  : "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}>
                {telemetry.status}
              </div>
            </CardContent>
          </Card>

          {/* 6 Metric Cards */}
          <Card className="border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-brand" /> Live Telemetry
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <Eye className="w-4 h-4 text-zinc-400 mb-1" />
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Iris Pos</p>
                  <p className={`text-lg font-black ${telemetry.irisPosition !== "CENTER" && telemetry.irisPosition !== "—" ? "text-amber-600" : "text-zinc-900"}`}>
                    {telemetry.irisPosition}
                  </p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <Focus className="w-4 h-4 text-zinc-400 mb-1" />
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Aversions</p>
                  <p className="text-xl font-black text-red-500">{telemetry.aversions}</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <Activity className="w-4 h-4 text-zinc-400 mb-1" />
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Blinks / BPM</p>
                  <p className="text-lg font-black text-blue-600">
                    {telemetry.blinks} <span className="text-xs text-zinc-400">({telemetry.blinkRate})</span>
                  </p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">EAR</p>
                  <p className={`text-lg font-black ${telemetry.ear < 0.22 && telemetry.ear > 0 ? "text-amber-500" : "text-zinc-700"}`}>
                    {Number(telemetry.ear).toFixed(2)}
                  </p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Yaw</p>
                  <p className="text-lg font-black text-zinc-700">{telemetry.yaw}°</p>
                </div>
                <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center text-center">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Pitch</p>
                  <p className="text-lg font-black text-zinc-700">{telemetry.pitch}°</p>
                </div>
              </div>

              {/* Posture Stability */}
              <div className="mt-3 bg-zinc-50 p-3 rounded-xl border border-black/5 flex items-center justify-between">
                <div>
                  <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Posture Stability</p>
                  <p className="text-sm font-bold mt-0.5 text-zinc-800">Head Steadiness</p>
                </div>
                <Badge className={telemetry.postureStable ? "bg-success-bg text-success-dark" : "bg-red-50 text-red-600 border-red-200"}>
                  {telemetry.postureStable ? "Stable" : "Unstable"}
                </Badge>
              </div>

              {/* Motor Events */}
              <div className="mt-3 bg-zinc-50 p-3 rounded-xl border border-black/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-amber-100 rounded-lg">
                    <Activity className="w-4 h-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Motor Events</p>
                    <p className="text-sm font-medium text-zinc-900">Hand Flapping</p>
                  </div>
                </div>
                <p className="text-2xl font-black text-amber-600">{telemetry.flappingEvents}</p>
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
