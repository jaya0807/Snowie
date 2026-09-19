import re

with open("frontend/src/app/professional/layout.tsx", "r") as f:
    content = f.read()

auth_check = """
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfessionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role, isLoading, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading && role !== "clinician") {
      router.push("/login");
    }
  }, [role, isLoading, router]);

  if (!mounted || isLoading || role !== "clinician") {
    return <div className="flex h-screen items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand"></div></div>;
  }
"""
content = re.sub(r'export default function ProfessionalLayout.*?\{\n  return \(', auth_check + '\n  return (', content, flags=re.DOTALL)

content = content.replace(
    """          <Link href="/login" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </Link>""",
    """          <button onClick={() => logout()} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 transition-colors">
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Log out</span>
          </button>"""
)

with open("frontend/src/app/professional/layout.tsx", "w") as f:
    f.write(content)
