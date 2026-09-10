"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { 
  GiFairy, GiCastle, GiStarsStack, GiMoon, GiPineTree, 
  GiRocketFlight, GiAirBalloon, GiRingedPlanet, GiCrystalCluster, 
  GiFairyWand, GiButterfly, GiSpikyField, GiFlowerPot
} from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

// Speak utility using Web Speech API
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
};

const TASKS = [
  {
    level: 1,
    instruction: "Touch the BLUE star!",
    targetSequence: ["blue_star"],
    objects: [
      { id: "blue_star", type: "star", color: "text-blue-400", icon: GiStarsStack },
      { id: "gold_moon", type: "moon", color: "text-yellow-300", icon: GiMoon },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand }
    ]
  },
  {
    level: 2,
    instruction: "Touch the BLUE star, then the GOLD star!",
    targetSequence: ["blue_star", "gold_star"],
    objects: [
      { id: "blue_star", type: "star", color: "text-blue-400", icon: GiStarsStack },
      { id: "gold_star", type: "star", color: "text-yellow-400", icon: GiStarsStack },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand }
    ]
  },
  {
    level: 3,
    instruction: "Touch the PINK wand, then the BLUE butterfly!",
    targetSequence: ["pink_wand", "blue_butterfly"],
    objects: [
      { id: "pink_wand", type: "wand", color: "text-pink-400", icon: GiFairyWand },
      { id: "blue_butterfly", type: "butterfly", color: "text-blue-400", icon: GiButterfly },
      { id: "gold_star", type: "star", color: "text-yellow-400", icon: GiStarsStack },
      { id: "purple_crystal", type: "crystal", color: "text-purple-400", icon: GiCrystalCluster },
      { id: "gold_moon", type: "moon", color: "text-yellow-300", icon: GiMoon }
    ]
  }
];

export default function Activity2UI() {
  const router = useRouter();
  
  // Game State
  const [sessionState, setSessionState] = useState<"intro" | "playing" | "celebrating" | "outro">("intro");
  const [level, setLevel] = useState(0);
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [lumiMessage, setLumiMessage] = useState("Welcome to the Magic World! I'm Lumi, your guide.");
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  // Camera and Telemetry state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const initCameraAndSession = async () => {
      // 1. Start Session
      let sid = "mock_session_a2";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A2`, { method: 'POST' });
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
    setLumiMessage(currentTask.instruction);
    speak(currentTask.instruction);
    setStartTime(Date.now());
  };

  const handleObjectClick = (objectId: string) => {
    if (sessionState !== "playing") return;
    setTotalAttempts(prev => prev + 1);

    const targetId = currentTask.targetSequence[currentSequenceIndex];

    if (objectId === targetId) {
      // Correct click
      if (currentSequenceIndex + 1 === currentTask.targetSequence.length) {
        // Level complete
        const latency = (Date.now() - startTime) / 1000;
        setTotalLatency(prev => prev + latency);
        
        setSessionState("celebrating");
        setLumiMessage("Great job! You found it!");
        speak("Great job! You found it!");
        
        setTimeout(() => {
          if (level + 1 < TASKS.length) {
            setLevel(level + 1);
            setCurrentSequenceIndex(0);
            setSessionState("playing");
            setLumiMessage(TASKS[level + 1].instruction);
            speak(TASKS[level + 1].instruction);
            setStartTime(Date.now());
          } else {
            setSessionState("outro");
            setLumiMessage("You completed all the magical tasks! You're amazing!");
            speak("You completed all the magical tasks! You're amazing!");
          }
        }, 3500);
      } else {
        // Correct, but more steps left
        setCurrentSequenceIndex(prev => prev + 1);
        setLumiMessage("Good! Now what's next?");
        speak("Good! Now what's next?");
      }
    } else {
      // Incorrect click
      setErrors(prev => prev + 1);
      setLumiMessage("✨ Hmm... let's try that again! " + currentTask.instruction);
      speak("Hmm... let's try that again! " + currentTask.instruction);
      setCurrentSequenceIndex(0); // Reset sequence on error
    }
  };

  const finishActivity = async () => {
    // Send final metrics to backend
    const accuracy = totalAttempts > 0 ? ((totalAttempts - errors) / totalAttempts) * 100 : 0;
    const avg_latency = TASKS.length > 0 ? totalLatency / TASKS.length : 0;
    
    try {
      await fetch("http://localhost:8001/api/activities/a2/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a2",
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
      await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId || "demo-session-a2"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    
    // Go back to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A1128] font-sans selection:bg-purple-500/30">
      
      {/* Hidden camera and canvas for telemetry */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Background Layer: Deep blue magical sky, moon, stars, clouds */}
      <div className="absolute inset-0 z-0 opacity-80">
        <div className="absolute top-10 right-20 opacity-90 animate-pulse"><GiMoon className="text-yellow-100 text-[180px] drop-shadow-[0_0_40px_rgba(255,255,200,0.4)]" /></div>
        <div className="absolute top-20 left-1/4 opacity-40"><GiStarsStack className="text-white text-6xl" /></div>
        <div className="absolute top-40 right-1/3 opacity-60"><GiStarsStack className="text-white text-4xl" /></div>
        <div className="absolute top-32 left-10 opacity-70"><FaCloud className="text-indigo-200/20 text-[200px]" /></div>
        <div className="absolute top-10 right-1/4 opacity-50"><FaCloud className="text-purple-200/20 text-[150px]" /></div>
        <div className="absolute bottom-1/2 left-1/4 opacity-30 animate-bounce" style={{animationDuration: '10s'}}><GiRingedPlanet className="text-indigo-400 text-[120px]" /></div>
      </div>

      {/* Middle Layer: Hills, castle, rocket */}
      <div className="absolute bottom-[5%] w-full h-1/2 z-10 pointer-events-none">
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-indigo-900 to-transparent opacity-50"></div>
        {/* Simple SVG hills */}
        <svg className="absolute bottom-0 w-full h-48 drop-shadow-xl opacity-90" preserveAspectRatio="none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2E1065" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#4B2A75" fillOpacity="1" d="M0,256L60,240C120,224,240,192,360,197.3C480,203,600,245,720,245.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        
        <div className="absolute bottom-[20%] right-[10%] opacity-80"><GiCastle className="text-indigo-900 text-[200px]" /></div>
        <div className="absolute bottom-[10%] left-[5%] opacity-70"><GiPineTree className="text-purple-900 text-[150px]" /></div>
        <div className="absolute bottom-[15%] left-[15%] opacity-60"><GiPineTree className="text-purple-800 text-[100px]" /></div>
        <div className="absolute top-[10%] left-[40%] animate-pulse" style={{animationDuration: '6s'}}><GiRocketFlight className="text-pink-300/40 text-[80px]" /></div>
        <div className="absolute top-0 right-[30%] animate-bounce" style={{animationDuration: '8s'}}><GiAirBalloon className="text-orange-300/30 text-[100px]" /></div>
      </div>

      {/* Foreground Layer */}
      <div className="absolute bottom-0 w-full h-[20vh] z-20 pointer-events-none">
        <div className="absolute bottom-4 left-1/4"><GiSpikyField className="text-purple-600 text-[80px]" /></div>
        <div className="absolute bottom-8 right-1/4"><GiFlowerPot className="text-pink-800 text-[100px]" /></div>
      </div>

      {/* Exit Button & Hidden Camera Elements */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={finishActivity}
          className="bg-white/10 hover:bg-white/30 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-lg border border-white/20"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-30 w-full h-full flex flex-col items-center pt-[5vh] pointer-events-none">
        
        {/* Lumi and Speech Bubble */}
        <div className="flex flex-col items-center max-w-2xl px-4">
          <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 mb-8 shadow-[0_15px_35px_rgba(0,0,0,0.5)] border-4 border-indigo-300 relative text-center pointer-events-auto transition-all duration-300 transform">
            {/* Tail of speech bubble */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white/90"></div>
            
            <h2 className="text-3xl md:text-4xl font-extrabold text-indigo-900 leading-tight">
              {lumiMessage}
            </h2>
          </div>
          
          {/* Lumi Character */}
          <div className="relative animate-bounce pointer-events-auto" style={{animationDuration: '3s'}}>
            <GiFairy className="text-[#FFD700] text-[140px] drop-shadow-[0_0_30px_rgba(255,215,0,0.8)]" />
            <div className="absolute inset-0 animate-ping opacity-20"><GiFairy className="text-[#FFD700] text-[140px]" /></div>
          </div>
        </div>

        {/* Play Area */}
        <div className="absolute bottom-[10%] w-full max-w-5xl px-8 flex justify-center flex-wrap gap-8 md:gap-16 pointer-events-auto">
          {sessionState === "intro" && (
            <button 
              onClick={startGame}
              className="bg-gradient-to-b from-[#9D4EDD] to-[#5A189A] hover:from-[#B100E8] hover:to-[#7B2CBF] text-white font-black text-3xl px-16 py-8 rounded-[40px] shadow-[0_10px_0_#3C096C,0_20px_40px_rgba(157,78,221,0.6)] transition-all duration-300 transform hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#3C096C] flex items-center gap-4 border-4 border-purple-300/50"
            >
              <GiStarsStack className="text-4xl" />
              Let's Begin
            </button>
          )}

          {sessionState === "playing" && currentTask.objects.map((obj) => (
            <button
              key={obj.id}
              onClick={() => handleObjectClick(obj.id)}
              className="group relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40 bg-indigo-900/40 hover:bg-indigo-800/60 backdrop-blur-sm rounded-[40px] border-4 border-indigo-400/30 transition-all duration-300 transform hover:scale-110 hover:-translate-y-4 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute inset-0 bg-white/5 rounded-[36px] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <obj.icon className={`${obj.color} text-[80px] md:text-[100px] drop-shadow-[0_0_15px_currentColor] transition-transform duration-300 group-active:scale-90`} />
            </button>
          ))}

          {sessionState === "celebrating" && (
            <div className="animate-spin text-yellow-300" style={{animationDuration: '4s'}}>
              <GiStarsStack className="text-[120px] drop-shadow-[0_0_50px_rgba(255,255,0,0.8)]" />
            </div>
          )}

          {sessionState === "outro" && (
            <button 
              onClick={finishActivity}
              className="bg-gradient-to-b from-[#FF7A00] to-[#E85D04] hover:from-[#FF9E00] hover:to-[#F48C06] text-white font-black text-3xl px-16 py-8 rounded-[40px] shadow-[0_10px_0_#D00000,0_20px_40px_rgba(255,122,0,0.6)] transition-all duration-300 transform hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#D00000] flex items-center gap-4 border-4 border-orange-300/50"
            >
              <GiCastle className="text-4xl" />
              Finish Adventure
            </button>
          )}
        </div>
      </div>
    </div>
  );
}