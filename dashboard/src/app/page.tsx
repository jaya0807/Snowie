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
      totalSessions: { value: "Nil", trend: "Nil", isPositive: true }, 
      avgEngagement: { value: "Nil", trend: "Nil", isPositive: true }, 
      avgDuration: { value: "Nil", trend: "Nil", isPositive: true }, 
      goalAchievement: { value: 0, trend: "Nil", isPositive: true } 
    },
    recentSessions: [],
    chartData: []
  });

  useEffect(() => {
    fetch("http://localhost:8000/api/dashboard")
      .then(res => res.json())
      .then(json => {
        if (json.stats) {
          setData(json);
        }
      })
      .catch(err => console.error("Failed to fetch dashboard data:", err));
  }, []);

  return (
    <div className="space-y-4 flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
          <p className="text-zinc-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/reports')} className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            Generate Report
          </button>
          <button onClick={() => router.push('/sessions')} className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
            Start Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Metric 1 */}
        <Card size="sm" className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Total Sessions</CardTitle>
            <Activity className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.totalSessions.value}</div>
            {data.stats.totalSessions.trend !== "Nil" && (
              <p className="text-xs text-zinc-400 mt-1">
                <span className={`flex items-center inline-flex ${data.stats.totalSessions.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {data.stats.totalSessions.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.totalSessions.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Metric 2 */}
        <Card size="sm" className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg. Engagement</CardTitle>
            <Brain className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.avgEngagement.value}</div>
            {data.stats.avgEngagement.trend !== "Nil" && (
              <p className="text-xs text-zinc-400 mt-1">
                <span className={`flex items-center inline-flex ${data.stats.avgEngagement.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {data.stats.avgEngagement.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.avgEngagement.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card size="sm" className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Avg. Session Duration</CardTitle>
            <Clock className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.stats.avgDuration.value}</div>
            {data.stats.avgDuration.trend !== "Nil" && (
              <p className="text-xs text-zinc-400 mt-1">
                <span className={`flex items-center inline-flex ${data.stats.avgDuration.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                  {data.stats.avgDuration.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.avgDuration.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card size="sm" className="glass-panel">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Goal Achievement</CardTitle>
            <Target className="w-4 h-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-2">{data.stats.goalAchievement.value === 0 ? "Nil" : `${data.stats.goalAchievement.value}%`}</div>
            {data.stats.goalAchievement.value > 0 && (
              <Progress value={data.stats.goalAchievement.value as number} className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-gradient-to-r [&_[data-slot=progress-indicator]]:from-zinc-400 [&_[data-slot=progress-indicator]]:to-white" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[400px]">
        {/* Main Chart */}
        <Card size="sm" className="lg:col-span-2 glass-panel !bg-none !bg-white/5 flex flex-col h-full">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg">Engagement vs Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pt-0">
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData.length > 0 ? data.chartData : [
                  { day: 'Mon' }, { day: 'Tue' }, { day: 'Wed' }, { day: 'Thu' }, { day: 'Fri' }, { day: 'Sat' }, { day: 'Sun' }
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#ffffff" fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card size="sm" className="glass-panel flex flex-col h-full">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-auto min-h-0 pt-0">
            {data.recentSessions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
                Nil
              </div>
            ) : (
              data.recentSessions.map((session: any) => (
                <div key={session.id} className="glass p-4 rounded-lg flex flex-col gap-3 shrink-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">{session.patient}</p>
                      <p className="text-xs text-zinc-400 mt-1">{session.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${session.status === 'Completed' ? 'border-white/20 text-white' : 'border-yellow-500/50 text-yellow-500'}`}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {session.duration}</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {session.accuracy} Acc</span>
                  </div>
                </div>
              ))
            )}

            <button className="mt-auto w-full py-2 text-sm text-zinc-400 hover:text-white transition-colors border border-white/10 rounded-lg hover:bg-white/5 shrink-0">
              View All Sessions
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
