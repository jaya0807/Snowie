"use client";

import React from "react";

interface LoginCardProps {
  children: React.ReactNode;
  variant?: "parent" | "child" | "choice";
  className?: string;
}

export function LoginCard({
  children,
  variant = "choice",
  className = "",
}: LoginCardProps) {
  const variantStyles = {
    parent:
      "bg-white border border-black/5 rounded-3xl p-8 md:p-10 shadow-[0_12px_36px_rgba(23,107,156,0.08),0_4px_12px_rgba(23,107,156,0.04)]",
    child:
      "bg-gradient-to-b from-white to-amber-50/40 border-2 border-amber-200/80 rounded-3xl p-8 md:p-10 shadow-[0_16px_40px_rgba(245,158,11,0.12),0_4px_12px_rgba(245,158,11,0.06)] relative overflow-hidden",
    choice:
      "bg-white border border-black/5 rounded-3xl p-8 shadow-[0_10px_30px_rgba(23,107,156,0.06)] hover:shadow-[0_20px_45px_rgba(23,107,156,0.12)] transition-all duration-300 hover:-translate-y-1 group",
  };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
