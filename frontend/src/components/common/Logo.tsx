import React from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['600', '700'],
  display: 'swap',
});

interface LogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
  showText?: boolean;
  suffix?: string;
}

export function Logo({ 
  className = '', 
  iconSize = 40,
  textSize = 'text-xl',
  showText = true,
  suffix
}: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Robot Mascot SVG */}
      <div style={{ width: iconSize, height: iconSize }} className="shrink-0 text-blue-400">
        <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Antenna */}
          <line x1="20" y1="6" x2="20" y2="12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
          <circle cx="20" cy="4.5" r="2.5" fill="#93C5FD"/>
          
          {/* Head (rounded, soft blue) */}
          <rect x="7" y="12" width="26" height="22" rx="8" fill="#BFDBFE" stroke="currentColor" strokeWidth="2"/>
          
          {/* Ears */}
          <path d="M7 20H4.5C3.67157 20 3 20.6716 3 21.5V23.5C3 24.3284 3.67157 25 4.5 25H7" fill="#93C5FD" stroke="currentColor" strokeWidth="2"/>
          <path d="M33 20H35.5C36.3284 20 37 20.6716 37 21.5V23.5C37 24.3284 36.3284 25 35.5 25H33" fill="#93C5FD" stroke="currentColor" strokeWidth="2"/>
          
          {/* Eyes (friendly, dark navy) */}
          <circle cx="14" cy="20" r="2.5" fill="#1E3A8A"/>
          <circle cx="26" cy="20" r="2.5" fill="#1E3A8A"/>
          
          {/* Small Smile */}
          <path d="M15 26C15 26 17.5 28.5 20 28.5C22.5 28.5 25 26 25 26" stroke="#1E3A8A" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>

      {showText && (
        <span className={`${poppins.className} ${textSize} font-bold text-slate-900 tracking-tight leading-none`}>
          Snowie{suffix ? ` ${suffix}` : ''}
        </span>
      )}
    </div>
  );
}
