import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-[#F5F8FC] border border-[#F5F8FC] mb-4 rounded-lg mx-3 mt-3 z-10 relative shadow-sm">
      <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-transparent w-80 transition-colors shadow-sm">
        <Search className="w-3.5 h-3.5 text-[#176B9C] mr-2" />
        <input 
          type="text" 
          placeholder="Search profiles..." 
          className="bg-transparent border-none outline-none text-xs w-full text-[#173B50] placeholder:text-[#668294]"
        />
      </div>

      <div className="flex items-center gap-5">
        <button className="relative text-[#176B9C] hover:text-[#173B50] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-[#FF9BAA] rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-[#176B9C]/20">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-[#176B9C]">Dr. Sarah Chen</p>
            <p className="text-[10px] text-[#668294]">Lead Therapist</p>
          </div>
          <Avatar className="h-8 w-8 border-none">
            <AvatarImage src="" />
            <AvatarFallback className="bg-[#E7F5FB] text-[#176B9C] font-medium text-xs">SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
