import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Sparkles, LineChart, FileText } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-brand/20">
      <LandingNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-widest mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Simple Process
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-marketing-dark tracking-tight leading-tight mb-6">
            How <span className="text-brand">Snowie</span> Works
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed">
            Four simple steps to turn playful screen time into actionable clinical insights.
          </p>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 -translate-x-1/2"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
            <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0 pr-0 md:pr-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">1. Play an Activity</h3>
              <p className="text-zinc-500 leading-relaxed">
                Parents launch engaging, story-driven activities for their child. From pirate adventures to space exploration, each activity is designed to elicit specific behavioral responses.
              </p>
            </div>
            <div className="absolute left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10">
              <Play className="w-5 h-5 ml-1" />
            </div>
            <div className="md:w-5/12 pl-0 md:pl-8 flex justify-center md:justify-start">
              <div className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group">
                <img src="/assets/space/bg.png" alt="Activity" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-brand">
                    <Play className="w-5 h-5 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-16 md:mb-24">
            <div className="md:w-5/12 text-center md:text-left mb-6 md:mb-0 pl-0 md:pl-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">2. Invisible Analysis</h3>
              <p className="text-zinc-500 leading-relaxed">
                As the child plays, our underlying AI engine processes webcam telemetry in real-time. We track gaze patterns, motor tics, facial expressions, and posture—all without storing raw video.
              </p>
            </div>
            <div className="absolute left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="md:w-5/12 pr-0 md:pr-8 flex justify-center md:justify-end">
              <div className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-4 flex flex-col justify-center items-center gap-3">
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-brand animate-pulse"></div></div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[60%] h-full bg-orange-400 animate-pulse delay-75"></div></div>
                <div className="w-full h-2 bg-zinc-100 rounded-full overflow-hidden"><div className="w-[90%] h-full bg-green-400 animate-pulse delay-150"></div></div>
                <span className="text-xs text-zinc-400 font-medium uppercase tracking-wider mt-2">Telemetry Processing</span>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24">
            <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0 pr-0 md:pr-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">3. Track Progress</h3>
              <p className="text-zinc-500 leading-relaxed">
                Accuracy, response latency, and attention metrics are aggregated into beautiful, easy-to-read dashboards. Parents can see clear trends and know exactly where their child stands.
              </p>
            </div>
            <div className="absolute left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10">
              <LineChart className="w-5 h-5" />
            </div>
            <div className="md:w-5/12 pl-0 md:pl-8 flex justify-center md:justify-start">
               <div className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-6 relative overflow-hidden flex items-end gap-2">
                 {[40, 70, 45, 90, 65, 100].map((h, i) => (
                   <div key={i} className="flex-1 bg-brand-light rounded-t-sm transition-all" style={{ height: `${h}%` }}></div>
                 ))}
               </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between">
            <div className="md:w-5/12 text-center md:text-left mb-6 md:mb-0 pl-0 md:pl-8">
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">4. Clinical Reporting</h3>
              <p className="text-zinc-500 leading-relaxed">
                When it's time for an evaluation, Snowie generates a comprehensive, AI-summarized clinical report for doctors. No more subjective guessing—just hard, behavioral evidence.
              </p>
            </div>
            <div className="absolute left-1/2 top-0 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10">
              <FileText className="w-5 h-5" />
            </div>
            <div className="md:w-5/12 pr-0 md:pr-8 flex justify-center md:justify-end">
              <div className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-3">
                <div className="w-1/3 h-4 bg-zinc-200 rounded-full mb-2"></div>
                <div className="w-full h-2 bg-zinc-100 rounded-full"></div>
                <div className="w-5/6 h-2 bg-zinc-100 rounded-full"></div>
                <div className="w-full h-2 bg-zinc-100 rounded-full"></div>
                <div className="w-2/3 h-2 bg-zinc-100 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Ready to see it in action?</h2>
          <Link 
            href="/login?tab=signup" 
            className="inline-flex items-center justify-center bg-zinc-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm"
          >
            Create Free Account
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
