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
            <h4 className="font-semibold text-zinc-900 mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-brand transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Security</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">For Professionals</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-brand transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Guidelines</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Community</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-zinc-900 mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-zinc-500">
              <li><Link href="#" className="hover:text-brand transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-brand transition-colors">Contact</Link></li>
              <li><Link href="#" className="hover:text-brand transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} Snowie. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-zinc-600 transition-colors">Terms</Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-zinc-600 transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
