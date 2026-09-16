"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, Timer } from "lucide-react";
import { useState, useEffect } from "react";

export default function TrackPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/track/trends")
      .then(res => res.json())
      .then(resData => {
        if (resData.history && Array.isArray(resData.history) && resData.history.length > 0) {
          setData(resData.history.map((d: any) => ({
            session: d.session_id || `S${d.id || '?'}`,
            latency: d.response_time_sec ?? d.latency ?? null,
            duration: d.interaction_duration_sec ?? d.duration ?? null
          })));
        }
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
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Progress Trends</h1>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-zinc-500">Loading tracking data...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* GRAPH 1: RESPONSE LATENCY */}
          <div className="glass p-5 flex flex-col h-96">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-zinc-900">Response Latency Trend</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Response time across sessions</p>
              </div>
              <div className="w-8 h-8 rounded bg-warning-bg flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-warning-dark" />
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis dataKey="session" axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                    <YAxis domain={[0, 100]} axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#F59E0B', fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="latency" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4, fill: '#F59E0B', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-zinc-500">No response latency data available yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* GRAPH 2: INTERACTION DURATION */}
          <div className="glass p-5 flex flex-col h-96">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-zinc-900">Interaction Duration Trend</h2>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider mt-1">Interaction duration across sessions</p>
              </div>
              <div className="w-8 h-8 rounded bg-brand/10 flex items-center justify-center shrink-0">
                <Timer className="w-4 h-4 text-brand" />
              </div>
            </div>
            
            <div className="flex-1 w-full relative">
              {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                    <XAxis dataKey="session" axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                    <YAxis domain={[0, 10]} axisLine={{ stroke: '#e4e4e7' }} tickLine={{ stroke: '#e4e4e7' }} tick={{ fontSize: 12, fill: '#71717a' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                      itemStyle={{ color: '#176B9C', fontWeight: 600 }}
                    />
                    <Line type="monotone" dataKey="duration" stroke="#176B9C" strokeWidth={3} dot={{ r: 4, fill: '#176B9C', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-sm text-zinc-500">No interaction duration data available yet.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
