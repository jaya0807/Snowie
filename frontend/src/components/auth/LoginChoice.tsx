"use client";

import React from "react";
import { Users, Sparkles, Rocket, ArrowRight, ShieldCheck, HeartHandshake } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { Button } from "@/components/common/Button";

interface LoginChoiceProps {
  onSelectParent: () => void;
  onSelectChild: () => void;
}

export function LoginChoice({ onSelectParent, onSelectChild }: LoginChoiceProps) {
  return (
    <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 px-4">
      {/* Card 1: Parent Login */}
      <LoginCard variant="choice" className="flex flex-col justify-between border-t-4 border-t-brand">
        <div>
          {/* Friendly Icon / Badge */}
          <div className="w-16 h-16 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
            <Users className="w-8 h-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-light text-brand text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Caregivers & Professionals</span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight">
            Parent Login
          </h2>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            View your child’s activities, observations and progress in real-time.
          </p>

          <div className="space-y-2.5 py-4 border-y border-zinc-100 mb-8">
            <div className="flex items-center gap-2.5 text-xs text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span>Review developmental observations</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span>Track milestones & progress trends</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-600">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span>Personalized home care suggestions</span>
            </div>
          </div>
        </div>

        <Button
          variant="secondary"
          size="lg"
          onClick={onSelectParent}
          className="w-full justify-between group-hover:bg-brand-dark"
        >
          <span>Parent Login</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </LoginCard>

      {/* Card 2: Child Login */}
      <LoginCard
        variant="choice"
        className="flex flex-col justify-between border-t-4 border-t-amber-400 bg-gradient-to-b from-white to-amber-50/30 relative overflow-hidden"
      >
        {/* Playful Floating Background Sparkles */}
        <div className="absolute top-3 right-3 text-amber-300 animate-pulse pointer-events-none">
          <Sparkles className="w-6 h-6" />
        </div>

        <div>
          {/* Playful Icon / Badge */}
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm border border-amber-200">
            <span className="text-3xl" role="img" aria-label="Milo Fox">
              🦊
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/90 text-amber-800 text-xs font-bold mb-3 border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Milo's Adventure Hub</span>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 mb-2 tracking-tight flex items-center gap-2">
            <span>Child Login</span>
            <span className="text-lg">🌟</span>
          </h2>

          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            Ready for your next adventure? Choose your animal friend and enter your secret PIN!
          </p>

          <div className="space-y-2.5 py-4 border-y border-amber-100 mb-8">
            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <span className="text-sm">🎮</span>
              <span>Fun interactive games & challenges</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <span className="text-sm">⭐</span>
              <span>Earn shiny stars and adventure badges</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-zinc-700">
              <span className="text-sm">🎨</span>
              <span>Friendly animal companions</span>
            </div>
          </div>
        </div>

        <Button
          variant="adventure"
          size="lg"
          onClick={onSelectChild}
          className="w-full justify-between"
        >
          <span>Start My Adventure</span>
          <span className="text-lg ml-1">🚀</span>
        </Button>
      </LoginCard>
    </div>
  );
}
