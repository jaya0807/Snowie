"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from 'next/dynamic';

const Activity1UI = dynamic(() => import('@/activities/a1_natural_interaction/Activity1UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
const Activity2UI = dynamic(() => import('@/activities/a2_follow_instruction/Activity2UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
const Activity3UI = dynamic(() => import('@/activities/a3_target_finding/Activity3UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
const Activity4UI = dynamic(() => import('@/activities/a4_imitation/Activity4UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
const Activity5UI = dynamic(() => import('@/activities/a5_emotion_social/Activity5UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
const Activity6UI = dynamic(() => import('@/activities/a6_controlled_challenge/Activity6UI'), { loading: () => <div className="h-screen w-full flex items-center justify-center bg-zinc-900 text-white font-bold text-2xl">Loading Activity...</div> });
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

function ChildContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activityId = searchParams.get("activity") || "A1";

  useEffect(() => {
    // Clear forceNewSession flag so it only applies once
    setTimeout(() => localStorage.removeItem("forceNewSession"), 2000);
    // Heartbeat to let the dashboard know a session is active
    localStorage.setItem("childLiveHeartbeat", Date.now().toString());
    const interval = setInterval(() => {
      localStorage.setItem("childLiveHeartbeat", Date.now().toString());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  
  if (activityId === "A1") return <Activity1UI />;
  if (activityId === "A2") return <Activity2UI />;
  if (activityId === "A3") return <Activity3UI />;
  if (activityId === "A4") return <Activity4UI />;
  if (activityId === "A5") return <Activity5UI />;
  if (activityId === "A6") return <Activity6UI />;

  return (
    <div className="h-screen w-screen bg-zinc-950 flex flex-col items-center justify-center font-sans text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Activity Not Found</h1>
        <p className="text-zinc-400 mb-8">The activity {activityId} does not exist or is still under construction.</p>
        <button 
          onClick={() => router.push('/activities')}
          className="flex items-center justify-center gap-2 text-white bg-brand hover:bg-brand-dark px-6 py-3 rounded-full transition-colors mx-auto"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Activities</span>
        </button>
      </div>
    </div>
  );
}

export default function ChildMode() {
  return (
    <Suspense fallback={<div className="h-screen w-screen bg-zinc-950 flex items-center justify-center text-white">Loading...</div>}>
      <ChildContent />
    </Suspense>
  );
}
