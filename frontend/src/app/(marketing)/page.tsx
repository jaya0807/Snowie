import Image from "next/image";
import Link from "next/link";
import { Rocket, Users, ScanFace, TrendingUp, ShieldCheck, FileText } from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#F0F8FF] to-[#E3F2FD] font-sans overflow-x-hidden flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center w-full relative z-10">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 md:pr-12 lg:pr-24 space-y-8 z-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#112A46] leading-tight tracking-tight">
            Understanding <br />
            <span className="text-[#FF4081]">Today,</span> <br />
            <span className="text-[#00BFA5]">Supporting</span> <br />
            a Better Tomorrow
          </h2>
          
          <p className="text-[#546E7A] text-lg max-w-md leading-relaxed">
            AI-powered observations that help professionals understand, track and support every child's unique journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/sessions" 
              className="flex items-center justify-center gap-2 bg-[#2D73FF] hover:bg-[#1E5BD6] text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_8px_20px_rgba(45,115,255,0.3)] hover:shadow-[0_8px_25px_rgba(45,115,255,0.4)] hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              Start Observation
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 bg-white hover:bg-[#F5F9FF] text-[#112A46] border border-[#E0E7FF] px-8 py-3.5 rounded-full font-medium transition-all shadow-sm"
            >
              <Users className="w-5 h-5 text-[#2D73FF]" />
              For Professionals
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="flex-1 relative mt-16 md:mt-0 z-10 w-full h-[500px]">
          <div className="absolute inset-0 bg-[#A7C7E7]/20 rounded-full blur-3xl scale-125 -z-10"></div>
          <Image 
            src="/hero_illustration.png" 
            alt="AI Child Observation" 
            fill
            className="object-contain"
            priority
          />
        </div>
      </main>

      {/* Features Bar */}
      <div className="max-w-7xl mx-auto w-full px-8 mb-12 relative z-20">
        <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-[0_10px_40px_rgba(0,0,0,0.05)] border border-white flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
          
          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#E3F2FD] rounded-xl text-[#2D73FF]">
              <ScanFace className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#112A46] text-sm mb-1">Smart Observation</h3>
              <p className="text-xs text-[#78909C]">AI observes and records<br/>real-time behavior</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FCE4EC] rounded-xl text-[#FF4081]">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#112A46] text-sm mb-1">Track Progress</h3>
              <p className="text-xs text-[#78909C]">Monitor growth and<br/>engagement over time</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#E0F2F1] rounded-xl text-[#00BFA5]">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#112A46] text-sm mb-1">Secure & Private</h3>
              <p className="text-xs text-[#78909C]">Your data is safe<br/>and confidential</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-[#FFF8E1] rounded-xl text-[#FFC107]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-[#112A46] text-sm mb-1">Helpful Reports</h3>
              <p className="text-xs text-[#78909C]">Easy-to-understand<br/>insights for experts</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative background bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-[#B2DFDB]/40 to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}
