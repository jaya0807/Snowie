"use client";

import { useRouter } from "next/navigation";
import { Play, Settings2, BarChart2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

const ACTIVITY_OVERRIDES: Record<string, { name: string, description: string }> = {
  "A1": { name: "🐾 Animal Adventure", description: "Meet friendly animal characters and enjoy a fun conversation adventure." },
  "A2": { name: "✨ Magic Mission", description: "Complete magical missions and find the right objects along the way." },
  "A3": { name: "🏴☠️ Treasure Hunt", description: "Explore the island and find hidden treasures among the objects." },
  "A4": { name: "🧠✨ Memory Quest", description: "Listen carefully, remember what you hear, and complete each memory challenge." },
  "A5": { name: "😊 Feel-O-Meter", description: "Explore everyday situations and discover feelings, emotions, and kind responses." },
  "A6": { name: "🚀 Super Challenge", description: "Take on fun challenges that become more exciting as you progress." }
};

const ACTIVITY_IMAGES: Record<string, string> = {
  "A1": "/assets/activities/animal-adventure.jpg",
  "A2": "/assets/activities/magic-mission.jpg",
  "A3": "/assets/activities/treasure-hunt.jpg",
  "A4": "/assets/activities/memory-quest.jpg",
  "A5": "/assets/activities/feel-o-meter.jpg",
  "A6": "/assets/activities/super-challenge.jpg",
};

export default function ActivitiesPage() {
  const router = useRouter();
  
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetch("http://localhost:8001/api/activities")
      .then(res => res.json())
      .then(data => {
        const updated = data.map((act: any) => ({
          ...act,
          name: ACTIVITY_OVERRIDES[act.id]?.name || act.name,
          description: ACTIVITY_OVERRIDES[act.id]?.description || act.description
        }));
        setActivities(updated);
      })
      .catch(err => {
        setActivities([
          { id: "A1", name: ACTIVITY_OVERRIDES["A1"].name, domain: "social", description: ACTIVITY_OVERRIDES["A1"].description, difficulty_levels: [1] },
          { id: "A2", name: ACTIVITY_OVERRIDES["A2"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A2"].description, difficulty_levels: [1, 2, 3] },
          { id: "A3", name: ACTIVITY_OVERRIDES["A3"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A3"].description, difficulty_levels: [1, 2, 3] },
          { id: "A4", name: ACTIVITY_OVERRIDES["A4"].name, domain: "motor", description: ACTIVITY_OVERRIDES["A4"].description, difficulty_levels: [1, 2, 3, 4, 5] },
          { id: "A5", name: ACTIVITY_OVERRIDES["A5"].name, domain: "social", description: ACTIVITY_OVERRIDES["A5"].description, difficulty_levels: [1, 2] },
          { id: "A6", name: ACTIVITY_OVERRIDES["A6"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A6"].description, difficulty_levels: [1, 2] }
        ]);
      });
  }, []);

  const launchActivity = (activityId: string) => {
    router.push(`/child?activity=${activityId}`);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Activity Library</h1>
          <p className="text-sm text-zinc-500 mt-1">Select an activity to launch.</p>
        </div>
      </div>

      {activities.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">Loading activities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <div key={act.id} className="glass flex flex-col overflow-hidden group hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
              
              <div className="h-40 relative flex items-center justify-center border-b border-black/5 overflow-hidden">
                {ACTIVITY_IMAGES[act.id] ? (
                  <img src={ACTIVITY_IMAGES[act.id]} alt={act.name} className="absolute inset-0 w-full h-full object-cover z-0" />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-surface to-white z-0" />
                )}
                
                <div className="absolute inset-0 bg-black/5 z-0" />

                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur text-[10px] text-brand border-none font-bold uppercase tracking-wider shadow-sm">
                    {act.domain.replace("_", " ")}
                  </Badge>
                </div>
                <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-white transition-all">
                  <Play className="w-6 h-6 text-brand ml-1" />
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <h3 className="font-bold text-lg text-zinc-900 group-hover:text-brand transition-colors">{act.id} — {act.name}</h3>
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
                  <button onClick={() => launchActivity(act.id)} className="flex-1 btn-primary py-2 text-sm font-semibold group-hover:bg-brand-dark transition-colors">
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
