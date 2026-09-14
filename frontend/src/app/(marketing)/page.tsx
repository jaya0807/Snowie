import Image from "next/image";
import Link from "next/link";
import { Rocket, Users, ScanFace, TrendingUp, ShieldCheck, FileText } from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] font-sans overflow-x-hidden flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center w-full relative z-10">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 md:pr-12 lg:pr-24 space-y-8 z-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-zinc-900 leading-tight tracking-tight">
            Understanding <br />
            <span className="text-[#176B9C]">Today,</span> <br />
            <span className="text-zinc-600">Supporting</span> <br />
            a Better Tomorrow
          </h2>
          
          <p className="text-zinc-500 text-lg max-w-md leading-relaxed">
            AI-powered observations that help professionals understand, track and support every child's unique journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 bg-[#176B9C] hover:bg-[#135A84] text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-sm"
            >
              <Rocket className="w-5 h-5" />
              Start Observation
            </Link>
            
            <Link 
              href="#" 
              className="flex items-center justify-center gap-2 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 px-8 py-3.5 rounded-lg font-medium transition-all shadow-sm"
            >
              <Users className="w-5 h-5 text-[#176B9C]" />
              For Professionals
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="flex-1 relative mt-16 md:mt-0 z-10 w-full h-[500px]">
          <Image 
            src="/hero_illustration.png" 
            alt="Snowie" 
            fill
            className="object-contain drop-shadow-xl"
            priority
          />
        </div>
      </main>

      {/* Features Bar */}
      <div className="max-w-7xl mx-auto w-full px-8 mb-12 relative z-20">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-zinc-200 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#176B9C]/10 rounded-lg text-[#176B9C]">
              <ScanFace className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm mb-1">Smart Observation</h3>
              <p className="text-xs text-zinc-500">AI observes and records<br/>real-time behavior</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#176B9C]/10 rounded-lg text-[#176B9C]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm mb-1">Track Progress</h3>
              <p className="text-xs text-zinc-500">Monitor growth and<br/>engagement over time</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#176B9C]/10 rounded-lg text-[#176B9C]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm mb-1">Secure & Private</h3>
              <p className="text-xs text-zinc-500">Your data is safe<br/>and confidential</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#176B9C]/10 rounded-lg text-[#176B9C]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 text-sm mb-1">Helpful Reports</h3>
              <p className="text-xs text-zinc-500">Easy-to-understand<br/>insights for experts</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
