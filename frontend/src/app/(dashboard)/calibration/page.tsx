"use client";

import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

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
      const landmarks = results.multiFaceLandmarks[0];
      
      // Draw mesh points for visual feedback
      canvasCtx.fillStyle = "#176B9C";
      for (let i = 0; i < landmarks.length; i+=5) {
        const x = landmarks[i].x * canvasRef.current.width;
        const y = landmarks[i].y * canvasRef.current.height;
        canvasCtx.beginPath();
        canvasCtx.arc(x, y, 1, 0, 2 * Math.PI);
        canvasCtx.fill();
      }

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

      let currentStatus = "Centered / Focused";
      if (Math.abs(parseFloat(yawDeg)) > 30) currentStatus = "Looking Away (Avoidance)";
      if (parseFloat(pitchDeg) > 20) currentStatus = "Looking Down";
      if (parseFloat(pitchDeg) < -20) currentStatus = "Looking Up";

      setTelemetry({
        pitch: parseFloat(pitchDeg),
        yaw: parseFloat(yawDeg),
        roll: 0,
        status: currentStatus
      });
      
      // Throttle WebSocket sends to twice a second (500ms)
      const now = Date.now();
      if (now - lastSendRef.current > 500 && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({
          timestamp: now,
          patient_id: "P1",
          metrics: {
            yaw: parseFloat(yawDeg),
            pitch: parseFloat(pitchDeg),
            status: currentStatus
          }
        }));
        lastSendRef.current = now;
      }

      
      canvasCtx.fillStyle = "red";
      canvasCtx.beginPath();
      canvasCtx.arc(nose.x * canvasRef.current.width, nose.y * canvasRef.current.height, 5, 0, 2 * Math.PI);
      canvasCtx.fill();

    } else {
      setIsTracking(false);
      setTelemetry(prev => ({ ...prev, status: "No face detected" }));
    }
    canvasCtx.restore();
  };

  useEffect(() => {
    // Initialize WebSocket for streaming data to backend
    const ws = new WebSocket("ws://localhost:8001/api/ws/capture/test_session");
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
          refineLandmarks: true,
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
    <div className="p-6 space-y-6 max-w-5xl mx-auto h-full overflow-auto">
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="afterInteractive" crossOrigin="anonymous" />

      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Camera Setup & Testing</h1>
        <p className="text-zinc-500 mt-1">
          Make sure your child's camera is positioned correctly before starting an activity. 
          Video is processed locally and never sent to the server.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-black/5 shadow-sm">
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
                  <p className="text-zinc-500 text-xs mt-4">Check Mac System Settings &gt; Privacy & Security &gt; Camera</p>
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

        <Card className="border-black/5 shadow-sm">
          <CardHeader className="border-b border-black/5 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Activity className="w-5 h-5 text-brand" />
              Live Telemetry Stream
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Current Status</p>
              <div className={`p-4 rounded-xl font-bold text-lg border ${
                telemetry.status.includes("Avoidance") ? "bg-warning-bg text-warning-dark border-warning-light" : 
                telemetry.status.includes("Focused") ? "bg-success-bg text-success-dark border-success-light" : 
                "bg-zinc-100 text-zinc-700 border-zinc-200"
              }`}>
                {telemetry.status}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5">
                <p className="text-xs text-zinc-500 font-medium mb-1">Looking Left/Right</p>
                <p className="text-3xl font-black text-zinc-900">
                  {telemetry.yaw}°
                </p>
              </div>
              <div className="bg-zinc-50 p-4 rounded-xl border border-black/5">
                <p className="text-xs text-zinc-500 font-medium mb-1">Looking Up/Down</p>
                <p className="text-3xl font-black text-zinc-900">
                  {telemetry.pitch}°
                </p>
              </div>
            </div>

            <div className="bg-brand/5 border border-brand/20 p-4 rounded-xl">
              <p className="text-xs font-bold text-brand mb-2">System Data (For Doctors)</p>
              <pre className="text-[10px] font-mono text-zinc-600 bg-white p-3 rounded border border-black/5 overflow-x-auto">
{`{
  "timestamp": 1716301200,
  "patient_id": "P1",
  "metrics": {
    "yaw": ${telemetry.yaw},
    "pitch": ${telemetry.pitch},
    "status": "${telemetry.status}"
  }
}`}
              </pre>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
