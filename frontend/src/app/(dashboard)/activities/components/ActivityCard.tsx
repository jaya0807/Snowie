import React from "react";
import Image, { StaticImageData } from "next/image";
import { Play, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ActivityCardProps {
  act: { id: string; name: string; description: string };
  image: StaticImageData | null;
  pausedActivity: string | null;
  onLaunch: (id: string, resume?: boolean) => void;
  onClear: (e: React.MouseEvent, id: string) => void;
}

export function ActivityCard({ act, image, pausedActivity, onLaunch, onClear }: ActivityCardProps) {
  return (
    <div className="glass flex flex-col overflow-hidden group hover:shadow-xl hover:shadow-brand/5 transition-all duration-300">
      <div className="h-40 relative flex items-center justify-center border-b border-black/5 overflow-hidden">
        {image ? (
          <Image src={image} alt={act.name} fill className="object-cover z-0" sizes="(max-width: 768px) 100vw, 33vw" priority />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-brand-surface to-white z-0" />
        )}
        
        <div className="absolute inset-0 bg-black/5 z-0" />

        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
          {pausedActivity === act.id && (
            <Badge className="bg-warning-dark text-white border-none font-bold text-[10px] uppercase tracking-wider shadow-sm">
              In Progress
            </Badge>
          )}
        </div>
        <div className="relative z-10 w-16 h-16 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center border border-white/50 group-hover:scale-110 group-hover:bg-white transition-all">
          <Play className="w-6 h-6 text-brand ml-1" />
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-2">
          <h3 className="font-bold text-lg text-zinc-900 group-hover:text-brand transition-colors">{act.id} — {act.name}</h3>
        </div>
        
        <p className="text-sm text-zinc-500 line-clamp-2 flex-1 leading-relaxed">
          {act.description}
        </p>

        <div className="mt-6 flex gap-3">
          {pausedActivity === act.id ? (
            <>
              <button onClick={() => onLaunch(act.id, true)} className="flex-1 btn-warning py-2 text-sm font-semibold transition-colors">
                Resume Activity
              </button>
              <button onClick={(e) => onClear(e, act.id)} className="px-3 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-600 rounded-lg transition-colors" title="Restart from beginning">
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button onClick={() => onLaunch(act.id)} className="flex-1 btn-primary py-2 text-sm font-semibold group-hover:bg-brand-dark transition-colors">
              Launch Activity
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
