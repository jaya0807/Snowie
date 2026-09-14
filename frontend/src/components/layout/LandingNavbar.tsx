"use client";

import Link from "next/link";
import { Activity } from "lucide-react";
import { usePathname } from "next/navigation";

export function LandingNavbar() {
  const pathname = usePathname();

  const getLinkClass = (path: string) => {
    // If it's a hash link, it's not strictly 'active' via pathname, just a scroll target
    if (path.includes('#')) {
      return "px-4 py-2 text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-900 rounded-xl transition-all";
    }
    return pathname === path
      ? "px-4 py-2 bg-zinc-100 rounded-xl text-zinc-900 transition-all"
      : "px-4 py-2 text-zinc-600 hover:bg-zinc-100/50 hover:text-zinc-900 rounded-xl transition-all";
  };

  return (
    <header className="w-[96%] max-w-7xl mx-auto mt-4 sticky top-4 bg-white/85 backdrop-blur-xl border border-black/5 shadow-md shadow-brand/5 rounded-2xl z-50 transition-all duration-300">
      <nav className="w-full flex items-center justify-between py-3 px-6 mx-auto">
      <div className="flex items-center gap-2">
        <div className="text-brand-accent">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 35C20 35 7.5 25.8 7.5 15.6C7.5 11.734 10.634 8.6 14.5 8.6C16.634 8.6 18.634 9.5 20 11.2C21.366 9.5 23.366 8.6 25.5 8.6C29.366 8.6 32.5 11.734 32.5 15.6C32.5 25.8 20 35 20 35Z" fill="currentColor" opacity="0.8"/>
            <circle cx="14" cy="16" r="2" fill="white"/>
            <circle cx="26" cy="16" r="2" fill="white"/>
            <path d="M16 23C16 23 18 25 20 25C22 25 24 23 24 23" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="20" cy="5" r="2.5" className="fill-warning-light"/>
          </svg>
        </div>
        <div>
          <h1 className="text-xl font-bold leading-tight text-zinc-900">
            Snowie
          </h1>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-2 text-sm font-medium">
        <Link href="/" className={getLinkClass("/")}>
          Home
        </Link>
        <Link href="/#about" className={getLinkClass("/#about")}>
          About Us
        </Link>
        <Link href="/#how-it-works" className={getLinkClass("/#how-it-works")}>
          How It Works
        </Link>
        <Link href="/contact" className={getLinkClass("/contact")}>
          Contact
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          href="/login?tab=signup" 
          className="flex items-center justify-center bg-white text-zinc-900 border border-zinc-200 hover:bg-zinc-50 shadow-sm hover:shadow px-6 py-2.5 rounded-xl font-medium transition-all"
        >
          Sign Up
        </Link>
        <Link 
          href="/login" 
          className="flex items-center gap-2 bg-zinc-900 hover:bg-black text-white rounded-xl px-6 py-2.5 font-medium transition-all shadow-sm"
        >
          Login
        </Link>
      </div>
    </nav>
    </header>
  );
}
