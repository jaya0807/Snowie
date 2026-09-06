"use client";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

import { FileText, Download, Printer, Filter, ChevronRight, Activity, Eye, Target, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { useState, useEffect } from "react";

export default function ReportsView() {
  const searchParams = useSearchParams();
  const hasActivePatient = searchParams.get("patient") !== "none";
  const [reports, setReports] = useState([
    { id: "R-1042", patient: "Aarav M.", date: "Loading...", type: "Session Summary", status: "Ready for Review" }
  ]);

  useEffect(() => {
    fetch("http://localhost:8001/api/reports")
      .then(res => res.json())
      .then(json => {
        if (json.reports && json.reports.length > 0) {
          setReports(json.reports);
        }
      })
      .catch(err => console.error("Failed to fetch reports:", err));
  }, []);


  if (!hasActivePatient) return <EmptyState title="AI Reports" />;

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI-Assisted Reports</h1>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 btn-secondary px-4 py-2 text-sm font-medium">
            <Filter className="w-4 h-4" /> Filter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        {/* Left Column - Report List */}
        <Card size="sm" className="glass flex flex-col h-[calc(100vh-140px)]">
          <CardHeader className="border-b border-black/5">
            <CardTitle className="text-sm font-medium">Recent Reports</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-3 space-y-2">
            {reports.map((report, i) => (
              <div 
                key={report.id} 
                className={`p-3 rounded-lg flex items-center justify-between cursor-pointer transition-colors border ${
                  i === 0 ? 'bg-brand/5 border-white/20' : 'border-transparent hover:bg-zinc-50 hover:border-black/5'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{report.patient}</span>
                    {i === 0 && <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <FileText className="w-3 h-3" />
                    {report.type} • {report.date}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 ${i === 0 ? 'text-zinc-900' : 'text-zinc-500'}`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right Column - Report Preview */}
        <Card size="sm" className="lg:col-span-2 glass-panel flex flex-col h-[calc(100vh-140px)] relative overflow-hidden">
          <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
            <FileText className="w-12 h-12 mb-4 opacity-20" />
            <p>Select a report to view details.</p>
            <p className="text-xs mt-2 text-zinc-600">Report details are currently unavailable.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
