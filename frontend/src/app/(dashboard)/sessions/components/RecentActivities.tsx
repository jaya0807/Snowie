import { Badge } from "@/components/ui/badge";
import { History, Clock, Target } from "lucide-react";

export function RecentActivities({ isMounted, recentSessions }: { isMounted: boolean; recentSessions: any[] }) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold tracking-tight mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-zinc-500" />
        Completed Activities Today
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {!isMounted || recentSessions.length === 0 ? (
          <div className="col-span-full py-8 text-center text-zinc-500 bg-white rounded-xl border border-black/5">
            No recent activities completed yet today.
          </div>
        ) : (
          recentSessions.map((session: any) => (
            <div key={session.id} className="bg-white border border-black/5 p-4 rounded-xl flex flex-col gap-3 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold text-sm text-zinc-900">{session.activity}</p>
                  <p className="text-xs text-zinc-500 mt-1">{session.time}</p>
                </div>
                <Badge variant="outline" className={`text-[10px] ${session.status === 'Completed' ? 'border-success-light text-success-light bg-success-bg' : 'border-warning-light text-warning-light bg-warning-bg'}`}>
                  {session.status}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500 mt-2 pt-2 border-t border-black/5">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-zinc-400" /> {session.duration}</span>
                <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5 text-zinc-400" /> {session.accuracy} Acc</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
