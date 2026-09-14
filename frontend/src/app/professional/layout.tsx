import React from "react";
import Link from "next/link";
import { Users, FileText, Settings, LogOut, Stethoscope } from "lucide-react";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative font-sans">
      
      {/* Professional Sidebar */}
      <aside className="w-64 flex-shrink-0 hidden md:flex flex-col bg-white border-r border-black/5 m-3 rounded-2xl shadow-sm z-10">
        <div className="p-6 flex items-center gap-3 border-b border-black/5">
          <div className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center shadow-sm">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 block leading-none">Snowie Pro</span>
            <span className="text-[10px] uppercase font-bold text-brand tracking-widest">Clinician Portal</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link href="/professional" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-brand/10 text-brand font-semibold transition-colors">
            <Users className="w-4 h-4" />
            <span className="text-sm">My Patients</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-black/5 transition-colors">
            <FileText className="w-4 h-4" />
            <span className="text-sm font-medium">All Reports</span>
          </Link>
          <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-zinc-900 hover:bg-black/5 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm font-medium">Settings</span>
          </Link>
        </nav>
        
        <div className="p-4 border-t border-black/5">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-500 hover:text-danger hover:bg-danger-bg transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </Link>
        </div>
      </aside>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <header className="h-16 px-8 flex items-center justify-between border-b border-black/5 bg-white/50 backdrop-blur-sm m-3 mb-0 rounded-2xl shadow-sm">
          <h2 className="font-bold text-zinc-800">Welcome, Dr. Sarah Jenkins</h2>
          <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-sm">
            SJ
          </div>
        </header>
        <main className="flex-1 overflow-auto p-3">
          {children}
        </main>
      </div>
    </div>
  );
}
