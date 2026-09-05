"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Camera, Eye, Activity, Square, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function LiveSession() {
  const [isRunning, setIsRunning] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Session</h1>
          <p className="text-zinc-400">Participant: Aarav M. • Guided Activity: Shape Sorting</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsRunning(!isRunning)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              isRunning ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white text-black hover:bg-zinc-200'
            }`}
          >
            {isRunning ? <><Pause className="w-4 h-4" /> Pause</> : <><Play className="w-4 h-4" /> Start</>}
          </button>
          <button className="flex items-center gap-2 glass px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            <Square className="w-4 h-4" /> End Session
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Camera Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card size="sm" className="glass-panel overflow-hidden">
            <div className="relative aspect-video bg-black/60 flex items-center justify-center border-b border-white/10">
              {isRunning ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Simulated camera feed with bounding boxes */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant="outline" className="bg-black/50 border-white/20 backdrop-blur-md">
                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2 animate-pulse" /> REC {formatTime(sessionTime)}
                    </Badge>
                    <Badge variant="outline" className="bg-black/50 border-white/20 backdrop-blur-md text-green-400">
                      AI Active
                    </Badge>
                  </div>
                  <Camera className="w-12 h-12 text-white/20" />
                  
                  {/* Fake UI for bounding boxes/landmarks */}
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>
              ) : (
                <div className="text-center text-zinc-500 flex flex-col items-center">
                  <Camera className="w-12 h-12 mb-4 opacity-50" />
                  <p>Camera standby. Press Start to begin observation.</p>
                </div>
              )}
            </div>
            <div className="p-4 grid grid-cols-3 gap-4">
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400">Pose Confidence</p>
                <p className="text-lg font-semibold text-green-400">{isRunning ? '94%' : 'Nil'}</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400">Face Landmarks</p>
                <p className="text-lg font-semibold text-green-400">{isRunning ? 'Tracking' : 'Nil'}</p>
              </div>
              <div className="glass p-3 rounded-lg text-center">
                <p className="text-xs text-zinc-400">FPS</p>
                <p className="text-lg font-semibold text-white">{isRunning ? '30.2' : '0.0'}</p>
              </div>
            </div>
          </Card>

          {/* Real-time Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <Card size="sm" className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                  <Eye className="w-4 h-4 mr-2" /> Head Orientation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Forward (Engaged)</span>
                      <span>{isRunning ? '68%' : 'Nil'}</span>
                    </div>
                    <Progress value={isRunning ? 68 : 0} className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-green-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Looking Away</span>
                      <span>{isRunning ? '22%' : 'Nil'}</span>
                    </div>
                    <Progress value={isRunning ? 22 : 0} className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-yellow-400" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Looking Down</span>
                      <span>{isRunning ? '10%' : 'Nil'}</span>
                    </div>
                    <Progress value={isRunning ? 10 : 0} className="h-1.5 bg-white/10 [&_[data-slot=progress-indicator]]:bg-zinc-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card size="sm" className="glass-panel">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-zinc-400 flex items-center">
                  <Activity className="w-4 h-4 mr-2" /> Activity Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                 <div className="flex flex-col items-center justify-center h-full pt-2">
                    <div className="text-4xl font-bold">{isRunning ? '85%' : 'Nil'}</div>
                    <p className="text-sm text-zinc-400 mt-1">Accuracy</p>
                    <div className="mt-4 flex gap-2">
                      {isRunning ? (
                        <>
                          <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">Task 1: Pass</Badge>
                          <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">Task 2: In Prog</Badge>
                        </>
                      ) : (
                        <Badge className="bg-zinc-500/20 text-zinc-400 hover:bg-zinc-500/20">Waiting to start</Badge>
                      )}
                    </div>
                 </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Live Event Log */}
        <Card size="sm" className="glass-panel flex flex-col h-[calc(100vh-140px)] sticky top-6">
          <CardHeader className="border-b border-white/10 pb-4">
            <CardTitle className="text-lg flex items-center justify-between">
              Live Event Log
              <Settings className="w-4 h-4 text-zinc-400 cursor-pointer hover:text-white" />
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            <div className="flex flex-col">
              {/* Event log is empty by default until session starts */}
              
              {!isRunning && (
                 <div className="p-8 text-center text-zinc-500 text-sm">
                   Event engine is paused.
                 </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
