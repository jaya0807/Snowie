import React from "react";
import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/common/Logo";

export function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <Logo iconSize={32} textSize="text-xl" />
            </Link>
            <p className="text-zinc-500 text-sm max-w-sm mb-6 leading-relaxed">
              Empowering child development professionals with AI-driven behavioral observation and actionable insights
            </p>
            {/* Socials */}
            <div className="flex items-center gap-4 text-zinc-400">
              <Link href="#" className="hover:text-brand transition-colors"><MessageCircle className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-brand transition-colors"><Globe className="w-5 h-5" /></Link>
              <Link href="#" className="hover:text-brand transition-colors"><Mail className="w-5 h-5" /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Platform</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="/" className="hover:text-brand transition-colors">Home</Link></li>
              <li><Link href="/login" className="hover:text-brand transition-colors">Parent Portal</Link></li>
              <li><Link href="/professional" className="hover:text-brand transition-colors">Doctor Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><a href="mailto:support@snowie.app" className="hover:text-brand transition-colors">Contact Us</a></li>
              <li><a href="mailto:support@snowie.app?subject=Help" className="hover:text-brand transition-colors">Help Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><span className="cursor-not-allowed">Privacy Policy</span></li>
              <li><span className="cursor-not-allowed">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} Snowie. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
