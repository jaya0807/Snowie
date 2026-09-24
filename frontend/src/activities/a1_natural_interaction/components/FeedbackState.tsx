/* eslint-disable */
"use client";

import React from "react";
import ContinueButton from "./ContinueButton";

interface FeedbackStateProps {
  message: string;
  onContinue: () => void;
  continueLabel?: string;
}

export default function FeedbackState({ message, onContinue, continueLabel }: FeedbackStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center mt-4 animate-[fadeIn_0.5s_ease-out]">
      <div className="bg-green-50 text-green-800 font-bold px-6 py-4 rounded-3xl border-2 border-green-200 shadow-sm text-lg md:text-xl text-center mb-6 whitespace-pre-line leading-relaxed max-w-[95%]">
        {message}
      </div>
      <ContinueButton onClick={onContinue} label={continueLabel} />
    </div>
  );
}
