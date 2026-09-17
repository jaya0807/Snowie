"use client";

import React, { useState } from "react";
import { PatientList } from "./components/PatientList";
import { PatientReport } from "./components/PatientReport";

import { useEffect } from "react";

export default function ProfessionalDashboard() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8001/api/clinician/patients")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPatients(data);
          // Don't override selectedPatientId if they already picked one, but default to first if none
        }
        setLoading(false);
      });
  }, []);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  if (loading) return <div className="p-8 text-zinc-500">Loading patients...</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4">
      <PatientList 
        patients={patients} 
        selectedPatientId={selectedPatientId || (patients[0]?.id)} 
        setSelectedPatientId={setSelectedPatientId} 
      />
      
      <div className="flex-1 glass overflow-hidden flex flex-col">
        {selectedPatient ? (
          <PatientReport selectedPatient={selectedPatient} />
        ) : (
          <div className="p-8 text-zinc-500 text-center mt-20">No patient selected</div>
        )}
      </div>
    </div>
  );
}
