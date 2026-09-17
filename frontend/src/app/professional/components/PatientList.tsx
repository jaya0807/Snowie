import React from "react";
import { Search } from "lucide-react";

export function PatientList({ 
  patients, 
  selectedPatientId, 
  setSelectedPatientId 
}: { 
  patients: any[]; 
  selectedPatientId: string; 
  setSelectedPatientId: (id: string) => void;
}) {
  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
      <div className="glass p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search patients..." 
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 transition-all"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          {patients.map(patient => (
            <button 
              key={patient.id}
              onClick={() => setSelectedPatientId(patient.id)}
              className={`flex items-start gap-3 p-3 rounded-lg text-left transition-all ${
                selectedPatientId === patient.id 
                  ? "bg-brand/5 border border-brand/20 shadow-sm" 
                  : "hover:bg-zinc-50 border border-transparent"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                selectedPatientId === patient.id ? "bg-brand text-white" : "bg-zinc-100 text-zinc-500"
              }`}>
                {patient.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className={`font-semibold text-sm truncate ${selectedPatientId === patient.id ? "text-brand" : "text-zinc-900"}`}>
                    {patient.name}
                  </p>
                </div>
                <p className="text-xs text-zinc-500 truncate">Last: {patient.lastSession}</p>
              </div>
              {patient.status === 'Requires Review' && (
                <div className="w-2 h-2 rounded-full bg-warning mt-1.5 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
