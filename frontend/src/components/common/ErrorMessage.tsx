"use client";

import React from "react";
import { AlertCircle, Sparkles } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  isChildMode?: boolean;
  className?: string;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  isChildMode = false,
  className = "",
  onDismiss,
}: ErrorMessageProps) {
  if (!message) return null;

  if (isChildMode) {
    return (
      <div
        role="alert"
        className={`bg-amber-50 border-2 border-amber-300/80 rounded-2xl p-4 flex items-center gap-3 text-amber-900 shadow-sm animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
      >
        <div className="w-8 h-8 rounded-full bg-amber-200 text-amber-800 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-4 h-4" />
        </div>
        <p className="text-sm font-medium flex-1">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-amber-700 hover:text-amber-900 text-xs font-bold px-2 py-1"
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      role="alert"
      className={`bg-rose-50 border border-rose-200/80 rounded-xl p-3.5 flex items-start gap-3 text-rose-800 text-sm shadow-sm animate-in fade-in slide-in-from-top-1 duration-200 ${className}`}
    >
      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-medium leading-relaxed">{message}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-rose-400 hover:text-rose-600 text-sm font-semibold ml-2"
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}
