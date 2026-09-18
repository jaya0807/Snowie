"use client";
import BackgroundScene from "./components/BackgroundScene";

import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";

import { speak, TASKS } from "./components/data";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { 
  GiFairy, GiCastle, GiStarsStack, GiMoon, GiPineTree, 
  GiRocketFlight, GiAirBalloon, GiRingedPlanet, GiCrystalCluster, 
  GiFairyWand, GiButterfly, GiSpikyField, GiFlowerPot
} from "react-icons/gi";
import { FaCloud } from "react-icons/fa";



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
  
  // Session init
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/session/start?activity_id=A2&force_new=${localStorage.getItem('forceNewSession') === 'true'}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { 
        // Backend not running, silently fallback
      }
    };
    initSession();
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

  const finishActivity = async (quit: boolean = false) => {
    // Send final metrics to backend
    const accuracy = totalAttempts > 0 ? ((totalAttempts - errors) / totalAttempts) * 100 : 0;
    const avg_latency = TASKS.length > 0 ? totalLatency / TASKS.length : 0;
    
    try {
      await fetch("http://localhost:8000/api/activities/a2/submit", {
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
      await fetch(`http://localhost:8000/api/session/end?session_id=${sessionId || "demo-session-a2"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    
    if (quit === true) {
      router.push("/dashboard");
    } else {
      router.push("/child?activity=A3");
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0A1128] font-sans selection:bg-purple-500/30">
      
      {/* Hidden camera & telemetry */}
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A2" />
      
      <BackgroundScene />
      {/* Exit Button & Hidden Camera Elements */}
      <div className="absolute top-6 left-6 z-50">
        <button 
          onClick={() => finishActivity(true)}
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
              onClick={() => finishActivity(false)}
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