"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Activity, AlertTriangle, CheckCircle2, Eye, Focus } from "lucide-react";
import { CalibrationCamera } from "./components/CalibrationCamera";

export default function CalibrationPage() {
  const [isTracking, setIsTracking] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSendRef = useRef<number>(0);

  const [telemetry, setTelemetry] = useState({
    pitch: 0, yaw: 0, roll: 0, status: "Initializing...",
    ear: 0, blinks: 0, blinkRate: 0, aversions: 0, irisPosition: "CENTER"
  });

  const handleTelemetry = (newTelemetry: any) => {
    // If it's just a functional update, pass it on.
    if (typeof newTelemetry === "function") {
      setTelemetry(newTelemetry);
      return;
    }
    setTelemetry(newTelemetry);
    const now = Date.now();
    if (now - lastSendRef.current > 500 && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        timestamp: now,
        patient_id: "P1",
        metrics: newTelemetry
      }));
      lastSendRef.current = now;
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/api/ws/capture/test_session");
    ws.onerror = (e) => console.warn("Calibration WS Error:", e);
    wsRef.current = ws;

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-auto">
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="afterInteractive" crossOrigin="anonymous" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Camera Setup & Testing</h1>
        <p className="text-zinc-500 mt-1">
          Make sure your child's camera is positioned correctly. True Iris Tracking & Gaze metrics are processed locally.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-black/5 shadow-sm h-fit">
          <CardHeader className="border-b border-black/5 pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand" /> Live Capture Feed
              </span>
              {isTracking ? (
                <Badge className="bg-success-bg text-success-dark hover:bg-success-bg flex gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tracking Active</Badge>
              ) : (
                <Badge variant="outline" className="text-warning-dark border-warning-light bg-warning-bg"><AlertTriangle className="w-3.5 h-3.5 mr-1" /> Waiting for face...</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center bg-zinc-50">
            <CalibrationCamera onTelemetry={handleTelemetry} setIsTracking={setIsTracking} />
          </CardContent>
        </Card>

        <Card className="border-black/5 shadow-sm h-fit">
          <CardHeader className="border-b border-black/5 pb-4">
            <CardTitle className="text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-brand" /> Live Telemetry Stream</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Current Status</p>
              <div className={`p-4 rounded-xl font-bold text-lg border transition-colors duration-300 ${
                telemetry.status.includes("Avoidance") ? "bg-warning-bg text-warning-dark border-warning-light shadow-[0_0_15px_rgba(251,146,60,0.15)]" : 
                telemetry.status.includes("Focused") ? "bg-success-bg text-success-dark border-success-light" : 
                "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}>
                {telemetry.status}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <Eye className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Iris Pos</p>
                <p className={`text-xl font-black ${telemetry.irisPosition !== 'CENTER' ? 'text-amber-600' : 'text-zinc-900'}`}>{telemetry.irisPosition}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <Focus className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Aversions</p>
                <p className="text-2xl font-black text-red-500">{telemetry.aversions}</p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <Activity className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Blinks / BPM</p>
                <p className="text-xl font-black text-blue-600">{telemetry.blinks} <span className="text-sm text-zinc-400">({telemetry.blinkRate})</span></p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">EAR</p>
                <p className={`text-lg font-black ${telemetry.ear < 0.22 ? 'text-amber-500' : 'text-zinc-700'}`}>{telemetry.ear.toFixed(2)}</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Yaw</p>
                <p className="text-lg font-black text-zinc-700">{telemetry.yaw}°</p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Pitch</p>
                <p className="text-lg font-black text-zinc-700">{telemetry.pitch}°</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
