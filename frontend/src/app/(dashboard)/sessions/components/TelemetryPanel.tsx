import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "lucide-react";

export function TelemetryPanel({ sessionActive, telemetry }: { sessionActive: boolean; telemetry: any }) {
  return (
    <Card className="border-0 shadow-sm bg-zinc-50 border border-black/5">
      <CardHeader className="pb-3 border-b border-black/5">
        <CardTitle className="text-sm font-bold flex items-center justify-between">
          <span>Real-time Telemetry</span>
          <Activity className={`w-4 h-4 ${sessionActive ? "text-brand animate-pulse" : "text-zinc-300"}`} />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-5">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-900">Task Engagement</span>
            <span className="text-zinc-500">{sessionActive ? telemetry.engagement : 0}%</span>
          </div>
          <Progress value={sessionActive ? telemetry.engagement : 0} className="h-1.5 [&>div]:bg-brand transition-all duration-500" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="font-medium text-zinc-900">Response Latency</span>
            <span className="text-zinc-500">{sessionActive ? telemetry.latency : "0.0"}s avg</span>
          </div>
          <Progress value={sessionActive ? Math.min(100, parseFloat(telemetry.latency)*20) : 0} className="h-1.5 [&>div]:bg-brand transition-all duration-500" />
        </div>

        <div className="pt-3 mt-3 border-t border-black/5">
          <p className="text-xs font-bold text-zinc-900 mb-2">Live Event Stream</p>
          <div className="space-y-2 max-h-[150px] overflow-hidden">
            {!sessionActive && <p className="text-xs text-zinc-400 italic">Waiting for events...</p>}
            {telemetry.events.map((ev: any, i: number) => (
              <div key={i} className="text-[10px] bg-white p-2 rounded border border-black/5 flex items-start gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <span className={`font-mono ${ev.type === 'warn' ? 'text-warning-dark' : 'text-brand'}`}>
                  {ev.time}
                </span>
                <span className="text-zinc-600">{ev.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
