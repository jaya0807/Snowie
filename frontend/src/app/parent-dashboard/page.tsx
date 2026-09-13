"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  Users,
  Activity,
  ClipboardList,
  Target,
  FileText,
  TrendingUp,
  LogOut,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/common/Button";

export default function ParentDashboardPage() {
  const { user, role, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (role === "child") {
        router.push("/child-home");
      }
    }
  }, [user, role, isLoading, router]);

  if (isLoading || !user || role !== "parent") {
    return (
      <div className="min-h-screen bg-[#EEF4F9] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-sm font-semibold text-zinc-600">
            Opening Parent Portal...
          </p>
        </div>
      </div>
    );
  }

  const parentUser = user as any;

  return (
    <div className="min-h-screen bg-[#EEF4F9] font-sans flex flex-col">
      {/* Top Navigation Header */}
      <header className="bg-white border-b border-black/5 px-6 py-4 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-brand text-white flex items-center justify-center font-bold text-xs shadow-xs">
                AI
              </div>
              <div>
                <span className="font-extrabold text-sm text-zinc-900 block leading-tight">
                  Snowie
                </span>
                <span className="text-[10px] font-bold text-brand uppercase tracking-wider block">
                  Parent Portal
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-brand-light border border-brand/10 text-xs text-zinc-700">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-medium">{parentUser.email}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={logout}
              className="rounded-full flex items-center gap-1.5 text-xs text-zinc-600 hover:text-rose-600 hover:border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-brand to-brand-dark rounded-3xl p-6 md:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Observation & Development Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Welcome, {parentUser.name || "Caregiver"} 👋
            </h1>
            <p className="text-blue-100 text-xs md:text-sm leading-relaxed">
              Track developmental progress, review recorded observation sessions, and discover evidence-based activities tailored for your child.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            <Link
              href="/sessions"
              className="px-5 py-3 rounded-2xl bg-white text-brand font-bold text-xs md:text-sm hover:bg-blue-50 transition-all shadow-md flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Live Observation</span>
            </Link>
            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs md:text-sm transition-all border border-white/20 flex items-center gap-2"
            >
              <span>Full Analytics</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Decorative background circle */}
          <div className="absolute right-0 -bottom-12 w-64 h-64 bg-white/5 rounded-full pointer-events-none"></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Observed Child
            </span>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl font-black text-zinc-900">Aarav M.</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-brand">
                Age 6
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Status: Active Plan</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Total Sessions
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900">14</span>
              <span className="text-xs font-bold text-emerald-600">+3 this week</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Last: Today, 10:42 AM</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Avg Focus Time
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900">78%</span>
              <span className="text-xs font-bold text-emerald-600">+5%</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">Optimal engagement</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">
              Goal Progress
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-900">60%</span>
              <span className="text-xs font-bold text-amber-600">On track</span>
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">2-Step Instructions</p>
          </div>
        </div>

        {/* Quick Navigation Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-zinc-900 tracking-tight">
            Explore Observations & Clinical Modules
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/sessions"
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-brand transition-colors">
                Live Sessions
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Connect real-time observation pipeline & stream events.
              </p>
            </Link>

            <Link
              href="/activities"
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-purple-600 transition-colors">
                Activities Library
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Browse the 6 interactive observation adventures.
              </p>
            </Link>

            <Link
              href="/goals"
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-amber-600 transition-colors">
                Development Goals
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Review milestone targets and adaptive difficulty.
              </p>
            </Link>

            <Link
              href="/reports"
              className="bg-white rounded-2xl p-5 border border-black/5 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all group block"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-zinc-900 text-sm mb-1 group-hover:text-emerald-600 transition-colors">
                Summary Reports
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Evidence-based session reports formatted for reviewers.
              </p>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
