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

          {/* Step 1: Play Activity */}
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
                className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 overflow-hidden relative group flex items-center justify-center"
              >
                {/* Abstract animated game scene */}
                <div className="absolute inset-0 bg-indigo-50"></div>
                <motion.div 
                  animate={{ x: [-50, 50, -50], y: [-20, 20, -20] }}
                  transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                  className="absolute w-20 h-20 bg-brand/20 rounded-full blur-xl"
                />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  className="relative z-10 w-16 h-16 bg-white shadow-xl shadow-brand/20 rounded-full flex items-center justify-center text-brand"
                >
                  <Play className="w-6 h-6 ml-1" />
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Step 2: Invisible Analysis */}
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
                className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col justify-center gap-4 relative overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-zinc-400 uppercase">Focus</div>
                  <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["30%", "90%", "60%", "85%"] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className="h-full bg-brand rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-zinc-400 uppercase">Posture</div>
                  <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["80%", "40%", "95%", "70%"] }}
                      transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 0.5 }}
                      className="h-full bg-green-400 rounded-full"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-xs font-semibold text-zinc-400 uppercase">Motor</div>
                  <div className="flex-1 h-2.5 bg-zinc-100 rounded-full overflow-hidden">
                    <motion.div 
                      animate={{ width: ["10%", "50%", "20%", "40%"] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 1 }}
                      className="h-full bg-orange-400 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Step 3: Track Progress */}
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
                 className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-6 relative flex items-end gap-3 justify-center"
               >
                 {[0.2, 0.4, 0.1, 0.6, 0.3, 0.8].map((delay, i) => (
                   <motion.div 
                     key={i}
                     initial={{ height: "10%" }}
                     animate={{ height: ["10%", `${40 + (i * 10)}%`, `${30 + (i * 12)}%`, `${50 + (i * 8)}%`] }}
                     transition={{ repeat: Infinity, duration: 4, delay: delay, ease: "easeInOut" }}
                     className="w-8 bg-brand-light rounded-t-md"
                   />
                 ))}
               </motion.div>
            </div>
          </div>

          {/* Step 4: Clinical Reporting */}
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
                className="w-full max-w-sm aspect-video bg-white rounded-2xl shadow-sm border border-black/5 p-6 flex flex-col gap-3 justify-center"
              >
                <motion.div 
                  initial={{ opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 3 }}
                  className="w-1/3 h-4 bg-zinc-200 rounded-full mb-2" 
                />
                {[0, 0.5, 1, 1.5, 2].map((delay, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scaleX: 0, opacity: 0, originX: 0 }}
                    animate={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 6, delay: delay, times: [0, 0.1, 0.8, 1] }}
                    className={`h-2 bg-zinc-100 rounded-full ${i % 2 === 0 ? 'w-full' : 'w-4/5'}`} 
                  />
                ))}
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
