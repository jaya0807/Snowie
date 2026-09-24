"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, UserPlus, Baby } from "lucide-react";
import { LoginCard } from "./LoginCard";
import { Button } from "@/components/common/Button";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { useAuth } from "@/context/AuthContext";
import { ParentProfileFields } from "./ParentProfileFields";
import { ChildProfileFields } from "./ChildProfileFields";

interface SignupFormProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

export function SignupForm({ onBack, onLoginClick }: SignupFormProps) {
  const router = useRouter();
  const { signupParent } = useAuth();
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [relationship, setRelationship] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [childName, setChildName] = useState("");
  const [childDob, setChildDob] = useState("");
  const [childGender, setChildGender] = useState("");
  
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
      const res = await signupParent({
        fullName,
        email,
        password,
        relationship,
        childName,
        childDob,
        childGender
      });
      if (res.success) {
        router.push("/dashboard");
      } else {
        setErrorMessage(res.error || "Oops! We couldn't create your account right now. Please try again.");
      }
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
          <ErrorMessage message={errorMessage} onDismiss={() => setErrorMessage(null)} className="mb-5" />
        )}

        <form onSubmit={handleSubmit} className="relative">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
            
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
              <ParentProfileFields 
                fullName={fullName} setFullName={setFullName}
                email={email} setEmail={setEmail}
                phone={phone} setPhone={setPhone}
                relationship={relationship} setRelationship={setRelationship}
                password={password} setPassword={setPassword}
                confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}
                showPassword={showPassword} setShowPassword={setShowPassword}
                showConfirmPassword={showConfirmPassword} setShowConfirmPassword={setShowConfirmPassword}
              />
            </div>

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
              <ChildProfileFields 
                childName={childName} setChildName={setChildName}
                childDob={childDob} setChildDob={setChildDob}
                childGender={childGender} setChildGender={setChildGender}
                childPhotoFront={childPhotoFront} setChildPhotoFront={setChildPhotoFront}
                childPhotoRear={childPhotoRear} setChildPhotoRear={setChildPhotoRear}
                childPhotoLeft={childPhotoLeft} setChildPhotoLeft={setChildPhotoLeft}
                childPhotoRight={childPhotoRight} setChildPhotoRight={setChildPhotoRight}
              />
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
            
            <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full md:w-auto md:px-12 md:py-3.5 shadow-md hover:shadow-lg transition-shadow text-base font-bold">
              Create Account <ArrowRight className="w-5 h-5 ml-1.5" />
            </Button>
          </div>
        </form>
      </LoginCard>
    </div>
  );
}
