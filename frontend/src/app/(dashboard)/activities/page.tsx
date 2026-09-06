"use client";

import { useRouter } from "next/navigation";
import { Play, Settings2, BarChart2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function ActivitiesPage() {
  const router = useRouter();
  
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/activities")
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(err => console.error(err));
  }, []);

  const handleStartChildMode = (activityId: string) => {
    router.push(`/child?activity=${activityId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Activity Library</h1>
          <p className="text-sm text-zinc-500 mt-1">Select an activity to launch in Child Mode.</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">Loading activities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div key={act.id} className="glass flex flex-col overflow-hidden group hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
              
              <div className="h-32 bg-gradient-to-br from-brand-surface to-white relative flex items-center justify-center border-b border-black/5 p-6">
                <div className="absolute top-4 left-4">
                  <Badge variant="outline" className="bg-white/80 backdrop-blur text-[10px] text-brand border-brand/20 font-bold uppercase tracking-wider">
                    {act.domain.replace("_", " ")}
                  </Badge>
                </div>
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center border border-black/5 group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-brand ml-1" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-zinc-900 group-hover:text-brand transition-colors">{act.id}: {act.name}</h3>
                </div>
                
                <p className="text-sm text-zinc-500 line-clamp-2 flex-1 leading-relaxed">
                  {act.description}
                </p>

                <div className="mt-6 space-y-3 pt-4 border-t border-black/5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 flex items-center gap-1.5"><Settings2 className="w-3.5 h-3.5" /> Levels</span>
                    <span className="font-medium text-zinc-900">{act.difficulty_levels.length} Available</span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => handleStartChildMode(act.id)} className="flex-1 btn-primary py-2 text-sm font-semibold group-hover:bg-brand-dark transition-colors">
                    Launch Activity
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
