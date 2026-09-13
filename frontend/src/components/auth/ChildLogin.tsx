"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles, User, HelpCircle } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { AvatarSelector } from "./AvatarSelector";
import { PinPad } from "./PinPad";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";

interface ChildLoginProps {
  onBack: () => void;
}

export function ChildLogin({ onBack }: ChildLoginProps) {
  const router = useRouter();
  const { loginChild } = useAuth();

  const [avatar, setAvatar] = useState<string>("fox");
  const [childId, setChildId] = useState<string>("Aarav");
  const [pin, setPin] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!childId.trim()) {
      setErrorMessage("What is your name or Explorer ID? 🎈");
      return;
    }

    if (pin.length !== 4) {
      setErrorMessage("Enter your 4-digit secret PIN! 🌟");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginChild({
        childId: childId.trim(),
        pin,
        avatar,
      });

      if (res.success) {
        router.push("/child-home");
      } else {
        setErrorMessage(
          res.error || "Let's check your PIN and try again, Explorer! 🌟"
        );
      }
    } catch {
      setErrorMessage("Let's check your PIN and try again, Explorer! 🌟");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setAvatar("fox");
    setChildId("Aarav");
    setPin("1234");
    setErrorMessage(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 relative">
      {/* Playful Floating Cloud / Star Badges */}
      <div className="absolute -top-6 -left-4 text-3xl select-none animate-bounce duration-1000">
        ☁️
      </div>
      <div className="absolute -top-4 -right-2 text-2xl select-none animate-pulse">
        ⭐
      </div>

      <LoginCard variant="child" className="border-amber-300">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-800/80 hover:text-amber-950 transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose different login</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-amber-100 text-amber-800 mb-2 shadow-xs border border-amber-200">
            <Sparkles className="w-6 h-6 text-amber-600 animate-spin-slow" />
          </div>
          <h2 className="text-2xl font-black text-amber-950 tracking-tight flex items-center justify-center gap-1.5">
            <span>Hi, Explorer!</span>
            <span className="text-2xl">🌟</span>
          </h2>
          <p className="text-xs font-semibold text-amber-800/80 mt-1">
            Choose your friend and start your adventure!
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            isChildMode={true}
            onDismiss={() => setErrorMessage(null)}
            className="mb-4"
          />
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Choose Avatar */}
          <AvatarSelector selectedAvatar={avatar} onSelect={setAvatar} />

          {/* 2. Child Name / ID */}
          <div className="space-y-1.5">
            <label
              htmlFor="child-id-input"
              className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Child Name / Explorer ID</span>
              <span>🏷️</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-amber-600/70 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="child-id-input"
                type="text"
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                placeholder="e.g., Aarav or CH001"
                className="w-full pl-10 pr-4 py-3 bg-white/90 border-2 border-amber-200 rounded-2xl text-sm font-semibold text-amber-950 placeholder:text-amber-400 focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-200/50 transition-all outline-none"
              />
            </div>
          </div>

          {/* 3. 4-Digit PIN */}
          <PinPad pin={pin} onChange={setPin} maxLength={4} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="adventure"
            size="lg"
            isLoading={isLoading}
            disabled={pin.length !== 4}
            className="w-full text-base py-4 rounded-2xl cursor-pointer"
          >
            <span>🚀 Start My Adventure</span>
          </Button>
        </form>

        {/* Quick Demo Autofill helper */}
        <div className="mt-5 pt-4 border-t border-amber-200/60 text-center">
          <button
            type="button"
            onClick={handleFillDemo}
            className="text-xs text-amber-800 hover:text-amber-950 font-semibold inline-flex items-center gap-1.5 cursor-pointer bg-amber-100/60 hover:bg-amber-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Fill Demo (Aarav / PIN: 1234)</span>
          </button>
        </div>
      </LoginCard>
    </div>
  );
}
