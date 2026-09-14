"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, Mail, User as UserIcon, Lock, Eye, EyeOff } from "lucide-react";
import { LoginCard } from "@/components/auth/LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useAuth } from "@/context/AuthContext";
import { SignupForm } from "@/components/auth/SignupForm";

function AuthContent() {
  const router = useRouter();
  const { loginParent } = useAuth();
  
  const searchParams = useSearchParams();
  const [isLogin, setIsLogin] = useState(searchParams.get('tab') !== 'signup');

  useEffect(() => {
    setIsLogin(searchParams.get('tab') !== 'signup');
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [childName, setChildName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage("Please fill out all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginParent({ email, password, childName });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Login failed. Please try again.");
      }
    } catch (err) {
      setErrorMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-marketing-bg via-[#EEF4F9] to-brand-blue-light font-sans flex flex-col justify-between relative overflow-x-hidden selection:bg-brand/20">
      <div className="absolute top-12 left-10 w-48 h-48 bg-brand-blue-light/50 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-16 right-10 w-64 h-64 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-20">
        <Link href="/" className="inline-flex items-center gap-2 group transition-transform hover:-translate-x-0.5 cursor-pointer">
          <div className="text-brand-accent">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 0C8.954 0 0 8.954 0 20C0 31.046 8.954 40 20 40C31.046 40 40 31.046 40 20C40 8.954 31.046 0 20 0Z" fill="currentColor" opacity="0.1" />
              <path d="M20 4C11.163 4 4 11.163 4 20C4 28.837 11.163 36 20 36C28.837 36 36 28.837 36 20C36 11.163 28.837 4 20 4Z" fill="currentColor" opacity="0.85" />
              <circle cx="14" cy="16" r="2" fill="white" />
              <circle cx="26" cy="16" r="2" fill="white" />
              <path d="M16 23C16 23 18 25 20 25C22 25 24 23 24 23" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <circle cx="20" cy="5" r="2.5" fill="#FFD76A" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-sm text-zinc-900 tracking-tight block leading-tight">Snowie</span>
          </div>
        </Link>
        <Link href="/" className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/70 hover:bg-white border border-black/5 shadow-xs transition-all cursor-pointer">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-8 px-4 w-full relative z-10">
        <div className="text-center max-w-xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-marketing-dark tracking-tight leading-tight">
            {isLogin ? "Welcome Back!" : "Start Your Free Journey"}
          </h1>
          <p className="text-zinc-600 text-sm md:text-base mt-2">
            {isLogin ? "Log in to continue your child's observation journey." : "Create an account to track milestones, log observations, and build personalized activities."}
          </p>
        </div>

        <div className={`w-full mx-auto transition-all duration-300 animate-in fade-in zoom-in-95 ${isLogin ? "max-w-md" : "max-w-5xl"}`}>
          {isLogin ? (
            <LoginCard variant="parent" className="relative">
              {errorMessage && <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="mb-5" />}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email address" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none" required />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Child Name (Optional)</label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Enter your child's name" className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 outline-none" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" variant="secondary" size="lg" isLoading={isLoading} className="w-full mt-2">Login</Button>
              </form>
              <div className="mt-6 pt-5 border-t border-zinc-100 text-center">
                <span className="text-xs text-zinc-500 mr-1.5">Don't have an account yet?</span>
                <button onClick={() => setIsLogin(false)} className="text-xs font-semibold text-brand hover:underline cursor-pointer">Sign Up</button>
              </div>
            </LoginCard>
          ) : (
            <div>
              <SignupForm />
              <div className="mt-8 text-center pb-4">
                <span className="text-sm text-zinc-500 mr-2 font-medium">Already have an account?</span>
                <button onClick={() => setIsLogin(true)} className="text-sm font-bold text-[#176B9C] hover:text-[#135A84] hover:underline transition-colors cursor-pointer">Log In</button>
              </div>
              
            </div>
          )}
        </div>
      </main>
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-zinc-500 relative z-20">
        <p className="flex items-center justify-center gap-1">
          <span>Snowie • Supporting every child’s unique journey</span>
          <Heart className="w-3 h-3 text-rose-400 fill-rose-400 inline" />
        </p>
      </footer>
    </div>
  );
}


export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <AuthContent />
    </Suspense>
  );
}
