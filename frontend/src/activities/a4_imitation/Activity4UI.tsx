"use client";
import MovieStage from "./components/MovieStage";
import BackgroundScene from "./components/BackgroundScene";

import HiddenCameraProcessor from "@/activities/a1_natural_interaction/components/HiddenCameraProcessor";

import { LEVELS } from "./components/data";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, RefreshCcw, Clapperboard, Video, Mic2 } from "lucide-react";

export default function Activity4UI() {
  const router = useRouter();

  const [sessionState, setSessionState] = useState<"intro" | "movie" | "question" | "celebrating" | "outro">("intro");
  const [levelIndex, setLevelIndex] = useState(0);
  const [feedbackMsg, setFeedbackMsg] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [errors, setErrors] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [totalLatency, setTotalLatency] = useState<number>(0);

  // Animation states
  const [emmaPos, setEmmaPos] = useState("-left-64");
  const [propPos, setPropPos] = useState("opacity-0");
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Session init
  useEffect(() => {
    const initSession = async () => {
      try {
        const res = await fetch(`http://${window.location.hostname}:8000/api/session/start?activity_id=A2&force_new=${localStorage.getItem('forceNewSession') === 'true'}`, { method: 'POST' });
        const data = await res.json();
        setSessionId(data.session_id);
      } catch(e) { console.error(e); }
    };
    initSession();
  }, []);
  const speakSentence = (text: string, onComplete: () => void) => {
    window.speechSynthesis.cancel();
    if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    
    let isFired = false;
    const finish = () => {
      if (!isFired) {
        isFired = true;
        onComplete();
      }
    };
    
    utterance.onend = finish;
    utterance.onerror = finish;
    window.speechSynthesis.speak(utterance);
    
    // Fallback for browsers where onend doesn't fire reliably
    fallbackTimeoutRef.current = setTimeout(finish, 6000);
  };

  const playMovie = (index: number) => {
    setSessionState("movie");
    const level = LEVELS[index];
    
    // Reset positions
    setEmmaPos("-left-64");
    setPropPos("left-0 top-1/2 opacity-0");

    // Start Sequence
    setTimeout(() => {
      setEmmaPos("left-[20%]");
      
      setTimeout(() => {
        setPropPos(`opacity-100 left-[25%] top-[50%] transition-all duration-[2000ms]`);
        
        speakSentence(level.sentence, () => {
          setTimeout(() => {
             // Move prop to final destination
             setPropPos(`opacity-100 ${level.targetPropEndPos} transition-all duration-1000`);
             
             setTimeout(() => {
                 setSessionState("question");
                 setQuestionStartTime(new Date().getTime());
             }, 1500);
          }, 500);
        });
      }, 1000);
    }, 500);
  };

  const handleAnswer = (isCorrectChoice: boolean) => {
    const level = LEVELS[levelIndex];
    setAttempts(prev => prev + 1);

    if (isCorrectChoice) {
      setIsCorrect(true);
      const latency = (new Date().getTime() - questionStartTime) / 1000;
      setTotalLatency(prev => prev + latency);
      setFeedbackMsg(level.feedbackPos);
      setSessionState("celebrating");
    } else {
      setErrors(prev => prev + 1);
      setIsCorrect(false);
      setFeedbackMsg("Almost! Let's watch carefully again. 💛");
      
      // Replay the movie after a short delay so they can watch again
      setTimeout(() => {
        setIsCorrect(null);
        setFeedbackMsg("");
        playMovie(levelIndex);
      }, 2500);
    }
  };

  const handleNext = () => {
    setIsCorrect(null);
    setFeedbackMsg("");
    
    if (levelIndex + 1 < LEVELS.length) {
      const nextIndex = levelIndex + 1;
      setLevelIndex(nextIndex);
      playMovie(nextIndex);
    } else {
      setSessionState("outro");
    }
  };

  const finishActivity = async (quit: boolean = false) => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = LEVELS.length > 0 ? totalLatency / LEVELS.length : 0;
    
    try {
      await fetch(`http://${window.location.hostname}:8000/api/activities/a4/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a4",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: LEVELS.length }
        })
      });
      await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId || "demo-session-a4"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    if (quit === true) {
      router.push("/dashboard");
    } else {
      router.push("/child?activity=A5");
    }
  };

  const currentLevel = LEVELS[levelIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-slate-900 text-white">
      
      {/* Hidden camera & telemetry */}
      <HiddenCameraProcessor sessionId={sessionId || "mock"} activityId="A4" />
      
      <BackgroundScene />
      {/* Exit Button */}
      <button onClick={() => finishActivity(true)} className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-md border border-white/10">
        <X className="w-8 h-8" />
      </button>

      {/* Main Content Area */}
      <div className="relative z-30 w-full h-full flex flex-col items-center justify-center p-8">
        
        {sessionState === "intro" && (
          <div className="bg-zinc-800/80 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl max-w-2xl text-center flex flex-col items-center border border-zinc-600 border-t-zinc-500 relative">
            <div className="absolute -top-16 bg-red-600 text-white font-black px-8 py-3 rounded-xl shadow-lg border-4 border-zinc-900 flex items-center gap-3 animate-pulse">
               <Video className="w-6 h-6" /> REC
            </div>
            
            <Clapperboard className="w-32 h-32 text-white mb-8 drop-shadow-2xl" />
            <h1 className="text-6xl font-black text-white mb-4 tracking-tight drop-shadow-md">MINI MOVIE</h1>
            <h2 className="text-4xl font-bold text-zinc-400 mb-10">STUDIO</h2>
            <p className="text-2xl text-zinc-300 font-medium mb-12 flex items-center gap-3">
              <Mic2 className="w-8 h-8 text-yellow-400" /> Watch carefully and listen to the story!
            </p>
            <button onClick={() => playMovie(0)} className="bg-red-600 hover:bg-red-500 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#7f1d1d,0_15px_30px_rgba(220,38,38,0.5)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#7f1d1d] flex items-center gap-4">
              ▶ START MOVIE
            </button>
          </div>
        )}

        {(sessionState === "movie" || sessionState === "question" || sessionState === "celebrating") && (
          <div className="w-full max-w-6xl h-full flex flex-col items-center justify-center pt-20">
            
            <MovieStage sessionState={sessionState} currentLevel={currentLevel} emmaPos={emmaPos} propPos={propPos} />
            {/* Question Panel */}
            {sessionState === "question" && (
              <div className="w-full bg-zinc-800 p-8 rounded-[2rem] border border-zinc-700 shadow-2xl animate-[slideUp_0.5s_ease-out]">
                <h3 className="text-4xl font-bold text-center mb-8">{currentLevel.question}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {currentLevel.choices.map((choice, i) => (
                    <button 
                      key={i}
                      onClick={() => handleAnswer(choice.isCorrect)}
                      className="bg-zinc-700 hover:bg-zinc-600 text-white text-2xl font-bold py-6 px-4 rounded-2xl flex flex-col items-center gap-4 transition-transform hover:scale-105 active:scale-95 shadow-lg border border-zinc-600"
                    >
                      <span className="text-5xl">{choice.icon}</span>
                      {choice.text}
                    </button>
                  ))}
                </div>
                
                {isCorrect === false && (
                  <div className="mt-8 bg-red-500/20 px-8 py-4 rounded-xl border border-red-500/50 flex items-center justify-center gap-4 animate-[shake_0.5s_ease-in-out]">
                    <RefreshCcw className="text-white w-6 h-6" />
                    <p className="text-2xl font-bold text-white">{feedbackMsg}</p>
                  </div>
                )}
              </div>
            )}

            {/* Celebrating State */}
            {sessionState === "celebrating" && (
              <div className="w-full bg-green-500/20 p-8 rounded-[2rem] border-2 border-green-500 shadow-2xl animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
                <h3 className="text-5xl font-black text-center mb-8 text-white drop-shadow-md">{feedbackMsg}</h3>
                <button 
                  onClick={handleNext}
                  className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-4 mx-auto"
                >
                  Next Scene <ArrowRight className="w-8 h-8" />
                </button>
              </div>
            )}

          </div>
        )}

        {sessionState === "outro" && (
           <div className="bg-zinc-800/90 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl max-w-3xl text-center flex flex-col items-center border-4 border-yellow-400/50 relative overflow-hidden">
             
             <div className="absolute inset-0 opacity-30">
               <img src="/assets/movie/star.png" alt="Star" className="w-full h-full object-cover animate-spin" style={{animationDuration: '20s'}} />
             </div>
             
             <div className="relative z-10 flex flex-col items-center">
               <div className="w-32 h-32 bg-yellow-400 rounded-full border-8 border-white flex flex-col items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.6)] mb-8">
                 <StarIcon className="w-16 h-16 text-yellow-800 fill-yellow-800" />
               </div>
               
               <h1 className="text-6xl font-black text-white mb-6 drop-shadow-sm">MOVIE STAR!</h1>
               <p className="text-3xl text-zinc-300 font-bold mb-12">You listened and remembered so well! 🎬</p>
               
               <button onClick={() => finishActivity(false)} className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#a16207,0_15px_30px_rgba(234,179,8,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#a16207] flex items-center gap-4">
                 <Clapperboard className="w-8 h-8" /> That&apos;s a Wrap!
               </button>
             </div>
           </div>
        )}

      </div>
    </div>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
