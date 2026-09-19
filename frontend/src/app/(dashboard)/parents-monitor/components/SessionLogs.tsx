import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SessionLogs({ logs }: { logs: { time: string; event: string; details: string }[] }) {
  return (
    <Card className="border-black/5 shadow-sm flex flex-col h-full">
      <CardHeader className="border-b border-black/5 p-4 shrink-0 bg-zinc-50/50 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-bold flex items-center gap-2 m-0 uppercase tracking-wider text-zinc-500">
          Session Tracking Logs
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-zinc-50 text-zinc-500 text-xs uppercase font-semibold sticky top-0">
              <tr><th className="px-4 py-3 w-24">Time</th><th className="px-4 py-3 w-40">Event</th><th className="px-4 py-3 w-full">Details</th></tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {logs.length === 0 ? (
                <tr><td colSpan={3} className="px-4 py-8 text-center text-zinc-400">Clinical events will appear here once the child starts playing…</td></tr>
              ) : (
                logs.map((log, i) => (
                  <tr key={i} className="hover:bg-zinc-50">
                    <td className="px-4 py-3 text-zinc-500 font-mono text-xs whitespace-nowrap">{log.time}</td>
                    <td className="px-4 py-3 font-medium text-zinc-900 whitespace-nowrap">{log.event}</td>
                    <td className="px-4 py-3 text-zinc-600">{log.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
