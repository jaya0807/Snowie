"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface ContinueButtonProps {
  onClick: () => void;
  label?: string;
  icon?: React.ReactNode;
}

export default function ContinueButton({ onClick, label = "Continue", icon = <ArrowRight className="w-6 h-6" /> }: ContinueButtonProps) {
  return (
    <button 
      onClick={onClick}
      className="mt-6 bg-[#FF7A00] hover:bg-[#FF8C20] text-white font-black text-xl px-10 py-4 rounded-full shadow-[0_6px_0_#CC6200,0_15px_30px_rgba(255,122,0,0.3)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_#CC6200] flex items-center justify-center gap-3 w-full max-w-[240px] mx-auto animate-[slideUp_0.3s_ease-out]"
    >
      {label} {icon}
    </button>
  );
}
