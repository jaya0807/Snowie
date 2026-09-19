"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  ParentLoginCredentials,
  ParentSignupCredentials,
  parentSignup as serviceParentSignup,
  parentLogin as serviceParentLogin,
  clinicianLogin as serviceClinicianLogin,
  logout as serviceLogout,
  getStoredSession,
} from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  role: "parent" | "clinician" | null;
  isLoading: boolean;
  loginParent: (creds: ParentLoginCredentials) => Promise<{ success: boolean; error?: string }>;
  signupParent: (creds: ParentSignupCredentials) => Promise<{ success: boolean; error?: string }>;
  loginClinician: (creds: { email: string; password?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Hydrate session from localStorage
    const session = getStoredSession();
    if (session) {
      setUser(session);
    }
    setIsLoading(false);
  }, []);

  const loginParent = async (creds: ParentLoginCredentials) => {
    const res = await serviceParentLogin(creds);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  
  const signupParent = async (creds: ParentSignupCredentials) => {
    const res = await serviceParentSignup(creds);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const loginClinician = async (creds: { email: string; password?: string }) => {
    const res = await serviceClinicianLogin(creds);
    if (res.success && res.user) {
      setUser(res.user);
      return { success: true };
    }
    return { success: false, error: res.error };
  };

  const logout = async () => {
    await serviceLogout();
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isLoading,
        loginParent,
        signupParent,
        loginClinician,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
