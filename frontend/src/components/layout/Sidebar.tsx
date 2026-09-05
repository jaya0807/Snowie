"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users, FileText, Settings } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-[#E9EEF0] border-r border-[#E9EEF0] m-3 rounded-lg z-10 shadow-sm">
      <div className="p-5 flex items-center gap-3 border-b border-[#176B9C]/10">
        <div className="w-7 h-7 rounded-full bg-white text-[#176B9C] flex items-center justify-center font-bold text-xs shadow-sm">
          AI
        </div>
        <span className="font-semibold text-sm tracking-widest text-[#173B50]">OBSERVE</span>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        <Link 
          href="/" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/" ? "bg-white text-[#176B9C] shadow-sm" : "text-[#668294] hover:text-[#176B9C] hover:bg-white/50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>
        <Link 
          href="/sessions" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/sessions") ? "bg-white text-[#176B9C] shadow-sm" : "text-[#668294] hover:text-[#176B9C] hover:bg-white/50"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium text-sm">Live Session</span>
        </Link>
        <Link 
          href="/profiles" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/profiles") ? "bg-white text-[#176B9C] shadow-sm" : "text-[#668294] hover:text-[#176B9C] hover:bg-white/50"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium text-sm">Child Profiles</span>
        </Link>
        <Link 
          href="/reports" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/reports") ? "bg-white text-[#176B9C] shadow-sm" : "text-[#668294] hover:text-[#176B9C] hover:bg-white/50"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Reports</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-[#176B9C]/10">
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/settings") ? "bg-white text-[#176B9C] shadow-sm" : "text-[#668294] hover:text-[#176B9C] hover:bg-white/50"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
