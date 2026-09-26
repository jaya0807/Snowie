"use client";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { StaticImageData } from "next/image";

import imgA1 from "@/assets/activities/animal-adventure.jpg";
import imgA2 from "@/assets/activities/magic-mission.jpg";
import imgA3 from "@/assets/activities/treasure-hunt.jpg";
import imgA4 from "@/assets/activities/memory-quest.jpg";
import imgA5 from "@/assets/activities/feel-o-meter.jpg";
import imgA6 from "@/assets/activities/super-challenge.jpg";

import { ActivityCard } from "./components/ActivityCard";
import { MasterSessionModal } from "./components/MasterSessionModal";

const ACTIVITY_OVERRIDES: Record<string, { name: string, description: string }> = {
  "A1": { name: "🐾 Animal Adventure", description: "Meet friendly animal characters and enjoy a fun conversation adventure." },
  "A2": { name: "✨ Magic Mission", description: "Complete magical missions and find the right objects along the way." },
  "A3": { name: "🏴☠️ Treasure Hunt", description: "Explore the island and find hidden treasures among the objects." },
  "A4": { name: "🧠✨ Memory Quest", description: "Listen carefully, remember what you hear, and complete each memory challenge." },
  "A5": { name: "😊 Feel-O-Meter", description: "Explore everyday situations and discover feelings, emotions, and kind responses." },
  "A6": { name: "🚀 Super Challenge", description: "Take on fun challenges that become more exciting as you progress." }
};

const ACTIVITY_IMAGES: Record<string, StaticImageData> = {
  "A1": imgA1, "A2": imgA2, "A3": imgA3, "A4": imgA4, "A5": imgA5, "A6": imgA6,
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
        const res = await fetch(`http://${window.location.hostname}:8001/api/master/status`);
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
      const res = await fetch(`http://${window.location.hostname}:8001/api/master/start`, { method: "POST" });
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
      const res = await fetch(`http://${window.location.hostname}:8001/api/master/resume`, { method: "POST" });
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
        await fetch(`http://${window.location.hostname}:8001/api/master/end?session_id=${sessionId}`, { method: "POST" });
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
        <MasterSessionModal hasHistory={hasHistory} onStartNew={handleStartNew} onResume={handleResume} />
      )}

      {activities.length === 0 ? (
        <div className="p-8 text-center text-zinc-500">Loading activities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act) => (
            <ActivityCard 
              key={act.id} 
              act={act} 
              image={ACTIVITY_IMAGES[act.id]} 
              pausedActivity={pausedActivity} 
              onLaunch={launchActivity} 
              onClear={clearProgress} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
