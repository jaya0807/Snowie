"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  isChildMode?: boolean;
}

export function LoadingState({
  message = "Loading...",
  isChildMode = false,
}: LoadingStateProps) {
  if (isChildMode) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 text-center">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-amber-300 rounded-full blur-lg opacity-40 animate-pulse"></div>
          <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-amber-400 to-orange-400 flex items-center justify-center shadow-lg animate-bounce">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
        </div>
        <p className="text-base font-bold text-amber-900 animate-pulse">
          {message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3 text-center">
      <Loader2 className="w-8 h-8 animate-spin text-brand" />
      <p className="text-sm font-medium text-zinc-600">{message}</p>
    </div>
  );
}
