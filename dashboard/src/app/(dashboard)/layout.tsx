import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-full bg-[#63C1BB] overflow-hidden relative">
      <div className="fixed inset-0 z-0 bg-[#63C1BB]"></div>
      
      <Sidebar />
      
      <div className="flex-1 flex flex-col min-w-0 z-10 relative">
        <Header />
        <main className="flex-1 overflow-auto p-4 pt-0">
          {children}
        </main>
      </div>
    </div>
  );
}
