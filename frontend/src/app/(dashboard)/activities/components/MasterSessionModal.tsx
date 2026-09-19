import React from "react";
import { Activity } from "lucide-react";

interface MasterSessionModalProps {
  hasHistory: boolean;
  onStartNew: () => void;
  onResume: () => void;
}

export function MasterSessionModal({ hasHistory, onStartNew, onResume }: MasterSessionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-brand/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-brand" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-zinc-900 mb-2">Master Session</h2>
        <p className="text-zinc-500 text-center text-sm mb-6">How would you like to proceed with the clinical session?</p>
        <div className="flex flex-col gap-3">
          <button onClick={onStartNew} className="w-full btn-primary py-3 rounded-lg font-semibold">
            Start New Session
          </button>
          <button 
            onClick={onResume} 
            disabled={!hasHistory}
            className={`w-full py-3 rounded-lg font-semibold transition-colors ${hasHistory ? "bg-zinc-100 hover:bg-zinc-200 text-zinc-700" : "bg-zinc-100 text-zinc-400 cursor-not-allowed opacity-50"}`}
            title={!hasHistory ? "No previous sessions found to resume" : ""}
          >
            Resume Session
          </button>
        </div>
      </div>
    </div>
  );
}
