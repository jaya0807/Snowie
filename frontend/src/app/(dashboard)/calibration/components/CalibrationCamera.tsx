"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";

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

export function CalibrationCamera({
  onTelemetry,
  setIsTracking,
}: {
  onTelemetry: (data: any) => void;
  setIsTracking: (isTracking: boolean) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

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
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      setIsTracking(true);
      const metrics = eyeMetricsRef.current;
      if (metrics.sessionStartTime === 0) metrics.sessionStartTime = Date.now();

      const landmarks = results.multiFaceLandmarks[0];

      canvasCtx.fillStyle = "var(--color-brand)";
      for (let i = 0; i < landmarks.length; i += 10) {
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

      const leftEyeLm = [33, 160, 158, 133, 153, 144].map((i) => landmarks[i]);
      const rightEyeLm = [362, 385, 387, 263, 373, 380].map((i) => landmarks[i]);
      const avgEAR = (calculateEAR(leftEyeLm) + calculateEAR(rightEyeLm)) / 2;

      if (avgEAR < 0.22) {
        if (!metrics.isBlinking) {
          metrics.blinks += 1;
          metrics.isBlinking = true;
        }
      } else {
        metrics.isBlinking = false;
      }

      const elapsedMins = (Date.now() - metrics.sessionStartTime) / 60000;
      const blinkRate = elapsedMins > 0 ? Math.round(metrics.blinks / elapsedMins) : 0;

      const leftIris = landmarks[468];
      const innerCorner = landmarks[133];
      const outerCorner = landmarks[33];

      const distInner = Math.hypot(leftIris.x - innerCorner.x, leftIris.y - innerCorner.y);
      const distOuter = Math.hypot(leftIris.x - outerCorner.x, leftIris.y - outerCorner.y);
      const irisRatio = distInner / (distInner + distOuter);

      let irisPos = "CENTER";
      if (irisRatio < 0.35) irisPos = "LEFT";
      else if (irisRatio > 0.65) irisPos = "RIGHT";

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
        irisPosition: irisPos,
      };

      onTelemetry(finalTelemetry);

      canvasCtx.fillStyle = "var(--color-warning)";
      canvasCtx.beginPath();
      canvasCtx.arc(landmarks[468].x * canvasRef.current.width, landmarks[468].y * canvasRef.current.height, 3, 0, 2 * Math.PI);
      canvasCtx.arc(landmarks[473].x * canvasRef.current.width, landmarks[473].y * canvasRef.current.height, 3, 0, 2 * Math.PI);
      canvasCtx.fill();
    } else {
      setIsTracking(false);
      onTelemetry((prev: any) => ({ ...prev, status: "No face detected" }));
    }
    canvasCtx.restore();
  };

  useEffect(() => {
    const initTracking = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((track) => track.stop());
        setCameraError(null);
      } catch (err: any) {
        setCameraError(
          err.name === "NotAllowedError"
            ? "Camera access is blocked by your Browser or Mac OS System Settings."
            : err.message
        );
        return;
      }

      if (window.FaceMesh && window.Camera && videoRef.current) {
        setIsLoaded(true);

        const faceMesh = new window.FaceMesh({
          locateFile: (file: string) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
          },
        });

        faceMesh.setOptions({
          maxNumFaces: 1,
          refineLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        faceMesh.onResults(onResults);

        const camera = new window.Camera(videoRef.current, {
          onFrame: async () => {
            if (videoRef.current) {
              await faceMesh.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480,
        });

        camera.start();
      } else {
        setTimeout(initTracking, 500);
      }
    };

    initTracking();
  }, []);

  return (
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
      <video ref={videoRef} className="hidden" playsInline />
      <canvas
        ref={canvasRef}
        width="640"
        height="480"
        className="w-full h-full object-cover transform scale-x-[-1]"
      />
    </div>
  );
}
