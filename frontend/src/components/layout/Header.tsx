"use client";

import { Bell, ChevronDown, Stethoscope, UserX } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isGlobalView = pathname === "/dashboard" || pathname === "/profiles" || pathname === "/settings";
  const hasActivePatient = searchParams.get("patient") !== "none";

  const togglePatient = () => {
    if (hasActivePatient) {
      router.push(`${pathname}?patient=none`);
    } else {
      router.push(pathname);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white border border-black/5 mb-4 rounded-lg mx-3 mt-3 z-10 relative shadow-[0_4px_14px_0_rgba(23,107,156,0.12),0_2px_4px_0_rgba(23,107,156,0.06)]">
      
      <div className="flex items-center gap-4">
        {isGlobalView ? (
          <div className="flex items-center gap-3 bg-zinc-50 border border-black/5 px-3 py-1.5 rounded-lg shadow-sm">
            <div className="w-7 h-7 rounded-full bg-zinc-200 text-zinc-500 flex items-center justify-center font-bold text-[10px]">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-400 font-bold uppercase tracking-wider leading-none mb-1">View Mode</span>
              <span className="text-sm font-bold text-zinc-700 leading-none">Global Clinic</span>
            </div>
          </div>
        ) : (
          <div 
            onClick={togglePatient}
            className={`flex items-center gap-3 border px-3 py-1.5 rounded-lg cursor-pointer transition-colors shadow-sm ${
              hasActivePatient 
                ? "bg-brand-surface border-brand/10 hover:bg-brand/5" 
                : "bg-warning-bg border-warning/20 hover:bg-warning/10"
            }`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${
              hasActivePatient ? "bg-brand text-white" : "bg-warning-dark text-white"
            }`}>
              {hasActivePatient ? "L" : <UserX className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none mb-1">
                {hasActivePatient ? "Active Patient" : "No Patient"}
              </span>
              <span className={`text-sm font-bold leading-none ${hasActivePatient ? "text-zinc-900" : "text-warning-dark"}`}>
                {hasActivePatient ? "Leo D." : "Select Child"}
              </span>
            </div>
            <ChevronDown className={`w-3 h-3 ml-4 ${hasActivePatient ? "text-zinc-400" : "text-warning-dark"}`} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-5">
        <button onClick={() => router.push("/child")} className="mr-2 text-xs font-bold uppercase tracking-wider bg-brand/10 text-brand px-3 py-1.5 rounded-md hover:bg-brand hover:text-white transition-colors">
          Child Mode
        </button>        <button className="relative text-zinc-900 hover:text-brand transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-danger-light rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-5 border-l border-brand/20">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium text-zinc-900">Dr. Sarah Chen</p>
            <p className="text-[10px] text-zinc-500">Lead Therapist</p>
          </div>
          <Avatar className="h-8 w-8 border-none">
            <AvatarImage src="" />
            <AvatarFallback className="bg-brand-surface-alt text-zinc-900 font-medium text-xs">SC</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
