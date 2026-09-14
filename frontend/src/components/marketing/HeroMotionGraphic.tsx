"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, ShieldCheck, Smile, Activity, Stethoscope, Moon, CheckCircle } from "lucide-react";

const burstCards = [
  { icon: CheckCircle, label: "Milestone Hit", color: "text-brand", x: -180, y: -140 },
  { icon: Stethoscope, label: "Checkup Done", color: "text-success", x: 180, y: -160 },
  { icon: Moon, label: "Sleep: 8h", color: "text-brand", x: 200, y: 130 },
  { icon: Activity, label: "Heart Rate", color: "text-brand-accent", x: -190, y: 150 },
];

export function HeroMotionGraphic() {
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycle((prev) => prev + 1);
    }, 5500); // 2.5s animation + 1s hold + 2s gap
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full flex items-center justify-center h-[380px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={cycle}
          className="relative flex items-center justify-center w-[260px] h-[320px]"
        >
          {/* BURST PARTICLES — behind the center card */}
          {burstCards.map((card, i) => (
            <motion.div
              key={`burst-${i}`}
              initial={{ opacity: 0, scale: 0.6, x: 0, y: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.6, 1, 1, 0.7],
                x: [0, card.x * 0.6, card.x, card.x],
                y: [0, card.y * 0.6, card.y, card.y],
              }}
              transition={{
                duration: 2.5,
                times: [0, 0.25, 0.65, 1],
                ease: "easeOut",
                delay: i * 0.08,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-0 bg-white px-3 py-2 rounded-xl shadow-md border border-zinc-100 flex items-center gap-2 whitespace-nowrap"
            >
              <card.icon className={`w-4 h-4 ${card.color}`} />
              <span className="text-xs font-semibold text-zinc-600">{card.label}</span>
            </motion.div>
          ))}

          {/* CENTER CARD — always on top */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative z-20 bg-white border-2 border-brand/10 p-6 rounded-3xl shadow-[0_20px_60px_rgba(23,107,156,0.12)] flex flex-col items-center gap-4 w-[260px]"
          >
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center"
            >
              <HeartPulse className="w-7 h-7 text-brand" />
            </motion.div>
            <div className="text-center space-y-0.5">
              <h3 className="font-bold text-zinc-800 text-sm">Child Healthcare</h3>
              <p className="text-[11px] text-zinc-400 font-medium">Real-time health monitoring</p>
            </div>
            <div className="w-full h-8 bg-zinc-50 rounded-lg flex items-center justify-center overflow-hidden border border-zinc-100">
              <Activity className="w-full h-10 text-success-light opacity-40" strokeWidth={1.5} />
            </div>
          </motion.div>

          {/* TOP-RIGHT BADGE — overlaps ~20% */}
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, x: 110, y: -100 }}
            exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.45, delay: 0.25 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="bg-white p-2.5 rounded-2xl shadow-[0_12px_35px_rgba(16,185,129,0.12)] border border-success/15 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-success-bg flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Vitals</p>
                <p className="text-xs font-semibold text-zinc-800">Stable & Secure</p>
              </div>
            </div>
          </motion.div>

          {/* BOTTOM-LEFT BADGE — overlaps ~20% */}
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ opacity: 1, scale: 1, x: -110, y: 110 }}
            exit={{ opacity: 0, scale: 0.5, x: 0, y: 0 }}
            transition={{ duration: 0.7, type: "spring", bounce: 0.45, delay: 0.35 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30"
          >
            <div className="bg-white p-2.5 rounded-2xl shadow-[0_12px_35px_rgba(23,107,156,0.12)] border border-brand/15 flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center">
                <Smile className="w-3.5 h-3.5 text-brand" />
              </div>
              <div>
                <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Behavior</p>
                <p className="text-xs font-semibold text-zinc-800">Calm & Engaged</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
