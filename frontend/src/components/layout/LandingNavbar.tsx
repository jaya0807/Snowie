"use client";

import Link from "next/link";
import { User, Activity } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto z-50 relative">
      <div className="flex items-center gap-2">
        <div className="text-brand-accent">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35C20 35 7.5 25.8 7.5 15.6C7.5 11.734 10.634 8.6 14.5 8.6C16.634 8.6 18.634 9.5 20 11.2C21.366 9.5 23.366 8.6 25.5 8.6C29.366 8.6 32.5 11.734 32.5 15.6C32.5 25.8 20 35 20 35Z" fill="currentColor" opacity="0.8"/>
            <circle cx="14" cy="16" r="2" fill="white"/>
            <circle cx="26" cy="16" r="2" fill="white"/>
            <path d="M16 23C16 23 18 25 20 25C22 25 24 23 24 23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="5" r="2.5" fill="#FFD76A"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight text-zinc-900">
            Snowie
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-900">
        <Link href="/" className="px-4 py-2 bg-brand-surface-alt rounded-full text-zinc-900">
          Home
        </Link>
        <Link href="#about" className="hover:text-brand-accent transition-colors">
          About Us
        </Link>
        <Link href="#how-it-works" className="hover:text-brand-accent transition-colors">
          How It Works
        </Link>
        <Link href="#contact" className="hover:text-brand-accent transition-colors">
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          href="/login" 
          className="flex items-center justify-center bg-white text-brand border border-brand/20 hover:border-brand/50 hover:bg-brand-light/20 shadow-sm hover:shadow px-6 py-2.5 rounded-[6px] font-medium transition-all"
        >
          Sign Up
        </Link>
        <Link 
          href="/login" 
          className="flex items-center gap-2 btn-primary px-6 py-2.5 font-medium transition-all"
        >
          <User className="w-4 h-4" />
          Login
        </Link>
      </div>
    </nav>
  );
}
