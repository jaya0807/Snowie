/* eslint-disable */
import React from "react";
import { Video, Clapperboard, Mic2, RefreshCcw, ArrowRight } from "lucide-react";
import { LEVELS } from "./data";

export function IntroCard({ onStart }: { onStart: () => void }) {
  return (
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
      <button onClick={onStart} className="bg-red-600 hover:bg-red-500 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#7f1d1d,0_15px_30px_rgba(220,38,38,0.5)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#7f1d1d] flex items-center gap-4">
        ▶ START MOVIE
      </button>
    </div>
  );
}

export function QuestionCard({ 
  level, 
  onAnswer, 
  isCorrect, 
  feedbackMsg 
}: { 
  level: typeof LEVELS[0];
  onAnswer: (correct: boolean) => void;
  isCorrect: boolean | null;
  feedbackMsg: string;
}) {
  return (
    <div className="w-full bg-zinc-800 p-8 rounded-[2rem] border border-zinc-700 shadow-2xl animate-[slideUp_0.5s_ease-out]">
      <h3 className="text-4xl font-bold text-center mb-8">{level.question}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {level.choices.map((choice, i) => (
          <button 
            key={i}
            onClick={() => onAnswer(choice.isCorrect)}
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
    <div className="w-full bg-green-500/20 p-8 rounded-[2rem] border-2 border-green-500 shadow-2xl animate-[fadeIn_0.5s_ease-out] flex flex-col items-center">
      <h3 className="text-5xl font-black text-center mb-8 text-white drop-shadow-md">{feedbackMsg}</h3>
      <button 
        onClick={onNext}
        className="bg-green-500 hover:bg-green-400 text-white font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#166534,0_15px_30px_rgba(34,197,94,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#166534] flex items-center gap-4 mx-auto"
      >
        Next Scene <ArrowRight className="w-8 h-8" />
      </button>
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

export function OutroCard({ onFinish }: { onFinish: () => void }) {
  return (
    <div className="bg-zinc-800/90 backdrop-blur-xl p-16 rounded-[3rem] shadow-2xl max-w-3xl text-center flex flex-col items-center border-4 border-yellow-400/50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30">
        <img src="/assets/movie/star.png" alt="Star" className="w-full h-full object-cover animate-spin duration-20s" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-32 h-32 bg-yellow-400 rounded-full border-8 border-white flex flex-col items-center justify-center shadow-[0_0_50px_rgba(250,204,21,0.6)] mb-8">
          <StarIcon className="w-16 h-16 text-yellow-800 fill-yellow-800" />
        </div>
        
        <h1 className="text-6xl font-black text-white mb-6 drop-shadow-sm">MOVIE STAR!</h1>
        <p className="text-3xl text-zinc-300 font-bold mb-12">You listened and remembered so well! 🎬</p>
        
        <button onClick={onFinish} className="bg-yellow-500 hover:bg-yellow-400 text-yellow-900 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_#a16207,0_15px_30px_rgba(234,179,8,0.4)] transition-all hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_#a16207] flex items-center gap-4">
          <Clapperboard className="w-8 h-8" /> That&apos;s a Wrap!
        </button>
      </div>
    </div>
  );
}
