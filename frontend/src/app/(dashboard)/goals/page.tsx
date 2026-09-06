"use client";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

import { Target, Plus, TrendingUp, AlertCircle } from "lucide-react";

export default function GoalsPage() {
  const searchParams = useSearchParams();
  const hasActivePatient = searchParams.get("patient") !== "none";
  const goals = [
    { id: "G-001", domain: "Instruction Following", text: "Improve completion of two-step instructions", baseline: "60%", target: "80%", status: "ACTIVE" },
    { id: "G-002", domain: "Imitation", text: "Improve mirrored motor imitation latency", baseline: "4.2s", target: "< 2.0s", status: "ACTIVE" },
    { id: "G-003", domain: "Social / Emotion", text: "Identify basic emotions correctly", baseline: "40%", target: "75%", status: "REVIEW" },
  ];


  if (!hasActivePatient) return <EmptyState title="Clinical Goals" />;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Clinical Goals</h1>
        </div>
        <button className="flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium">
          <Plus className="w-4 h-4" />
          New Goal
        </button>
      </div>

      <div className="glass p-6">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-black/5">
          <AlertCircle className="w-5 h-5 text-brand" />
          <p className="text-sm text-zinc-600">The GROW engine automatically assigns activities based on these active goals.</p>
        </div>

        <div className="space-y-4">
          {goals.map((goal) => (
            <div key={goal.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-black/5 rounded-lg bg-zinc-50/50 hover:bg-white transition-colors">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold tracking-wider text-brand uppercase">{goal.domain}</span>
                  <span className={`px-2 py-0.5 text-[9px] font-bold rounded-sm ${goal.status === 'ACTIVE' ? 'bg-success-bg text-success' : 'bg-warning-bg text-warning-dark'}`}>
                    {goal.status}
                  </span>
                </div>
                <h3 className="font-semibold text-zinc-900 text-sm">{goal.text}</h3>
              </div>
              
              <div className="flex items-center gap-8 bg-white px-4 py-2 rounded-md border border-black/5 shadow-sm">
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">Baseline</p>
                  <p className="text-sm font-bold text-zinc-700">{goal.baseline}</p>
                </div>
                <TrendingUp className="w-4 h-4 text-zinc-300" />
                <div>
                  <p className="text-[10px] text-zinc-400 font-medium uppercase">Target</p>
                  <p className="text-sm font-bold text-brand">{goal.target}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
