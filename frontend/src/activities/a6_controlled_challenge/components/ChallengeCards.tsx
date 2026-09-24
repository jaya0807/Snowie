/* eslint-disable */
import React from "react";
import { ArrowRight, RefreshCcw, Sparkles } from "lucide-react";
import { LEVELS } from "./data";

export function IntroCard({ onStart }: { onStart: () => void }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-12 rounded-[3rem] shadow-2xl max-w-2xl text-center flex flex-col items-center border border-white/20">
      <div className="w-48 h-48 bg-indigo-500/50 rounded-full mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.5)] border-4 border-white/30 animate-[bounce_3s_ease-in-out_infinite]">
        <span className="text-8xl">👩‍🚀</span>
      </div>
      <h1 className="text-6xl font-black text-white mb-6 tracking-tight drop-shadow-md">SPACE MISSION</h1>
      <p className="text-2xl text-indigo-100 font-medium mb-10">Complete three missions and become a Space Explorer!</p>
      <button onClick={onStart} className="bg-indigo-500 hover:bg-indigo-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#4338ca,0_15px_30px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#4338ca] flex items-center gap-4">
        🚀 START MISSION
      </button>
    </div>
  );
}

export function PlayingCard({
  choices,
  currentLevel,
  isCorrect,
  feedbackMsg,
  onAnswer
}: {
  choices: string[];
  currentLevel: typeof LEVELS[0];
  isCorrect: boolean | null;
  feedbackMsg: string;
  onAnswer: (choice: string) => void;
}) {
  return (
    <div className="w-full max-w-6xl flex flex-col items-center">
      <div className="bg-white/10 backdrop-blur-md px-10 py-6 rounded-[2rem] border border-white/20 mb-12 shadow-xl flex items-center gap-6 animate-pulse">
        <span className="text-4xl">👩‍🚀</span>
        <h2 className="text-4xl font-bold text-white text-center">
          Find the <span className="text-yellow-300">ROCKET</span> !
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full px-10">
        {choices.map((choice, idx) => (
          <button 
            key={`${choice}-${idx}`}
            onClick={() => onAnswer(choice)}
            className="group relative bg-white/5 hover:bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center aspect-square"
          >
            <img 
              src={`/assets/space/${choice}.png`} 
              alt={choice} 
              className="w-3/4 h-3/4 object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)] transition-transform group-hover:scale-110 group-hover:-rotate-12" 
            />
            {isCorrect === false && choice !== currentLevel.target && (
              <div className="absolute inset-0 bg-red-500/20 rounded-3xl" />
            )}
          </button>
        ))}
      </div>

      {isCorrect === false && (
        <div className="mt-12 bg-red-500/20 backdrop-blur-md px-8 py-4 rounded-full border border-red-500/50 flex items-center gap-4 animate-[bounce_1s_ease-in-out_infinite]">
          <RefreshCcw className="text-white w-6 h-6" />
          <p className="text-2xl font-bold text-white">{feedbackMsg}</p>
        </div>
      )}
    </div>
  );
}

export function CelebrationCard({
  feedbackMsg,
  onNext
}: {
  feedbackMsg: string;
  onNext: () => void;
}) {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center animate-[fadeIn_0.5s_ease-out]">
      <div className="relative">
        <img src="/assets/space/sparkles.png" alt="Sparkles" className="absolute -inset-20 w-[150%] h-[150%] object-contain opacity-50 animate-spin duration-10s" />
        <img src="/assets/space/rocket.png" alt="Rocket" className="w-64 h-64 drop-shadow-[0_20px_30px_rgba(255,255,255,0.3)] animate-[bounce_2s_ease-in-out_infinite] z-10 relative" />
      </div>
      
      <div className="bg-white/20 backdrop-blur-xl px-12 py-8 rounded-[3rem] border-2 border-white/50 shadow-2xl mt-12 text-center">
        <h2 className="text-5xl font-black text-white mb-8 drop-shadow-md">{feedbackMsg}</h2>
        <button 
          onClick={onNext}
          className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-4 mx-auto"
        >
          Next Mission <ArrowRight className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
}

export function OutroCard({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="bg-white/10 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl max-w-3xl text-center flex flex-col items-center border-4 border-yellow-400/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src="/assets/space/sparkles.png" alt="Sparkles" className="w-full h-full object-cover animate-pulse" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex gap-6 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-24 bg-green-500 rounded-full border-4 border-white flex flex-col items-center justify-center text-white shadow-[0_0_30px_rgba(34,197,94,0.6)]">
              <span className="text-4xl font-black">✓</span>
            </div>
          ))}
        </div>
        
        <h1 className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-500 mb-6 drop-shadow-sm">MISSION COMPLETE!</h1>
        <p className="text-3xl text-white font-bold mb-12">You are a Space Hero! 🏆</p>
        
        <button onClick={onFinish} className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#a16207,0_15px_30px_rgba(234,179,8,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#a16207] flex items-center gap-4">
          <Sparkles className="w-8 h-8" /> Return to Earth
        </button>
      </div>
    </div>
  );
}
