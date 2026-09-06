"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Activity, Brain, Clock, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

export default function DashboardHome() {
  const router = useRouter();
  
  const [data, setData] = useState({
    stats: { 
      totalSessions: { value: "Nil", trend: "Nil", isPositive: true, label: "Total Sessions" }, 
      avgEngagement: { value: "Nil", trend: "Nil", isPositive: true, label: "Avg Focus Time" }, 
      avgDuration: { value: "Nil", trend: "Nil", isPositive: true, label: "Session Duration" }, 
      goalAchievement: { value: "0%", trend: "Nil", isPositive: true, label: "Goal Progress" } 
    },
    recentSessions: [] as any[],
    chartData: [] as any[]
  });

  useEffect(() => {
    fetch("http://localhost:8001/api/dashboard")
      .then(res => res.json())
      .then(json => {
        if (json.stats) {
          setData(json);
        }
      })
      .catch(err => console.error("Failed to fetch dashboard data:", err));
  }, []);

  const statsList = [
    { label: data.stats.totalSessions.label, value: data.stats.totalSessions.value, icon: Activity, trend: data.stats.totalSessions.trend, isPositive: data.stats.totalSessions.isPositive },
    { label: data.stats.avgEngagement.label, value: data.stats.avgEngagement.value, icon: Brain, trend: data.stats.avgEngagement.trend, isPositive: data.stats.avgEngagement.isPositive },
    { label: data.stats.avgDuration.label, value: data.stats.avgDuration.value, icon: Clock, trend: data.stats.avgDuration.trend, isPositive: data.stats.avgDuration.isPositive },
    { label: data.stats.goalAchievement.label, value: data.stats.goalAchievement.value, icon: Target, trend: data.stats.goalAchievement.trend, isPositive: data.stats.goalAchievement.isPositive },
  ];

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Child Overview</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/reports')} className="btn-secondary px-4 py-2 text-sm font-medium transition-colors">
            Generate Report
          </button>
          <button onClick={() => router.push('/activities')} className="btn-primary px-4 py-2 text-sm font-medium transition-colors">
            Play Activity
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {statsList.map((stat, i) => (
          <Card key={i} className="glass group hover:bg-white transition-all duration-300 relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
              <CardTitle className="text-sm font-semibold text-zinc-600">{stat.label}</CardTitle>
              <div className="p-2 bg-brand/5 rounded-lg border border-brand/10">
                <stat.icon className="w-4 h-4 text-brand" />
              </div>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="text-3xl font-black text-zinc-900 tracking-tight">{stat.value}</div>
              <p className={`text-xs mt-2 font-medium flex items-center gap-1 ${stat.isPositive ? 'text-brand' : 'text-zinc-500'}`}>
                {stat.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-0">
        <Card size="sm" className="lg:col-span-2 glass flex flex-col h-full">
          <CardHeader className="shrink-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg text-zinc-900">Weekly Engagement Trend</CardTitle>
              <p className="text-xs text-zinc-500 mt-1">Focus percentage across all activities</p>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#176B9C" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#176B9C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ color: '#176B9C', fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="engagement" stroke="#176B9C" strokeWidth={3} fillOpacity={1} fill="url(#colorEngagement)" activeDot={{ r: 6, strokeWidth: 0, fill: '#176B9C' }} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card size="sm" className="glass flex flex-col h-full">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg text-zinc-900">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-auto min-h-0 pt-0">
            {data.recentSessions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                No sessions yet
              </div>
            ) : (
              data.recentSessions.map((session: any) => (
                <div key={session.id} className="bg-white border border-brand-border p-4 rounded-lg flex flex-col gap-3 shrink-0 shadow-[0_4px_16px_rgba(23,107,156,0.02)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-zinc-900">{session.activity}</p>
                      <p className="text-xs text-zinc-500 mt-1">{session.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${session.status === 'Completed' ? 'border-success-light text-success-light' : 'border-warning-light text-warning-light'}`}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-zinc-900" /> {session.duration}</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3 text-zinc-900" /> {session.accuracy} Acc</span>
                  </div>
                </div>
              ))
            )}
            <button className="mt-auto w-full py-2 text-sm font-medium text-zinc-900 hover:bg-white/50 transition-colors border border-brand-border bg-white rounded-lg shrink-0">
              View Activity History
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
