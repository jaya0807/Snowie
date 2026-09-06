"use client";

import { Search, Plus, User, Calendar, Activity } from "lucide-react";

export default function ProfilesPage() {
  const profiles = [
    { id: "P-1001", name: "Leo D.", age: 6, lastSession: "2 days ago", sessions: 12, status: "Active" },
    { id: "P-1002", name: "Maya S.", age: 5, lastSession: "1 week ago", sessions: 4, status: "Active" },
    { id: "P-1003", name: "Ethan W.", age: 7, lastSession: "3 weeks ago", sessions: 28, status: "Review" },
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900 mb-6">Child Profiles</h1>
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search by name or ID..." 
              className="w-full pl-9 pr-4 py-2 bg-white border border-black/5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 shadow-sm"
            />
          </div>
          <button className="flex items-center gap-2 btn-primary px-4 py-2 text-sm font-medium whitespace-nowrap shrink-0">
            <Plus className="w-4 h-4" />
            New Participant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => (
          <div key={profile.id} className="glass p-5 flex flex-col hover:border-brand/20 transition-colors cursor-pointer">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900">{profile.name}</h3>
                  <p className="text-xs text-zinc-500">ID: {profile.id} • Age {profile.age}</p>
                </div>
              </div>
              <span className={`px-2 py-1 text-[10px] font-medium rounded-full ${profile.status === 'Active' ? 'bg-success-bg text-success border border-success/20' : 'bg-warning-bg text-warning-dark border border-warning/20'}`}>
                {profile.status}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-black/5">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                {profile.lastSession}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Activity className="w-3.5 h-3.5 text-zinc-400" />
                {profile.sessions} Sessions
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
