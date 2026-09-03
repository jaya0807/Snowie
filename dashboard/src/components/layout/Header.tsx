import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 glass !bg-gradient-to-b !from-white/15 !to-white/5 mb-4 rounded-lg mx-3 mt-3 z-10 relative">
      <div className="flex items-center bg-black/40 rounded-full px-3 py-1.5 border border-white/10 w-80 focus-within:border-white/30 transition-colors">
        <Search className="w-3.5 h-3.5 text-zinc-400 mr-2" />
        <input 
          type="text" 
          placeholder="Search profiles..." 
          className="bg-transparent border-none outline-none text-xs w-full text-zinc-200 placeholder:text-zinc-500"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-white/10">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-white">Dr. Sarah Chen</p>
            <p className="text-[10px] text-zinc-400">Lead Therapist</p>
          </div>
          <Avatar className="h-8 w-8 border border-white/20">
            <AvatarImage src="" />
            <AvatarFallback className="bg-zinc-800 text-white font-medium text-xs">SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
