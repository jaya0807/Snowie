"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { X, ChevronRight, RotateCcw, ArrowRight } from "lucide-react";

const TASKS = [
  {
    level: 1,
    id: "obvious_emotions",
    character: "maya",
    scene_text: "Maya received a big birthday present!",
    question: "How do you think Maya feels?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "sad", label: "Sad", emoji: "😢" },
      { id: "angry", label: "Angry", emoji: "😠" },
      { id: "scared", label: "Scared", emoji: "😨" }
    ],
    correct: "happy",
    emotion_change: "happy",
    feedback: "That's right! You noticed how Maya might feel! 💛",
    scene_objects: ["present", "balloon"]
  },
  {
    level: 2,
    id: "emotion_from_situation",
    character: "aarav",
    scene_text: "Aarav's favorite toy just broke while he was playing.",
    question: "How might Aarav feel?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "sad", label: "Sad", emoji: "😢" },
      { id: "sleepy", label: "Sleepy", emoji: "😴" },
      { id: "excited", label: "Excited", emoji: "😎" }
    ],
    correct: "sad",
    emotion_change: "sad",
    feedback: "Yes... when things break, we often feel sad. 💛",
    scene_objects: ["kite"]
  },
  {
    level: 3,
    id: "social_situation",
    character: "riya",
    scene_text: "Riya is standing alone while the other children are playing together.",
    question: "How might Riya feel?",
    options: [
      { id: "happy", label: "Happy", emoji: "😊" },
      { id: "lonely", label: "Lonely / Sad", emoji: "😢" },
      { id: "angry", label: "Angry", emoji: "😠" },
      { id: "sleepy", label: "Sleepy", emoji: "😴" }
    ],
    correct: "lonely",
    emotion_change: "sad",
    feedback: "She might feel lonely.",
    social_question: "What could you do?",
    social_options: [
      { id: "ask_play", label: "Ask Riya to play", emoji: "💛" },
      { id: "laugh", label: "Laugh at her", emoji: "😂" },
      { id: "walk", label: "Walk away", emoji: "🚶" },
      { id: "leave", label: "Tell her to leave", emoji: "😠" }
    ],
    social_correct: "ask_play",
    social_emotion_change: "happy",
    social_feedback: "That's very kind! Asking her to play helps her feel included! 💛",
    scene_objects: ["football"]
  },
  {
    level: 4,
    id: "helping_empathy",
    character: "kabir",
    scene_text: "Kabir dropped his crayons and looks upset.",
    question: "What could you do?",
    options: [
      { id: "help", label: "Help pick them up", emoji: "💛" },
      { id: "laugh", label: "Laugh", emoji: "😂" },
      { id: "walk", label: "Walk away", emoji: "🚶" },
      { id: "take", label: "Take the crayons", emoji: "😠" }
    ],
    correct: "help",
    emotion_change: "happy",
    feedback: "You are a great helper! 💛",
    scene_objects: ["crayon"]
  }
];

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

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let ws: WebSocket;
    const initSession = async () => {
      let sid = "mock_session_a5";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?activity_id=A5`, { method: 'POST' });
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
    };
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

  const finishActivity = async () => {
    const accuracy = attempts > 0 ? ((attempts - errors) / attempts) * 100 : 0;
    const avg_latency = TASKS.length > 0 ? totalLatency / TASKS.length : 0;
    
    try {
      await fetch("http://localhost:8001/api/activities/a5/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          session_id: sessionId || "demo-session-a5",
          accuracy: accuracy,
          avg_latency: avg_latency,
          metrics: { errors, attempts, levelsCompleted: TASKS.length }
        })
      });
      await fetch(`http://localhost:8001/api/session/end?session_id=${sessionId || "demo-session-a5"}`, { method: 'POST' });
    } catch (e) {
      console.error("Failed to submit metrics", e);
    }
    router.push("/dashboard");
  };

  const currentTask = TASKS[taskIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-sky-300 font-sans">
      
      {/* Hidden camera & canvas */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      {/* 1. Sky & Distant Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300">
        <div className="absolute top-10 right-20 animate-[spin_60s_linear_infinite]">
          <img src="/assets/storyworld/sun.png" alt="Sun" className="w-48 h-48 drop-shadow-xl" />
        </div>
        
        {/* Clouds */}
        <div className="absolute top-16 left-10 animate-[bounce_8s_ease-in-out_infinite]">
          <img src="/assets/storyworld/cloud.png" alt="Cloud" className="w-64 h-64 opacity-80" />
        </div>
        <div className="absolute top-8 right-1/3 animate-[bounce_10s_ease-in-out_infinite_reverse]">
          <img src="/assets/storyworld/cloud.png" alt="Cloud" className="w-48 h-48 opacity-70" />
        </div>
        
        {/* Rainbow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <img src="/assets/storyworld/rainbow.png" alt="Rainbow" className="w-[800px] opacity-40 mix-blend-multiply" />
        </div>
      </div>

      {/* 2. Midground Landscape */}
      <div className="absolute bottom-0 w-full h-1/2 z-10 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full drop-shadow-2xl" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#86efac" fillOpacity="1" d="M0,192L60,186.7C120,181,240,171,360,176C480,181,600,203,720,208C840,213,960,203,1080,181.3C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          <path fill="#4ade80" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        <img src="/assets/storyworld/house.png" alt="House" className="absolute bottom-[40%] right-[10%] w-64 h-64 drop-shadow-xl" />
        <img src="/assets/storyworld/tree1.png" alt="Tree" className="absolute bottom-[35%] left-[5%] w-80 h-80 drop-shadow-2xl" />
        <img src="/assets/storyworld/tree2.png" alt="Tree" className="absolute bottom-[45%] left-[25%] w-64 h-64 opacity-90 drop-shadow-xl" />
      </div>

      {/* 3. Foreground Decorations */}
      <div className="absolute bottom-0 w-full h-1/4 z-20 pointer-events-none">
        <img src="/assets/storyworld/flower.png" alt="Flower" className="absolute bottom-10 right-[25%] w-24 h-24 drop-shadow-md animate-[bounce_4s_ease-in-out_infinite]" />
        <img src="/assets/storyworld/flower.png" alt="Flower" className="absolute bottom-5 left-[15%] w-20 h-20 drop-shadow-md animate-[bounce_5s_ease-in-out_infinite]" />
        <img src="/assets/storyworld/butterfly.png" alt="Butterfly" className="absolute bottom-32 left-[30%] w-16 h-16 animate-[bounce_2s_linear_infinite]" />
      </div>

      {/* Exit Button */}
      <button onClick={finishActivity} className="absolute top-6 left-6 z-50 bg-white/50 hover:bg-white/90 text-sky-900 rounded-full p-4 backdrop-blur-md transition-all shadow-md">
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
                   <img key={i} src={`/assets/storyworld/${obj}.png`} alt={obj} className={`absolute z-40 w-28 h-28 lg:w-36 lg:h-36 drop-shadow-xl animate-bounce ${i === 0 ? '-top-10 -left-10 lg:-left-20' : '-bottom-5 -left-12 lg:-left-16'}`} style={{animationDuration: '3s', animationDelay: `${i}s`}} />
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
                    { (subStep.includes("social") ? currentTask.social_options : currentTask.options).map((opt) => (
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
             <img src="/assets/storyworld/sparkles.png" alt="Sparkles" className="w-32 h-32 mb-6 animate-spin" style={{animationDuration: '10s'}} />
             <h1 className="text-5xl font-black text-green-600 mb-6 font-comic">🌈 You did amazing!</h1>
             <p className="text-2xl text-zinc-600 font-bold mb-10">You discovered lots of feelings and friendly ways to help!</p>
             <button onClick={finishActivity} className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-4">
               ✨ Finish Adventure
             </button>
           </div>
        )}

      </div>
    </div>
  );
}
