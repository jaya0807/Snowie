/* eslint-disable */
"use client";
import BackgroundScene from "./components/BackgroundScene";

import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";

import { TASKS } from "./components/data";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, RotateCcw, ArrowRight } from "lucide-react";


export default function Activity5UI() {
  const router = useRouter();

  const [sessionState, setSessionState] = useState<"intro" | "playing" | "outro">("intro");
  const [taskIndex, setTaskIndex] = useState(0);
  const [subStep, setSubStep] = useState<"question" | "social_question" | "feedback" | "social_feedback">("question");
  const [characterEmotion, setCharacterEmotion] = useState("neutral");
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  // Session init
  useEffect(() => {
    const initSession = async () => {
      try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`}/api/session/start?activity_id=A5&force_new=${localStorage.getItem('forceNewSession') === 'true'}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { console.error(e); }
    };
    initSession();
  }, []);
  const startGame = () => {
    setSessionState("playing");
    setTaskIndex(0);
    setSubStep("question");
    setCharacterEmotion(TASKS[0].character === 'kabir' || TASKS[0].character === 'aarav' ? 'sad' : 'neutral');
    setStartTime(new Date().getTime());
  };

  const handleAnswer = (answerId: string, isSocial: boolean) => {
    const task = TASKS[taskIndex];
    setAttempts(prev => prev + 1);

    const correctId = isSocial ? task.social_correct : task.correct;
    
    if (answerId === correctId) {
      // Correct
      setIsCorrect(true);
      const latency = (new Date().getTime() - startTime) / 1000;
      setTotalLatency(prev => prev + latency);
      
      if (isSocial) {
        setSubStep("social_feedback");
        setFeedbackMsg(task.social_feedback || "Great choice!");
        if (task.social_emotion_change) setCharacterEmotion(task.social_emotion_change);
      } else {
        setSubStep("feedback");
        setFeedbackMsg(task.feedback);
        if (task.emotion_change) setCharacterEmotion(task.emotion_change);
      }
    } else {
      // Incorrect
      setErrors(prev => prev + 1);
      setIsCorrect(false);
      setFeedbackMsg("Hmm... let's think about it again. 💛");
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedbackMsg("");
    
    const task = TASKS[taskIndex];
    
    if (subStep === "feedback" && task.social_question) {
      setSubStep("social_question");
      setStartTime(new Date().getTime());
      return;
    }
    
    if (taskIndex + 1 < TASKS.length) {
      setTaskIndex(prev => prev + 1);
      setSubStep("question");
      const nextTask = TASKS[taskIndex + 1];
      setCharacterEmotion(nextTask.character === 'kabir' || nextTask.character === 'aarav' ? 'sad' : 'neutral');
      setStartTime(new Date().getTime());
    } else {
      setSessionState("outro");
    }
  };

  const finishActivity = async (quit: boolean = false) => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = TASKS.length > 0 ? totalLatency / TASKS.length : 0;
    
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`}/api/activities/a5/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a5",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: TASKS.length }
        })
      });
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`}/api/session/end?session_id=${sessionId || "demo-session-a5"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    if (quit === true) {
      router.push("/child/thank-you");
    } else {
      router.push("/child?activity=A6");
    }
  };

  const currentTask = TASKS[taskIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-300 font-sans">
      
      {/* Hidden camera & telemetry */}
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A5" />
      
      <BackgroundScene />
      {/* Exit Button */}
      <button onClick={() => finishActivity(true)} className="absolute top-6 left-6 z-50 bg-white/50 hover:bg-white/90 text-sky-900 rounded-full p-4 backdrop-blur-md transition-all shadow-md">
        <X className="w-8 h-8" />
      </button>

      {/* UI Content Layer */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
        
        {sessionState === "intro" && (
          <div className="bg-white/95 backdrop-blur-md p-12 rounded-[3rem] shadow-2xl max-w-2xl text-center flex flex-col items-center border-8 border-yellow-200">
            <h1 className="text-5xl font-black text-sky-600 mb-6 font-comic">Welcome to Little Life Stories! 🌈</h1>
            <p className="text-2xl text-zinc-600 font-bold mb-10">Today we&apos;ll discover how our friends might feel.</p>
            <button onClick={startGame} className="bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#ca8a04,0_15px_30px_rgba(250,204,21,0.5)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#ca8a04] flex items-center gap-4">
              ✨ Let&apos;s Begin
            </button>
          </div>
        )}

        {sessionState === "playing" && currentTask && (
          <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-12 mt-10">
            
            {/* Left: Scene & Character */}
            <div className="flex-1 flex flex-col items-center relative">
              
              <div className="bg-white/80 px-8 py-4 rounded-3xl shadow-md border-4 border-white mb-6">
                <p className="text-2xl font-bold text-sky-900 text-center">{currentTask.scene_text}</p>
              </div>

              {/* Character */}
              <div className="relative w-80 h-80 lg:w-[400px] lg:h-[400px] bg-sky-100/30 rounded-full border-8 border-white/50 shadow-2xl flex items-center justify-center backdrop-blur-sm transition-transform duration-500 hover:scale-105">
                 
                 {/* Scene Objects */}
                 {currentTask.scene_objects.map((obj, i) => (
                   <img key={i} src={`/assets/storyworld/${obj}.png`} alt={obj} className={`absolute z-40 w-28 h-28 lg:w-36 lg:h-36 drop-shadow-xl animate-bounce duration-3s ${i === 0 ? '-top-10 -left-10 lg:-left-20' : '-bottom-5 -left-12 lg:-left-16'}`} style={{animationDelay: `${i}s`}} />
                 ))}

                 <img src={`/assets/storyworld/characters/${currentTask.character}_${characterEmotion}.svg`} alt={currentTask.character} className="w-full h-full object-contain drop-shadow-2xl animate-[bounce_4s_ease-in-out_infinite]" />
                 
                 {isCorrect && subStep.includes("feedback") && (
                   <img src="/assets/storyworld/sparkles.png" alt="Sparkles" className="absolute -top-10 -right-10 w-40 h-40 animate-ping opacity-80" />
                 )}
              </div>
            </div>

            {/* Right: Question & Options */}
            <div className="flex-1 w-full flex flex-col">
              <div className="bg-white/95 backdrop-blur-md rounded-[3rem] p-8 shadow-2xl border-[6px] border-sky-100 flex flex-col items-center text-center">
                
                <h2 className="text-3xl font-black text-zinc-800 mb-8">
                  {subStep.includes("social") ? currentTask.social_question : currentTask.question}
                </h2>
                
                {(!subStep.includes("feedback") || isCorrect === false) ? (
                  <div className="grid grid-cols-2 gap-4 w-full">
                    { (subStep.includes("social") ? (currentTask.social_options || []) : currentTask.options).map((opt) => (
                       <button 
                         key={opt.id}
                         onClick={() => handleAnswer(opt.id, subStep.includes("social"))}
                         className="flex flex-col items-center justify-center p-6 bg-sky-50 hover:bg-sky-100 border-b-8 border-sky-200 rounded-[2rem] transition-all hover:-translate-y-2 active:translate-y-2 active:border-b-0 group"
                       >
                         <span className="text-5xl mb-2 drop-shadow-md group-hover:scale-110 transition-transform">{opt.emoji}</span>
                         <span className="font-bold text-sky-900 text-xl">{opt.label}</span>
                       </button>
                    )) }
                  </div>
                ) : (
                  <div className="flex flex-col items-center w-full py-8">
                    <p className="text-3xl font-bold text-green-600 mb-8">{feedbackMsg}</p>
                    <button 
                      onClick={handleNext}
                      className="bg-green-500 hover:bg-green-400 text-white font-black text-2xl px-12 py-5 rounded-full shadow-[0_6px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-3"
                    >
                      Continue <ArrowRight className="w-8 h-8" />
                    </button>
                  </div>
                )}
                
                {isCorrect === false && (
                   <p className="mt-6 text-xl font-bold text-orange-500 animate-pulse">{feedbackMsg}</p>
                )}
                
              </div>
            </div>

          </div>
        )}

        {sessionState === "outro" && (
           <div className="bg-white/95 backdrop-blur-md p-12 rounded-[3rem] shadow-2xl max-w-2xl text-center flex flex-col items-center border-8 border-green-200">
             <img src="/assets/storyworld/sparkles.png" alt="Sparkles" className="w-32 h-32 mb-6 animate-spin duration-10s" />
             <h1 className="text-5xl font-black text-green-600 mb-6 font-comic">🌈 You did amazing!</h1>
             <p className="text-2xl text-zinc-600 font-bold mb-10">You discovered lots of feelings and friendly ways to help!</p>
             <button onClick={() => finishActivity(false)} className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-4">
               ✨ Finish Adventure
             </button>
           </div>
        )}

      </div>
    </div>
  );
}
