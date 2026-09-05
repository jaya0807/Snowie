"use client";

import Link from "next/link";
import { User, Activity } from "lucide-react";

export function LandingNavbar() {
  return (
    <nav className="w-full flex items-center justify-between py-6 px-8 max-w-7xl mx-auto z-50 relative">
      <div className="flex items-center gap-2">
        <div className="text-[#49B3E8]">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35C20 35 7.5 25.8 7.5 15.6C7.5 11.734 10.634 8.6 14.5 8.6C16.634 8.6 18.634 9.5 20 11.2C21.366 9.5 23.366 8.6 25.5 8.6C29.366 8.6 32.5 11.734 32.5 15.6C32.5 25.8 20 35 20 35Z" fill="currentColor" opacity="0.8"/>
            <circle cx="14" cy="16" r="2" fill="white"/>
            <circle cx="26" cy="16" r="2" fill="white"/>
            <path d="M16 23C16 23 18 25 20 25C22 25 24 23 24 23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="5" r="2.5" fill="#FFD76A"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight text-[#173B50]">
            AI Child
            <br />
            <span className="text-[#49B3E8]">Observe</span>
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[#173B50]">
        <Link href="/" className="px-4 py-2 bg-[#E7F5FB] rounded-full text-[#176B9C]">
          Home
        </Link>
        <Link href="#about" className="hover:text-[#49B3E8] transition-colors">
          About Us
        </Link>
        <Link href="#how-it-works" className="hover:text-[#49B3E8] transition-colors">
          How It Works
        </Link>
        <Link href="#professionals" className="hover:text-[#49B3E8] transition-colors">
          For Professionals
        </Link>
        <Link href="#contact" className="hover:text-[#49B3E8] transition-colors">
          Contact
        </Link>
      </div>

      <div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 bg-[#2D73FF] hover:bg-[#1E5BD6] text-white px-6 py-2.5 rounded-full font-medium transition-all"
        >
          <User className="w-4 h-4" />
          Login
        </Link>
      </div>
    </nav>
  );
}
