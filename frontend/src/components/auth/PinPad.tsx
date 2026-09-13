"use client";

import React, { useState } from "react";
import { Delete, RotateCcw, Eye, EyeOff } from "lucide-react";

interface PinPadProps {
  pin: string;
  onChange: (pin: string) => void;
  maxLength?: number;
}

export function PinPad({ pin, onChange, maxLength = 4 }: PinPadProps) {
  const [showPin, setShowPin] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length < maxLength) {
      onChange(pin + digit);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      onChange(pin.slice(0, -1));
    }
  };

  const handleClear = () => {
    onChange("");
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
          <span>Enter 4-Digit Secret PIN</span>
          <span>🔒</span>
        </label>
        <button
          type="button"
          onClick={() => setShowPin(!showPin)}
          className="text-xs font-medium text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
        >
          {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{showPin ? "Hide" : "Peek"}</span>
        </button>
      </div>

      {/* PIN Indicator Bubbles */}
      <div className="flex items-center justify-center gap-4 py-2">
        {Array.from({ length: maxLength }).map((_, index) => {
          const isFilled = index < pin.length;
          const currentDigit = pin[index];
          return (
            <div
              key={index}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-lg transition-all duration-200 ${
                isFilled
                  ? "bg-amber-400 text-white shadow-md scale-105 border-2 border-amber-500"
                  : "bg-white/80 border-2 border-amber-200/80 text-transparent"
              }`}
            >
              {isFilled ? (showPin ? currentDigit : "⭐") : "○"}
            </div>
          );
        })}
      </div>

      {/* Numeric Keypad */}
      <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto pt-1">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => handleDigit(digit)}
            className="h-12 rounded-2xl bg-white hover:bg-amber-100/80 active:bg-amber-200 border border-amber-200/80 text-zinc-900 font-bold text-lg shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            aria-label={`Digit ${digit}`}
          >
            {digit}
          </button>
        ))}

        {/* Backspace Button */}
        <button
          type="button"
          onClick={handleBackspace}
          className="h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200/80 text-amber-900 font-medium text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Backspace"
          title="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>

        {/* 0 Button */}
        <button
          type="button"
          onClick={() => handleDigit("0")}
          className="h-12 rounded-2xl bg-white hover:bg-amber-100/80 active:bg-amber-200 border border-amber-200/80 text-zinc-900 font-bold text-lg shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Digit 0"
        >
          0
        </button>

        {/* Clear Button */}
        <button
          type="button"
          onClick={handleClear}
          className="h-12 rounded-2xl bg-amber-50 hover:bg-amber-100 active:bg-amber-200 border border-amber-200/80 text-amber-900 font-semibold text-xs shadow-sm hover:shadow active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          aria-label="Clear PIN"
          title="Clear"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
}
