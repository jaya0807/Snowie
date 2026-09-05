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
    fetch("http://localhost:8001/api/dashboard")
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
          <h1 className="text-2xl font-bold tracking-tight text-[#173B50]">Overview</h1>
          <p className="text-[#668294]">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => router.push('/reports')} className="bg-[#E7F5FB] text-[#176B9C] border border-[#C9E4F0] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Generate Report
          </button>
          <button onClick={() => router.push('/sessions')} className="bg-[#49B3E8] text-[#FFFFFF] border-none px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#176B9C] transition-colors">
            Start Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
        {/* Metric 1 */}
        <Card size="sm" className="bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_14px_rgba(23,107,156,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#668294]">Total Sessions</CardTitle>
            <Activity className="w-4 h-4 text-[#176B9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#176B9C]">{data.stats.totalSessions.value}</div>
            {data.stats.totalSessions.trend !== "Nil" && (
              <p className="text-xs text-[#668294] mt-1">
                <span className={`flex items-center inline-flex ${data.stats.totalSessions.isPositive ? 'text-[#78D6B0]' : 'text-[#FF9BAA]'}`}>
                  {data.stats.totalSessions.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.totalSessions.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>
        
        {/* Metric 2 */}
        <Card size="sm" className="bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_14px_rgba(23,107,156,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#668294]">Avg. Engagement</CardTitle>
            <Brain className="w-4 h-4 text-[#176B9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#176B9C]">{data.stats.avgEngagement.value}</div>
            {data.stats.avgEngagement.trend !== "Nil" && (
              <p className="text-xs text-[#668294] mt-1">
                <span className={`flex items-center inline-flex ${data.stats.avgEngagement.isPositive ? 'text-[#78D6B0]' : 'text-[#FF9BAA]'}`}>
                  {data.stats.avgEngagement.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.avgEngagement.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card size="sm" className="bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_14px_rgba(23,107,156,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#668294]">Avg. Session Duration</CardTitle>
            <Clock className="w-4 h-4 text-[#176B9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#176B9C]">{data.stats.avgDuration.value}</div>
            {data.stats.avgDuration.trend !== "Nil" && (
              <p className="text-xs text-[#668294] mt-1">
                <span className={`flex items-center inline-flex ${data.stats.avgDuration.isPositive ? 'text-[#78D6B0]' : 'text-[#FF9BAA]'}`}>
                  {data.stats.avgDuration.isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
                  {data.stats.avgDuration.trend}
                </span> from last week
              </p>
            )}
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card size="sm" className="bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_14px_rgba(23,107,156,0.05)]">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-[#668294]">Goal Achievement</CardTitle>
            <Target className="w-4 h-4 text-[#176B9C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#176B9C] mb-2">{data.stats.goalAchievement.value === 0 ? "Nil" : `${data.stats.goalAchievement.value}%`}</div>
            {data.stats.goalAchievement.value > 0 && (
              <Progress value={data.stats.goalAchievement.value as number} className="h-1.5 bg-white [&_[data-slot=progress-indicator]]:bg-[#78D6B0]" />
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 flex-1 min-h-[400px]">
        {/* Main Chart */}
        <Card size="sm" className="lg:col-span-2 bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_16px_rgba(23,107,156,0.05)] flex flex-col h-full">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg text-[#176B9C]">Engagement vs Duration</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 min-h-0 pt-0">
            <div className="h-full w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.chartData.length > 0 ? data.chartData : [
                  { day: 'Mon' }, { day: 'Tue' }, { day: 'Wed' }, { day: 'Thu' }, { day: 'Fri' }, { day: 'Sat' }, { day: 'Sun' }
                ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#49B3E8" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#49B3E8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#668294" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#668294" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#C9E4F0', borderRadius: '8px' }}
                    itemStyle={{ color: '#176B9C' }}
                  />
                  <Area type="monotone" dataKey="engagement" stroke="#49B3E8" fillOpacity={1} fill="url(#colorEngagement)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card size="sm" className="bg-[#E0FBFC] border border-[#C9E4F0] shadow-[0_4px_16px_rgba(23,107,156,0.05)] flex flex-col h-full">
          <CardHeader className="shrink-0">
            <CardTitle className="text-lg text-[#176B9C]">Recent Sessions</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-auto min-h-0 pt-0">
            {data.recentSessions.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-[#668294] text-sm">
                Nil
              </div>
            ) : (
              data.recentSessions.map((session: any) => (
                <div key={session.id} className="bg-[#FFFFFF] border border-[#C9E4F0] p-4 rounded-lg flex flex-col gap-3 shrink-0 shadow-[0_4px_16px_rgba(23,107,156,0.02)]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm text-[#173B50]">{session.patient}</p>
                      <p className="text-xs text-[#668294] mt-1">{session.time}</p>
                    </div>
                    <Badge variant="outline" className={`text-[10px] ${session.status === 'Completed' ? 'border-[#78D6B0] text-[#78D6B0]' : 'border-[#FFD76A] text-[#FFD76A]'}`}>
                      {session.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-[#668294]">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#176B9C]" /> {session.duration}</span>
                    <span className="flex items-center gap-1"><Target className="w-3 h-3 text-[#176B9C]" /> {session.accuracy} Acc</span>
                  </div>
                </div>
              ))
            )}

            <button className="mt-auto w-full py-2 text-sm font-medium text-[#176B9C] hover:bg-white/50 transition-colors border border-[#C9E4F0] bg-white rounded-lg shrink-0">
              View All Sessions
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
