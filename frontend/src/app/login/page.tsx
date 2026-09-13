"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Mail, User as UserIcon, Lock, Eye, EyeOff } from "lucide-react";
import { LoginCard } from "@/components/auth/LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { loginParent } = useAuth(); // We'll keep using this context for now

  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !childName.trim() || !password) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setIsLoading(true);

    try {
      // Assuming loginParent can handle this, or we just simulate for now
      const res = await loginParent({
        email: email.trim(),
        password,
      });

      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(
          res.error || "Oops! We couldn’t log you in. Please check your details and try again."
        );
      }
    } catch {
      setErrorMessage("Oops! We couldn’t log you in. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-marketing-bg via-[#EEF4F9] to-brand-blue-light font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-brand/20">
      {/* Decorative Gentle Floating Clouds & Accents */}
      <div className="absolute top-12 left-10 w-48 h-48 bg-brand-blue-light/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-16 right-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      {/* Top Navigation Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 group transition-transform hover:-translate-x-0.5 cursor-pointer"
        >
          {/* Logo SVG matching LandingNavbar */}
          <div className="text-brand-accent">
            <svg
              width="36"
              height="36"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20 35C20 35 7.5 25.8 7.5 15.6C7.5 11.734 10.634 8.6 14.5 8.6C16.634 8.6 18.634 9.5 20 11.2C21.366 9.5 23.366 8.6 25.5 8.6C29.366 8.6 32.5 11.734 32.5 15.6C32.5 25.8 20 35 20 35Z"
                fill="currentColor"
                opacity="0.85"
              />
              <circle cx="14" cy="16" r="2" fill="white" />
              <circle cx="26" cy="16" r="2" fill="white" />
              <path
                d="M16 23C16 23 18 25 20 25C22 25 24 23 24 23"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle cx="20" cy="5" r="2.5" fill="#FFD76A" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-sm text-zinc-900 tracking-tight block leading-tight">
              AI Child
            </span>
            <span className="font-bold text-xs text-brand-accent tracking-wider block">
              OBSERVE
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 hover:bg-white border border-black/5 shadow-xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 w-full relative z-10">
        {/* Header Title Section */}
        <div className="text-center max-w-xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 border border-brand/10 text-zinc-700 text-xs font-medium mb-3 shadow-2xs backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI-Assisted Child Observation & Development</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-marketing-dark tracking-tight leading-tight">
            Welcome Back! 💛
          </h1>

          <p className="text-zinc-600 text-sm md:text-base mt-2">
            Log in to continue your child's observation journey.
          </p>
        </div>

        {/* Dynamic Form View */}
        <div className="w-full max-w-md mx-auto transition-all duration-300 animate-in fade-in zoom-in-95">
          <LoginCard variant="parent" className="relative">
            {/* Error Notification */}
            {errorMessage && (
              <ErrorMessage
                message={errorMessage}
                onDismiss={() => setErrorMessage(null)}
                className="mb-5"
              />
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Parent Email Address */}
              <div>
                <label
                  htmlFor="parent-email"
                  className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5"
                >
                  Parent Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="parent-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Child Name */}
              <div>
                <label
                  htmlFor="child-name"
                  className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5"
                >
                  Child Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="child-name"
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Enter your child's name"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="parent-password"
                    className="block text-xs font-bold text-zinc-700 uppercase tracking-wider"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="parent-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer p-1"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password */}
              <div className="flex justify-end mt-1 mb-2">
                <button
                  type="button"
                  className="text-xs text-brand hover:underline font-medium cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-2"
              >
                Login
              </Button>
            </form>

            {/* Signup Link */}
            <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
              <span className="text-xs text-zinc-500 mr-1.5">
                Don't have an account yet?
              </span>
              <Link
                href="/signup"
                className="text-xs font-semibold text-brand hover:underline cursor-pointer"
              >
                Sign Up
              </Link>
            </div>
          </LoginCard>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-500 relative z-20">
        <p className="flex items-center justify-center gap-1">
          <span>AI Child Observe • Supporting every child’s unique journey</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
        </p>
      </footer>
    </div>
  );
}
