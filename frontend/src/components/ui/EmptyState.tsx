import { UserX } from "lucide-react";
import Link from "next/link";

export function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-8 text-center animate-in fade-in duration-500">
      <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mb-5">
        <UserX className="w-8 h-8 text-zinc-400" />
      </div>
      <h2 className="text-xl font-bold text-zinc-900 mb-2">No Active Patient Selected</h2>
      <p className="text-zinc-500 max-w-sm mb-6 text-sm leading-relaxed">
        You must select a child from the directory before you can view their {title} or start a new observation session.
      </p>
      <Link 
        href="/profiles" 
        className="btn-primary px-6 py-2.5 text-sm font-medium transition-transform active:scale-95"
      >
        Go to Child Profiles
      </Link>
    </div>
  );
}
