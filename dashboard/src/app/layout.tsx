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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans h-screen bg-black text-white relative flex overflow-hidden`}
      >
        {/* Background gradient for glassmorphism effect */}
        <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-black to-black"></div>
        
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
