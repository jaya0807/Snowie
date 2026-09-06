"use client";

import { Camera, Brain, Sliders, Bell, Shield, User, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function SettingsView() {
  return (
    <div className="space-y-4 pb-8 h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Navigation / Tabs */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-white/10 text-white transition-colors border border-white/10">
            <User className="w-4 h-4" /> Profile & Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <Camera className="w-4 h-4" /> Camera Setup
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <Brain className="w-4 h-4" /> AI Models
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-400 hover:bg-white/5 hover:text-white transition-colors">
            <Shield className="w-4 h-4" /> Data Privacy
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Section 1: AI Model Settings */}
          <Card size="sm" className="glass-panel">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-indigo-400" />
                <CardTitle className="text-lg">Observation AI Engine</CardTitle>
              </div>
              <CardDescription className="text-zinc-400 text-xs mt-1">Configure thresholds for movement and engagement detection.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-zinc-200">Pose Confidence Threshold</label>
                  <span className="text-sm text-zinc-400">75%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[75%] rounded-full"></div>
                </div>
                <p className="text-[10px] text-zinc-500">Minimum confidence required for the MediaPipe Holistic model to track body joints.</p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-zinc-200">Face Mesh Sensitivity</label>
                  <span className="text-sm text-zinc-400">High</span>
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2 rounded-md bg-white/5 text-xs text-zinc-400 border border-transparent hover:border-white/10 transition-colors">Low</button>
                  <button className="flex-1 py-2 rounded-md bg-white/5 text-xs text-zinc-400 border border-transparent hover:border-white/10 transition-colors">Medium</button>
                  <button className="flex-1 py-2 rounded-md bg-white/10 text-xs text-white border border-white/20 transition-colors">High</button>
                </div>
                <p className="text-[10px] text-zinc-500">Affects how aggressively head orientation shifts (Engagement) are logged.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Hardware Settings */}
          <Card size="sm" className="glass-panel">
            <CardHeader className="border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Monitor className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-lg">Hardware Setup</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-200">Default Camera Input</label>
                <select className="w-full bg-white/5 border border-white/10 text-sm text-white rounded-lg p-2.5 outline-none focus:border-white/30 transition-colors appearance-none">
                  <option className="bg-zinc-900">Logitech Brio 4K WebCam (USB)</option>
                  <option className="bg-zinc-900">FaceTime HD Camera (Built-in)</option>
                  <option className="bg-zinc-900">OBS Virtual Camera</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
                <div>
                  <p className="text-sm font-medium text-white">Hardware Acceleration</p>
                  <p className="text-[10px] text-zinc-400">Use GPU to process video frames faster.</p>
                </div>
                <div className="w-10 h-5 bg-blue-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3 pt-4">
            <button className="glass px-5 py-2 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
              Reset Defaults
            </button>
            <button className="bg-white text-black px-5 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-colors">
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
