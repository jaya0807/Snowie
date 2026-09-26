"use client";

import { useRouter } from "next/navigation";
import { PartyPopper, Star, Sparkles, Heart } from "lucide-react";

export default function ThankYouPage() {
  const router = useRouter();

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gradient-to-br from-cyan-400 via-purple-400 to-pink-400 flex flex-col items-center justify-center font-sans">
      
      {/* Background Animated Elements */}
      <div className="absolute top-10 left-10 text-yellow-300 animate-[bounce_3s_ease-in-out_infinite]">
        <Star className="w-16 h-16 fill-current" />
      </div>
      <div className="absolute bottom-20 right-20 text-white animate-[bounce_4s_ease-in-out_infinite]">
        <Sparkles className="w-20 h-20 fill-current" />
      </div>
      <div className="absolute top-20 right-1/4 text-pink-300 animate-[pulse_2s_ease-in-out_infinite]">
        <Heart className="w-12 h-12 fill-current" />
      </div>
      <div className="absolute bottom-1/4 left-1/4 text-blue-200 animate-[bounce_2.5s_ease-in-out_infinite]">
        <Star className="w-10 h-10 fill-current" />
      </div>

      {/* Main Card */}
      <div className="relative z-10 bg-white/20 backdrop-blur-2xl border-4 border-white/50 p-16 rounded-[3rem] shadow-2xl flex flex-col items-center text-center max-w-3xl transform transition-all hover:scale-105 duration-500">
        
        <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-8 shadow-inner animate-[spin_10s_linear_infinite]">
          <PartyPopper className="w-16 h-16 text-pink-500" />
        </div>

        <h1 className="text-7xl font-black text-white mb-6 drop-shadow-lg tracking-tight">
          YOU DID IT!
        </h1>
        
        <p className="text-3xl text-white/90 font-bold mb-12 drop-shadow-md">
          Thank you for playing! You did an amazing job today! 🌟
        </p>

        <button 
          onClick={() => router.push("/")}
          className="bg-white text-purple-600 hover:bg-yellow-300 hover:text-purple-800 font-black text-3xl px-12 py-6 rounded-full shadow-[0_8px_0_rgba(255,255,255,0.4),0_15px_30px_rgba(0,0,0,0.2)] hover:-translate-y-2 active:translate-y-2 active:shadow-[0_0px_0_rgba(255,255,255,0.4)] transition-all flex items-center gap-4 group"
        >
          <span>🏠</span> Go Back Home
        </button>

      </div>
      
    </div>
  );
}
