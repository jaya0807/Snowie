"use client";

import React from "react";

export default function BackgroundScene() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-sky-300 via-sky-200 to-sky-100">
      
      {/* Sun */}
      <img 
        src="/assets/a1/sun.png" 
        alt="Sun" 
        className="absolute top-[-5%] right-[-5%] w-64 h-64 md:w-96 md:h-96 opacity-90 drop-shadow-[0_0_50px_rgba(250,204,21,0.6)] animate-[pulse_6s_ease-in-out_infinite]"
      />

      {/* Clouds */}
      <img src="/assets/a1/cloud.png" alt="Cloud" className="absolute top-[10%] left-[5%] w-48 opacity-80 animate-[slideRight_60s_linear_infinite]" />
      <img src="/assets/a1/cloud.png" alt="Cloud" className="absolute top-[20%] right-[20%] w-32 opacity-60 animate-[slideRight_80s_linear_infinite_reverse]" />
      <img src="/assets/a1/cloud.png" alt="Cloud" className="absolute top-[5%] left-[40%] w-40 opacity-70 animate-[slideRight_45s_linear_infinite]" />

      {/* Ground/Grass Layer */}
      <div className="absolute bottom-0 w-full h-[40%] md:h-[45%]">
        {/* Distant Hills */}
        <div className="absolute bottom-0 w-full h-full bg-emerald-400 rounded-[100%_100%_0_0/20%_20%_0_0] transform scale-x-125 translate-y-12"></div>
        
        {/* Near Grass */}
        <div className="absolute bottom-0 w-full h-[80%] bg-emerald-300 rounded-[100%_100%_0_0/15%_15%_0_0] transform scale-x-[1.4] translate-y-8"></div>
        
        {/* Foreground Grass */}
        <div className="absolute bottom-0 w-full h-[60%] bg-emerald-200 rounded-[100%_100%_0_0/10%_10%_0_0] transform scale-x-150"></div>

        {/* Environmental Decorations */}
        <img src="/assets/a1/tree.png" alt="Tree" className="absolute bottom-[30%] left-[10%] w-48 md:w-64 drop-shadow-xl" />
        <img src="/assets/a1/tree.png" alt="Tree" className="absolute bottom-[40%] right-[5%] w-32 md:w-48 drop-shadow-xl opacity-80" />
        <img src="/assets/a1/tree.png" alt="Tree" className="absolute bottom-[20%] right-[15%] w-56 md:w-72 drop-shadow-2xl" />
        
        <img src="/assets/a1/flower.png" alt="Flower" className="absolute bottom-[10%] left-[20%] w-12 drop-shadow-md" />
        <img src="/assets/a1/flower.png" alt="Flower" className="absolute bottom-[15%] left-[25%] w-8 drop-shadow-md" />
        <img src="/assets/a1/mushroom.png" alt="Mushroom" className="absolute bottom-[5%] right-[30%] w-12 drop-shadow-md" />
      </div>

    </div>
  );
}
