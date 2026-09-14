"use client";

import React from "react";
import { LandingNavbar } from "@/components/layout/LandingNavbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, MapPin, MessageSquare } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="w-full bg-background font-sans overflow-x-hidden min-h-screen flex flex-col">
      <LandingNavbar />
      
      <main className="flex-1 max-w-7xl mx-auto px-8 py-16 md:py-24 w-full relative z-10">
        
        {/* Header section */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 leading-tight tracking-tight mb-4">
            Get in touch
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed">
            Have a question about Snowie or need support? Our team is here to help you get the most out of our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 max-w-6xl mx-auto">
          
          {/* Left: Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm">
              <h3 className="text-xl font-bold text-zinc-900 mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-brand" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-1">Email Us</h4>
                    <p className="text-zinc-500 text-sm mb-1">Our friendly team is here to help.</p>
                    <a href="mailto:hello@snowie.app" className="text-brand font-medium text-sm hover:underline">hello@snowie.app</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-success-bg flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-1">Live Chat</h4>
                    <p className="text-zinc-500 text-sm mb-1">Available Mon-Fri, 9am - 5pm EST.</p>
                    <button className="text-success font-medium text-sm hover:underline">Start a new chat</button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-zinc-700" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-900 mb-1">Office</h4>
                    <p className="text-zinc-500 text-sm mb-1">Come say hello at our HQ.</p>
                    <p className="text-zinc-700 font-medium text-sm">100 Health Tech Way<br/>Boston, MA 02110</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl p-8 border border-zinc-200 shadow-sm relative overflow-hidden group">
              <div className="absolute -right-24 -top-24 w-96 h-96 bg-brand/5 rounded-full blur-3xl z-0 pointer-events-none" />
              
              <form className="relative z-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-zinc-900">First name</label>
                    <input 
                      type="text" 
                      placeholder="Jane"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-zinc-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-sm font-semibold text-zinc-900">Last name</label>
                    <input 
                      type="text" 
                      placeholder="Doe"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-zinc-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-zinc-900">Email address</label>
                  <input 
                    type="email" 
                    placeholder="jane@example.com"
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-zinc-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-sm font-semibold text-zinc-900">How can we help?</label>
                  <textarea 
                    rows={4}
                    placeholder="Tell us a little about your project or inquiry..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all text-zinc-900 resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="flex items-center justify-center gap-2 bg-zinc-900 hover:bg-black text-white w-full py-3.5 rounded-xl font-medium transition-all shadow-sm"
                >
                  Send message
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
}
