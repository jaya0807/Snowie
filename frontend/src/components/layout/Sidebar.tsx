"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Camera, Activity, LayoutDashboard, Users, FileText, Settings, ClipboardList, Target, Sprout, TrendingUp, LogOut } from "lucide-react";

function NavItem({ href, icon: Icon, label, isLive = false }: { href: string, icon: any, label: string, isLive?: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname?.startsWith(`${href}/`);
  return (
    <Link 
      href={href} 
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
        isActive ? "bg-brand/10 text-zinc-900" : "text-zinc-500 hover:text-zinc-900 hover:bg-brand/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        <span className="font-medium text-sm">{label}</span>
      </div>
      {isLive && (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [isLive, setIsLive] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    const checkLive = () => {
      const hb = localStorage.getItem("childLiveHeartbeat");
      if (hb) {
        setIsLive(Date.now() - parseInt(hb) < 5000);
      } else {
        setIsLive(false);
      }
    };
    
    checkLive();
    const interval = setInterval(checkLive, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-black/5 m-3 rounded-lg z-10 shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      <div className="p-5 flex items-center border-b border-black/5">
        <Logo iconSize={24} textSize="text-xl" />
      </div>

      <nav className="flex-1 p-3 space-y-6 overflow-y-auto">
        
        <div className="space-y-1.5">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Overview" />
        </div>

        <div>
          <h3 className="px-3 text-[10px] font-bold tracking-widest text-zinc-400 mb-2 uppercase">Observe</h3>
          <div className="space-y-1.5">
            <NavItem href="/parents-monitor" icon={Activity} label="Parents Monitor" isLive={isLive} />
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

      <div className="p-3 border-t border-brand/10 space-y-1">
        <NavItem href="/settings" icon={Settings} label="Settings" />
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-zinc-500 hover:text-rose-600 hover:bg-rose-50"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium text-sm">Log out</span>
        </button>
      </div>
    </aside>
  );
}
