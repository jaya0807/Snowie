import Image from "next/image";
import Link from "next/link";
import { ScanFace, TrendingUp, ShieldCheck, FileText } from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { HeroMotionGraphic } from "@/components/marketing/HeroMotionGraphic";
import { BentoGrid } from "@/components/marketing/BentoGrid";
import { Footer } from "@/components/layout/Footer";

export default function LandingPage() {
  return (
    <div className="w-full bg-background font-sans overflow-x-hidden">
      <div className="min-h-screen flex flex-col">
        <LandingNavbar />
        
        <main className="flex-1 max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-center w-full relative z-10">
        
        {/* Left Side: Text and CTA */}
        <div className="w-full md:w-[55%] lg:w-[60%] md:pr-8 lg:pr-12 space-y-8 z-20">
          <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold text-zinc-900 leading-[1.1] tracking-tight">
            Smarter <span className="text-brand">Observations</span><br />
            <span className="text-zinc-600">Better</span> Outcomes
          </h2>
          
          <p className="text-zinc-500 text-lg max-w-lg leading-relaxed">
            AI-powered observations to help professionals understand, track and support every child's development
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/login?tab=signup" 
              className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm"
            >
              Start Observation
            </Link>
            
            <Link 
              href="/professional" 
              className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-900 px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm"
            >
              Doctor Login
            </Link>
          </div>
        </div>

        {/* Right Side: Animated Graphic */}
        <div className="w-full md:w-[45%] lg:w-[40%] mt-16 md:mt-0 z-10">
          <HeroMotionGraphic />
        </div>
        </main>
      </div>

      <BentoGrid />
      <Footer />
    </div>
  );
}
