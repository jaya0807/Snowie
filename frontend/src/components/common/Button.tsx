"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "adventure" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  className = "",
  disabled,
  children,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-200 select-none outline-none focus-visible:ring-4 focus-visible:ring-brand/20 disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variantStyles = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm",
    secondary:
      "bg-brand text-white hover:bg-brand-dark shadow-[0_4px_14px_rgba(23,107,156,0.25)] hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0",
    adventure:
      "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 text-white font-bold tracking-wide shadow-[0_6px_20px_rgba(245,158,11,0.35)] hover:shadow-[0_8px_25px_rgba(245,158,11,0.5)] hover:scale-[1.02] hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 border-b-4 border-orange-600/30",
    ghost:
      "bg-transparent text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 active:bg-zinc-200/80",
    outline:
      "bg-white border-2 border-zinc-200 text-zinc-800 hover:border-brand hover:text-brand shadow-sm hover:shadow",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}
