/* eslint-disable */
"use client";

import React from "react";

interface AnimalCharacterProps {
  charImage: string;
  name: string;
  isReacting: boolean;
}

export default function AnimalCharacter({ charImage, name, isReacting }: AnimalCharacterProps) {
  
  let animClass = "";
  let animStyle = {};
  
  if (isReacting) {
    animClass = "animate-bounce";
  } else {
    if (name === "Panda") animStyle = { animation: "sway 4s ease-in-out infinite" };
    else if (name === "Bunny") animStyle = { animation: "float 3s ease-in-out infinite" };
    else animStyle = { animation: "float 4s ease-in-out infinite" };
  }

  return (
    <div className="relative z-40 mb-[-30px] md:mb-[-40px] flex justify-center">
        <div 
          className={`relative transition-transform duration-500 ${animClass} motion-reduce:animate-none`}
          style={animStyle}
        >
          <img 
            src={`/assets/a1/${charImage}`} 
            alt={name} 
            className="w-40 md:w-56 object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)] transition-transform duration-700 hover:scale-105"
          />
          {isReacting && (
            <img src="/assets/a1/sparkles.png" className="absolute -top-4 -right-4 w-16 opacity-90 animate-[ping_1s_cubic-bezier(0,0,0.2,1)_2]" alt="Sparkle" />
          )}
        </div>
    </div>
  );
}
