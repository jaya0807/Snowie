"use client";

import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function Header() {
  const router = useRouter();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border border-black/5 mb-4 rounded-lg mx-3 mt-3 z-10 relative shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-zinc-900 leading-none">Neura</span>
          <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider mt-1">Parent Dashboard</span>
        </div>
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => router.push("/child")} className="mr-2 text-xs font-bold uppercase tracking-wider bg-brand text-white px-4 py-2 rounded-md hover:bg-brand-dark transition-colors shadow-sm">
          Enter Child Mode
        </button>        
        <button className="relative text-zinc-900 hover:text-brand transition-colors">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-black/5">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-zinc-900">Parent</p>
          </div>
          <Avatar className="h-8 w-8 border-none bg-brand/10">
            <AvatarFallback className="text-brand font-medium text-xs">P</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
