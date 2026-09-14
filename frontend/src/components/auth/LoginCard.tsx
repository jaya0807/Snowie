"use client";

import React from "react";

interface LoginCardProps {
  children: React.ReactNode;
  variant?: "parent";
  className?: string;
}

export function LoginCard({
  children,
  variant = "parent",
  className = "",
}: LoginCardProps) {
  const variantStyles = {
    parent:
      "bg-white border border-black/5 rounded-3xl p-8 md:p-10 shadow-[0_12px_36px_rgba(23,107,156,0.08),0_4px_12px_rgba(23,107,156,0.04)]",
    };

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
