import React from "react";
import Link from "next/link";
import { Users, FileText, Settings, LogOut, Stethoscope } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      
      {/* Professional Sidebar */}
      <aside className="w-56 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-black/5 m-3 rounded-lg z-10 shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
        <div className="p-6 flex flex-col justify-center border-b border-black/5">
          <Logo iconSize={32} textSize="text-lg" suffix="Pro" />
          <div className="pl-10">
            <span className="text-[10px] uppercase font-bold text-brand tracking-widest leading-none">Clinician Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/professional" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-brand/10 text-brand font-semibold transition-colors">
            <Users className="w-4 h-4" />
            <span className="text-sm">My Patients</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-black/5 transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">All Reports</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-black/5 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-black/5">
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-danger hover:bg-danger-bg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 flex items-center justify-between px-6 bg-white border border-black/5 mb-4 rounded-lg mx-3 mt-3 z-10 relative shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
          <h2 className="font-bold text-zinc-800">Welcome, Dr. Sarah Jenkins</h2>
          <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-sm">
            SJ
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
