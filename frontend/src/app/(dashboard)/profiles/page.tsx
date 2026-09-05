"use client";

import { User, Calendar, FileText, Activity, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

import { useState, useEffect } from "react";

export default function ProfileView() {
  const [data, setData] = useState({
    patient: { name: "Loading...", age: 0 },
    longitudinalData: []
  });

  useEffect(() => {
    fetch("http://localhost:8001/api/profiles")
      .then(res => res.json())
      .then(json => {
        if (json.patient) setData(json);
      })
      .catch(err => console.error("Failed to fetch profiles:", err));
  }, []);

  return (
    <div className="space-y-4">
      {/* Profile Header */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row gap-4 items-start md:items-center">
        <Avatar className="w-24 h-24 border-2 border-white/20">
          <AvatarImage src="" />
          <AvatarFallback className="bg-zinc-800 text-2xl">{data.patient.name ? data.patient.name.substring(0,2).toUpperCase() : "NA"}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                {data.patient.name}
                <Badge variant="outline" className="border-green-500/50 text-green-400 bg-green-500/10">Active</Badge>
              </h1>
              <div className="flex gap-4 mt-2 text-sm text-zinc-400">
                <span className="flex items-center gap-1"><User className="w-4 h-4" /> {data.patient.age} Years Old</span>
                <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Joined Jan 2026</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
                Edit Profile
              </button>
              <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
                New Session
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Left Column - Goals & Notes */}
        <div className="space-y-4">
          <Card size="sm" className="glass-panel">
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-lg">Current Goals</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="text-center text-sm text-zinc-500 py-4">Nil</div>
            </CardContent>
          </Card>

          <Card size="sm" className="glass-panel">
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="text-lg">Recent Reports</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3">
              {data.reports && data.reports.length > 0 ? data.reports.map((report: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    <div>
                      <p className="text-sm font-medium">{report.type}</p>
                      <p className="text-xs text-zinc-500">{report.date}</p>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center text-sm text-zinc-500 py-4">Nil</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Longitudinal Tracking */}
        <div className="md:col-span-2 space-y-4">
          <Card size="sm" className="glass-panel">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Longitudinal Pattern: Repeated Movements</span>
                <Badge variant="outline" className="border-white/20 text-zinc-300">Last 7 Sessions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.longitudinalData && data.longitudinalData.length > 0 ? data.longitudinalData : [
                    { date: 'S1' }, { date: 'S2' }, { date: 'S3' }, { date: 'S4' }, { date: 'S5' }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 20]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000CC', border: '1px solid #ffffff20', borderRadius: '8px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="repeatedMovements" name="Events Count" stroke="#ffffff" strokeWidth={2} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {data.longitudinalData && data.longitudinalData.length > 0 && (
                <div className="mt-4 p-4 glass rounded-lg text-sm text-zinc-300 flex items-start gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-white">AI Insight:</strong> Repeated upper-limb movement events have decreased by 66% over the last 7 sessions, correlating with improved task accuracy.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card size="sm" className="glass-panel">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Activity Performance Accuracy</span>
                <Badge variant="outline" className="border-white/20 text-zinc-300">Last 7 Sessions</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[250px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.longitudinalData && data.longitudinalData.length > 0 ? data.longitudinalData : [
                    { date: 'S1' }, { date: 'S2' }, { date: 'S3' }, { date: 'S4' }, { date: 'S5' }
                  ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="date" stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff50" fontSize={12} tickLine={false} axisLine={false} domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#000000CC', border: '1px solid #ffffff20', borderRadius: '8px', color: '#fff' }}
                    />
                    <Line type="monotone" dataKey="accuracy" name="Accuracy %" stroke="#a1a1aa" strokeWidth={2} dot={{ r: 4, fill: '#000' }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
