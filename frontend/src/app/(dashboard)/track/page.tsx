"use client";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Target } from "lucide-react";

export default function TrackPage() {
  const searchParams = useSearchParams();
  const hasActivePatient = searchParams.get("patient") !== "none";
  // Mock longitudinal data
  const data = [
    { session: 'S1', accuracy: 45, latency: 4.8 },
    { session: 'S2', accuracy: 50, latency: 4.2 },
    { session: 'S3', accuracy: 48, latency: 4.5 },
    { session: 'S4', accuracy: 65, latency: 3.8 },
    { session: 'S5', accuracy: 72, latency: 3.1 },
    { session: 'S6', accuracy: 80, latency: 2.8 },
  ];


  if (!hasActivePatient) return <EmptyState title="Progress Trends" />;

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Longitudinal Tracking</h1>
        </div>
        <select className="bg-white border border-black/5 text-sm rounded-md px-3 py-1.5 shadow-sm outline-none focus:ring-2 focus:ring-brand/20">
          <option>Last 6 Sessions</option>
          <option>Last 30 Days</option>
          <option>All Time</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="glass p-5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Task Accuracy Trend</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Based on 6 sessions</p>
            </div>
            <div className="w-8 h-8 rounded bg-brand/10 flex items-center justify-center">
              <Target className="w-4 h-4 text-brand" />
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#176B9C', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="accuracy" stroke="#176B9C" strokeWidth={3} dot={{ r: 4, fill: '#176B9C', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass p-5 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-zinc-900">Response Latency Trend</h2>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Based on 6 sessions</p>
            </div>
            <div className="w-8 h-8 rounded bg-warning-bg flex items-center justify-center">
              <Clock className="w-4 h-4 text-warning-dark" />
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="session" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} domain={['dataMin - 1', 'dataMax + 1']} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#F59E0B', fontWeight: 600 }}
                />
                <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
      
      <div className="glass p-5">
        <h2 className="text-sm font-bold text-zinc-900 mb-4">Longitudinal AI Observation</h2>
        <div className="bg-brand-surface-alt border border-brand-border p-4 rounded-lg flex items-start gap-3">
          <TrendingUp className="w-5 h-5 text-brand shrink-0" />
          <p className="text-sm text-zinc-700 leading-relaxed">
            <span className="font-semibold text-zinc-900">Trend detected:</span> Across the last three sessions, higher-demand task accuracy has steadily improved while response latency has decreased by an average of 1.4 seconds. This suggests familiarization and improved instruction-following capacity.
          </p>
        </div>
      </div>
    </div>
  );
}
