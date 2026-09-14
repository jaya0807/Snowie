"use client";

import React from "react";
import { motion } from "framer-motion";
import { ScanFace, TrendingUp, ShieldCheck, FileText } from "lucide-react";

import { Variants } from "framer-motion";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 60, damping: 20 },
  },
};

export function BentoGrid() {
  return (
    <div className="max-w-7xl mx-auto w-full px-8 py-24 relative z-20">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-4">Everything you need to support them</h2>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">Powerful tools designed specifically for child development professionals</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]"
      >
        
        {/* Card 1: Wide */}
        <motion.div variants={cardVariant} className="md:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-brand/5 rounded-full blur-3xl group-hover:bg-brand/10 transition-colors z-0" />
          <div className="relative z-10">
            <motion.div 
              className="w-14 h-14 bg-brand/10 rounded-2xl flex items-center justify-center mb-6"
            >
              <ScanFace className="w-7 h-7 text-brand" />
            </motion.div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Smart Observation</h3>
            <p className="text-zinc-500 leading-relaxed">
              AI seamlessly observes and records real-time behavior, freeing you from manual note-taking so you can focus entirely on interacting with the child
            </p>
          </div>
        </motion.div>

        {/* Card 2: Square */}
        <motion.div variants={cardVariant} className="col-span-1 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -right-8 -bottom-8 w-48 h-48 bg-success-light/10 rounded-full blur-2xl group-hover:bg-success-light/20 transition-colors z-0" />
          <div className="relative z-10">
            <motion.div 
              className="w-14 h-14 bg-success-light/20 rounded-2xl flex items-center justify-center mb-6"
            >
              <TrendingUp className="w-7 h-7 text-success" />
            </motion.div>
            <h3 className="text-xl font-bold text-zinc-900 mb-3">Track Progress</h3>
            <p className="text-zinc-500 leading-relaxed">
              Monitor growth, engagement, and behavioral trends over time with beautiful, intuitive visualizations
            </p>
          </div>
        </motion.div>

        {/* Card 3: Square */}
        <motion.div variants={cardVariant} className="col-span-1 bg-brand rounded-3xl p-8 border border-brand-dark shadow-md relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent z-0" />
          <div className="relative z-10">
            <motion.div 
              className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10"
            >
              <ShieldCheck className="w-7 h-7 text-white" />
            </motion.div>
            <h3 className="text-xl font-bold text-white mb-3">Secure & Private</h3>
            <p className="text-blue-100 leading-relaxed">
              Your data is encrypted, strictly confidential, and stored securely following healthcare compliance standards
            </p>
          </div>
        </motion.div>

        {/* Card 4: Wide */}
        <motion.div variants={cardVariant} className="md:col-span-2 bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute -left-12 -bottom-12 w-64 h-64 bg-zinc-100 rounded-full blur-3xl group-hover:bg-zinc-200 transition-colors z-0" />
          <div className="relative z-10">
            <motion.div 
              className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6"
            >
              <FileText className="w-7 h-7 text-zinc-700" />
            </motion.div>
            <h3 className="text-2xl font-bold text-zinc-900 mb-3">Helpful Reports</h3>
            <p className="text-zinc-500 leading-relaxed ">
              Generate easy-to-understand insights, printable summaries, and exportable data for experts, parents, and caregivers with a single click
            </p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
