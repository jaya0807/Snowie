import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { Heart, Shield, Users, Activity } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-brand/20">
      <LandingNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6">
            <Heart className="w-3.5 h-3.5" />
            Our Mission
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-marketing-dark tracking-tight leading-tight mb-6">
            Empowering Care Through <span className="text-brand">AI Innovation</span>
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            At Snowie, we believe that early observation and consistent tracking are the keys to 
            understanding and supporting a child's unique developmental journey.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-6 text-brand">
              <Shield className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Privacy First</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              We process video on-device securely. Your child's data is encrypted and handled with the utmost care.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-orange-500">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Built for Families</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Designed to be unobtrusive and playful, ensuring children interact naturally without realizing they are being observed.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-black/5 text-center transition-all hover:-translate-y-1 hover:shadow-md">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 text-green-600">
              <Activity className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Clinical Precision</h3>
            <p className="text-zinc-500 leading-relaxed text-sm">
              Our AI tracks gaze, posture, and motor events to provide clinicians with quantitative, actionable evidence.
            </p>
          </div>
        </div>

        <div className="bg-marketing-dark text-white rounded-[2rem] p-12 md:p-16 text-center relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Our Story</h2>
            <p className="text-zinc-300 leading-relaxed mb-0">
              Snowie was born out of a desire to bridge the gap between home environments and clinical settings. 
              Traditional observations often happen in unfamiliar rooms, altering a child's natural behavior. 
              By turning observation into engaging digital activities, we capture authentic interactions, providing 
              parents and doctors with a clearer, more accurate picture of a child's development.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
