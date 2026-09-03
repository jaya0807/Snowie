"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users, FileText, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col glass-panel !bg-gradient-to-b !from-white/15 !to-white/5 border-r border-white/10 m-3 rounded-lg z-10">
      <div className="p-5 flex items-center gap-3 border-b border-white/10">
        <div className="w-7 h-7 rounded-full bg-white text-black flex items-center justify-center font-bold text-xs">
          AI
        </div>
        <span className="font-semibold text-sm tracking-widest">OBSERVE</span>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/" ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>
        <Link 
          href="/sessions" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/sessions") ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium text-sm">Live Session</span>
        </Link>
        <Link 
          href="/profiles" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/profiles") ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium text-sm">Child Profiles</span>
        </Link>
        <Link 
          href="/reports" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/reports") ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Reports</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-white/10">
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/settings") ? "bg-white/10 text-white" : "hover:bg-white/5 text-zinc-400 hover:text-white"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
