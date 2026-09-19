import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

export function LiveCameraFeed({ frame }: { frame: string | null }) {
  return (
    <Card className="border-black/5 shadow-sm ">
      <CardHeader className="border-b border-black/5 pb-4 shrink-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Live Camera Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 bg-zinc-50 flex items-center justify-center">
        <div className="relative w-full aspect-video max-h-[450px] bg-zinc-900 rounded-xl overflow-hidden shadow-inner flex items-center justify-center">
          {frame ? (
            <img src={frame} alt="Child Stream" className="w-full h-full object-cover transform scale-x-[-1]" />
          ) : (
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-sm">
              <div className="w-16 h-16 rounded-2xl bg-zinc-800 flex items-center justify-center mb-6"><Camera className="w-8 h-8 text-zinc-600" /></div>
              <h3 className="text-white font-semibold mb-2">No Active Session</h3>
              <p className="text-zinc-400 text-sm mb-6">Start an activity to begin monitoring live telemetry and video.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
