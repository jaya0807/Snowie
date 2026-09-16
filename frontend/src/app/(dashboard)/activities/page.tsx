"use client";

import { useRouter } from "next/navigation";
import { Play, Settings2, BarChart2, CheckCircle2, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { RotateCcw } from "lucide-react";
import Image, { StaticImageData } from "next/image";

import imgA1 from "@/assets/activities/animal-adventure.jpg";
import imgA2 from "@/assets/activities/magic-mission.jpg";
import imgA3 from "@/assets/activities/treasure-hunt.jpg";
import imgA4 from "@/assets/activities/memory-quest.jpg";
import imgA5 from "@/assets/activities/feel-o-meter.jpg";
import imgA6 from "@/assets/activities/super-challenge.jpg";


const ACTIVITY_OVERRIDES: Record<string, { name: string, description: string }> = {
  "A1": { name: "🐾 Animal Adventure", description: "Meet friendly animal characters and enjoy a fun conversation adventure." },
  "A2": { name: "✨ Magic Mission", description: "Complete magical missions and find the right objects along the way." },
  "A3": { name: "🏴☠️ Treasure Hunt", description: "Explore the island and find hidden treasures among the objects." },
  "A4": { name: "🧠✨ Memory Quest", description: "Listen carefully, remember what you hear, and complete each memory challenge." },
  "A5": { name: "😊 Feel-O-Meter", description: "Explore everyday situations and discover feelings, emotions, and kind responses." },
  "A6": { name: "🚀 Super Challenge", description: "Take on fun challenges that become more exciting as you progress." }
};

const ACTIVITY_IMAGES: Record<string, StaticImageData> = {
  "A1": imgA1,
  "A2": imgA2,
  "A3": imgA3,
  "A4": imgA4,
  "A5": imgA5,
  "A6": imgA6,
};

export default function ActivitiesPage() {
  const router = useRouter();
  
    const [activities] = useState<any[]>([
    { id: "A1", name: ACTIVITY_OVERRIDES["A1"].name, domain: "social", description: ACTIVITY_OVERRIDES["A1"].description, difficulty_levels: [1] },
    { id: "A2", name: ACTIVITY_OVERRIDES["A2"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A2"].description, difficulty_levels: [1, 2, 3] },
    { id: "A3", name: ACTIVITY_OVERRIDES["A3"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A3"].description, difficulty_levels: [1, 2, 3] },
    { id: "A4", name: ACTIVITY_OVERRIDES["A4"].name, domain: "motor", description: ACTIVITY_OVERRIDES["A4"].description, difficulty_levels: [1, 2, 3, 4, 5] },
    { id: "A5", name: ACTIVITY_OVERRIDES["A5"].name, domain: "social", description: ACTIVITY_OVERRIDES["A5"].description, difficulty_levels: [1, 2] },
    { id: "A6", name: ACTIVITY_OVERRIDES["A6"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A6"].description, difficulty_levels: [1, 2] }
  ]);
  
  const [pausedActivity, setPausedActivity] = useState<string | null>(null);

  useEffect(() => {
    // Check if the user abandoned an activity mid-session
    const saved = localStorage.getItem("paused_activity");
    if (saved) {
      setPausedActivity(saved);
    }
  }, []);

  const launchActivity = (activityId: string, isResume: boolean = false) => {
    // Save to local storage so we know they started it
    localStorage.setItem("paused_activity", activityId);
    router.push(`/child?activity=${activityId}${isResume ? '&resume=true' : ''}`);
  };
  
  const clearProgress = (e: React.MouseEvent, activityId: string) => {
    e.stopPropagation();
    localStorage.removeItem("paused_activity");
    setPausedActivity(null);
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
                  <Image src={ACTIVITY_IMAGES[act.id]} alt={act.name} fill className="object-cover z-0" sizes="(max-width: 768px) 100vw, 33vw" priority />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-surface to-white z-0" />
                )}
                
                <div className="absolute inset-0 bg-black/5 z-0" />

                <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                  <Badge variant="outline" className="bg-white/90 backdrop-blur text-[10px] text-brand border-none font-bold uppercase tracking-wider shadow-sm">
                    {act.domain.replace("_", " ")}
                  </Badge>
                  {pausedActivity === act.id && (
                    <Badge className="bg-warning-dark text-white border-none font-bold text-[10px] uppercase tracking-wider shadow-sm">
                      In Progress
                    </Badge>
                  )}
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
                  {pausedActivity === act.id ? (
                    <>
                      <button onClick={() => launchActivity(act.id, true)} className="flex-1 bg-warning-bg text-warning-dark hover:bg-warning-light border border-warning-light py-2 rounded-xl text-sm font-bold transition-colors">
                        Resume Activity
                      </button>
                      <button onClick={(e) => clearProgress(e, act.id)} className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-xl transition-colors" title="Restart from beginning">
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button onClick={() => launchActivity(act.id)} className="flex-1 btn-primary py-2 text-sm font-semibold group-hover:bg-brand-dark transition-colors">
                      Launch Activity
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}
