import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Snowie Platform",
  description: "AI-assisted structured observations",
};

import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased font-sans text-zinc-900`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
