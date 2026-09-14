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
}

export function SignupForm({ onBack }: SignupFormProps) {
  const router = useRouter();
  
  // Step State
  const [step, setStep] = useState<1 | 2>(1);
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

  const handleNextStep = () => {
    setErrorMessage(null);
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword || !relationship) {
      setErrorMessage("Please fill out all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

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
    <div className="w-full mx-auto px-4 transition-all duration-500 ease-in-out max-w-5xl">
      <LoginCard variant="parent" className="relative p-6 md:p-8">
        
        {/* Error Notification */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            className="mb-5"
          />
        )}

        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="relative">
          
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-stretch">
            
            {/* LEFT SIDE: Illustration & Text */}
            <div className="hidden md:flex flex-1 md:w-5/12 flex-col justify-center items-center text-center bg-[#EEF4F9]/50 rounded-3xl p-8 border border-black/5">
              <div className="relative w-full max-w-[300px] aspect-square mb-8 drop-shadow-sm rounded-2xl overflow-hidden bg-white/50 border border-white">
                <Image
                  src="/parent_illustration.png"
                  alt="Parent and Child Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {step === 1 ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight leading-tight">
                    A better way to <span className="text-[#176B9C]">understand</span> your child.
                  </h3>
                  <p className="text-base text-zinc-500 max-w-xs leading-relaxed mx-auto">
                    Create your account to begin their journey.
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-3xl font-bold text-zinc-900 mb-3 tracking-tight leading-tight">
                    Every child is unique <span className="text-[#176B9C]">💙</span>
                  </h3>
                  <p className="text-base text-zinc-500 max-w-xs leading-relaxed mx-auto">
                    A few details about your child help us create a personalized experience and better understand their progress.
                  </p>
                </div>
              )}
            </div>

            {/* Mobile Illustration (Only visible on small screens) */}
            <div className="md:hidden w-full flex flex-col justify-center items-center text-center bg-[#EEF4F9]/50 rounded-3xl p-6 border border-black/5 mb-6">
              <div className="relative w-full max-w-[200px] aspect-square mb-4 drop-shadow-sm rounded-2xl overflow-hidden bg-white/50 border border-white">
                <Image
                  src="/parent_illustration.png"
                  alt="Parent and Child Illustration"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {step === 1 ? (
                <div className="animate-in fade-in duration-500">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight leading-tight">
                    A better way to <span className="text-[#176B9C]">understand</span> your child.
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mx-auto">
                    Create your account to begin their journey.
                  </p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-500">
                  <h3 className="text-xl font-bold text-zinc-900 mb-2 tracking-tight leading-tight">
                    Every child is unique <span className="text-[#176B9C]">💙</span>
                  </h3>
                  <p className="text-sm text-zinc-500 max-w-xs leading-relaxed mx-auto">
                    A few details about your child help us create a personalized experience.
                  </p>
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="flex-1 md:w-7/12 flex flex-col pt-2 md:pt-4">
              
              {/* STEP INDICATOR (Inside Right Column) */}
              <div className="flex items-center gap-3 mb-8 text-xs font-bold uppercase tracking-wider">
                <div className={`flex items-center gap-2 ${step === 1 ? "text-brand" : "text-zinc-400"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step === 1 ? "bg-brand" : "bg-zinc-300"}`}>
                    1
                  </div>
                  <span>Parent Account</span>
                </div>
                
                <div className="w-8 h-px bg-zinc-200"></div>
                
                <div className={`flex items-center gap-2 ${step === 2 ? "text-brand" : "text-zinc-400"}`}>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-white ${step === 2 ? "bg-brand" : "bg-zinc-300"}`}>
                    2
                  </div>
                  <span>Child Profile</span>
                </div>
              </div>

              {/* STEP 1: PARENT ACCOUNT */}
              {step === 1 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                  
                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-4 shadow-sm border border-brand/10">
                      <UserPlus className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Create Account</h2>
                    <p className="text-zinc-500 text-sm mt-1.5 font-medium">Let's start with your parent profile.</p>
                  </div>

                  <div className="space-y-4 flex-1">
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="parent@example.com"
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Phone Number (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Phone Number <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (/^[\d+\-()\s]*$/.test(val)) {
                              setPhone(val);
                            }
                          }}
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                        />
                      </div>
                    </div>

                    {/* Relationship with Child */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Relationship with Child *
                      </label>
                      <select
                        value={relationship}
                        onChange={(e) => setRelationship(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none font-medium"
                        required
                      >
                        <option value="" disabled>Select Relationship</option>
                        <option value="Mother">Mother</option>
                        <option value="Father">Father</option>
                        <option value="Guardian">Guardian</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Passwords */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-10 pr-10 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-6 mt-8">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full shadow-md hover:shadow-lg transition-shadow text-base py-4 rounded-xl font-bold"
                    >
                      Next Step <ArrowRight className="w-5 h-5 ml-1.5" />
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <span className="text-sm text-zinc-500 mr-2 font-medium">Already have an account?</span>
                    <Link
                      href="/login"
                      className="text-sm font-bold text-[#176B9C] hover:text-[#135A84] hover:underline transition-colors"
                    >
                      Log in here
                    </Link>
                  </div>

                </div>
              )}

              {/* STEP 2: CHILD PROFILE */}
              {step === 2 && (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300 flex-1 flex flex-col">
                  
                  <div className="mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-4 shadow-sm border border-brand/10">
                      <Baby className="w-6 h-6" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-zinc-900 tracking-tight">Tell Us About Your Child</h2>
                    <p className="text-zinc-500 text-sm mt-1.5 font-medium">Just a few details to create their personal profile. 🌱</p>
                  </div>
                  
                  <div className="space-y-4 flex-1">
                    {/* Child Name */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Child's Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={childName}
                          onChange={(e) => setChildName(e.target.value)}
                          placeholder="Enter your child's name"
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="date"
                          value={childDob}
                          onChange={(e) => setChildDob(e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="w-full pl-10 pr-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                          required
                        />
                      </div>
                    </div>

                    {/* Gender (Optional) */}
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Gender <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                      </label>
                      <select
                        value={childGender}
                        onChange={(e) => setChildGender(e.target.value)}
                        className="w-full px-4 py-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none font-medium"
                      >
                        <option value="" disabled>Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Child Photos (Optional) */}
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                        Child's Photos <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                      </label>
                      <p className="text-xs text-zinc-500 mb-3 font-medium">
                        Upload 4 photos of your child — front, rear, left and right view.
                      </p>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {/* Front View */}
                        <div className="relative flex flex-col items-center">
                          <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                            {childPhotoFront ? (
                              <>
                                <img src={URL.createObjectURL(childPhotoFront)} alt="Front" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setChildPhotoFront(null)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) setChildPhotoFront(e.target.files[0]);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-1 border border-black/5">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-zinc-600 mt-2 uppercase tracking-wide">Front</span>
                        </div>

                        {/* Rear View */}
                        <div className="relative flex flex-col items-center">
                          <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                            {childPhotoRear ? (
                              <>
                                <img src={URL.createObjectURL(childPhotoRear)} alt="Rear" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setChildPhotoRear(null)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) setChildPhotoRear(e.target.files[0]);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-1 border border-black/5">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-zinc-600 mt-2 uppercase tracking-wide">Rear</span>
                        </div>

                        {/* Left View */}
                        <div className="relative flex flex-col items-center">
                          <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                            {childPhotoLeft ? (
                              <>
                                <img src={URL.createObjectURL(childPhotoLeft)} alt="Left" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setChildPhotoLeft(null)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) setChildPhotoLeft(e.target.files[0]);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-1 border border-black/5">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-zinc-600 mt-2 uppercase tracking-wide">Left</span>
                        </div>

                        {/* Right View */}
                        <div className="relative flex flex-col items-center">
                          <div className="w-full aspect-square bg-zinc-50 border border-zinc-200 rounded-xl overflow-hidden relative group transition-all hover:border-brand/30 hover:bg-brand-light/30 shadow-sm">
                            {childPhotoRight ? (
                              <>
                                <img src={URL.createObjectURL(childPhotoRight)} alt="Right" className="w-full h-full object-cover" />
                                <button
                                  type="button"
                                  onClick={() => setChildPhotoRight(null)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-colors z-20 shadow-sm"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </>
                            ) : (
                              <>
                                <input
                                  type="file"
                                  accept="image/jpeg,image/png,image/jpg"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) setChildPhotoRight(e.target.files[0]);
                                  }}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-400 group-hover:text-brand transition-colors bg-brand-light/20">
                                  <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-brand mb-1 border border-black/5">
                                    <Plus className="w-4 h-4" />
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                          <span className="text-[11px] font-bold text-zinc-600 mt-2 uppercase tracking-wide">Right</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-zinc-400 mt-3 font-medium italic">
                        You can upload photos now or add them later.
                      </p>
                    </div>
                  </div>
                  
                  {/* Bottom Actions */}
                  <div className="pt-6 mt-8 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-zinc-500 hover:text-brand transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back</span>
                    </button>
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      className="px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-shadow text-base font-bold"
                    >
                      Create Account <ArrowRight className="w-5 h-5 ml-1.5" />
                    </Button>
                  </div>
                  
                </div>
              )}

            </div>
          </div>
        </form>
      </LoginCard>
    </div>
  );
}
