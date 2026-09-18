import React, { useState, useEffect } from "react";
import { Download, Plus, Activity, Brain, Clock, AlertTriangle, FileText, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PatientReport({ selectedPatient }: { selectedPatient: any }) {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedPatient?.id) {
      setLoading(true);
      fetch(`http://localhost:8000/api/clinician/patients/${selectedPatient.id}`)
        .then(res => res.json())
        .then(data => {
          setDetails(data);
          setLoading(false);
        });
    }
  }, [selectedPatient?.id]);

  if (!selectedPatient) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-zinc-400 p-8 text-center">
        <FileText className="w-16 h-16 mb-4 text-zinc-200" />
        <h3 className="text-lg font-semibold text-zinc-900 mb-2">No patient selected</h3>
        <p>Select a patient from the list on the left to view their detailed behavioral report and session history.</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 border-b border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold text-xl">
            {selectedPatient.initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{selectedPatient.name}</h1>
            <div className="flex items-center gap-3 text-sm text-zinc-500 mt-1">
              <span>Age: {selectedPatient.age}</span>
              <span className="w-1 h-1 rounded-full bg-zinc-300" />
              <span>DOB: {selectedPatient.dob}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Note
          </button>
          <button className="btn-primary px-4 py-2 text-sm font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6 space-y-6">
        {details?.reviewAlert && (
          <div className="bg-warning-bg border border-warning-light/50 p-4 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-warning-dark shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-warning-dark text-sm">Review Recommended</h4>
              <p className="text-sm text-warning-dark/80 mt-1">
                {details.reviewAlert}
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center">
                <Activity className="w-5 h-5 text-brand" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Visual Focus</p>
                <p className="text-xl font-bold text-zinc-900">{details?.visualFocus || "—"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center">
                <Brain className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Gaze Shifts</p>
                <p className="text-xl font-bold text-zinc-900">{details?.gazeShifts || "—"}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-zinc-700" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 font-medium">Avg Sustained Gaze</p>
                <p className="text-xl font-bold text-zinc-900">{details?.sustainedGaze || "—"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass">
            <CardHeader className="pb-3 border-b border-black/5">
              <CardTitle className="text-base">Behavioral Trends (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-700">Visual Attention</span>
                  <span className="text-zinc-900 font-bold">{details?.trends?.visualAttention || 0}%</span>
                </div>
                <Progress value={details?.trends?.visualAttention || 0} className={`h-2 [&>div]:${(details?.trends?.visualAttention || 0) >= 80 ? 'bg-success' : 'bg-warning'}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-700">Emotional Regulation</span>
                  <span className="text-zinc-900 font-bold">{details?.trends?.emotionalRegulation || 0}%</span>
                </div>
                <Progress value={details?.trends?.emotionalRegulation || 0} className={`h-2 [&>div]:${(details?.trends?.emotionalRegulation || 0) >= 80 ? 'bg-success' : 'bg-warning'}`} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-zinc-700">Task Completion</span>
                  <span className="text-zinc-900 font-bold">{details?.trends?.taskCompletion || 0}%</span>
                </div>
                <Progress value={details?.trends?.taskCompletion || 0} className={`h-2 [&>div]:${(details?.trends?.taskCompletion || 0) >= 80 ? 'bg-success' : 'bg-warning'}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="glass flex flex-col h-full">
            <CardHeader className="pb-3 border-b border-black/5">
              <CardTitle className="text-base">Latest Clinical Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-auto">
              <div className="divide-y divide-black/5">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Today, 2:30 PM</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    {details?.notes}
                  </p>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2 text-xs text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Oct 12, 10:00 AM</span>
                  </div>
                  <p className="text-sm text-zinc-700 leading-relaxed">
                    Excellent progress on task completion. Engagement remained above 80% for the entire 20-minute block.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
