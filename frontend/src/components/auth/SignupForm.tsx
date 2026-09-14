"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  ArrowLeft, ArrowRight, UserPlus, Calendar, Image as ImageIcon,
  Baby, Plus, X
} from "lucide-react";
import { LoginCard } from "./LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import Link from "next/link";
import Image from "next/image";

interface SignupFormProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

export function SignupForm({ onBack, onLoginClick }: SignupFormProps) {
  const router = useRouter();
  
  // Step State
    const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Step 1: Parent Account
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [relationship, setRelationship] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: Child Profile
  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [childGender, setChildGender] = useState("");
  
  // Four separate child photo uploads
  const [childPhotoFront, setChildPhotoFront] = useState<File | null>(null);
  const [childPhotoRear, setChildPhotoRear] = useState<File | null>(null);
  const [childPhotoLeft, setChildPhotoLeft] = useState<File | null>(null);
  const [childPhotoRight, setChildPhotoRight] = useState<File | null>(null);

      const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !relationship) {
      setErrorMessage("Please fill out all parent required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    if (!childName.trim() || !childDob) {
      setErrorMessage("Please provide the child's name and date of birth.");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // Redirect to login or dashboard
      router.push("/dashboard");
    } catch {
      setErrorMessage("Oops! We couldn't create your account right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto transition-all duration-500 ease-in-out">
      <LoginCard variant="parent" className="relative p-6 md:p-8 md:px-10">
        
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            className="mb-5"
          />
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: PARENT ACCOUNT */}
            <div className="flex-1 flex flex-col">
              <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand shadow-sm border border-brand/10">
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Parent Profile</h2>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Your account details.</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Full Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Email Address *</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="parent@example.com" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Phone <span className="text-zinc-400 normal-case font-normal">(opt)</span></label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="tel" value={phone} onChange={(e) => { const val = e.target.value; if (/^[\d+\-()\s]*$/.test(val)) setPhone(val); }} placeholder="+1 555 000-0000" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Relationship *</label>
                    <select value={relationship} onChange={(e) => setRelationship(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none font-medium" required>
                      <option value="" disabled>Select</option>
                      <option value="Mother">Mother</option>
                      <option value="Father">Father</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Password *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Confirm *</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full pl-10 pr-10 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1">
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: CHILD PROFILE */}
            <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-zinc-100 pt-6 md:pt-0 md:pl-8 lg:pl-12">
              <div className="mb-5 flex items-center gap-3 border-b border-zinc-100 pb-3">
                <div className="w-10 h-10 rounded-xl bg-brand-light flex items-center justify-center text-brand shadow-sm border border-brand/10">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-zinc-900 tracking-tight">Child Profile</h2>
                  <p className="text-zinc-500 text-xs mt-0.5 font-medium">Create their personal profile.</p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Child's Name *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" value={childName} onChange={(e) => setChildName(e.target.value)} placeholder="Name" className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Date of Birth *</label>
                    <div className="relative">
                      <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="date" value={childDob} onChange={(e) => setChildDob(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">Gender <span className="text-zinc-400 normal-case font-normal">(optional)</span></label>
                  <select value={childGender} onChange={(e) => setChildGender(e.target.value)} className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none font-medium">
                    <option value="" disabled>Select Gender</option>
                    <option value="Boy">Boy</option>
                    <option value="Girl">Girl</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5 mt-2">Child Photos <span className="text-zinc-400 normal-case font-normal">(optional)</span></label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Front', state: childPhotoFront, set: setChildPhotoFront },
                      { label: 'Rear', state: childPhotoRear, set: setChildPhotoRear },
                      { label: 'Left', state: childPhotoLeft, set: setChildPhotoLeft },
                      { label: 'Right', state: childPhotoRight, set: setChildPhotoRight }
                    ].map((photo, i) => (
                      <div key={i} className="relative flex flex-col items-center">
                        <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                          {photo.state ? (
                            <>
                              <img src={URL.createObjectURL(photo.state)} alt={photo.label} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => photo.set(null)} className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm">
                                <X className="w-3 h-3" />
                              </button>
                            </>
                          ) : (
                            <>
                              <input type="file" accept="image/jpeg,image/png,image/jpg" onChange={(e) => { if (e.target.files && e.target.files.length > 0) photo.set(e.target.files[0]); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                                <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-0.5 border border-black/5">
                                  <Plus className="w-3 h-3" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <span className="text-[9px] font-bold text-zinc-600 mt-1.5 uppercase tracking-wide">{photo.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-6 mt-6 border-t border-zinc-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm font-medium text-zinc-500">
              Already have an account?{" "}
              <button 
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onLoginClick) onLoginClick();
                  else router.push('/login');
                }} 
                className="text-brand hover:text-brand-dark hover:underline font-bold transition-colors cursor-pointer"
              >
                Log in here
              </button>
            </div>
            
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full md:w-auto md:px-12 md:py-3.5 shadow-md hover:shadow-lg transition-shadow text-base font-bold"
            >
              Create Account <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </div>
        </form>
      </LoginCard>
    </div>
  );
}
