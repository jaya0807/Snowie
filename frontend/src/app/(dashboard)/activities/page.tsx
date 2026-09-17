"use client";
import { useToast } from "@/components/ui/Toast";

import { useRouter } from "next/navigation";
import { Play, Settings2, BarChart2, CheckCircle2, ShieldAlert, Activity } from "lucide-react";
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
  const { toast } = useToast();
  
    const [activities] = useState<any[]>([
    { id: "A1", name: ACTIVITY_OVERRIDES["A1"].name, domain: "social", description: ACTIVITY_OVERRIDES["A1"].description, difficulty_levels: [1] },
    { id: "A2", name: ACTIVITY_OVERRIDES["A2"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A2"].description, difficulty_levels: [1, 2, 3] },
    { id: "A3", name: ACTIVITY_OVERRIDES["A3"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A3"].description, difficulty_levels: [1, 2, 3] },
    { id: "A4", name: ACTIVITY_OVERRIDES["A4"].name, domain: "motor", description: ACTIVITY_OVERRIDES["A4"].description, difficulty_levels: [1, 2, 3, 4, 5] },
    { id: "A5", name: ACTIVITY_OVERRIDES["A5"].name, domain: "social", description: ACTIVITY_OVERRIDES["A5"].description, difficulty_levels: [1, 2] },
    { id: "A6", name: ACTIVITY_OVERRIDES["A6"].name, domain: "cognitive", description: ACTIVITY_OVERRIDES["A6"].description, difficulty_levels: [1, 2] }
  ]);
  
  const [pausedActivity, setPausedActivity] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [masterActive, setMasterActive] = useState(false);
  const [hasHistory, setHasHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("paused_activity");
    if (saved) setPausedActivity(saved);

    const checkStatus = async () => {
      try {
        const res = await fetch("http://localhost:8001/api/master/status");
        const data = await res.json();
        setHasHistory(data.has_history);
      } catch (e) {}
    };
    checkStatus();

    const isMasterActive = localStorage.getItem("master_session_active") === "true";
    if (!isMasterActive) {
      setShowModal(true);
    } else {
      setMasterActive(true);
    }
  }, []);

  const handleStartNew = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/master/start", { method: "POST" });
      const data = await res.json();
      localStorage.setItem("master_session_id", data.session_id);
      localStorage.setItem("master_session_active", "true");
      localStorage.setItem("forceNewSession", "true");
      setMasterActive(true);
      setShowModal(false);
      toast(`New Master Session (${data.session_id}) started.`);
    } catch(e) {
      toast("Error starting session");
    }
  };

  const handleResume = async () => {
    try {
      const res = await fetch("http://localhost:8001/api/master/resume", { method: "POST" });
      const data = await res.json();
      localStorage.setItem("master_session_id", data.session_id);
      localStorage.setItem("master_session_active", "true");
      localStorage.removeItem("forceNewSession");
      setMasterActive(true);
      setShowModal(false);
      toast(`Resumed Session ${data.session_id}`);
    } catch(e) {
      toast("Error resuming session");
    }
  };

  const handleEndSession = async () => {
    const sessionId = localStorage.getItem("master_session_id");
    toast("Ending session & generating AI Report...");
    try {
      if (sessionId) {
        await fetch(`http://localhost:8001/api/master/end?session_id=${sessionId}`, { method: "POST" });
      }
      localStorage.removeItem("master_session_active");
      localStorage.removeItem("master_session_id");
      localStorage.removeItem("forceNewSession");
      toast("AI Report ready!");
      router.push("/dashboard");
    } catch(e) {
      toast("Error ending session");
    }
  };

    const launchActivity = (activityId: string, isResume: boolean = false) => {
    toast(`Activity ${activityId} ${isResume ? 'resumed' : 'launched'} successfully`);
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
        {masterActive && (
          <button 
            onClick={handleEndSession}
            className="px-4 py-2 rounded-lg font-semibold transition-colors bg-red-100 text-red-700 hover:bg-red-200"
          >
            End Session
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-brand" />
              </div>
            </div>
            <h2 className="text-xl font-bold text-center text-zinc-900 mb-2">Master Session</h2>
            <p className="text-zinc-500 text-center text-sm mb-6">How would you like to proceed with the clinical session?</p>
            <div className="flex flex-col gap-3">
              <button onClick={handleStartNew} className="w-full btn-primary py-3 rounded-lg font-semibold">
                Start New Session
              </button>
              <button 
                onClick={handleResume} 
                disabled={!hasHistory}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${hasHistory ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700" : "bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50"}`}
                title={!hasHistory ? "No previous sessions found to resume" : ""}
              >
                Resume Session
              </button>
            </div>
          </div>
        </div>
      )}

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



                <div className="mt-6 flex gap-3">
                  {pausedActivity === act.id ? (
                    <>
                      <button onClick={() => launchActivity(act.id, true)} className="flex-1 btn-warning py-2 text-sm font-semibold transition-colors">
                        Resume Activity
                      </button>
                      <button onClick={(e) => clearProgress(e, act.id)} className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg transition-colors" title="Restart from beginning">
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
