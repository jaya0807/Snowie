"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Users, FileText, Settings, ClipboardList, Target, Sprout, TrendingUp } from "lucide-react";

function NavItem({ href, icon: Icon, label }: { href: string, icon: any, label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        isActive ? "bg-brand/10 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-brand/5"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="font-medium text-sm">{label}</span>
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-black/5 m-3 rounded-lg z-10 shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      <div className="p-5 flex items-center gap-3 border-b border-black/5">
        <div className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center font-bold text-xs shadow-sm">
          AI
        </div>
        <span className="font-semibold text-sm tracking-widest text-zinc-900">OBSERVE</span>
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        
        <div className="space-y-1.5">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 mb-2 uppercase">Observe</h3>
          <div className="space-y-1.5">
            <NavItem href="/sessions" icon={Activity} label="Live Session" />
            <NavItem href="/activities" icon={ClipboardList} label="Activities" />
          </div>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 mb-2 uppercase">Grow</h3>
          <div className="space-y-1.5">
            <NavItem href="/goals" icon={Target} label="Clinical Goals" />
            <NavItem href="/grow" icon={Sprout} label="Care Plan" />
          </div>
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 mb-2 uppercase">Track</h3>
          <div className="space-y-1.5">
            <NavItem href="/track" icon={TrendingUp} label="Progress Trends" />
            <NavItem href="/reports" icon={FileText} label="AI Reports" />
          </div>
        </div>

      </nav>

      <div className="p-3 border-t border-brand/10">
        <NavItem href="/settings" icon={Settings} label="Settings" />
      </div>
    </aside>
  );
}
