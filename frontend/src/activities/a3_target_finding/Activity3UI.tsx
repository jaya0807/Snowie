"use client";
import BackgroundScene from "./components/BackgroundScene";

import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";

import { speak, TASKS } from "./components/data";

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
  
  // Session init
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A3`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { console.error(e); }
    };
    initSession();
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

  const finishActivity = async (quit: boolean = false) => {
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
    
    if (quit === true) {
      router.push("/dashboard");
    } else {
      router.push("/child?activity=A4");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#87CEEB] font-sans selection:bg-blue-500/30">
      
      {/* Hidden camera & telemetry */}
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A3" />
      
      <BackgroundScene />
      {/* Exit Button */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => finishActivity(true)}
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
              onClick={() => finishActivity(false)}
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
