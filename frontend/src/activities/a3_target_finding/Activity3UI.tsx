"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { 
  GiPirateCaptain, GiGalleon, GiPalmTree, GiIsland, 
  GiTreasureMap, GiKey, GiCoins, GiCompass, 
  GiGemPendant, GiDiamondRing, GiStarMedal, GiScallop,
  GiSwapBag, GiPirateHat
} from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

// Speak utility using Web Speech API
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1; // Piratey pitch
    window.speechSynthesis.speak(utterance);
  }
};

type TreasureObject = {
  id: string;
  type: string;
  color: string;
  icon: any;
};

// Task Bank Pool
const TASKS = [
  {
    level: 1,
    instruction: "Can you find the GOLD COIN?",
    target: "gold_coin",
    objects: [
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass }
    ]
  },
  {
    level: 2,
    instruction: "Can you find the TREASURE PURSE?",
    target: "treasure_purse",
    objects: [
      { id: "treasure_purse", type: "purse", color: "text-amber-700", icon: GiSwapBag },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "key", type: "key", color: "text-yellow-500", icon: GiKey },
      { id: "gem", type: "gem", color: "text-blue-500", icon: GiGemPendant },
      { id: "map", type: "map", color: "text-yellow-100", icon: GiTreasureMap }
    ]
  },
  {
    level: 3,
    instruction: "Look closely! Can you find the MAGICAL GEM?",
    target: "gem",
    objects: [
      { id: "gold_coin", type: "coin", color: "text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]", icon: GiCoins },
      { id: "silver_coin", type: "coin", color: "text-gray-400", icon: GiCoins },
      { id: "bronze_coin", type: "coin", color: "text-amber-800", icon: GiCoins },
      { id: "gold_key", type: "key", color: "text-yellow-400", icon: GiKey },
      { id: "treasure_purse", type: "purse", color: "text-amber-700", icon: GiSwapBag },
      { id: "pirate_hat", type: "hat", color: "text-gray-800", icon: GiPirateHat },
      { id: "gem", type: "gem", color: "text-blue-500", icon: GiGemPendant },
      { id: "compass", type: "compass", color: "text-orange-400", icon: GiCompass },
      { id: "shell", type: "shell", color: "text-pink-300", icon: GiScallop },
      { id: "map", type: "map", color: "text-yellow-100", icon: GiTreasureMap },
      { id: "ring", type: "ring", color: "text-red-400", icon: GiDiamondRing },
      { id: "star", type: "star", color: "text-yellow-300", icon: GiStarMedal }
    ]
  }
];

export default function Activity3UI() {
  const router = useRouter();
  
  // Game State
  const [sessionState, setSessionState] = useState<"intro" | "playing" | "celebrating" | "outro">("intro");
  const [level, setLevel] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [pirateMessage, setPirateMessage] = useState("Ahoy, little explorer! Are you ready for a Treasure Hunt?");
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Speak the intro message when the component mounts
  useEffect(() => {
    // Small delay to allow the voice engine to initialize
    const timer = setTimeout(() => {
      speak("Ahoy, little explorer! Are you ready for a Treasure Hunt?");
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Camera and Telemetry state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const initCameraAndSession = async () => {
      // 1. Start Session
      let sid = "mock_session_a3";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A3`, { method: 'POST' });
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      } catch(e) { console.error(e); }
      
      // 2. Start Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch(e: any) { console.error("Camera access denied", e); }
      
      // 3. Start Telemetry WebSocket
      ws = new WebSocket("ws://localhost:8001/api/ws/session");
      wsRef.current = ws;
      
      ws.onopen = () => {
        telemetryInterval.current = setInterval(() => {
          if (videoRef.current && canvasRef.current && ws.readyState === WebSocket.OPEN) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            if (ctx && video.videoWidth > 0) {
              canvas.width = video.videoWidth;
              canvas.height = video.videoHeight;
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const base64Frame = canvas.toDataURL('image/jpeg', 0.5).split(',')[1];
              ws.send(JSON.stringify({ type: "frame", image: base64Frame, session_id: sid }));
            }
          }
        }, 200); // 5 FPS
      };
    };
    
    initCameraAndSession();
    
    return () => {
      // Cleanup
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (telemetryInterval.current) clearInterval(telemetryInterval.current);
      if (ws) ws.close();
    };
  }, []);
  
  // Timing metrics
  const [startTime, setStartTime] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  const currentTask = TASKS[level];

  const startGame = () => {
    setSessionState("playing");
    setPirateMessage(currentTask.instruction);
    speak(currentTask.instruction);
    setStartTime(Date.now());
  };

  const handleObjectClick = (objectId: string) => {
    if (sessionState !== "playing") return;
    setTotalAttempts(prev => prev + 1);

    if (objectId === currentTask.target) {
      // Correct click
      const latency = (Date.now() - startTime) / 1000;
      setTotalLatency(prev => prev + latency);
      
      setSessionState("celebrating");
      setPirateMessage("Great job, explorer! You found the treasure! 🪙✨");
      speak("Great job, explorer! You found the treasure!");
      
      setTimeout(() => {
        if (level + 1 < TASKS.length) {
          setLevel(level + 1);
          setSessionState("playing");
          setPirateMessage(TASKS[level + 1].instruction);
          speak(TASKS[level + 1].instruction);
          setStartTime(Date.now());
        } else {
          setSessionState("outro");
          setPirateMessage("You found all the treasures! You are the best pirate!");
          speak("You found all the treasures! You are the best pirate!");
        }
      }, 5000); // Increased from 3.5s to 5s so the voice doesn't get cut off
    } else {
      // Incorrect click
      setErrors(prev => prev + 1);
      setPirateMessage("It's Okay... let's look again! " + currentTask.instruction);
      speak("It's Okay... let's look again! " + currentTask.instruction);
    }
  };

  const finishActivity = async () => {
    // Send final metrics to backend
    const accuracy = totalAttempts > 0 ? ((totalAttempts - errors) / totalAttempts) * 100 : 0;
    const avg_latency = TASKS.length > 0 ? totalLatency / TASKS.length : 0;
    
    try {
      await fetch("http://localhost:8001/api/activities/a3/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a3",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: {
            errors: errors,
            totalAttempts: totalAttempts,
            levelsCompleted: TASKS.length
          }
        })
      });
      // End the session
      await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId || "demo-session-a3"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    
    // Go back to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#87CEEB] font-sans selection:bg-blue-500/30">
      
      {/* Hidden camera and canvas for telemetry */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Background Layer: Ocean and Clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#4facfe] to-[#00f2fe]">
        <div className="absolute top-10 left-10 opacity-70 animate-pulse"><FaCloud className="text-white text-[150px]" /></div>
        <div className="absolute top-20 right-1/4 opacity-50"><FaCloud className="text-white text-[200px]" /></div>
      </div>

      {/* Middle Layer: Pirate Ship and Island */}
      <div className="absolute bottom-[20%] w-full h-1/2 z-10 pointer-events-none">
        <div className="absolute bottom-[30%] right-[5%] animate-pulse" style={{animationDuration: '6s'}}><GiGalleon className="text-[#8B4513] text-[250px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" /></div>
        <div className="absolute bottom-[-10%] left-[-5%]"><GiIsland className="text-[#DEB887] text-[400px]" /></div>
        <div className="absolute bottom-[20%] left-[10%]"><GiPalmTree className="text-[#228B22] text-[180px] drop-shadow-xl" /></div>
        <div className="absolute bottom-[10%] left-[25%]"><GiPalmTree className="text-[#228B22] text-[120px] drop-shadow-xl" /></div>
      </div>

      {/* Foreground Layer: Sandy Beach Floor */}
      <div className="absolute bottom-0 w-full h-[30vh] z-20 pointer-events-none bg-[#F4A460] rounded-t-[100px] border-t-8 border-[#CD853F]">
      </div>

      {/* Exit Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={finishActivity}
          className="bg-white/30 hover:bg-white/60 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-lg border border-white/40"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-30 w-full h-full flex flex-col items-center pt-[8vh] pointer-events-none">
        
        {/* Pirate Guide and Speech Bubble */}
        <div className="flex flex-col items-center max-w-3xl px-4 w-full">
          {/* Parchment Speech Bubble */}
          <div className="bg-[#FFF8DC] rounded-xl p-6 mb-8 shadow-[0_10px_20px_rgba(0,0,0,0.3)] border-4 border-[#D2B48C] relative text-center pointer-events-auto">
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-[#FFF8DC]"></div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-[#8B4513] leading-tight font-serif">
              {pirateMessage}
            </h2>
          </div>
          
          {/* Pirate Character */}
          <div className="relative animate-bounce pointer-events-auto" style={{animationDuration: '4s'}}>
            <GiPirateCaptain className="text-[#D2691E] text-[150px] drop-shadow-2xl bg-white/40 rounded-full" />
          </div>
        </div>

        {/* Play Area */}
        <div className="absolute bottom-[5%] w-full max-w-5xl px-8 flex justify-center flex-wrap gap-6 md:gap-10 pointer-events-auto">
          {sessionState === "intro" && (
            <button 
              onClick={startGame}
              className="bg-gradient-to-b from-[#FF4500] to-[#8B0000] hover:from-[#FF6347] hover:to-[#A52A2A] text-white font-black text-3xl px-16 py-8 rounded-xl shadow-[0_10px_0_#800000,0_20px_40px_rgba(139,0,0,0.6)] transition-all duration-300 transform hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#800000] flex items-center gap-4 border-4 border-[#FFA07A]"
            >
              <GiTreasureMap className="text-4xl" />
              Let's Go!
            </button>
          )}

          {sessionState === "playing" && currentTask.objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              className="group relative flex items-center justify-center w-28 h-28 md:w-32 md:h-32 bg-[#F5DEB3]/60 hover:bg-[#DEB887]/80 backdrop-blur-sm rounded-2xl border-4 border-[#D2B48C] transition-all duration-300 transform hover:scale-110 hover:-translate-y-2 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
            >
              <div className="absolute inset-0 bg-white/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <obj.icon className={`${obj.color} text-[70px] md:text-[80px] transition-transform duration-300 group-active:scale-90`} />
            </button>
          ))}

          {sessionState === "celebrating" && (
            <div className="animate-spin text-yellow-400" style={{animationDuration: '3s'}}>
              <GiStarMedal className="text-[120px] drop-shadow-[0_0_50px_rgba(255,215,0,1)]" />
            </div>
          )}

          {sessionState === "outro" && (
            <button 
              onClick={finishActivity}
              className="bg-gradient-to-b from-[#32CD32] to-[#228B22] hover:from-[#3CB371] hover:to-[#006400] text-white font-black text-3xl px-16 py-8 rounded-xl shadow-[0_10px_0_#006400,0_20px_40px_rgba(34,139,34,0.6)] transition-all duration-300 transform hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#006400] flex items-center gap-4 border-4 border-[#98FB98]"
            >
              <GiTreasureMap className="text-4xl" />
              Finish Adventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
