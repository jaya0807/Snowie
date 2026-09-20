"use client";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sprout, ArrowRight, BrainCircuit, Play } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
export default function GrowPage() {
  const [plan, setPlan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const patientId = user?.children?.[0]?.id || "P1";

  



    useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`}/api/grow/recommend?patient_id=${patientId}`)
      .then(res => res.json())
      .then(data => {
        if (data.recommendation) {
          setPlan([{
            goal: data.recommendation.goal_text || "Improve completion of two-step instructions",
            activity: "Activity " + data.recommendation.activity_id + " Recommended",
            difficulty: data.recommendation.recommended_difficulty,
            reason: data.reason
          }]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">GROW Care Plan</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">Recommended Session Plan</h2>
          
          {loading ? (
            <p className="text-sm text-zinc-500">Generating AI recommendations...</p>
          ) : (
            plan.map((item, idx) => (
              <div key={idx} className="glass p-5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <p className="text-xs font-medium text-brand mb-1">Targeting Goal</p>
                    <h3 className="font-semibold text-zinc-900 text-sm">{item.goal}</h3>
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 hidden md:block shrink-0" />
                  <div className="bg-brand-surface-alt border border-brand-border px-4 py-3 rounded-lg flex items-center gap-3 md:w-1/2">
                    <Play className="w-4 h-4 text-brand shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-zinc-900">{item.activity}</p>
                      <p className="text-xs text-zinc-500 uppercase">Difficulty: {item.difficulty}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-50 p-3 rounded border border-black/5 flex items-start gap-2">
                  <BrainCircuit className="w-4 h-4 text-brand mt-0.5 shrink-0" />
                  <p className="text-xs text-zinc-600 leading-relaxed"><span className="font-semibold text-zinc-900">AI Logic:</span> {item.reason}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="space-y-4">
          <div className="glass p-5">
            <h2 className="text-sm font-bold text-zinc-900 mb-2">Engine Status</h2>
            <p className="text-xs text-zinc-500 mb-4">The GROW engine converts professional goals and observed performance into structured developmental practice. It does not automatically prescribe medical treatment.</p>
            <button className="w-full btn-primary px-4 py-2 text-sm font-medium">
              Approve Approve & Start in Child Mode Launch
            </button>
            <button className="w-full btn-secondary mt-2 px-4 py-2 text-sm font-medium">
              Start in Parent Mode            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
