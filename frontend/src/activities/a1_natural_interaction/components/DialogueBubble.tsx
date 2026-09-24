/* eslint-disable */
"use client";

import React from "react";

export default function DialogueBubble({ children, name, charImage }: { children: React.ReactNode, name: string, charImage: string }) {
  return (
    <div className="relative w-[95%] md:w-full max-w-xl bg-gradient-to-br from-[#FFFBF4] to-[#F6F0FA] backdrop-blur-md rounded-[2.5rem_2rem_3rem_1.5rem] shadow-[4px_8px_20px_rgba(100,100,120,0.15)] px-6 py-6 md:px-10 md:py-8 flex flex-col items-center text-center border border-white/60 z-30 transition-all duration-300 mx-auto mt-4">
      {/* Speech bubble tail pointer pointing UP to the animal */}
      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[25px] border-b-[#FFFBF4] z-[-1]"></div>
      
      {/* Character Label & Avatar */}
      <div className="absolute -top-6 -left-2 md:-left-6 flex items-center gap-2 bg-white px-3 py-1.5 rounded-full shadow-md border border-indigo-50 z-10">
         <img src={`/assets/a1/${charImage}`} alt={name} className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover bg-amber-50" />
         <span className="font-extrabold text-sm md:text-base text-indigo-900 pr-2">{name}</span>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 left-6 text-yellow-400 opacity-70 text-lg">✨</div>
      <div className="absolute bottom-5 right-6 text-pink-400 opacity-60 text-sm">🌸</div>
      <div className="absolute -top-2 right-12 text-indigo-300 opacity-80 text-xl">✨</div>
      <div className="absolute bottom-4 left-8 text-yellow-300 opacity-60 text-xs">⭐</div>
      
      {children}
    </div>
  );
}
