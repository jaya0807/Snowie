import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Camera } from "lucide-react";

export function VideoFeed({ sessionActive }: { sessionActive: boolean }) {
  return (
    <Card className="border-0 shadow-sm bg-zinc-950 text-white overflow-hidden">
      <div className="aspect-video bg-zinc-900 relative flex items-center justify-center border-b border-white/10">
        <div className="absolute top-4 left-4 flex gap-2">
          <Badge variant="outline" className="bg-black/50 text-white border-white/20 backdrop-blur-md">
            <Camera className="w-3 h-3 mr-1" />
            Remote Feed (Simulated)
          </Badge>
        </div>
        
        <div className="flex flex-col items-center">
          <Camera className={`w-12 h-12 mb-4 ${sessionActive ? "text-brand animate-pulse" : "text-white/10"}`} />
          <p className="text-sm text-white/30">
            {sessionActive ? "Child is performing the activity..." : "Camera feed is off"}
          </p>
        </div>
      </div>
      <CardContent className="p-4 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-xs text-zinc-400 mb-1">Gaze</p>
          <p className={`font-semibold ${sessionActive ? "text-green-400" : "text-zinc-500"}`}>
            {sessionActive ? "Focused" : "N/A"}
          </p>
        </div>
        <div className="border-x border-white/10">
          <p className="text-xs text-zinc-400 mb-1">Posture</p>
          <p className={`font-semibold ${sessionActive ? "text-zinc-200" : "text-zinc-500"}`}>
            {sessionActive ? "Stable" : "N/A"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-1">Movements</p>
          <p className={`font-semibold ${sessionActive ? "text-zinc-200" : "text-zinc-500"}`}>
            {sessionActive ? "Expected" : "N/A"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
