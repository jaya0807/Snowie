"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { AIReports } from "@/components/AIReports";
import { ArrowLeft } from "lucide-react";

export default function PatientDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://${window.location.hostname}:8000/api/clinician/patients`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const found = data.find((p: any) => p.id === id);
          setPatient(found || null);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-8 text-zinc-500">Loading patient...</div>;
  if (!patient) return <div className="p-8 text-zinc-500">Patient not found</div>;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      <div>
        <button 
          onClick={() => router.push('/professional')}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </button>
      </div>
      
      <div className="flex items-center gap-4 px-1 pb-2">
        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold shrink-0">
          {patient.initials}
        </div>
        <div>
          <h2 className="text-xl font-bold text-zinc-900 leading-none">{patient.name}</h2>
          <p className="text-xs text-zinc-500 mt-1">ID: {patient.id} • Parent: {patient.parent_name}</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden flex flex-col">
        <AIReports patientId={id} isClinicianView={true} />
      </div>
    </div>
  );
}
