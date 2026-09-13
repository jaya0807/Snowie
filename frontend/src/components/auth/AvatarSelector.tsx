"use client";

import React from "react";
import { Check } from "lucide-react";

export interface AvatarOption {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
}

export const AVATAR_OPTIONS: AvatarOption[] = [
  { id: "fox", name: "Milo Fox", emoji: "🦊", color: "text-amber-600", bgColor: "bg-amber-100" },
  { id: "bunny", name: "Pip Bunny", emoji: "🐰", color: "text-pink-600", bgColor: "bg-pink-100" },
  { id: "panda", name: "Bao Panda", emoji: "🐼", color: "text-emerald-700", bgColor: "bg-emerald-100" },
  { id: "bear", name: "Barnaby Bear", emoji: "🐻", color: "text-amber-800", bgColor: "bg-amber-100" },
  { id: "cat", name: "Luna Cat", emoji: "🐱", color: "text-purple-600", bgColor: "bg-purple-100" },
  { id: "lion", name: "Leo Lion", emoji: "🦁", color: "text-orange-600", bgColor: "bg-orange-100" },
];

interface AvatarSelectorProps {
  selectedAvatar: string;
  onSelect: (avatarId: string) => void;
}

export function AvatarSelector({
  selectedAvatar,
  onSelect,
}: AvatarSelectorProps) {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>Choose Your Character</span>
          <span>✨</span>
        </label>
        <span className="text-[11px] font-medium text-amber-800/80">
          Pick your friend!
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
        {AVATAR_OPTIONS.map((avatar) => {
          const isSelected = selectedAvatar === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              onClick={() => onSelect(avatar.id)}
              aria-label={`Select ${avatar.name}`}
              className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl transition-all duration-200 cursor-pointer outline-none ${
                isSelected
                  ? "bg-amber-200/90 border-2 border-amber-500 shadow-md scale-105 -translate-y-0.5"
                  : "bg-white/80 hover:bg-white border-2 border-amber-100 hover:border-amber-300 hover:scale-102"
              }`}
            >
              {/* Selected Checkmark Badge */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Avatar Emoji */}
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${avatar.bgColor} transition-transform ${
                  isSelected ? "scale-110" : ""
                }`}
              >
                <span role="img" aria-label={avatar.name}>
                  {avatar.emoji}
                </span>
              </div>

              {/* Avatar Short Name */}
              <span
                className={`text-[10px] font-bold mt-1.5 truncate max-w-full ${
                  isSelected ? "text-amber-950 font-black" : "text-zinc-600"
                }`}
              >
                {avatar.name.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
