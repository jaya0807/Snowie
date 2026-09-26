"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, CheckCircle2, Wifi, WifiOff } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { StatCard } from "./components/StatCard";
import { SessionLogs } from "./components/SessionLogs";
import { LiveCameraFeed } from "./components/LiveCameraFeed";

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams?.get("activity") || "—";

  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [receiving, setReceiving] = useState(false);
  const lastDataRef = useRef<number>(0);

  const [logs, setLogs] = useState<{ time: string; event: string; details: string }[]>([]);
  const lastAversionRef = useRef(0);
  const lastFlapRef = useRef(0);
  const lastRockRef = useRef(0);
  const lastPostureRef = useRef(0);
  const lastFlickRef = useRef(0);
  const lastTicRef = useRef(0);

  const [telemetry, setTelemetry] = useState({
    pitch: 0, yaw: 0, status: "Waiting for child's device…",
    ear: 0, blinks: 0, blinkRate: "0",
    aversions: 0, irisPosition: "—",
    flappingEvents: 0, bodyRockEvents: 0, wristPostureEvents: 0,
    flickingEvents: 0, ticEvents: 0, postureStable: true,
  });

  const [frame, setFrame] = useState<string | null>(null);

  useEffect(() => {
    const connect = () => {
      const ws = new WebSocket(`ws://${window.location.hostname}:8000/api/ws/session`);
      wsRef.current = ws;

      ws.onopen = () => setConnected(true);

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.type === "telemetry" && msg.metrics) {
            const m = msg.metrics;
            lastDataRef.current = Date.now();
            setReceiving(true);
            if (msg.image) setFrame(msg.image);

            const newTelemetry = {
              pitch: m.pitch ?? 0, yaw: m.yaw ?? 0, status: m.status ?? "Active",
              ear: m.ear ?? 0, blinks: m.blinks ?? 0, blinkRate: String(m.blinkRate ?? "0"),
              aversions: m.aversions ?? 0, irisPosition: m.irisPosition ?? "CENTER",
              flappingEvents: m.flappingEvents ?? 0, bodyRockEvents: m.bodyRockEvents ?? 0,
              wristPostureEvents: m.wristPostureEvents ?? 0, flickingEvents: m.flickingEvents ?? 0,
              ticEvents: m.ticEvents ?? 0, postureStable: m.postureStable ?? true,
            };

            setTelemetry(newTelemetry);

            if (newTelemetry.aversions > lastAversionRef.current) {
              setLogs((prev) => [{ time: new Date().toLocaleTimeString(), event: "Gaze Aversion Detected", details: "Child looked away from the screen." }, ...prev]);
              lastAversionRef.current = newTelemetry.aversions;
            }
            if (newTelemetry.flappingEvents > lastFlapRef.current) {
              setLogs((prev) => [{ time: new Date().toLocaleTimeString(), event: "Hand Flapping Detected", details: "Rapid wrist oscillation recognised by AI." }, ...prev]);
              lastFlapRef.current = newTelemetry.flappingEvents;
            }
            if (!newTelemetry.postureStable) {
              setLogs((prev) => {
                if (prev.length > 0 && prev[0].event === "Posture Instability") return prev;
                return [{ time: new Date().toLocaleTimeString(), event: "Posture Instability", details: "Head moving erratically." }, ...prev];
              });
            }
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
        } catch (e) { }
      };

      ws.onclose = () => {
        setConnected(false);
        setReceiving(false);
        setTimeout(connect, 3000);
      };

      ws.onerror = () => ws.close();
    };

    connect();

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
      <div className="flex items-start justify-between">
        <div><h1 className="text-2xl font-bold tracking-tight text-zinc-900">Parents Monitor</h1></div>
        <div className="flex items-center gap-2">
          {connected ? (
            <Badge className="bg-blue-50 text-blue-600 border-blue-200 flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> Connected</Badge>
          ) : (
            <Badge variant="outline" className="text-zinc-400 flex items-center gap-1"><WifiOff className="w-3.5 h-3.5" /> Reconnecting…</Badge>
          )}
          {isTracking ? (
            <Badge className="bg-success-bg text-success-dark flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Live Tracking</Badge>
          ) : (
            <Badge variant="outline" className="text-warning-dark border-warning-light bg-warning-bg flex items-center gap-1"><AlertTriangle className="w-3.5 h-3.5" /> Awaiting Stream…</Badge>
          )}
        </div>
      </div>

      {!receiving && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 text-center">
          <WifiOff className="w-10 h-10 text-zinc-300 mx-auto mb-3" />
          <p className="font-semibold text-zinc-600">Waiting for child's device</p>
          <p className="text-sm text-zinc-400 mt-1">Ask the child to open the mini-games at <code className="bg-zinc-100 px-1 rounded text-xs">localhost:3000/child?activity={activityId}</code></p>
        </div>
      )}

      <div className="mb-6 w-full">
        {receiving && <LiveCameraFeed frame={frame} />}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Card className="border-black/5 shadow-sm flex flex-col overflow-hidden h-full">
            <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
                <Activity className="w-4 h-4 text-brand" /> Live Telemetry
              </CardTitle>
              <Badge className={`text-[9px] px-2 py-0.5 border ${telemetry.status.includes("Avoidance") || telemetry.status.includes("Distracted") ? "bg-warning-bg text-warning-dark border-warning-light" : telemetry.status.includes("Focused") ? "bg-success-bg text-success-dark border-success-light" : "bg-zinc-100 text-zinc-700 border-zinc-200"}`}>
                {telemetry.status}
              </Badge>
            </CardHeader>
            <CardContent className="p-3 overflow-y-auto space-y-4">
              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Core Metrics</p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Iris Pos" value={telemetry.irisPosition} valueClassName={telemetry.irisPosition !== "CENTER" && telemetry.irisPosition !== "—" ? "text-amber-600" : "text-zinc-900"} />
                  <StatCard label="Aversions" value={telemetry.aversions} valueClassName={telemetry.aversions > 0 ? "text-red-500" : "text-zinc-900"} />
                  <StatCard label="Blinks" value={<>{telemetry.blinks} <span className="text-[10px] text-zinc-400">({telemetry.blinkRate})</span></>} valueClassName="text-blue-600" />
                  <StatCard label="EAR" value={Number(telemetry.ear).toFixed(2)} valueClassName={telemetry.ear < 0.22 && telemetry.ear > 0 ? "text-amber-500" : "text-zinc-700"} />
                  <StatCard label="Yaw" value={`${telemetry.yaw}°`} valueClassName="text-zinc-700" />
                  <StatCard label="Pitch" value={`${telemetry.pitch}°`} valueClassName="text-zinc-700" />
                </div>
              </div>

              <div className="bg-zinc-50 p-3 rounded-lg border border-black/5 flex items-center justify-between">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Posture Stability</p>
                <Badge variant="outline" className={`text-[10px] h-6 ${telemetry.postureStable ? "bg-success-bg text-success-dark border-success-light" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {telemetry.postureStable ? "STABLE" : "UNSTABLE"}
                </Badge>
              </div>

              <div>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Motor Events</p>
                <div className="grid grid-cols-3 gap-3">
                  <StatCard label="Flap" value={telemetry.flappingEvents} valueClassName={telemetry.flappingEvents > 0 ? "text-amber-600" : "text-zinc-300"} containerClassName={telemetry.flappingEvents > 0 ? "bg-amber-50 border-amber-200" : undefined} />
                  <StatCard label="Rock" value={telemetry.bodyRockEvents} valueClassName={telemetry.bodyRockEvents > 0 ? "text-purple-600" : "text-zinc-300"} containerClassName={telemetry.bodyRockEvents > 0 ? "bg-purple-50 border-purple-200" : undefined} />
                  <StatCard label="Wrist" value={telemetry.wristPostureEvents} valueClassName={telemetry.wristPostureEvents > 0 ? "text-indigo-600" : "text-zinc-300"} containerClassName={telemetry.wristPostureEvents > 0 ? "bg-indigo-50 border-indigo-200" : undefined} />
                  <StatCard label="Flick" value={telemetry.flickingEvents} valueClassName={telemetry.flickingEvents > 0 ? "text-pink-600" : "text-zinc-300"} containerClassName={telemetry.flickingEvents > 0 ? "bg-pink-50 border-pink-200" : undefined} />
                  <StatCard label="Tic" value={telemetry.ticEvents} valueClassName={telemetry.ticEvents > 0 ? "text-rose-600" : "text-zinc-300"} containerClassName={telemetry.ticEvents > 0 ? "bg-rose-50 border-rose-200" : undefined} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="h-full">
          <SessionLogs logs={logs} />
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
