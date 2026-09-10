import React from "react";

export default function MovieStage(props: any) {
  const { sessionState, currentLevel, emmaPos, propPos } = props;
  return (
    <>
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
               {currentLevel.sceneProps.map((prop: any) => (
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

    </>
  );
}
