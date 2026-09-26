"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Filter, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfessionalDashboard() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // "newest" | "oldest"
  const [filterDate, setFilterDate] = useState(""); // exact date string YYYY-MM-DD

  useEffect(() => {
    fetch(`http://${window.location.hostname}:8001/api/clinician/patients`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setPatients(data);
        }
        setLoading(false);
      });
  }, []);

  // 1. Filter by search query
  let filtered = patients.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  // 2. Filter by exact admission date
  if (filterDate) {
    filtered = filtered.filter(p => p.date_of_admission === filterDate);
  }

  // 3. Sort by admission date
  filtered = filtered.sort((a, b) => {
    // If date is "Unknown", treat it as very old (0)
    const dateA = a.date_of_admission === "Unknown" ? 0 : new Date(a.date_of_admission).getTime();
    const dateB = b.date_of_admission === "Unknown" ? 0 : new Date(b.date_of_admission).getTime();
    
    if (sortBy === "newest") {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  if (loading) return <div className="p-8 text-zinc-500">Loading patients...</div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* Controls Bar */}
      <div className="glass p-4 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search by child's name..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <input 
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand/30"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-zinc-400" />
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-700 focus:outline-none focus:ring-2 focus:ring-brand/30"
            >
              <option value="newest">Sort by: Newest Admission</option>
              <option value="oldest">Sort by: Oldest Admission</option>
            </select>
          </div>
        </div>
      </div>

      {/* Card Grid */}
      {filtered.length === 0 ? (
        <div className="glass p-12 flex flex-col items-center justify-center text-center">
          <p className="text-zinc-500 font-medium">No patients found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(patient => (
            <button 
              key={patient.id} 
              onClick={() => router.push(`/professional/patient/${patient.id}`)}
              className="text-left w-full transition-transform hover:-translate-y-1 hover:shadow-lg"
            >
              <Card className="glass h-full border-transparent hover:border-brand/20 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    {patient.profile_pic ? (
                      <img src={patient.profile_pic} alt={patient.name} className="w-16 h-16 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-xl shrink-0">
                        {patient.initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg text-zinc-900 truncate">{patient.name}</h3>
                      {patient.status === 'Requires Review' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-warning-bg text-warning-dark mt-1 border border-warning-light">
                          Requires Review
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-success-bg text-success mt-1 border border-success-bg">
                          Stable
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-6 border-t border-black/5 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Date of Birth</span>
                      <span className="font-medium text-zinc-900">{patient.dob}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Admission Date</span>
                      <span className="font-medium text-zinc-900">{patient.date_of_admission}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-zinc-500">Parent/Guardian</span>
                      <span className="font-medium text-zinc-900">{patient.parent_name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
