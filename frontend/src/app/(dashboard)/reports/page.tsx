"use client";
import { EmptyState } from "@/components/ui/EmptyState";
import { FileText, Download, Printer, Filter, ChevronRight, Activity, Eye, Target, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/Toast";

export default function ReportsView() {
    const [reports, setReports] = useState<any[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [reportDetails, setReportDetails] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const { toast } = useToast();

  

  useEffect(() => {
    if (selectedReportId) {
      setReportDetails(null);
      fetch(`http://localhost:8000/api/reports/${selectedReportId}`)
        .then(res => res.json())
        .then(json => {
          setReportDetails(json.sections);
        })
        .catch(err => console.error("Failed to fetch report details:", err));
    }
  }, [selectedReportId]);


    useEffect(() => {
    fetch("http://localhost:8000/api/reports")
      .then(res => res.json())
      .then(json => {
        if (json.reports && json.reports.length > 0) {
          setReports(json.reports);
          setSelectedReportId(json.reports[0].id);
        }
      })
      .catch(err => console.error("Failed to fetch reports:", err));
  }, []);


  const filteredReports = reports.filter(report => {
    const matchesSearch = report.id.toLowerCase().includes(searchQuery.toLowerCase()) || report.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate ? report.date.startsWith(selectedDate) : true;
    return matchesSearch && matchesDate;
  });

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mb-1">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-brand">AI Reports</span>
            {selectedReportId && (
              <>
                <ChevronRight className="w-3 h-3 text-zinc-400" />
                <span className="text-brand">{selectedReportId}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">AI-Assisted Reports</h1>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Column - List */}
        <div className="flex flex-col h-full pr-2">
          
          <div className="flex gap-2 mb-4 shrink-0">
            <input 
              type="text" 
              placeholder="Search..." 
              className="flex-1 text-sm bg-white border border-zinc-200 rounded-lg px-3 py-2 outline-none focus:border-brand shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <input 
              type="date" 
              className="text-sm bg-white border border-zinc-200 rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-brand shadow-sm shrink-0"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pb-4">
          {reports.length === 0 && (
            <div className="p-8 text-center text-zinc-500 bg-white rounded-xl border border-black/5">
              <FileText className="w-8 h-8 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No reports available.</p>
              <p className="text-xs mt-1 opacity-70">Complete an activity session to generate AI reports.</p>
            </div>
          )}
          {filteredReports.map((report) => (
            <div 
              key={report.id} 
              onClick={() => setSelectedReportId(report.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                selectedReportId === report.id 
                  ? "bg-white border-brand shadow-[0_4px_14px_0_rgba(23,107,156,0.12)] ring-1 ring-brand/20" 
                  : "bg-zinc-50 border-black/5 hover:bg-white hover:shadow-sm hover:border-black/10"
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-brand uppercase tracking-wider">{report.id}</span>
                <span className="text-[10px] text-zinc-500 font-medium">{report.date}</span>
              </div>
              <h3 className="font-semibold text-zinc-900 text-sm mb-1">{report.type}</h3>
              <div className="flex justify-between items-center mt-3">
                <Badge variant="outline" className="bg-brand/5 text-brand border-brand/20 text-[10px]">
                  {report.status}
                </Badge>
                <ChevronRight className={`w-4 h-4 ${selectedReportId === report.id ? "text-brand" : "text-zinc-300"}`} />
              </div>
            </div>
          ))}
        </div>

        </div>
        {/* Right Column - Report Preview */}
        <Card size="sm" className="lg:col-span-2 glass-panel flex flex-col h-full relative overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-black/5 bg-white shrink-0 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-zinc-900">Session Report</h2>
              <p className="text-xs text-zinc-500 mt-1">Generated by Evidence & Report Engine</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toast("Sending to printer...")} className="p-2 text-zinc-500 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors">
                <Printer className="w-4 h-4" />
              </button>
              <button onClick={() => toast("Report downloaded successfully")} className="p-2 text-zinc-500 hover:text-brand hover:bg-brand/5 rounded-lg transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto bg-zinc-50/50 p-6">
            {reports.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <BrainCircuit className="w-16 h-16 mb-4 opacity-20" />
                <h3 className="font-semibold text-zinc-700">Awaiting Session Data</h3>
                <p className="text-sm mt-2 max-w-sm text-center">Snowie's AI engine will automatically generate clinical reports here once you complete a live session.</p>
              </div>
            ) : !reportDetails ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <FileText className="w-12 h-12 mb-4 opacity-20 animate-pulse" />
                <p>Generating evidence-backed report...</p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto bg-white p-8 shadow-sm border border-black/5 rounded-lg space-y-8">
                
                {Object.values(reportDetails).map((section: any, idx) => (
                  <div key={idx}>
                    <h3 className="text-sm font-bold text-brand uppercase tracking-wider mb-3 border-b border-brand/10 pb-2">
                      {section.title}
                    </h3>
                    <p className="text-sm text-zinc-700 leading-relaxed">
                      {section.content}
                    </p>
                    {section.system_limitation && (
                      <div className="mt-4 p-3 bg-warning-bg rounded border border-warning-border">
                        <p className="text-xs text-warning-dark font-medium italic">
                          Disclaimer: {section.system_limitation}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
