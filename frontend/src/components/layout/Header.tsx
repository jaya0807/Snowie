import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border border-black/5 mb-4 rounded-lg mx-3 mt-3 z-10 relative shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      <div className="flex items-center bg-zinc-100 rounded-full px-3 py-1.5 border border-transparent w-80 transition-colors shadow-none">
        <Search className="w-3.5 h-3.5 text-brand mr-2" />
        <input 
          type="text" 
          placeholder="Search profiles..." 
          className="bg-transparent border-none outline-none text-xs w-full text-brand-dark placeholder:text-brand-muted"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-brand hover:text-brand-dark transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-danger-light rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-brand/20">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-brand">Dr. Sarah Chen</p>
            <p className="text-[10px] text-brand-muted">Lead Therapist</p>
          </div>
          <Avatar className="h-8 w-8 border-none">
            <AvatarImage src="" />
            <AvatarFallback className="bg-brand-surface-alt text-brand font-medium text-xs">SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
