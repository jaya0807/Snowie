import { Card } from "@/components/ui/card";
import { Camera } from "lucide-react";

export function VideoFeed({ sessionActive }: { sessionActive: boolean }) {
  return (
    <Card className="border-0 shadow-sm bg-zinc-950 text-white overflow-hidden">
      <div className="aspect-video bg-zinc-900 relative flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Camera className={`w-12 h-12 mb-4 ${sessionActive ? "text-brand animate-pulse" : "text-white/10"}`} />
          <p className="text-sm text-white/30">
            {sessionActive ? "Child is performing the activity..." : "Camera feed is off"}
          </p>
        </div>
      </div>
    </Card>
  );
}
