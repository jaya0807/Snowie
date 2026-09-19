with open("frontend/src/app/(dashboard)/settings/page.tsx", "r") as f:
    content = f.read()

new_settings_page = """"use client";

import { User, Bell, Shield, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/common/Button";

export default function SettingsView() {
  const { user } = useAuth();
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("6");
  const [parentName, setParentName] = useState("");
  
  useEffect(() => {
    if (user) {
      setParentName(user.name || "");
      if (user.children && user.children.length > 0) {
        setChildName(user.children[0].name || "");
        setChildAge(user.children[0].age?.toString() || "6");
      }
    }
  }, [user]);

  const handleSave = () => {
    alert("Profile updated successfully!");
  };

  return (
    <div className="space-y-4 pb-8 h-full max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Settings</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
        {/* Navigation / Tabs */}
        <div className="space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium bg-brand/10 text-brand transition-colors border border-brand/20">
            <User className="w-4 h-4" /> Profile & Account
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:bg-black/5 hover:text-zinc-900 transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-zinc-500 hover:bg-black/5 hover:text-zinc-900 transition-colors">
            <Shield className="w-4 h-4" /> Privacy & Data
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-4">
          
          <Card size="sm" className="bg-white border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-lg text-zinc-900">Child Profile</CardTitle>
              <CardDescription className="text-zinc-500 text-xs mt-1">Update your child's basic information.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Child Name</label>
                <input 
                  type="text" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Child Age</label>
                <input 
                  type="number" 
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" 
                />
              </div>
            </CardContent>
          </Card>

          <Card size="sm" className="bg-white border-black/5 shadow-sm">
            <CardHeader className="border-b border-black/5 pb-4">
              <CardTitle className="text-lg text-zinc-900">Parent / Guardian Account</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Your Name</label>
                <input 
                  type="text" 
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/20" 
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={user?.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 bg-zinc-100 border border-zinc-200 rounded-lg text-sm text-zinc-500 cursor-not-allowed" 
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}
"""

with open("frontend/src/app/(dashboard)/settings/page.tsx", "w") as f:
    f.write(new_settings_page)
