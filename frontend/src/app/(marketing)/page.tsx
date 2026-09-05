import Image from "next/image";
import Link from "next/link";
import { Rocket, Users, ScanFace, TrendingUp, ShieldCheck, FileText } from "lucide-react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-marketing-bg to-brand-blue-light font-sans overflow-x-hidden flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center w-full relative z-10">
        
        {/* Left Side: Text and CTA */}
        <div className="flex-1 md:pr-12 lg:pr-24 space-y-8 z-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-marketing-dark leading-tight tracking-tight">
            Understanding <br />
            <span className="text-danger">Today,</span> <br />
            <span className="text-success-alt">Supporting</span> <br />
            a Better Tomorrow
          </h2>
          
          <p className="text-marketing-muted text-lg max-w-md leading-relaxed">
            AI-powered observations that help professionals understand, track and support every child's unique journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/sessions" 
              className="flex items-center justify-center gap-2 bg-brand-blue hover:bg-brand-blue-dark text-white px-8 py-3.5 rounded-full font-medium transition-all shadow-[0_8px_20px_rgba(45,115,255,0.3)] hover:shadow-[0_8px_25px_rgba(45,115,255,0.4)] hover:-translate-y-0.5"
            >
              <Rocket className="w-5 h-5" />
              Start Observation
            </Link>
            
            <Link 
              href="/dashboard" 
              className="flex items-center justify-center gap-2 bg-white hover:bg-brand-blue-light text-marketing-dark border border-indigo-100 px-8 py-3.5 rounded-full font-medium transition-all shadow-sm"
            >
              <Users className="w-5 h-5 text-brand-blue" />
              For Professionals
            </Link>
          </div>
        </div>

        {/* Right Side: Hero Image */}
        <div className="flex-1 relative mt-16 md:mt-0 z-10 w-full h-[500px]">
          <div className="absolute inset-0 bg-blue-200/20 rounded-full blur-3xl scale-125 -z-10"></div>
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
            <div className="p-3 bg-brand-blue-light rounded-xl text-brand-blue">
              <ScanFace className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-marketing-dark text-sm mb-1">Smart Observation</h3>
              <p className="text-xs text-marketing-muted-alt">AI observes and records<br/>real-time behavior</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-danger-bg rounded-xl text-danger">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-marketing-dark text-sm mb-1">Track Progress</h3>
              <p className="text-xs text-marketing-muted-alt">Monitor growth and<br/>engagement over time</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-success-alt-bg rounded-xl text-success-alt">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-marketing-dark text-sm mb-1">Secure & Private</h3>
              <p className="text-xs text-marketing-muted-alt">Your data is safe<br/>and confidential</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-warning-bg rounded-xl text-warning">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-marketing-dark text-sm mb-1">Helpful Reports</h3>
              <p className="text-xs text-marketing-muted-alt">Easy-to-understand<br/>insights for experts</p>
            </div>
          </div>

        </div>
      </div>
      
      {/* Decorative background bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-teal-200/40 to-transparent pointer-events-none -z-10"></div>
    </div>
  );
}
