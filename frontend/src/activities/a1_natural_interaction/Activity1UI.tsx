"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, CheckCircle2, ChevronRight, X, Camera } from "lucide-react";
import BackgroundScene from "./components/BackgroundScene";
import CameraMirror from "./components/CameraMirror";
import FeelingSelector from "./components/FeelingSelector";
import AnimalSelector from "./components/AnimalSelector";
import { useVoiceRecognition } from "./components/useVoiceRecognition";
import { useRouter } from "next/navigation";

// The 6 steps of our Animal Journey
const STEPS = [
  { id: "intro", char: "🦊", name: "Foxie", message: "Hi! I'm Foxie!\nI can't wait to meet you!\nLet's get to know each other. 💛", action: "✨ Let's Talk!" },
  { id: "name", char: "🐰", name: "Bunny", message: "And I'm Bunny! What's your name? 😊", action: "✨ That's me!" },
  { id: "feeling", char: "🐻", name: "Bear", message: "How are you feeling today?", action: "" },
  { id: "animal", char: "🐼", name: "Panda", message: "What's your favourite animal?", action: "" },
  { id: "day", char: "🐶", name: "Puppy", message: "Tell me about your day. I'm listening!\n(There's no right or wrong answer. 💛)", action: "✨ Done!" },
  { id: "outro", char: "🦁", name: "Lion", message: "You've met everyone!\nReady for your adventure?", action: "🚀 Let's Go!" }
];

export default function Activity1UI() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState("");
  
  const [name, setName] = useState("");
  const [feeling, setFeeling] = useState("");
  const [favAnimal, setFavAnimal] = useState("");
  const [dayText, setDayText] = useState("");
  
  const { isListening, toggleListen } = useVoiceRecognition(stepIndex, setName, setDayText);
  
  // Camera and Telemetry state
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const telemetryInterval = useRef<NodeJS.Timeout | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [camError, setCamError] = useState('');

  useEffect(() => {
    let ws: WebSocket;
    
    const initCameraAndSession = async () => {
      // 1. Start Session
      let sid = "";
      try {
        const res = await fetch(`http://localhost:8001/api/session/start?patient_id=P1&activity_id=A1`, { method: 'POST' });
        const data = await res.json();
        sid = data.session_id;
        setSessionId(sid);
      } catch(e) { console.error(e); }
      
      // 2. Start Camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch(e: any) { console.error("Camera access denied", e); setCamError(e.message || "Denied"); }
      
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



  const nextStep = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finish Activity - Send telemetry to backend and exit
      const sid = sessionId || "mock_session";
      
      try {
        // 1. Submit the conversational data
        await fetch(`http://localhost:8001/api/activities/a1/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sid,
            name: name,
            feeling: feeling,
            animal: favAnimal,
            day_text: dayText
          })
        });
        
        // 2. End the session
        await fetch(`http://localhost:8001/api/session/end?session_id=${sid}`, { method: 'POST' });
      } catch (e) {
        console.error("Failed to submit A1 data", e);
      }
      
      router.push('/dashboard');
    }
  };

  const step = STEPS[stepIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* 1. The Art Assets (Background Layer) */}
      <BackgroundScene />

      {/* Close Button */}
      <button 
        onClick={() => router.push('/dashboard')}
        className="absolute top-6 left-6 z-50 bg-white/50 hover:bg-white p-3 rounded-full backdrop-blur transition-all shadow-sm"
      >
        <X className="w-6 h-6 text-zinc-600" />
      </button>

      {/* Progress Indicator */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md px-6 py-2 rounded-full shadow-sm border border-white flex items-center gap-2">
        <span className="text-yellow-500 text-sm">⭐</span>
        <span className="font-bold text-xs uppercase tracking-widest text-zinc-700">
          Meet The Animal Friends • {stepIndex + 1} / 6
        </span>
      </div>

            {/* 2. The Interactive Overlay (Foreground Layer) */}
      
      {/* Hidden canvas for extracting frames */}
      <canvas ref={canvasRef} className="hidden" />

      {/* PIP Camera Mirror */}
      <CameraMirror cameraActive={cameraActive} camError={camError} videoRef={videoRef} />
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-[10vh] px-4">
        
        {/* Animated Character (Peeking from behind card) */}
        <div 
          key={step.char} 
          className="text-[140px] md:text-[180px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] animate-bounce mb-[-60px] md:mb-[-80px] z-10 transition-all duration-700 transform hover:scale-110 origin-bottom"
          style={{ animationDuration: '2.5s' }}
        >
          {step.char}
        </div>

        {/* The White Card */}
        <div className="relative bg-white/95 backdrop-blur-xl w-full max-w-3xl rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_4px_0_rgba(255,255,255,1)] p-10 md:p-14 flex flex-col items-center text-center border-[8px] border-white/50 transition-all duration-500 z-20">
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#176B9C] mb-6 leading-tight whitespace-pre-line font-comic">
            {step.message}
          </h2>

          {/* STEP 2: Name Input */}
          {stepIndex === 1 && (
            <div className="w-full max-w-md mb-8">
              <div className="relative flex items-center mb-4">
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Type your name here..."
                  className="w-full bg-zinc-100 border-2 border-zinc-200 rounded-2xl px-6 py-4 text-xl font-bold text-zinc-700 focus:outline-none focus:border-brand transition-colors"
                />
              </div>
              <button 
                onClick={toggleListen}
                className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 transition-all ${
                  isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-white border-b-4 border-brand text-brand hover:bg-brand/5 active:border-b-0 active:translate-y-1 shadow-sm'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span className="font-bold">{isListening ? 'Listening...' : '🎤 Or tell me!'}</span>
              </button>
            </div>
          )}

          {/* STEP 3: Feeling Input */}
          {stepIndex === 2 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { emoji: "😊", label: "Happy" },
                { emoji: "🤩", label: "Excited" },
                { emoji: "😌", label: "Calm" },
                { emoji: "😴", label: "Sleepy" },
                { emoji: "😟", label: "Not so good" },
              ].map(f => (
                <button
                  key={f.label}
                  onClick={() => {
                    setFeeling(f.label);
                    setTimeout(nextStep, 1000); // Auto-advance after 1 sec
                  }}
                  className={`flex flex-col items-center justify-center p-4 rounded-3xl border-4 transition-all duration-300 transform hover:scale-110 ${
                    feeling === f.label ? 'border-brand bg-brand/10 scale-110' : 'border-transparent bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-5xl mb-2 drop-shadow-md">{f.emoji}</span>
                  <span className="font-bold text-zinc-600 text-sm">{f.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP 4: Animal Input */}
          {stepIndex === 3 && (
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {[
                { emoji: "🐶", label: "Dog" },
                { emoji: "🐱", label: "Cat" },
                { emoji: "🐼", label: "Panda" },
                { emoji: "🦁", label: "Lion" },
                { emoji: "🐰", label: "Bunny" },
                { emoji: "🦋", label: "Butterfly" },
              ].map(a => (
                <button
                  key={a.label}
                  onClick={() => {
                    setFavAnimal(a.label);
                    setTimeout(nextStep, 1000);
                  }}
                  className={`flex flex-col items-center justify-center p-4 w-24 h-24 rounded-3xl border-4 transition-all duration-300 transform hover:scale-110 ${
                    favAnimal === a.label ? 'border-brand bg-brand/10 scale-110' : 'border-transparent bg-zinc-50 hover:bg-zinc-100'
                  }`}
                >
                  <span className="text-5xl drop-shadow-md">{a.emoji}</span>
                  <span className="font-bold text-zinc-600 text-xs mt-2">{a.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP 5: Day Reflection */}
          {stepIndex === 4 && (
            <div className="w-full max-w-md mb-8">
              <textarea 
                value={dayText}
                onChange={(e) => setDayText(e.target.value)}
                placeholder="I played outside and..."
                className="w-full bg-zinc-50 border-2 border-zinc-200 rounded-2xl px-6 py-4 text-lg font-medium text-zinc-700 h-32 resize-none focus:outline-none focus:border-brand transition-colors mb-4"
              />
              <button 
                onClick={toggleListen}
                className={`flex items-center justify-center gap-2 w-full py-4 rounded-xl border-2 transition-all ${
                  isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-brand border-b-4 border-brand-dark text-white hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-lg shadow-brand/30'
                }`}
              >
                <Mic className="w-6 h-6" />
                <span className="font-bold text-lg">{isListening ? 'Listening...' : '🎤 Talk to Puppy'}</span>
              </button>
            </div>
          )}

          {/* Action Button (if step has one) */}
          {step.action && (
            <button 
              onClick={nextStep}
              className="bg-[#FF7A00] hover:bg-[#FF8C20] text-white font-black text-2xl px-14 py-6 rounded-full shadow-[0_8px_0_#CC6200,0_15px_30px_rgba(255,122,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_#CC6200] flex items-center gap-3"
            >
              {step.action}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
