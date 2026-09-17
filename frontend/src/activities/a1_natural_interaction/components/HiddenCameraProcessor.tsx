"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

/**
 * HiddenCameraProcessor
 *
 * Runs INVISIBLY inside any activity page on the CHILD'S device.
 * - Activates the webcam silently
 * - Runs MediaPipe FaceMesh + Pose in the browser (client-side, no server GPU needed)
 * - Computes all 7 metrics: iris pos, aversions, blinks, EAR, yaw, pitch, hand flapping, posture
 * - Sends processed metrics to /api/ws/capture/{session_id} every 500ms
 * - Backend broadcasts those metrics to the parent's /sessions dashboard via /api/ws/session
 */

declare global {
  interface Window {
    FaceMesh: any;
    Pose: any;
    Hands: any;
    Camera: any;
  }
}

const calculateEAR = (eye: any[]) => {
  const v1 = Math.hypot(eye[1].x - eye[5].x, eye[1].y - eye[5].y);
  const v2 = Math.hypot(eye[2].x - eye[4].x, eye[2].y - eye[4].y);
  const h = Math.hypot(eye[0].x - eye[3].x, eye[0].y - eye[3].y);
  return h > 0 ? (v1 + v2) / (2.0 * h) : 0.3;
};

const stdDev = (arr: number[]) => {
  if (arr.length < 2) return 0;
  const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
  return Math.sqrt(arr.reduce((acc, v) => acc + (v - mean) ** 2, 0) / arr.length);
};

export default function HiddenCameraProcessor({
  sessionId,
  activityId,
}: {
  sessionId: string;
  activityId: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const lastSendRef = useRef<number>(0);
  const isInitialized = useRef(false);

  const eyeMetrics = useRef({
    blinks: 0,
    isBlinking: false,
    aversions: 0,
    lastGazeStatus: "Focused",
    sessionStartTime: 0,
    pitchHistory: [] as number[],
    yawHistory: [] as number[],
    ticEvents: 0,
    lastTicTime: 0,
    newTic: false,
    ticHistory: [] as { time: number; yaw: number; pitch: number }[],
  });

  const motorMetrics = useRef({
    flappingEvents: 0,
    bodyRockEvents: 0,
    wristPostureEvents: 0,
    lastFlapTime: 0,
    lastRockTime: 0,
    lastPostureTime: 0,
    newFlap: false,
    newRock: false,
    newPosture: false,
    wristHistory: [] as { time: number; ly: number; ry: number; lsX: number; lsY: number; rsX: number; rsY: number }[],
  });

  const handsMetrics = useRef({
    flickingEvents: 0,
    lastFlickTime: 0,
    newFlick: false,
    flickHistory: [] as { time: number; dist: number }[],
  });

  // Shared state ref so both callbacks can read it
  const latestMetrics = useRef<Record<string, any>>({});

  const onPoseResults = (results: any) => {
    if (!results.poseLandmarks || results.poseLandmarks.length < 33) return;
    const lm = results.poseLandmarks;
    const now = Date.now();
    const motor = motorMetrics.current;
    motor.newFlap = false;
    motor.newRock = false;
    motor.newPosture = false;

    // left wrist 15, right wrist 16, left shoulder 11, right shoulder 12
    motor.wristHistory.push({ time: now, ly: lm[15].y, ry: lm[16].y, lsX: lm[11].x, lsY: lm[11].y, rsX: lm[12].x, rsY: lm[12].y });
    motor.wristHistory = motor.wristHistory.filter((h) => now - h.time < 2000);

    if (motor.wristHistory.length > 10) {
      const history = motor.wristHistory;

      // 1. Hand Flapping (wrists oscillating)
      if (now - motor.lastFlapTime > 3000) {
        let lChanges = 0, rChanges = 0;
        let lMin = 1, lMax = 0, rMin = 1, rMax = 0;
        let lastLDir = 0, lastRDir = 0;

        for (let i = 1; i < history.length; i++) {
          const prev = history[i - 1];
          const curr = history[i];
          lMin = Math.min(lMin, curr.ly); lMax = Math.max(lMax, curr.ly);
          rMin = Math.min(rMin, curr.ry); rMax = Math.max(rMax, curr.ry);
          const lDir = Math.sign(curr.ly - prev.ly);
          if (lDir !== 0 && lastLDir !== 0 && lDir !== lastLDir) lChanges++;
          if (lDir !== 0) lastLDir = lDir;
          const rDir = Math.sign(curr.ry - prev.ry);
          if (rDir !== 0 && lastRDir !== 0 && rDir !== lastRDir) rChanges++;
          if (rDir !== 0) lastRDir = rDir;
        }

        if ((lChanges >= 4 && lMax - lMin > 0.03) || (rChanges >= 4 && rMax - rMin > 0.03)) {
          motor.flappingEvents += 1;
          motor.lastFlapTime = now;
          motor.newFlap = true;
        }
      }

      // 2. Body Rocking (shoulders oscillating X or Y)
      if (now - motor.lastRockTime > 3000) {
        let xChanges = 0, yChanges = 0;
        let xMin = 1, xMax = 0, yMin = 1, yMax = 0;
        let lastXDir = 0, lastYDir = 0;
        for (let i = 1; i < history.length; i++) {
            const prevX = (history[i - 1].lsX + history[i - 1].rsX) / 2;
            const prevY = (history[i - 1].lsY + history[i - 1].rsY) / 2;
            const currX = (history[i].lsX + history[i].rsX) / 2;
            const currY = (history[i].lsY + history[i].rsY) / 2;
            xMin = Math.min(xMin, currX); xMax = Math.max(xMax, currX);
            yMin = Math.min(yMin, currY); yMax = Math.max(yMax, currY);
            const xDir = Math.sign(currX - prevX);
            const yDir = Math.sign(currY - prevY);
            if (xDir !== 0 && lastXDir !== 0 && xDir !== lastXDir) xChanges++;
            if (xDir !== 0) lastXDir = xDir;
            if (yDir !== 0 && lastYDir !== 0 && yDir !== lastYDir) yChanges++;
            if (yDir !== 0) lastYDir = yDir;
        }
        if ((xChanges >= 4 && xMax - xMin > 0.04) || (yChanges >= 4 && yMax - yMin > 0.04)) {
            motor.bodyRockEvents += 1;
            motor.lastRockTime = now;
            motor.newRock = true;
        }
      }

      // 3. Wrist Posturing (wrists elevated above shoulders, velocity near zero)
      if (now - motor.lastPostureTime > 3000) {
          const lY = history.map(h => h.ly);
          const rY = history.map(h => h.ry);
          const lsY = history.map(h => h.lsY);
          
          const meanLY = lY.reduce((a,b)=>a+b)/lY.length;
          const varLY = lY.reduce((acc, v) => acc + (v - meanLY) ** 2, 0) / lY.length;
          const meanSY = lsY.reduce((a,b)=>a+b)/lsY.length;

          // image coords: smaller y is higher
          if (meanLY < meanSY && varLY < 0.0005) {
              motor.wristPostureEvents += 1;
              motor.lastPostureTime = now;
              motor.newPosture = true;
          }
      }
    }
  };

  const onHandsResults = (results: any) => {
    if (!results.multiHandLandmarks || results.multiHandLandmarks.length === 0) return;
    const now = Date.now();
    const hands = handsMetrics.current;
    hands.newFlick = false;
    
    // Check first hand
    const lm = results.multiHandLandmarks[0];
    if (!lm || lm.length < 21) return;
    const thumb = lm[4];
    const index = lm[8];
    const dist = Math.sqrt(Math.pow(thumb.x - index.x, 2) + Math.pow(thumb.y - index.y, 2));
    
    hands.flickHistory.push({ time: now, dist });
    hands.flickHistory = hands.flickHistory.filter((h) => now - h.time < 2000);

    if (now - hands.lastFlickTime > 3000 && hands.flickHistory.length > 10) {
        let dChanges = 0;
        let dMin = 1, dMax = 0;
        let lastDir = 0;
        for (let i = 1; i < hands.flickHistory.length; i++) {
            const prev = hands.flickHistory[i-1].dist;
            const curr = hands.flickHistory[i].dist;
            dMin = Math.min(dMin, curr); dMax = Math.max(dMax, curr);
            const dDir = Math.sign(curr - prev);
            if (dDir !== 0 && lastDir !== 0 && dDir !== lastDir) dChanges++;
            if (dDir !== 0) lastDir = dDir;
        }
        if (dChanges >= 5 && dMax - dMin > 0.03) {
            hands.flickingEvents += 1;
            hands.lastFlickTime = now;
            hands.newFlick = true;
        }
    }
  };

  const onFaceResults = (results: any) => {
    const now = Date.now();

    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      latestMetrics.current = {
        ...latestMetrics.current,
        status: "No Face Detected",
      };
    } else {
      const em = eyeMetrics.current;
      if (em.sessionStartTime === 0) em.sessionStartTime = now;
      em.newTic = false;

      const landmarks = results.multiFaceLandmarks[0];
      if (landmarks && landmarks.length >= 468) {
        // Head pose
        const nose = landmarks[1];
    const leftEye = landmarks[33];
    const rightEye = landmarks[263];
    const eyeDist = Math.abs(rightEye.x - leftEye.x);
    if (eyeDist === 0) return;
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
      if (!em.isBlinking) { em.blinks += 1; em.isBlinking = true; }
    } else {
      em.isBlinking = false;
    }

    // Gaze + aversions
    let status = "Focused";
    if (Math.abs(yawDeg) > 25) {
      status = "Distracted (Looking Away)";
      if (em.lastGazeStatus !== "Distracted") em.aversions += 1;
    } else if (Math.abs(pitchDeg) > 20) {
      status = "Avoidance (Looking Down/Up)";
      if (em.lastGazeStatus !== "Avoidance") em.aversions += 1;
    }
    em.lastGazeStatus = status.split(" ")[0];

    // Iris position
    let irisPosition = "CENTER";
    if (yawRatio < -0.15) irisPosition = "LEFT";
    else if (yawRatio > 0.15) irisPosition = "RIGHT";

    // Blink rate
    const elapsedMins = (Date.now() - em.sessionStartTime) / 60000;
    const blinkRate = elapsedMins > 0 ? parseFloat((em.blinks / elapsedMins).toFixed(1)) : 0;

    // Posture stability
    em.pitchHistory.push(pitchDeg);
    em.yawHistory.push(yawDeg);
    if (em.pitchHistory.length > 30) em.pitchHistory.shift();
    if (em.yawHistory.length > 30) em.yawHistory.shift();
    const postureSD = stdDev(em.yawHistory) + stdDev(em.pitchHistory);
    const postureStable = postureSD < 12;

    // 4. Head Tic (rapid yaw/pitch oscillation)
    em.ticHistory.push({ time: now, yaw: yawDeg, pitch: pitchDeg });
    em.ticHistory = em.ticHistory.filter(h => now - h.time < 2000);
    
    if (now - em.lastTicTime > 3000 && em.ticHistory.length > 10) {
        let yChanges = 0, pChanges = 0;
        let yMin = 999, yMax = -999, pMin = 999, pMax = -999;
        let lastYDir = 0, lastPDir = 0;
        for (let i = 1; i < em.ticHistory.length; i++) {
            const prev = em.ticHistory[i-1];
            const curr = em.ticHistory[i];
            yMin = Math.min(yMin, curr.yaw); yMax = Math.max(yMax, curr.yaw);
            pMin = Math.min(pMin, curr.pitch); pMax = Math.max(pMax, curr.pitch);
            
            const yDir = Math.sign(curr.yaw - prev.yaw);
            if (yDir !== 0 && lastYDir !== 0 && yDir !== lastYDir) yChanges++;
            if (yDir !== 0) lastYDir = yDir;
            
            const pDir = Math.sign(curr.pitch - prev.pitch);
            if (pDir !== 0 && lastPDir !== 0 && pDir !== lastPDir) pChanges++;
            if (pDir !== 0) lastPDir = pDir;
        }
        
        if ((yChanges >= 4 && yMax - yMin > 10) || (pChanges >= 4 && pMax - pMin > 10)) {
            em.ticEvents += 1;
            em.lastTicTime = now;
            em.newTic = true;
        }
    }

      latestMetrics.current = {
        pitch: pitchDeg,
        yaw: yawDeg,
        roll: 0,
        status,
        ear: parseFloat(avgEAR.toFixed(4)),
        blinks: em.blinks,
        blinkRate,
        aversions: em.aversions,
        irisPosition,
        flappingEvents: motorMetrics.current.flappingEvents,
        bodyRockEvents: motorMetrics.current.bodyRockEvents,
        wristPostureEvents: motorMetrics.current.wristPostureEvents,
        flickingEvents: handsMetrics.current.flickingEvents,
        ticEvents: em.ticEvents,
        postureStable,
        newFlap: motorMetrics.current.newFlap,
        newRock: motorMetrics.current.newRock,
        newPosture: motorMetrics.current.newPosture,
        newFlick: handsMetrics.current.newFlick,
        newTic: em.newTic,
      };
    }
    }

    // Send to backend every 500ms
    if (now - lastSendRef.current > 500 && wsRef.current?.readyState === WebSocket.OPEN) {
      
      let base64Frame = undefined;
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (ctx && videoRef.current.videoWidth > 0) {
          canvas.width = 320;
          canvas.height = 240;
          // Draw video to canvas to get base64
          ctx.drawImage(videoRef.current, 0, 0, 320, 240);
          base64Frame = canvas.toDataURL('image/jpeg', 0.5);
        }
      }

      wsRef.current.send(
        JSON.stringify({
          timestamp: now,
          patient_id: "P1",
          activity_id: activityId,
          metrics: latestMetrics.current,
          image: base64Frame
        })
      );
      lastSendRef.current = now;
      motorMetrics.current.newFlap = false;
      motorMetrics.current.newRock = false;
      motorMetrics.current.newPosture = false;
      handsMetrics.current.newFlick = false;
      em.newTic = false;
    }
  };

  useEffect(() => {
    // Connect to the capture WebSocket
    const ws = new WebSocket(`ws://localhost:8001/api/ws/capture/${sessionId}`);
    wsRef.current = ws;
    ws.onerror = (e) => console.warn("[Tracker] WS error:", e);

    const startTracking = async () => {
      // Get camera access
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (e) {
        console.warn("[Tracker] Camera not available:", e);
        return;
      }

      // Wait for MediaPipe scripts to load
      const tryInit = () => {
        if (window.FaceMesh && window.Pose && window.Camera && videoRef.current) {
          const faceMesh = new window.FaceMesh({
            locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${f}`,
          });
          faceMesh.setOptions({ maxNumFaces: 1, refineLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
          faceMesh.onResults(onFaceResults);

          const pose = new window.Pose({
            locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${f}`,
          });
          pose.setOptions({ modelComplexity: 1, smoothLandmarks: true, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
          pose.onResults(onPoseResults);

          let hands: any = null;
          if (window.Hands) {
            try {
              hands = new window.Hands({
                locateFile: (f: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${f}`,
              });
              hands.setOptions({ maxNumHands: 2, modelComplexity: 1, minDetectionConfidence: 0.5, minTrackingConfidence: 0.5 });
              hands.onResults(onHandsResults);
            } catch (e) {
              console.warn("Failed to init Hands:", e);
              hands = null;
            }
          }

          const camera = new window.Camera(videoRef.current, {
            onFrame: async () => {
              if (videoRef.current) {
                try { await faceMesh.send({ image: videoRef.current }); } catch (e) { console.warn("FaceMesh send error", e); }
                try { await pose.send({ image: videoRef.current }); } catch (e) { console.warn("Pose send error", e); }
                if (hands) {
                  try { await hands.send({ image: videoRef.current }); } catch (e) { console.warn("Hands send error", e); }
                }
              }
            },
            width: 320,
            height: 240,
          });
          camera.start().catch((e: any) => console.warn("[Tracker] Camera start error:", e));
        } else {
          setTimeout(tryInit, 500);
        }
      };

      tryInit();
    };

    startTracking();

    return () => {
      wsRef.current?.close();
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((t) => t.stop());
      }
    };
  }, [sessionId]);

  return (
    <>
      {/* MediaPipe scripts — only load once */}
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" strategy="afterInteractive" crossOrigin="anonymous" />
      <Script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" strategy="afterInteractive" crossOrigin="anonymous" />
      {/* Hidden camera elements */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
    </>
  );
}
