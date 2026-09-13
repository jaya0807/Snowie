"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function ContinueButton({ onClick, label = "Continue", icon = <ArrowRight className="w-6 h-6" />, disabled = false }: ContinueButtonProps) {
  return (
    <button 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`mt-6 font-black text-xl px-10 py-4 rounded-full transition-all duration-300 transform flex items-center justify-center gap-3 w-full max-w-[240px] mx-auto animate-[slideUp_0.3s_ease-out] ${disabled ? 'bg-zinc-300 text-zinc-500 cursor-not-allowed opacity-70' : 'bg-[#FF7A00] hover:bg-[#FF8C20] text-white shadow-[0_6px_0_#CC6200,0_15px_30px_rgba(255,122,0,0.3)] hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_#CC6200]'}`}
    >
      {label} {icon}
    </button>
  );
}
