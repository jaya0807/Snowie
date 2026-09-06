"use client";
import { useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Clock, Target } from "lucide-react";
import { useState, useEffect } from "react";

export default function TrackPage() {
  const searchParams = useSearchParams();
  
  const [data, setData] = useState<any[]>([]);
  const [trendInfo, setTrendInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  


    useEffect(() => {
    fetch("http://localhost:8001/api/track/trends")
      .then(res => res.json())
      .then(resData => {
        if (resData.history) {
          setData(resData.history.map((d: any) => ({
            session: d.session_id,
            accuracy: Math.round(d.accuracy * 100),
            latency: d.response_time_sec
          })));
        }
        setTrendInfo(resData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

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

      {loading ? (
        <p className="text-sm text-zinc-500">Loading tracking data from ProgressTracker engine...</p>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass p-5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-sm font-bold text-zinc-900">Task Accuracy Trend</h2>
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Based on {trendInfo.sessions_supported || 0} sessions</p>
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
                  <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Based on {trendInfo.sessions_supported || 0} sessions</p>
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
                <span className="font-semibold text-zinc-900">Trend detected:</span> Across {trendInfo.sessions_supported} sessions, the accuracy trend is <span className="font-bold">{trendInfo.accuracy_trend}</span>, with an average response time of {trendInfo.average_response_time?.toFixed(2)} seconds.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
