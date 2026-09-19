import { FaChild } from "react-icons/fa";
import { Gamepad2, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function ChildPlayingSticker() {
  return (
    <div 
      className="relative flex items-center justify-center w-full h-full"
    >
      <div 
        className="relative w-48 h-48 flex items-center justify-center"
        style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15)) drop-shadow(0px 0px 0px rgba(255,255,255,1)) drop-shadow(2px 2px 0px rgba(255,255,255,1)) drop-shadow(-2px -2px 0px rgba(255,255,255,1))' }}
      >
        {/* Child silhouette sticker */}
        <FaChild className="w-40 h-48 text-brand relative z-10" />
        
        {/* Floating Gamepad */}
        <motion.div 
          animate={{ y: [0, -5, 0], rotate: [-5, 5, -5] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="bg-zinc-800 rounded-2xl p-2 shadow-lg border-[3px] border-white">
            <Gamepad2 className="w-10 h-10 text-white fill-white/20" strokeWidth={1.5} />
          </div>
        </motion.div>

        {/* Floating Sparkles */}
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute top-4 right-2 text-amber-400 z-0"
        >
          <Sparkles className="w-8 h-8 fill-amber-400" />
        </motion.div>
        
        <motion.div
          animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-12 left-2 text-brand z-0"
        >
          <Sparkles className="w-6 h-6 fill-brand" />
        </motion.div>
      </div>
    </div>
  );
}
