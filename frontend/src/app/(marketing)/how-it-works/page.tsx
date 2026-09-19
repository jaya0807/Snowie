"use client";

import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { Play, Sparkles, LineChart, FileText } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans selection:bg-brand/20 overflow-x-hidden">
      <LandingNavbar />
      
      <main className="max-w-7xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="max-w-3xl mx-auto text-center mb-20"
        >
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
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical Connecting Line */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-zinc-200 -translate-x-1/2"></div>

          {/* Step 1 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-8 md:gap-0">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:w-5/12 text-center md:text-right order-2 md:order-1 pr-0 md:pr-8"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">1. Play an Activity</h3>
              <p className="text-zinc-500 leading-relaxed">
                Parents launch engaging, story-driven activities for their child. From pirate adventures to space exploration, each activity is designed to elicit specific behavioral responses.
              </p>
            </motion.div>
            
            <div className="relative md:absolute md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10 shrink-0 order-1 md:order-2">
              <Play className="w-5 h-5 ml-1" />
            </div>
            
            <div className="md:w-5/12 pl-0 md:pl-8 flex justify-center md:justify-start order-3">
              <motion.div 
                initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full max-w-sm aspect-video bg-zinc-200 rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group"
              >
                <video src="/assets/how-it-works/step1.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between mb-16 md:mb-24 gap-8 md:gap-0">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:w-5/12 text-center md:text-left order-2 md:order-1 pl-0 md:pl-8"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">2. Invisible Analysis</h3>
              <p className="text-zinc-500 leading-relaxed">
                As the child plays, our underlying AI engine processes webcam telemetry in real-time. We track gaze patterns, motor tics, facial expressions, and posture—all without storing raw video.
              </p>
            </motion.div>
            
            <div className="relative md:absolute md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10 shrink-0 order-1 md:order-2">
              <Sparkles className="w-5 h-5" />
            </div>
            
            <div className="md:w-5/12 pr-0 md:pr-8 flex justify-center md:justify-end order-3">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full max-w-sm aspect-video bg-zinc-200 rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group"
              >
                <video src="/assets/how-it-works/step2.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative flex flex-col md:flex-row items-center justify-between mb-16 md:mb-24 gap-8 md:gap-0">
            <motion.div 
              initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:w-5/12 text-center md:text-right order-2 md:order-1 pr-0 md:pr-8"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">3. Track Progress</h3>
              <p className="text-zinc-500 leading-relaxed">
                Accuracy, response latency, and attention metrics are aggregated into beautiful, easy-to-read dashboards. Parents can see clear trends and know exactly where their child stands.
              </p>
            </motion.div>
            
            <div className="relative md:absolute md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10 shrink-0 order-1 md:order-2">
              <LineChart className="w-5 h-5" />
            </div>
            
            <div className="md:w-5/12 pl-0 md:pl-8 flex justify-center md:justify-start order-3">
               <motion.div 
                 initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                 className="w-full max-w-sm aspect-video bg-zinc-200 rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group"
               >
                 <video src="/assets/how-it-works/step3.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
               </motion.div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative flex flex-col md:flex-row-reverse items-center justify-between gap-8 md:gap-0">
            <motion.div 
              initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              className="md:w-5/12 text-center md:text-left order-2 md:order-1 pl-0 md:pl-8"
            >
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">4. Clinical Reporting</h3>
              <p className="text-zinc-500 leading-relaxed">
                When it's time for an evaluation, Snowie generates a comprehensive, AI-summarized clinical report for doctors. No more subjective guessing—just hard, behavioral evidence.
              </p>
            </motion.div>
            
            <div className="relative md:absolute md:left-1/2 top-0 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-12 h-12 rounded-full bg-brand text-white flex items-center justify-center font-bold shadow-lg shadow-brand/30 border-4 border-zinc-50 z-10 shrink-0 order-1 md:order-2">
              <FileText className="w-5 h-5" />
            </div>
            
            <div className="md:w-5/12 pr-0 md:pr-8 flex justify-center md:justify-end order-3">
              <motion.div 
                initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="w-full max-w-sm aspect-video bg-zinc-200 rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group"
              >
                <video src="/assets/how-it-works/step4.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
              </motion.div>
            </div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-32 text-center"
        >
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">Ready to see it in action?</h2>
          <Link 
            href="/login?tab=signup" 
            className="inline-flex items-center justify-center bg-zinc-900 hover:bg-black text-white px-8 py-3.5 rounded-xl font-medium transition-all shadow-sm"
          >
            Create Free Account
          </Link>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
