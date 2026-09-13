"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  AuthUser,
  ParentUser,
  ChildUser,
  ParentLoginCredentials,
  ChildLoginCredentials,
  parentLogin as serviceParentLogin,
  childLogin as serviceChildLogin,
  logout as serviceLogout,
  getStoredSession,
} from "@/services/authService";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: AuthUser | null;
  role: "parent" | "child" | null;
  isLoading: boolean;
  loginParent: (creds: ParentLoginCredentials) => Promise<{ success: boolean; error?: string }>;
  loginChild: (creds: ChildLoginCredentials) => Promise<{ success: boolean; error?: string }>;
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

  const loginChild = async (creds: ChildLoginCredentials) => {
    const res = await serviceChildLogin(creds);
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
        loginChild,
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
