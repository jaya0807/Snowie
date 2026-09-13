"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ShieldCheck, HelpCircle } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";

interface ParentLoginProps {
  onBack: () => void;
}

export function ParentLogin({ onBack }: ParentLoginProps) {
  const router = useRouter();
  const { loginParent } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [modalInfo, setModalInfo] = useState<{ title: string; content: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your email or Parent ID.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await loginParent({
        email: trimmedEmail,
        password,
      });

      if (res.success) {
        router.push("/parent-dashboard");
      } else {
        setErrorMessage(
          res.error ||
            "Oops! We couldn’t log you in. Please check your details and try again."
        );
      }
    } catch {
      setErrorMessage("Oops! We couldn’t log you in. Please check your details and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <LoginCard variant="parent" className="relative">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand transition-colors mb-6 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Choose different login</span>
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            Parent Login
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            Access your child’s observation logs, milestones & progress.
          </p>
        </div>

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
          <div>
            <label
              htmlFor="parent-email"
              className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5"
            >
              Email / Parent ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="parent-email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@example.com"
                className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                autoComplete="username"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="parent-password"
                className="block text-xs font-bold text-zinc-700 uppercase tracking-wider"
              >
                Password
              </label>
              <button
                type="button"
                onClick={() =>
                  setModalInfo({
                    title: "Password Recovery",
                    content:
                      "For this demonstration, you can log in with any valid password or use your registered parent credentials.",
                  })
                }
                className="text-xs text-brand hover:underline font-medium cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="parent-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                autoComplete="current-password"
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

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Login to Dashboard
          </Button>
        </form>

        {/* Demo Account & Create Account Links */}
        <div className="mt-6 pt-5 border-t border-zinc-100 text-center space-y-3">
          <button
            type="button"
            onClick={() => {
              setEmail("parent@example.com");
              setPassword("password");
            }}
            className="text-xs text-zinc-500 hover:text-brand font-medium inline-flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Fill Demo Credentials</span>
          </button>

          <div>
            <Link
              href="/signup"
              className="text-xs font-semibold text-brand hover:underline cursor-pointer"
            >
              Create Parent Account
            </Link>
          </div>
        </div>
      </LoginCard>

      {/* Friendly Informational Modal */}
      {modalInfo && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-black/5 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-zinc-900 mb-2">
              {modalInfo.title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {modalInfo.content}
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={() => setModalInfo(null)}
              className="w-full"
            >
              Got it!
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
