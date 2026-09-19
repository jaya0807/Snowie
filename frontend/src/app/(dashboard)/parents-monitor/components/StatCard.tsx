import React from "react";

interface StatCardProps {
  label: string;
  value: React.ReactNode;
  valueClassName?: string;
  containerClassName?: string;
}

export function StatCard({
  label,
  value,
  valueClassName = "text-zinc-900",
  containerClassName = "bg-zinc-50 border-black/5",
}: StatCardProps) {
  return (
    <div className={`p-3 rounded-lg border flex flex-col justify-between transition-colors ${containerClassName}`}>
      <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{label}</p>
      <p className={`text-lg font-black ${valueClassName}`}>{value}</p>
    </div>
  );
}
