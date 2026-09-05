"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users, FileText, Settings, ClipboardList } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-black/5 m-3 rounded-lg z-10 shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      <div className="p-5 flex items-center gap-3 border-b border-black/5">
        <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shadow-sm">
          AI
        </div>
        <span className="font-semibold text-sm tracking-widest text-brand-dark">OBSERVE</span>
      </div>

      <nav className="flex-1 p-3 space-y-1.5">
        <Link 
          href="/dashboard" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname === "/dashboard" ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="font-medium text-sm">Dashboard</span>
        </Link>
        <Link 
          href="/sessions" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/sessions") ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <Activity className="w-4 h-4" />
          <span className="font-medium text-sm">Live Session</span>
        </Link>
        <Link 
          href="/profiles" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/profiles") ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <Users className="w-4 h-4" />
          <span className="font-medium text-sm">Child Profiles</span>
        </Link>
        <Link 
          href="/activities" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/activities") ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span className="font-medium text-sm">Activities</span>
        </Link>
        <Link 
          href="/reports" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/reports") ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span className="font-medium text-sm">Reports</span>
        </Link>
      </nav>

      <div className="p-3 border-t border-brand/10">
        <Link 
          href="/settings" 
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
            pathname?.startsWith("/settings") ? "bg-brand/10 text-brand" : "text-brand-muted hover:text-brand hover:bg-brand/5"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
