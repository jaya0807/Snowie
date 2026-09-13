"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, 
  ArrowLeft, ArrowRight, ShieldCheck, UserPlus, Calendar, Image as ImageIcon,
  Baby
} from "lucide-react";
import { LoginCard } from "./LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import Link from "next/link";

interface SignupFormProps {
  onBack?: () => void; // Optional back handler if embedded, otherwise we use Next Link
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
  // For file upload placeholder
  const [childPicture, setChildPicture] = useState<File | null>(null);

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
      router.push("/login");
    } catch {
      setErrorMessage("Oops! We couldn't create your account right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      <LoginCard variant="parent" className="relative">
        {/* Back Navigation */}
        {step === 1 ? (
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-brand transition-colors mb-6 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Step 1</span>
          </button>
        )}

        {/* Header */}
        <div className="mb-6">
          <div className="w-12 h-12 rounded-2xl bg-brand-light flex items-center justify-center text-brand mb-3">
            {step === 1 ? <UserPlus className="w-6 h-6" /> : <Baby className="w-6 h-6" />}
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight">
            {step === 1 ? "Create Account" : "Child Profile"}
          </h2>
          <p className="text-zinc-500 text-xs mt-1">
            {step === 1 
              ? "Step 1 of 2: Let's start with your parent profile." 
              : "Step 2 of 2: Tell us a bit about your little explorer."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <ErrorMessage
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            className="mb-5"
          />
        )}

        {/* Form Container */}
        <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNextStep(); } : handleSubmit} className="space-y-4">
          
          {/* STEP 1: PARENT ACCOUNT */}
          {step === 1 && (
            <>
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
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
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Relationship with Child */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Relationship with Child
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none"
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                    Confirm
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                className="w-full mt-2"
              >
                Next <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </>
          )}

          {/* STEP 2: CHILD PROFILE */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300 space-y-4">
              
              {/* Child Name */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Child Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={childName}
                    onChange={(e) => setChildName(e.target.value)}
                    placeholder="Alex"
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
                    required
                  />
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Date of Birth
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="date"
                    value={childDob}
                    onChange={(e) => setChildDob(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder:text-zinc-400 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none"
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
                  className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 focus:bg-white focus:border-brand focus:ring-4 focus:ring-brand/10 transition-all outline-none appearance-none"
                >
                  <option value="" disabled>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Child Picture (Optional) */}
              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1.5">
                  Child Picture <span className="text-zinc-400 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden shrink-0">
                    {childPicture ? (
                       <img src={URL.createObjectURL(childPicture)} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-zinc-400" />
                    )}
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files.length > 0) {
                          setChildPicture(e.target.files[0]);
                        }
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-600 hover:bg-zinc-100 transition-colors text-center font-medium">
                      {childPicture ? "Change Picture" : "Upload Picture"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  isLoading={isLoading}
                  className="w-full"
                >
                  Create Account
                </Button>
              </div>
            </div>
          )}

        </form>

        {/* Login Link */}
        {step === 1 && (
           <div className="mt-6 pt-5 border-t border-zinc-100 text-center space-y-3">
             <div>
               <span className="text-xs text-zinc-500 mr-1.5">Already have an account?</span>
               <Link
                 href="/login"
                 className="text-xs font-semibold text-brand hover:underline cursor-pointer"
               >
                 Log in here
               </Link>
             </div>
           </div>
        )}
      </LoginCard>
    </div>
  );
}
