"use client";

import React, { useState } from "react";
import { PatientList } from "./components/PatientList";
import { PatientReport } from "./components/PatientReport";

const PATIENTS = [
  { id: '1', name: 'Alex Thompson', age: 4, dob: 'Jan 12, 2022', lastSession: 'Today, 2:30 PM', status: 'Requires Review', initials: 'AT' },
  { id: '2', name: 'Mia Johnson', age: 5, dob: 'Mar 04, 2021', lastSession: 'Yesterday, 10:15 AM', status: 'Stable', initials: 'MJ' },
  { id: '3', name: 'Leo Garcia', age: 3, dob: 'Nov 22, 2022', lastSession: 'Oct 12, 9:00 AM', status: 'Stable', initials: 'LG' },
];

export default function ProfessionalDashboard() {
  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");

  const selectedPatient = PATIENTS.find(p => p.id === selectedPatientId);

  return (
    <div className="h-full flex flex-col lg:flex-row gap-6 p-4">
      <PatientList 
        patients={PATIENTS} 
        selectedPatientId={selectedPatientId} 
        setSelectedPatientId={setSelectedPatientId} 
      />
      
      <div className="flex-1 bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col">
        <PatientReport selectedPatient={selectedPatient} />
      </div>
    </div>
  );
}
