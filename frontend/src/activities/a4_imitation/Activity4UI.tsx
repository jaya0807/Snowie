"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ArrowRight, RefreshCcw, Clapperboard, Video, Mic2 } from "lucide-react";

const LEVELS = [
  {
    id: "level1",
    sentence: "Emma puts the ball beside the chair.",
    question: "Where did Emma put the ball?",
    sceneProps: ["chair"],
    targetProp: "ball",
    targetPropEndPos: "right-[20%]",
    choices: [
      { text: "Beside the chair", isCorrect: true, icon: "🪑" },
      { text: "Near the bed", isCorrect: false, icon: "🛏️" },
      { text: "Under the tree", isCorrect: false, icon: "🌳" }
    ],
    feedbackPos: "Great listening, Movie Star! ⭐"
  },
  {
    id: "level2",
    sentence: "Emma puts the toy on the bed.",
    question: "What did Emma put on the bed?",
    sceneProps: ["bed"],
    targetProp: "toy",
    targetPropEndPos: "right-[40%] top-[40%]",
    choices: [
      { text: "The toy", isCorrect: true, icon: "🧸" },
      { text: "The ball", isCorrect: false, icon: "⚽" },
      { text: "The flower", isCorrect: false, icon: "🌸" }
    ],
    feedbackPos: "Amazing memory! 🎬"
  },
  {
    id: "level3",
    sentence: "Emma puts the beautiful flower near the house.",
    question: "Where was the flower?",
    sceneProps: ["house"],
    targetProp: "flower",
    targetPropEndPos: "right-[30%] top-[60%]",
    choices: [
      { text: "Near the house", isCorrect: true, icon: "🏠" },
      { text: "Next to the tree", isCorrect: false, icon: "🌳" },
      { text: "On the chair", isCorrect: false, icon: "🪑" }
    ],
    feedbackPos: "You're a true director! 🌟"
  }
];

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);
  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const initSession = async () => {
      let sid = "mock_session_a4";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A4`, { method: 'POST' });
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      } catch (e) { console.error(e); }
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e: unknown) { console.error("Camera access denied", e); }
      
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
        }, 200);
      };
    };
    initSession();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(t => t.stop());
      }
      if (telemetryInterval.current) clearInterval(telemetryInterval.current);
      if (ws) ws.close();
      window.speechSynthesis.cancel();
      if (fallbackTimeoutRef.current) clearTimeout(fallbackTimeoutRef.current);
    };
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

  const finishActivity = async () => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = LEVELS.length > 0 ? totalLatency / LEVELS.length : 0;
    
    try {
      await fetch("http://localhost:8001/api/activities/a4/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a4",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: LEVELS.length }
        })
      });
      await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId || "demo-session-a4"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    router.push("/dashboard");
  };

  const currentLevel = LEVELS[levelIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans bg-slate-900 text-white">
      
      {/* Hidden camera & canvas */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Studio Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex items-start justify-around pt-10">
         <div className="w-1 bg-zinc-700 h-64 relative shadow-2xl">
           <div className="absolute bottom-0 -left-6 w-12 h-8 bg-zinc-800 rounded-t-xl"></div>
           <div className="absolute bottom-4 -left-12 w-24 h-24 bg-yellow-100 rounded-full blur-[50px] opacity-80 animate-pulse"></div>
         </div>
         <div className="w-1 bg-zinc-700 h-48 relative shadow-2xl">
           <div className="absolute bottom-0 -left-6 w-12 h-8 bg-zinc-800 rounded-t-xl"></div>
           <div className="absolute bottom-4 -left-12 w-24 h-24 bg-yellow-100 rounded-full blur-[50px] opacity-80 animate-pulse" style={{animationDelay: '1s'}}></div>
         </div>
      </div>

      {/* Exit Button */}
      <button onClick={finishActivity} className="absolute top-6 left-6 z-50 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 backdrop-blur-md transition-all shadow-md border border-white/10">
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
            
            {/* The Movie Stage */}
            <div className={`relative w-full h-[500px] bg-sky-200 rounded-[3rem] overflow-hidden border-[12px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] mb-8 transition-all duration-1000 ${sessionState === 'question' ? 'brightness-50 grayscale-[50%]' : ''}`}>
               
               {/* Film overlay decoration */}
               <div className="absolute top-0 left-0 w-full h-8 bg-zinc-900 flex justify-between px-8 items-center opacity-50 z-50">
                 {[...Array(20)].map((_, i) => <div key={i} className="w-4 h-4 bg-zinc-300 rounded-sm"></div>)}
               </div>
               <div className="absolute bottom-0 left-0 w-full h-8 bg-zinc-900 flex justify-between px-8 items-center opacity-50 z-50">
                 {[...Array(20)].map((_, i) => <div key={i} className="w-4 h-4 bg-zinc-300 rounded-sm"></div>)}
               </div>
               
               {/* Ground */}
               <div className="absolute bottom-0 w-full h-1/3 bg-emerald-400 rounded-b-[2rem]"></div>

               {/* Static Scene Props */}
               {currentLevel.sceneProps.map(prop => (
                 <img key={prop} src={`/assets/movie/${prop}.png`} alt={prop} className="absolute right-[20%] bottom-[20%] w-64 h-64 object-contain drop-shadow-xl" />
               ))}

               {/* Target Prop (Animated) */}
               <img 
                 src={`/assets/movie/${currentLevel.targetProp}.png`} 
                 alt="Target" 
                 className={`absolute w-32 h-32 object-contain drop-shadow-xl z-30 ${propPos}`} 
               />

               {/* Character (Emma) */}
               <img 
                 src="/assets/movie/emma.svg" 
                 alt="Emma" 
                 className={`absolute bottom-[20%] w-64 h-64 object-contain drop-shadow-2xl z-40 transition-all duration-[2000ms] ease-in-out ${emmaPos}`}
               />

               {sessionState === "question" && (
                 <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                    <div className="bg-black/80 text-white font-black text-6xl px-12 py-6 rounded-3xl backdrop-blur-sm border-4 border-white/20 animate-pulse">
                      PAUSED
                    </div>
                 </div>
               )}
            </div>

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
               
               <button onClick={finishActivity} className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#a16207,0_15px_30px_rgba(234,179,8,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#a16207] flex items-center gap-4">
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
