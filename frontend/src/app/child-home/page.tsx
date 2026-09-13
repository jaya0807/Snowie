"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { AVATAR_OPTIONS } from "@/components/auth/AvatarSelector";
import { Sparkles, Star, Rocket, LogOut, Play, Trophy, Smile } from "lucide-react";
import { Button } from "@/components/common/Button";

interface ActivityCard {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  bgGradient: string;
  badge: string;
}

const ACTIVITIES: ActivityCard[] = [
  {
    id: "A1",
    code: "A1",
    title: "Milo's Hello!",
    subtitle: "Warm-up greeting & friendly chat",
    icon: "👋",
    color: "from-blue-400 to-indigo-500",
    bgGradient: "bg-gradient-to-br from-blue-500 to-indigo-600",
    badge: "Warm-up",
  },
  {
    id: "A2",
    code: "A2",
    title: "Follow the Path",
    subtitle: "Listen & tap the magical toys in order",
    icon: "🎯",
    color: "from-amber-400 to-orange-500",
    bgGradient: "bg-gradient-to-br from-amber-500 to-orange-600",
    badge: "Instructions",
  },
  {
    id: "A3",
    code: "A3",
    title: "Treasure Hunt",
    subtitle: "Spot the hidden pirate objects",
    icon: "💎",
    color: "from-emerald-400 to-teal-500",
    bgGradient: "bg-gradient-to-br from-emerald-500 to-teal-600",
    badge: "Finding",
  },
  {
    id: "A4",
    code: "A4",
    title: "Monkey Mirror",
    subtitle: "Copy the fun moves on camera",
    icon: "🐵",
    color: "from-rose-400 to-pink-500",
    bgGradient: "bg-gradient-to-br from-rose-500 to-pink-600",
    badge: "Imitation",
  },
  {
    id: "A5",
    code: "A5",
    title: "Feeling Friends",
    subtitle: "Guess how the animal friends feel",
    icon: "🌈",
    color: "from-purple-400 to-violet-500",
    bgGradient: "bg-gradient-to-br from-purple-500 to-violet-600",
    badge: "Emotions",
  },
  {
    id: "A6",
    code: "A6",
    title: "Space Mission",
    subtitle: "Collect shiny stars under the clock",
    icon: "🚀",
    color: "from-cyan-400 to-blue-600",
    bgGradient: "bg-gradient-to-br from-cyan-500 to-blue-700",
    badge: "Challenge",
  },
];

export default function ChildHomePage() {
  const { user, role, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (role === "parent") {
        router.push("/parent-dashboard");
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user || role !== "child") {
    return (
      <div className="min-h-screen bg-[#FFF9E6] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-400 text-white flex items-center justify-center animate-bounce text-2xl mx-auto shadow-md">
            ⭐
          </div>
          <p className="text-base font-bold text-amber-900">
            Getting your adventure ready...
          </p>
        </div>
      </div>
    );
  }

  const childUser = user as any;
  const avatarMeta =
    AVATAR_OPTIONS.find((a) => a.id === childUser.avatar) || AVATAR_OPTIONS[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FEF9E7] via-[#FFFDF5] to-[#EBF6FF] font-sans flex flex-col justify-between relative overflow-x-hidden select-none">
      {/* Playful Floating Background Elements */}
      <div className="absolute top-8 left-12 text-4xl opacity-80 pointer-events-none animate-pulse">
        ☁️
      </div>
      <div className="absolute top-24 right-16 text-3xl opacity-80 pointer-events-none animate-bounce duration-1000">
        ☁️
      </div>
      <div className="absolute top-1/2 left-6 text-2xl text-amber-400 pointer-events-none animate-spin-slow">
        ✨
      </div>
      <div className="absolute bottom-20 right-8 text-2xl text-amber-400 pointer-events-none animate-ping">
        ⭐
      </div>

      {/* Top Header */}
      <header className="w-full max-w-6xl mx-auto px-6 py-5 flex items-center justify-between relative z-20">
        {/* Child Profile Badge */}
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-xs px-4 py-2.5 rounded-full shadow-sm border-2 border-amber-200">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-2xl shadow-2xs">
            <span role="img" aria-label={avatarMeta.name}>
              {avatarMeta.emoji}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-zinc-900 leading-tight">
                {childUser.name || "Explorer"}
              </span>
              <span className="text-xs">🌟</span>
            </div>
            <span className="text-[10px] font-bold text-amber-700 block">
              {avatarMeta.name}
            </span>
          </div>
        </div>

        {/* Stars Counter & Logout */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-amber-400 text-white px-4 py-2 rounded-full shadow-md font-black text-sm border-2 border-amber-500">
            <Star className="w-4 h-4 fill-white text-white animate-spin-slow" />
            <span>{childUser.stars || 15} Stars</span>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-1.5 bg-white hover:bg-rose-50 text-zinc-600 hover:text-rose-600 px-3.5 py-2 rounded-full shadow-xs border border-zinc-200 text-xs font-bold transition-all cursor-pointer"
            title="Switch Explorer or Log Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Adventure Station */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-4 flex flex-col items-center justify-center relative z-10">
        {/* Playful Banner */}
        <div className="text-center mb-8 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-3 border border-amber-200 shadow-2xs">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Milo's Adventure World</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 tracking-tight">
            Choose Your Adventure! 🚀
          </h1>

          <p className="text-zinc-600 text-sm md:text-base font-semibold mt-2">
            Pick a game below and play together with Milo!
          </p>
        </div>

        {/* 6 Adventure Activity Cards Grid */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACTIVITIES.map((act) => (
            <Link
              key={act.id}
              href={`/child?activity=${act.code}`}
              className="group relative bg-white rounded-3xl p-6 border-3 border-amber-100 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between overflow-hidden cursor-pointer"
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl p-2 rounded-2xl bg-amber-50 group-hover:scale-125 transition-transform duration-300">
                  {act.icon}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-amber-100/70 text-amber-900 border border-amber-200">
                  {act.badge}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-black text-zinc-900 group-hover:text-amber-600 transition-colors mb-1">
                  {act.title}
                </h2>
                <p className="text-xs font-semibold text-zinc-500 leading-relaxed mb-6">
                  {act.subtitle}
                </p>
              </div>

              {/* Play Button Bar */}
              <div className="w-full pt-4 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Start Game</span>
                  <span>▶</span>
                </span>
                <div className="w-8 h-8 rounded-full bg-amber-400 text-white flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-amber-500 transition-all">
                  <Play className="w-4 h-4 fill-white ml-0.5" />
                </div>
              </div>

              {/* Colorful Bottom Glow */}
              <div className="absolute -bottom-1 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          ))}
        </div>
      </main>

      {/* Friendly Bottom Bar */}
      <footer className="w-full max-w-6xl mx-auto px-6 py-4 text-center text-xs font-bold text-amber-900/60 relative z-20 flex items-center justify-center gap-2">
        <Smile className="w-4 h-4" />
        <span>Have fun exploring today! All activities are safe and friendly.</span>
      </footer>
    </div>
  );
}
