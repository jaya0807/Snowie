"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Brain, Clock, Target, ArrowUpRight, ArrowDownRight, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

import { useAuth } from "@/context/AuthContext";
export function ParentDashboard({ patientId: propPatientId, isClinicianView = false }: { patientId?: string, isClinicianView?: boolean }) {
  const { user } = useAuth();
  const patientId = propPatientId || user?.children?.[0]?.id || "P1";
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  
  const [data, setData] = useState<any>({
    stats: { 
      totalSessions: { value: "0", trend: "-", isPositive: true, label: "Total Sessions" }, 
      headOrientation: { value: "—", trend: "-", isPositive: true, label: "Head Orientation" }, 
      bodyMovement: { value: "—", handFlapping: "—", repeatedMovements: "—", label: "Body Movement" }, 
      eyeTracking: { value: "—", trend: "-", isPositive: true, label: "Eye Tracking" } 
    },
    recentSessions: [],
    responseLatencyData: [],
    interactionDurationData: []
  });

  useEffect(() => {
    setIsMounted(true);
    const query = new URLSearchParams();
    query.append("patient_id", patientId);
    if (selectedDate) query.append("date", selectedDate);
    
    fetch(`http://${window.location.hostname}:8000/api/dashboard?${query.toString()}`)
      .then(res => res.json())
      .then(json => {
        if (json.stats) {
          setData(json);
        }
      })
      .catch(err => {
        // Fallback on error
      });
  }, [selectedDate, patientId]);

  const statsList = [
    { ...data.stats.totalSessions, icon: Activity },
    { ...data.stats.headOrientation, icon: Brain },
    { ...data.stats.bodyMovement, icon: Target },
    { ...data.stats.eyeTracking, icon: Eye }
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold tracking-wider uppercase mb-1">
            <span>Dashboard</span>
            <span className="w-1 h-1 rounded-full bg-zinc-300" />
            <span className="text-brand">Overview</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        </div>
        {!isClinicianView && (
          <div className="flex gap-3">
            <button onClick={() => router.push('/reports')} className="btn-secondary px-4 py-2 text-sm font-medium transition-colors">
              Generate Report
            </button>
            <button onClick={() => router.push('/activities')} className="btn-primary px-4 py-2 text-sm font-medium transition-colors">
              Play Activity
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {statsList.map((stat, i) => (
          <Card key={i} className="glass group hover:bg-white transition-all duration-300 relative overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{stat.label}</CardTitle>
              <div className="p-2 bg-brand/5 rounded-lg border border-brand/10">
                <stat.icon className="w-4 h-4 text-brand" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10 flex-1 flex flex-col">
              <div className="text-2xl font-black text-zinc-900 tracking-tight">{stat.value}</div>
              
              {stat.label === "Body Movement" ? (
                <>
                  <div className="mt-auto pt-3 flex items-center text-xs text-zinc-600 w-full">
                    <div className="flex flex-col flex-1">
                      <span>Hand Flapping</span>
                      <span className="font-medium mt-0.5">{stat.handFlapping}</span>
                    </div>
                    <div className="w-px h-8 bg-zinc-200 mx-2" />
                    <div className="flex flex-col flex-1 pl-2">
                      <span>Repetitive</span>
                      <span className="font-medium mt-0.5">{stat.repeatedMovements}</span>
                    </div>
                  </div>
                </>
              ) : stat.trend && stat.trend !== 'Nil' && stat.trend !== '-' ? (
                <p className={`text-xs mt-auto pt-4 font-medium flex items-center gap-1 ${stat.isPositive ? 'text-brand' : 'text-zinc-500'}`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {stat.trend}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1 min-h-0">
        
        {/* GRAPH 1: Response Latency */}
        <Card size="sm" className="glass flex flex-col h-full">
          <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
              <Clock className="w-4 h-4 text-brand" />
              Response Latency
            </CardTitle>
            <input 
              type="date" 
              className="text-[10px] text-zinc-500 bg-zinc-100/50 border border-black/5 rounded px-2 py-1 outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </CardHeader>
          <CardContent className="flex-1 min-h-0 relative">
            {!isMounted || !data.responseLatencyData || data.responseLatencyData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                <Clock className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No response latency data available yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.responseLatencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis domain={[0, 5]} axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#176B9C', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="latency" stroke="#176B9C" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#176B9C' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#176B9C' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* GRAPH 2: Interaction Duration */}
        <Card size="sm" className="glass flex flex-col h-full">
          <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
              <Activity className="w-4 h-4 text-brand" />
              Interaction Duration
            </CardTitle>
            <input 
              type="date" 
              className="text-[10px] text-zinc-500 bg-zinc-100/50 border border-black/5 rounded px-2 py-1 outline-none cursor-pointer hover:bg-zinc-100 transition-colors"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </CardHeader>
          <CardContent className="flex-1 min-h-0 relative">
            {!isMounted || !data.interactionDurationData || data.interactionDurationData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400">
                <Activity className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-sm">No interaction duration data available yet</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.interactionDurationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" opacity={0.5} />
                  <XAxis dataKey="name" axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                  <YAxis domain={[0, 30]} axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                    itemStyle={{ color: '#176B9C', fontWeight: 600 }}
                  />
                  <Line type="monotone" dataKey="duration" stroke="#176B9C" strokeWidth={3} dot={{ r: 4, strokeWidth: 0, fill: '#176B9C' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#176B9C' }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
