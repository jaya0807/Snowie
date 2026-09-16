"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Activity, AlertTriangle, CheckCircle2, Eye, Focus, TrendingUp } from "lucide-react";
import { useSearchParams } from "next/navigation";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

declare global {
  interface Window {
    FaceMesh: any;
    Pose: any;
    Camera: any;
  }
}

const calculateEAR = (eye: any[]) => {
  const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
  const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
  const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
  return (v1 + v2) / (2.0 * h);
};

const stdDev = (arr: number[]) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((acc, v) => acc + (v - mean) ** 2, 0) / arr.length);
};

function LiveSessionContent() {
  const searchParams = useSearchParams();
  const activityId = searchParams?.get("activity") || "Unknown";

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const sessionIdRef = useRef<string>("pending");
  const lastSendRef = useRef<number>(0);

  const [logs, setLogs] = useState<{ time: string; event: string; details: string }[]>([]);
  const lastAversionRef = useRef(0);

  const [telemetry, setTelemetry] = useState({
    pitch: 0, yaw: 0, roll: 0,
    status: "Initializing...",
    ear: 0, blinks: 0, blinkRate: "0",
    aversions: 0, irisPosition: "CENTER",
    flappingEvents: 0,
    postureStable: true,
  });

  // Rolling 30-point buffer for the live graph
  const [graphData, setGraphData] = useState<{ t: string; yaw: number; pitch: number; ear: number }[]>([]);

  const motorMetricsRef = useRef({
    flappingEvents: 0,
    lastFlapTime: 0,
    newFlap: false,
    wristHistory: [] as { time: number; ly: number; ry: number }[],
  });

  const eyeMetricsRef = useRef({
    blinks: 0,
    isBlinking: false,
    aversions: 0,
    lastGazeStatus: "Focused",
    sessionStartTime: 0,
    pitchHistory: [] as number[],
    yawHistory: [] as number[],
  });

  // ── Pose Results (Wrist tracking for hand flapping) ──────────────────────
  const onPoseResults = (results: any) => {
    if (!results.poseLandmarks || !canvasRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    const lm = results.poseLandmarks;
    const W = canvasRef.current.width;
    const H = canvasRef.current.height;

    // Draw wrist dots in amber
    canvasCtx.fillStyle = "#F59E0B";
    [[lm[15], lm[16]]].flat().forEach((pt) => {
      canvasCtx.beginPath();
      canvasCtx.arc(pt.x * W, pt.y * H, 6, 0, 2 * Math.PI);
      canvasCtx.fill();
    });

    // Flapping algorithm: 2-second rolling wrist Y-oscillation
    const now = Date.now();
    const motor = motorMetricsRef.current;
    motor.newFlap = false;
    motor.wristHistory.push({ time: now, ly: lm[15].y, ry: lm[16].y });
    motor.wristHistory = motor.wristHistory.filter((h) => now - h.time < 2000);

    if (now - motor.lastFlapTime > 3000 && motor.wristHistory.length > 10) {
      let lChanges = 0, rChanges = 0;
      let lMin = 1, lMax = 0, rMin = 1, rMax = 0;
      let lastLDir = 0, lastRDir = 0;

      for (let i = 1; i < motor.wristHistory.length; i++) {
        const prev = motor.wristHistory[i - 1];
        const curr = motor.wristHistory[i];
        lMin = Math.min(lMin, curr.ly); lMax = Math.max(lMax, curr.ly);
        rMin = Math.min(rMin, curr.ry); rMax = Math.max(rMax, curr.ry);
        const lDir = Math.sign(curr.ly - prev.ly);
        if (lDir !== 0 && lastLDir !== 0 && lDir !== lastLDir) lChanges++;
        if (lDir !== 0) lastLDir = lDir;
        const rDir = Math.sign(curr.ry - prev.ry);
        if (rDir !== 0 && lastRDir !== 0 && rDir !== lastRDir) rChanges++;
        if (rDir !== 0) lastRDir = rDir;
      }

      const isFlapping =
        (lChanges >= 4 && lMax - lMin > 0.03) ||
        (rChanges >= 4 && rMax - rMin > 0.03);

      if (isFlapping) {
        motor.flappingEvents += 1;
        motor.lastFlapTime = now;
        motor.newFlap = true;
        setLogs((prev) => [
          { time: new Date().toLocaleTimeString(), event: "Hand Flapping Detected", details: "Rapid wrist oscillation recognised by AI." },
          ...prev,
        ]);
        setTelemetry((prev) => ({ ...prev, flappingEvents: motor.flappingEvents }));
      }
    }
  };

  // ── Face Mesh Results ─────────────────────────────────────────────────────
  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setIsTracking(true);
      const metrics = eyeMetricsRef.current;
      if (metrics.sessionStartTime === 0) metrics.sessionStartTime = Date.now();

      const landmarks = results.multiFaceLandmarks[0];

      // Sparse mesh overlay
      canvasCtx.fillStyle = "#176B9C";
      for (let i = 0; i < landmarks.length; i += 10) {
        const x = landmarks[i].x * canvasRef.current.width;
        const y = landmarks[i].y * canvasRef.current.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 1, 0, 2 * Math.PI);
        canvasCtx.fill();
      }

      // Head pose
      const nose = landmarks[1];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];
      const eyeDist = Math.abs(rightEye.x - leftEye.x);
      const noseToLeft = Math.abs(nose.x - leftEye.x);
      const yawRatio = ((noseToLeft / eyeDist) - 0.5) * 2;
      const yawDeg = parseFloat((yawRatio * 90).toFixed(1));
      const avgEyeY = (leftEye.y + rightEye.y) / 2;
      const pitchDeg = parseFloat(((nose.y - avgEyeY) * 10 * 45).toFixed(1));

      // EAR + blinks
      const leftEyeLm = [33, 160, 158, 133, 153, 144].map((i) => landmarks[i]);
      const rightEyeLm = [362, 385, 387, 263, 373, 380].map((i) => landmarks[i]);
      const avgEAR = (calculateEAR(leftEyeLm) + calculateEAR(rightEyeLm)) / 2;
      if (avgEAR < 0.22) {
        if (!metrics.isBlinking) { metrics.blinks += 1; metrics.isBlinking = true; }
      } else {
        metrics.isBlinking = false;
      }

      // Gaze status + aversions
      let currentStatus = "Focused";
      if (Math.abs(yawDeg) > 25) {
        currentStatus = "Distracted (Looking Away)";
        if (metrics.lastGazeStatus !== "Distracted") metrics.aversions += 1;
      } else if (Math.abs(pitchDeg) > 20) {
        currentStatus = "Avoidance (Looking Down/Up)";
        if (metrics.lastGazeStatus !== "Avoidance") metrics.aversions += 1;
      }
      metrics.lastGazeStatus = currentStatus.split(" ")[0];

      // Iris position
      let irisPos = "CENTER";
      if (yawRatio < -0.15) irisPos = "LEFT";
      else if (yawRatio > 0.15) irisPos = "RIGHT";

      // Blink rate
      const elapsedMins = (Date.now() - metrics.sessionStartTime) / 60000;
      const bpm = elapsedMins > 0 ? (metrics.blinks / elapsedMins).toFixed(1) : "0";

      // Posture stability (rolling SD of head yaw+pitch)
      metrics.pitchHistory.push(pitchDeg);
      metrics.yawHistory.push(yawDeg);
      if (metrics.pitchHistory.length > 30) metrics.pitchHistory.shift();
      if (metrics.yawHistory.length > 30) metrics.yawHistory.shift();
      const postureSD = stdDev(metrics.yawHistory) + stdDev(metrics.pitchHistory);
      const postureStable = postureSD < 12; // threshold

      const newTelemetry = {
        pitch: pitchDeg, yaw: yawDeg, roll: 0,
        status: currentStatus,
        ear: avgEAR, blinks: metrics.blinks, blinkRate: bpm,
        aversions: metrics.aversions, irisPosition: irisPos,
        flappingEvents: motorMetricsRef.current.flappingEvents,
        postureStable,
      };

      setTelemetry(newTelemetry);

      // Update rolling graph buffer
      const t = new Date().toLocaleTimeString("en", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" });
      setGraphData((prev) => {
        const next = [...prev, { t, yaw: yawDeg, pitch: pitchDeg, ear: parseFloat((avgEAR * 100).toFixed(1)) }];
        return next.slice(-30);
      });

      // Aversion logs
      if (newTelemetry.aversions > lastAversionRef.current) {
        setLogs((prev) => [
          { time: new Date().toLocaleTimeString(), event: "Gaze Aversion Detected", details: "Child looked away from the screen." },
          ...prev,
        ]);
        lastAversionRef.current = newTelemetry.aversions;
      }

      // Posture instability log (debounced – only on transition to unstable)
      if (!postureStable && newTelemetry.postureStable !== telemetry.postureStable) {
        setLogs((prev) => [
          { time: new Date().toLocaleTimeString(), event: "Posture Instability", details: `SD=${postureSD.toFixed(1)} — Head moving erratically.` },
          ...prev,
        ]);
      }

      // Send to backend
      const now = Date.now();
      if (now - lastSendRef.current > 500 && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          timestamp: now,
          patient_id: "P1",
          activity_id: activityId,
          metrics: { ...newTelemetry, newFlap: motorMetricsRef.current.newFlap },
        }));
        lastSendRef.current = now;
      }
    } else {
      setIsTracking(false);
      setTelemetry((prev) => ({ ...prev, status: "No Face Detected" }));
    }
    canvasCtx.restore();
  };

  // ── Start a real backend session, then init camera ─────────────────────────
  useEffect(() => {
    let wsInstance: WebSocket | null = null;

    const startSession = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/sessions/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ participant_id: "P1", activity_id: activityId, difficulty: 1 }),
        });
        const data = await res.json();
        sessionIdRef.current = data.session_id || "fallback";
      } catch {
        sessionIdRef.current = `local_${Date.now()}`;
      }

      wsInstance = new WebSocket(`ws://localhost:8001/api/ws/capture/${sessionIdRef.current}`);
      wsRef.current = wsInstance;
    };

    startSession().then(() => setupCameraAndAI());

    return () => {
      wsInstance?.close();
      // End session on unmount
      if (sessionIdRef.current && sessionIdRef.current !== "pending") {
        fetch(`http://localhost:8001/api/sessions/${sessionIdRef.current}/end`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accuracy: 0, response_time_sec: 0 }),
        }).catch(() => {});
      }
    };
  }, []);

  let streamRef: MediaStream | null = null;

  const setupCameraAndAI = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera access is not supported by your browser.");
      return;
    }
    try {
      streamRef = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = streamRef;
    } catch (err: any) {
      setCameraError(
        err.name === "NotAllowedError"
          ? "Camera access was denied. Please allow camera permissions in your browser settings."
          : err.message
      );
      return;
    }

    const tryInit = () => {
      if (window.FaceMesh && window.Pose && window.Camera && videoRef.current) {
        setIsLoaded(true);

        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
        });
        faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        faceMesh.onResults(onResults);

        const pose = new window.Pose({
          locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });
        pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
        pose.onResults(onPoseResults);

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await faceMesh.send({ image: videoRef.current });
              await pose.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });
        camera.start().catch((err: any) => setCameraError("Camera feed error: " + err.message));
      } else {
        setTimeout(tryInit, 500);
      }
    };
    tryInit();
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto h-full overflow-auto">
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" strategy="afterInteractive" crossOrigin="anonymous" />

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Child Monitoring</h1>
          <p className="text-zinc-500 mt-1">
            Activity: <span className="font-semibold text-zinc-800">{activityId}</span>
            {sessionIdRef.current !== "pending" && (
              <span className="ml-3 text-xs font-mono text-zinc-400">Session {sessionIdRef.current}</span>
            )}
          </p>
        </div>
        <Badge className={isTracking ? "bg-success-bg text-success-dark" : "bg-warning-bg text-warning-dark border-warning-light"}>
          {isTracking ? <><CheckCircle2 className="w-3.5 h-3.5 mr-1" />Tracking Active</> : <><AlertTriangle className="w-3.5 h-3.5 mr-1" />Waiting for face...</>}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left Column: Video + Logs ──────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Video Feed */}
          <Card className="border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand" />
                Live Capture Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-zinc-50">
              <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-inner">
                {!isLoaded && !cameraError && (
                  <div className="absolute inset-0 flex items-center justify-center text-white/50 z-20 text-sm">
                    Loading AI Models…
                  </div>
                )}
                {cameraError && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-30 p-6 text-center">
                    <AlertTriangle className="w-10 h-10 text-warning-dark mb-4" />
                    <p className="text-white font-bold mb-2">Camera Blocked</p>
                    <p className="text-zinc-400 text-sm max-w-sm">{cameraError}</p>
                  </div>
                )}
                <video ref={videoRef} className="hidden" playsInline />
                <canvas ref={canvasRef} width="640" height="480" className="w-full h-full object-cover transform scale-x-[-1]" />
              </div>
            </CardContent>
          </Card>

          {/* Live Graph */}
          <Card className="border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand" />
                Live Metrics Graph
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={graphData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10, fill: "#a1a1aa" }} tickLine={false} axisLine={{ stroke: "#e4e4e7" }} domain={[-60, 60]} />
                  <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e4e4e7" }} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="yaw" stroke="#3b82f6" dot={false} strokeWidth={2} name="Head Yaw" isAnimationActive={false} />
                  <Line type="monotone" dataKey="pitch" stroke="#8b5cf6" dot={false} strokeWidth={2} name="Head Pitch" isAnimationActive={false} />
                  <Line type="monotone" dataKey="ear" stroke="#10b981" dot={false} strokeWidth={2} name="EAR ×100" isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Session Log Table */}
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
                          Waiting for tracking events…
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

        {/* ── Right Column: Telemetry ────────────────────────────────── */}
        <div className="lg:col-span-1 space-y-4">

          {/* Status pill */}
          <Card className="border-black/5 shadow-sm">
            <CardContent className="p-4">
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Current Status</p>
              <div className={`p-3 rounded-xl font-bold text-base border transition-colors duration-300 text-center ${
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

          {/* 6 metric cards */}
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
                  <p className={`text-lg font-black ${telemetry.irisPosition !== "CENTER" ? "text-amber-600" : "text-zinc-900"}`}>
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
                  <p className={`text-lg font-black ${telemetry.ear < 0.22 ? "text-amber-500" : "text-zinc-700"}`}>
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
