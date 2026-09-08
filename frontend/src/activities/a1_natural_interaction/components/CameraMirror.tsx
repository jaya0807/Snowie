import { Camera } from "lucide-react";
import { RefObject } from "react";

interface Props {
  cameraActive: boolean;
  camError: string;
  videoRef: RefObject<HTMLVideoElement | null>;
}

export default function CameraMirror({ cameraActive, camError, videoRef }: Props) {
  return (
    <div className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500 relative">
      {!cameraActive && (
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-200 text-center p-2">
          <Camera className={`w-8 h-8 ${camError ? 'text-red-400' : 'text-zinc-400 animate-pulse'}`} />
          {camError && <span className="text-[10px] text-red-500 font-bold leading-tight mt-1 truncate w-full">{camError}</span>}
        </div>
      )}
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className="w-full h-full object-cover transform -scale-x-100 absolute inset-0 z-0" 
      />
    </div>
  );
}
