"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, CheckCircle2, ChevronRight, X } from "lucide-react";
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
  
  const [name, setName] = useState("");
  const [feeling, setFeeling] = useState("");
  const [favAnimal, setFavAnimal] = useState("");
  const [dayText, setDayText] = useState("");
  
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech API for Native Voice Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result: any) => result.transcript)
            .join('');
            
          if (stepIndex === 1) setName(transcript);
          if (stepIndex === 4) setDayText(transcript);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [stepIndex]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finish Activity - Send telemetry to backend and exit
      fetch(`http://localhost:8001/api/session/end?session_id=mock_session`, { method: 'POST' }).catch(() => {});
      router.push('/dashboard');
    }
  };

  const step = STEPS[stepIndex];

  return (
    <div className="relative w-screen h-screen overflow-hidden font-sans">
      {/* 1. The Art Assets (Background Layer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-400 z-0 flex flex-col justify-end">
        {/* Mocking the lush hills using basic CSS shapes for the MVP layout */}
        <div className="w-[150%] h-[40%] bg-green-500/80 rounded-[100%] absolute -bottom-[10%] -left-[25%] blur-[2px]"></div>
        <div className="w-[150%] h-[50%] bg-green-600 rounded-[100%] absolute -bottom-[20%] -right-[25%] blur-[1px]"></div>
        
        {/* The Sun */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)] flex items-center justify-center text-4xl">
          ☀️
        </div>
      </div>

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
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-end pb-[10vh] px-4">
        
        {/* Animated Character */}
        <div 
          key={step.char} 
          className="text-[120px] drop-shadow-2xl animate-bounce mb-[-20px] z-20 transition-all duration-500 transform scale-110"
          style={{ animationDuration: '2s' }}
        >
          {step.char}
        </div>

        {/* The White Card */}
        <div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col items-center text-center border-4 border-white/50 transition-all duration-500">
          
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
                  isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-brand/5 border-brand/20 text-brand hover:bg-brand/10'
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
                  isListening ? 'bg-red-50 border-red-200 text-red-500 animate-pulse' : 'bg-brand text-white shadow-lg shadow-brand/30 hover:scale-105 transform'
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
              className="bg-[#FF7A00] hover:bg-[#FF8C20] text-white font-black text-xl px-12 py-5 rounded-full shadow-[0_8px_30px_rgba(255,122,0,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center gap-2"
            >
              {step.action}
            </button>
          )}

        </div>
      </div>
    </div>
  );
}
