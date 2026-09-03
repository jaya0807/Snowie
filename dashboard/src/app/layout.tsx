import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Child Observation Platform",
  description: "AI-assisted structured observations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen bg-[#5BB8E8] text-[#26354A] relative flex overflow-hidden`}
      >
        {/* Playful child-friendly background using the custom palette */}
        <div className="fixed inset-0 z-0 bg-[#F4FAFE]/80">
          {/* Yellow glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-[#FFD86B]/40 via-transparent to-transparent"></div>
          {/* Pink and Purple glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-[#FF9EB5]/40 via-[#B9A7F9]/20 to-transparent"></div>
          {/* Primary Blue glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-[#5BB8E8]/30 via-transparent to-transparent"></div>
          {/* Secondary Green glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-[#7DD8B5]/30 via-transparent to-transparent"></div>
        </div>
        
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0 z-10 relative">
          <Header />
          <main className="flex-1 overflow-auto p-4 pt-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
