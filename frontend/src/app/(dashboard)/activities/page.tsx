"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, Puzzle, Pencil, Cubes, Search } from "lucide-react";
import { useState } from "react";

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");

  const activities = [
    {
      id: "act-1",
      name: "Shape Sorting",
      description: "Assesses fine motor skills and geometric recognition. AI tracks grasp type and placement accuracy.",
      status: "Active",
      icon: <Puzzle className="w-5 h-5 text-brand" />,
      metrics: ["Grasp Pattern", "Completion Time", "Correction Attempts"]
    },
    {
      id: "act-2",
      name: "Free Drawing",
      description: "Evaluates sustained attention and tool use. AI monitors posture and eye-gaze distribution.",
      status: "Active",
      icon: <Pencil className="w-5 h-5 text-brand" />,
      metrics: ["Gaze Fixation", "Posture Stability", "Duration"]
    },
    {
      id: "act-3",
      name: "Block Stacking",
      description: "Measures spatial reasoning and bilateral coordination. AI detects hand-handoffs and balance adjustments.",
      status: "In Training",
      icon: <BrainCircuit className="w-5 h-5 text-zinc-500" />,
      metrics: ["Bilateral Hand Use", "Tremor/Instability", "Max Height"]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">AI Activity Library</h1>
          <p className="text-brand-muted text-sm mt-1">Manage and monitor the structured tasks the AI is trained to analyze.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              className="pl-9 pr-4 py-2 bg-white border border-brand/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand/90 transition-colors shadow-sm">
            + New Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase())).map(activity => (
          <Card key={activity.id} className="bg-white border-brand/10 shadow-sm overflow-hidden flex flex-col hover:border-brand/30 transition-colors cursor-pointer">
            <CardHeader className="pb-3 border-b border-brand/5">
              <div className="flex justify-between items-start">
                <div className="p-2 bg-brand-light rounded-lg">
                  {activity.icon}
                </div>
                <Badge variant="outline" className={`text-[10px] ${activity.status === 'Active' ? 'bg-success-bg text-success border-success/20' : 'bg-zinc-100 text-zinc-500 border-zinc-200'}`}>
                  {activity.status}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-4 text-brand-dark">{activity.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm text-brand-muted mb-4 flex-1">
                {activity.description}
              </p>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2">Tracked AI Metrics</p>
                <div className="flex flex-wrap gap-2">
                  {activity.metrics.map(metric => (
                    <span key={metric} className="px-2 py-1 bg-brand-surface border border-brand/10 rounded text-xs text-brand-dark">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
