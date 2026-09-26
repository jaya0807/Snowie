"use client";
import { FileText, Download, Printer, Filter, ChevronRight, Activity, Eye, Target, BrainCircuit, UserCheck, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function AIReports({ patientId: propPatientId, isClinicianView = false }: { patientId?: string, isClinicianView?: boolean }) {
  // Mock data pulling metrics concepts from Parents Monitor
  const mockReport = {
    id: "REP-9921",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    title: "Comprehensive Session Analysis",
    patient: "Aarav M.",
    activity: "Activity 4 (Imitation)",
    summary: "During this session, Aarav demonstrated excellent baseline attention but exhibited an increase in self-stimulatory behaviors (hand flapping and body rocking) when task complexity increased. Gaze tracking indicates strong central focus during the first 5 minutes, followed by occasional aversions.",
    metrics: [
      { label: "Gaze Aversions", value: "14", trend: "up", icon: Eye, color: "text-amber-500", bg: "bg-amber-500/10" },
      { label: "Hand Flapping", value: "6", trend: "up", icon: Activity, color: "text-red-500", bg: "bg-red-500/10" },
      { label: "Body Rocking", value: "2", trend: "down", icon: Activity, color: "text-indigo-500", bg: "bg-indigo-500/10" },
      { label: "Sustained Attention", value: "78%", trend: "up", icon: Target, color: "text-green-500", bg: "bg-green-500/10" },
    ],
    insights: [
      "Blink rate averaged 18 BPM, indicating normal cognitive load.",
      "Posture remained largely stable (92% stability), with brief erratic head movements detected at minute 6.",
      "No wrist posture anomalies or rapid flicking events were detected."
    ],
    recommendations: [
      "Introduce a 30-second sensory break before transitioning to higher-complexity tasks.",
      "Continue monitoring gaze aversions to see if they correlate with specific auditory cues.",
      "Praise and reinforce periods of stable posture and sustained attention."
    ]
  };

  return (
    <div className="w-full flex gap-8">
      {/* Sidebar: Report History */}
      <div className="w-1/3 flex flex-col gap-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-zinc-800">History</h2>
          <button className="p-2 bg-zinc-100 hover:bg-zinc-200 rounded-lg text-zinc-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        
        <Card className="p-4 border-l-4 border-l-brand cursor-pointer hover:shadow-md transition-shadow bg-brand-surface">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-zinc-900">{mockReport.title}</h3>
              <p className="text-sm text-zinc-500">{mockReport.date}</p>
            </div>
            <Badge className="bg-brand text-white">Latest</Badge>
          </div>
          <div className="text-sm font-medium text-brand-dark flex items-center gap-1 mt-3">
            <Activity className="w-4 h-4" /> {mockReport.activity}
          </div>
        </Card>

        {/* Older mock reports */}
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-4 border border-zinc-200 cursor-pointer hover:border-brand/50 transition-colors opacity-70">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-zinc-700">Routine Assessment</h3>
                <p className="text-sm text-zinc-400">Previous Session</p>
              </div>
            </div>
            <div className="text-sm font-medium text-zinc-500 flex items-center gap-1 mt-3">
              <Activity className="w-4 h-4" /> Activity {i}
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content: Report Details */}
      <div className="w-2/3 bg-white rounded-2xl shadow-sm border border-zinc-200 p-8">
        <div className="flex justify-between items-start mb-8 pb-6 border-b border-zinc-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="text-brand border-brand/30 bg-brand/5">
                {mockReport.id}
              </Badge>
              <Badge variant="outline" className="text-zinc-500">
                AI Generated
              </Badge>
            </div>
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{mockReport.title}</h1>
            <p className="text-zinc-500 mt-2 font-medium flex items-center gap-2">
              <UserCheck className="w-4 h-4" /> Patient: {mockReport.patient} • {mockReport.date}
            </p>
          </div>
          <div className="flex gap-2">
            <button className="p-2.5 text-zinc-600 hover:bg-zinc-100 rounded-xl transition-colors border border-zinc-200">
              <Printer className="w-5 h-5" />
            </button>
            <button className="p-2.5 text-brand hover:bg-brand/10 rounded-xl transition-colors border border-brand/20">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-brand" /> Executive Summary
          </h3>
          <div className="p-5 bg-zinc-50 rounded-xl border border-zinc-100 text-zinc-700 leading-relaxed">
            {mockReport.summary}
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand" /> Captured Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockReport.metrics.map((metric, i) => (
              <div key={i} className={`p-4 rounded-xl border border-zinc-100 flex flex-col items-center text-center ${metric.bg}`}>
                <metric.icon className={`w-8 h-8 mb-3 ${metric.color}`} />
                <span className="text-3xl font-black text-zinc-900 mb-1">{metric.value}</span>
                <span className="text-xs font-bold text-zinc-600 uppercase tracking-wider">{metric.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Insights */}
        <div className="mb-10">
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <Eye className="w-5 h-5 text-brand" /> Observation Insights
          </h3>
          <ul className="space-y-3">
            {mockReport.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-3 text-zinc-700">
                <div className="w-1.5 h-1.5 rounded-full bg-brand mt-2.5 flex-shrink-0" />
                <span className="leading-relaxed">{insight}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommendations */}
        <div>
          <h3 className="text-lg font-bold text-zinc-900 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" /> Recommendations
          </h3>
          <div className="bg-amber-50/50 rounded-xl p-5 border border-amber-100">
            <ul className="space-y-3">
              {mockReport.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-3 text-zinc-800 font-medium">
                  <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </div>
                  <span className="mt-0.5">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
