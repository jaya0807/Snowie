"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Brain, Target, MessageCircle, ArrowRight, UserCheck, Flame, X, Play, Info } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ActivitiesPage() {
  const [search, setSearch] = useState("");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const router = useRouter();

  const activities = [
    {
      id: "A1",
      name: "Natural Interaction",
      description: "Robot greets the child and asks simple baseline questions (name, favorite animal) without prompting.",
      difficulty: "Low",
      icon: <MessageCircle className="w-5 h-5 text-zinc-900" />,
      metrics: ["Response Latency", "Head Orientation", "Baseline Movement"],
      protocol: "1. Ensure child is comfortably seated facing the camera.\n2. Do not issue any demands.\n3. Ask an open-ended question like 'What is your favorite animal?'\n4. Wait 10 seconds for a response without prompting again.",
      expected: "Child exhibits natural baseline posture and engaged head orientation."
    },
    {
      id: "A2",
      name: "Follow Instruction",
      description: "Child is asked to follow 1-step to 3-step physical instructions (e.g., 'Touch the red circle').",
      difficulty: "Low→High",
      icon: <Brain className="w-5 h-5 text-zinc-900" />,
      metrics: ["Accuracy", "Completion Rate", "Latency"],
      protocol: "1. Present the target objects clearly.\n2. Issue a 1-step instruction ('Touch the red block').\n3. If successful, increase to 2-step ('Touch red, then blue').\n4. Measure the latency between instruction completion and child movement.",
      expected: "Child touches the correct sequence of objects within the time limit."
    },
    {
      id: "A3",
      name: "Visual Target Finding",
      description: "Child must locate a specific object among 4 to 12 distractors on a screen or table.",
      difficulty: "Low→High",
      icon: <Target className="w-5 h-5 text-zinc-900" />,
      metrics: ["Target Response Time", "Head Orientation", "Errors"],
      protocol: "1. Display 4 objects (Easy mode).\n2. Ask 'Can you find the star?'\n3. Increase distractors up to 12 if performance is strong.\n4. Observe gaze and head orientation changes.",
      expected: "Head orientation shifts toward the target, followed by selection."
    },
    {
      id: "A4",
      name: "Imitation",
      description: "Robot demonstrates a motor action (clap, raise hand) and asks 'Can you do this?'.",
      difficulty: "Low→Medium",
      icon: <UserCheck className="w-5 h-5 text-zinc-900" />,
      metrics: ["Pose Matching", "L/R Correspondence", "Completion"],
      protocol: "1. Gain the child's attention.\n2. Say 'Can you do this?' and perform a gross motor action (e.g., raise both hands).\n3. Maintain the pose for 5 seconds.\n4. Note if the child mirrors the left/right sides correctly.",
      expected: "Child's body landmarks match the demonstrated pose within 3 seconds."
    },
    {
      id: "A5",
      name: "Emotion / Social",
      description: "Show a simple face/scene and ask the child to identify the correct emotion (happy, sad).",
      difficulty: "Low→Medium",
      icon: <Brain className="w-5 h-5 text-zinc-900" />,
      metrics: ["Task Correctness", "Verbal Response", "Latency"],
      protocol: "1. Display a clear illustration of an emotion.\n2. Ask 'How is this person feeling?'\n3. Wait for verbal response or pointing selection.\n4. Do not infer broad emotional capability from a single failure.",
      expected: "Accurate identification of the designed emotion."
    },
    {
      id: "A6",
      name: "Controlled Challenge",
      description: "Keep the task similar while systematically increasing demand/speed to observe frustration tolerance.",
      difficulty: "Medium→High",
      icon: <Flame className="w-5 h-5 text-zinc-900" />,
      metrics: ["Repetitive Movement", "Abandonment", "Help Requests"],
      protocol: "1. Select a task the child has mastered (e.g., sorting).\n2. Artificially decrease the time limit or increase the volume of sorting.\n3. Carefully monitor for self-stimulatory behavior (repetitive movement) or looking away.",
      expected: "Observe coping mechanisms; task completion is secondary."
    }
  ];

  const startSession = () => {
    // In a real app, we might check if a patient is active first.
    router.push(`/sessions?activity=${selectedActivity.id}`);
  };

  return (
    <div className="space-y-6 relative h-full">
      {/* MODAL OVERLAY */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-black/5 bg-zinc-50 flex justify-between items-start shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-lg shadow-sm border border-black/5">
                  {selectedActivity.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-black text-brand tracking-wider uppercase">{selectedActivity.id}</span>
                    <Badge variant="outline" className="text-[10px] bg-white text-zinc-500 border-zinc-200 uppercase">
                      Diff: {selectedActivity.difficulty}
                    </Badge>
                  </div>
                  <h2 className="text-xl font-bold text-zinc-900">{selectedActivity.name}</h2>
                </div>
              </div>
              <button 
                onClick={() => setSelectedActivity(null)}
                className="p-2 text-zinc-400 hover:text-zinc-900 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Info className="w-3.5 h-3.5" /> Purpose
                </h3>
                <p className="text-sm text-zinc-700 leading-relaxed bg-brand/5 p-4 rounded-lg border border-brand/10">
                  {selectedActivity.description}
                </p>
              </div>

              <div>
                <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Clinical Protocol</h3>
                <div className="bg-white border border-black/5 rounded-lg p-4 shadow-sm">
                  <ul className="text-sm text-zinc-700 space-y-2">
                    {selectedActivity.protocol.split('\n').map((step: string, i: number) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-brand font-bold">{step.split('.')[0]}.</span>
                        <span>{step.substring(step.indexOf('.') + 1)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Expected Outcome</h3>
                  <p className="text-sm text-zinc-700">{selectedActivity.expected}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Tracked AI Metrics</h3>
                  <div className="flex flex-col gap-1.5">
                    {selectedActivity.metrics.map((metric: string) => (
                      <div key={metric} className="flex items-center gap-2 text-sm text-zinc-700">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand"></div>
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-black/5 bg-zinc-50 flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setSelectedActivity(null)}
                className="btn-secondary px-6 py-2.5"
              >
                Close
              </button>
              <button 
                onClick={startSession}
                className="flex items-center gap-2 btn-primary px-6 py-2.5 shadow-md"
              >
                <Play className="w-4 h-4" />
                Start in Parent Mode
              </button>
              <button
                onClick={() => router.push(`/child?activity=${selectedActivity.id}`)}
                className="flex items-center gap-2 btn-secondary bg-brand text-white hover:bg-brand-dark px-6 py-2.5 shadow-md"
              >
                <Play className="w-4 h-4" />
                Start in Child Mode              </button>
            </div>
            
          </div>
        </div>
      )}

      {/* PAGE CONTENT */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">AI Activity Library</h1>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search activities..." 
              className="pl-9 pr-4 py-2 bg-white border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())).map(activity => (
          <Card 
            key={activity.id} 
            onClick={() => setSelectedActivity(activity)}
            className="bg-white border-black/5 shadow-sm overflow-hidden flex flex-col hover:border-brand/30 hover:shadow-md transition-all cursor-pointer group"
          >
            <CardHeader className="pb-3 border-b border-black/5">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand/10 rounded-lg group-hover:bg-brand/20 transition-colors">
                    {activity.icon}
                  </div>
                  <span className="font-black text-xl text-zinc-300 group-hover:text-brand/50 transition-colors">{activity.id}</span>
                </div>
                <Badge variant="outline" className="text-[10px] bg-zinc-50 text-zinc-500 border-zinc-200 uppercase tracking-wider font-bold">
                  {activity.difficulty}
                </Badge>
              </div>
              <CardTitle className="text-lg mt-4 text-zinc-900 group-hover:text-brand transition-colors">{activity.name}</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex-1 flex flex-col">
              <p className="text-sm text-zinc-500 mb-5 flex-1 leading-relaxed line-clamp-2">
                {activity.description}
              </p>
              <div>
                <p className="text-[10px] font-bold tracking-wider text-zinc-400 uppercase mb-2">Tracked AI Metrics</p>
                <div className="flex flex-wrap gap-2">
                  {activity.metrics.map(metric => (
                    <span key={metric} className="px-2 py-1 bg-zinc-50 border border-black/5 rounded text-xs text-zinc-600 font-medium">
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-5 pt-4 border-t border-black/5 flex items-center justify-between text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-bold">View Protocol</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
