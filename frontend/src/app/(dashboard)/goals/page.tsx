"use client";
import { Target, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

import { useAuth } from "@/context/AuthContext";
export default function GoalsPage() {
  const [goals, setGoals] = useState<any[]>([]);
  const { user } = useAuth();
  const patientId = user?.children?.[0]?.id || "P1";

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`}/api/grow/goals?patient_id=${patientId}`)
      .then(res => res.json())
      .then(data => setGoals(data))
      .catch(err => console.error(err));
  }, []);

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
          <Target className="w-5 h-5 text-brand" />
          <h2 className="text-lg font-bold text-zinc-900">Active Objectives</h2>
        </div>

        <div className="space-y-4">
          {goals.map(goal => (
            <div key={goal.goal_id} className="bg-white border border-black/5 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${goal.status === 'ACTIVE' ? 'bg-success' : 'bg-warning'}`}></div>
                  <h3 className="font-semibold text-zinc-900">{goal.domain}</h3>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  goal.status === 'ACTIVE' ? 'bg-success-light/20 text-success-dark' : 'bg-warning-light/20 text-warning-dark'
                }`}>
                  {goal.status}
                </span>
              </div>

              <p className="text-sm text-zinc-600 mb-6">{goal.goal_text}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-50 rounded-lg p-3 border border-black/5">
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1 font-medium uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5" /> Baseline
                  </div>
                  <span className="font-bold text-zinc-900">{goal.baseline}</span>
                </div>
                <div className="bg-brand-surface rounded-lg p-3 border border-brand/10">
                  <div className="flex items-center gap-2 text-xs text-brand mb-1 font-medium uppercase tracking-wider">
                    <TrendingUp className="w-3.5 h-3.5" /> Target
                  </div>
                  <span className="font-bold text-brand-dark">{goal.target}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
