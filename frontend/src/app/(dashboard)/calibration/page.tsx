"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Activity, AlertTriangle, CheckCircle2, Eye, Focus } from "lucide-react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

const calculateEAR = (eye: any[]) => {
  const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
  const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
  const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
  return (v1 + v2) / (2.0 * h);
};

export default function CalibrationPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSendRef = useRef<number>(0);
  
  const [telemetry, setTelemetry] = useState({
    pitch: 0,
    yaw: 0,
    roll: 0,
    status: "Initializing...",
    ear: 0,
    blinks: 0,
    blinkRate: 0,
    aversions: 0,
    irisPosition: "CENTER"
  });

  const eyeMetricsRef = useRef({
    blinks: 0,
    isBlinking: false,
    aversions: 0,
    lastGazeStatus: "Centered / Focused",
    sessionStartTime: 0,
  });

  const onResults = (results: any) => {
    if (!canvasRef.current || !videoRef.current) return;
    
    const canvasCtx = canvasRef.current.getContext("2d");
    if (!canvasCtx) return;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Draw the video frame to canvas
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setIsTracking(true);
      const metrics = eyeMetricsRef.current;
      if (metrics.sessionStartTime === 0) metrics.sessionStartTime = Date.now();

      const landmarks = results.multiFaceLandmarks[0];
      
      // Draw mesh points for visual feedback (sparse)
      canvasCtx.fillStyle = "#176B9C";
      for (let i = 0; i < landmarks.length; i+=10) {
        const x = landmarks[i].x * canvasRef.current.width;
        const y = landmarks[i].y * canvasRef.current.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 1, 0, 2 * Math.PI);
        canvasCtx.fill();
      }

      // 1. Head Pose (Pitch/Yaw) Approximation
      const nose = landmarks[1];
      const leftEye = landmarks[33];
      const rightEye = landmarks[263];

      const eyeDist = Math.abs(rightEye.x - leftEye.x);
      const noseToLeft = Math.abs(nose.x - leftEye.x);
      const yawRatio = ((noseToLeft / eyeDist) - 0.5) * 2; 
      const yawDeg = (yawRatio * 90).toFixed(1);

      const avgEyeY = (leftEye.y + rightEye.y) / 2;
      const pitchRatio = (nose.y - avgEyeY) * 10; 
      const pitchDeg = (pitchRatio * 45).toFixed(1);

      // 2. Eye Aspect Ratio (EAR) & Blinks
      const leftEyeLm = [33, 160, 158, 133, 153, 144].map(i => landmarks[i]);
      const rightEyeLm = [362, 385, 387, 263, 373, 380].map(i => landmarks[i]);
      const avgEAR = (calculateEAR(leftEyeLm) + calculateEAR(rightEyeLm)) / 2;

      if (avgEAR < 0.22) { // Blink threshold
        if (!metrics.isBlinking) {
          metrics.blinks += 1;
          metrics.isBlinking = true;
        }
      } else {
        metrics.isBlinking = false;
      }

      const elapsedMins = (Date.now() - metrics.sessionStartTime) / 60000;
      const blinkRate = elapsedMins > 0 ? Math.round(metrics.blinks / elapsedMins) : 0;

      // 3. True Iris Tracking (Left Eye for reference)
      const leftIris = landmarks[468]; // Center of left iris
      const innerCorner = landmarks[133];
      const outerCorner = landmarks[33];
      
      const distInner = Math.hypot(leftIris.x - innerCorner.x, leftIris.y - innerCorner.y);
      const distOuter = Math.hypot(leftIris.x - outerCorner.x, leftIris.y - outerCorner.y);
      const irisRatio = distInner / (distInner + distOuter);

      let irisPos = "CENTER";
      if (irisRatio < 0.35) irisPos = "LEFT";
      else if (irisRatio > 0.65) irisPos = "RIGHT";

      // 4. Combined Status & Aversions
      let currentStatus = "Centered / Focused";
      if (Math.abs(parseFloat(yawDeg)) > 30 || irisPos !== "CENTER") currentStatus = "Looking Away (Avoidance)";
      if (parseFloat(pitchDeg) > 20) currentStatus = "Looking Down";
      if (parseFloat(pitchDeg) < -20) currentStatus = "Looking Up";

      if (currentStatus === "Looking Away (Avoidance)" && metrics.lastGazeStatus !== "Looking Away (Avoidance)") {
        metrics.aversions += 1;
      }
      metrics.lastGazeStatus = currentStatus;

      const finalTelemetry = {
        pitch: parseFloat(pitchDeg),
        yaw: parseFloat(yawDeg),
        roll: 0,
        status: currentStatus,
        ear: parseFloat(avgEAR.toFixed(2)),
        blinks: metrics.blinks,
        blinkRate,
        aversions: metrics.aversions,
        irisPosition: irisPos
      };

      setTelemetry(finalTelemetry);
      
      // Throttle WebSocket sends to twice a second (500ms)
      const now = Date.now();
      if (now - lastSendRef.current > 500 && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          timestamp: now,
          patient_id: "P1",
          metrics: finalTelemetry
        }));
        lastSendRef.current = now;
      }
      
      // Highlight Iris
      canvasCtx.fillStyle = "#FFD700";
      canvasCtx.beginPath();
      canvasCtx.arc(landmarks[468].x * canvasRef.current.width, landmarks[468].y * canvasRef.current.height, 3, 0, 2 * Math.PI);
      canvasCtx.arc(landmarks[473].x * canvasRef.current.width, landmarks[473].y * canvasRef.current.height, 3, 0, 2 * Math.PI);
      canvasCtx.fill();

    } else {
      setIsTracking(false);
      setTelemetry(prev => ({ ...prev, status: "No face detected" }));
    }
    canvasCtx.restore();
  };

  useEffect(() => {
    // Initialize WebSocket for streaming data to backend
    const ws = new WebSocket("ws://localhost:8000/api/ws/capture/test_session");
    ws.onerror = (e) => console.warn("Calibration WS Error:", e);
    wsRef.current = ws;
    
    const initTracking = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop());
        setCameraError(null);
      } catch (err: any) {
        setCameraError(err.name === 'NotAllowedError' 
          ? "Camera access is blocked by your Browser or Mac OS System Settings."
          : err.message);
        return;
      }

      if (window.FaceMesh && window.Camera && videoRef.current) {
        setIsLoaded(true);
        
        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          }
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true, // Crucial for Iris tracking
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        faceMesh.onResults(onResults);

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        camera.start();
      } else {
        setTimeout(initTracking, 500);
      }
    };

    initTracking();
    
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
                <Camera className="w-5 h-5 text-brand" />
                Live Capture Feed
              </span>
              {isTracking ? (
                <Badge className="bg-success-bg text-success-dark hover:bg-success-bg flex gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Tracking Active
                </Badge>
              ) : (
                <Badge variant="outline" className="text-warning-dark border-warning-light bg-warning-bg">
                  <AlertTriangle className="w-3.5 h-3.5 mr-1" /> Waiting for face...
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center justify-center bg-zinc-50">
            <div className="relative w-full aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-inner">
              
              {!isLoaded && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 z-20">
                  Loading AI Models...
                </div>
              )}
              
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-900 z-30 p-6 text-center">
                  <AlertTriangle className="w-10 h-10 text-warning-dark mb-4" />
                  <p className="text-white font-bold mb-2">Camera Blocked</p>
                  <p className="text-zinc-400 text-sm max-w-sm">{cameraError}</p>
                </div>
              )}

              <video 
                ref={videoRef} 
                className="hidden"
                playsInline
              />
              <canvas 
                ref={canvasRef} 
                width="640" 
                height="480"
                className="w-full h-full object-cover transform scale-x-[-1]" 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-black/5 shadow-sm h-fit">
          <CardHeader className="border-b border-black/5 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand" />
              Live Telemetry Stream
            </CardTitle>
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
                <p className={`text-xl font-black ${telemetry.irisPosition !== 'CENTER' ? 'text-amber-600' : 'text-zinc-900'}`}>
                  {telemetry.irisPosition}
                </p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <Focus className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Aversions</p>
                <p className="text-2xl font-black text-red-500">
                  {telemetry.aversions}
                </p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <Activity className="w-5 h-5 text-zinc-400 mb-2" />
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Blinks / BPM</p>
                <p className="text-xl font-black text-blue-600">
                  {telemetry.blinks} <span className="text-sm text-zinc-400">({telemetry.blinkRate})</span>
                </p>
              </div>
              
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">EAR</p>
                <p className={`text-lg font-black ${telemetry.ear < 0.22 ? 'text-amber-500' : 'text-zinc-700'}`}>
                  {telemetry.ear.toFixed(2)}
                </p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Yaw</p>
                <p className="text-lg font-black text-zinc-700">
                  {telemetry.yaw}°
                </p>
              </div>
              <div className="bg-zinc-50 p-3 rounded-xl border border-black/5 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">Head Pitch</p>
                <p className="text-lg font-black text-zinc-700">
                  {telemetry.pitch}°
                </p>
              </div>
            </div>

            

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
