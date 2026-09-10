"use client";

import React from "react";

interface Option {
  emoji: string;
  label: string;
}

interface ResponseOptionsProps {
  options: Option[];
  selectedValue: string;
  onSelect: (val: string) => void;
  disabled: boolean;
}

export default function ResponseOptions({ options, selectedValue, onSelect, disabled }: ResponseOptionsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-4 mt-2">
      {options.map(opt => {
        const isSelected = selectedValue === opt.label;
        const opacity = disabled && !isSelected ? "opacity-40 scale-95" : "opacity-100";
        const borderBg = isSelected 
          ? "border-[#176B9C] bg-sky-100 scale-105 shadow-md" 
          : "border-transparent bg-slate-50 hover:bg-sky-50 shadow-sm";

        return (
          <button
            key={opt.label}
            onClick={() => !disabled && onSelect(opt.label)}
            disabled={disabled}
            className={`flex items-center gap-3 px-5 py-3 rounded-full border-2 transition-all duration-300 transform ${opacity} ${borderBg} ${!disabled && 'hover:-translate-y-1 active:translate-y-1'}`}
          >
            <span className="text-3xl">{opt.emoji}</span>
            <span className="font-bold text-slate-700 text-sm md:text-base">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
