import { apiRequest } from "./api";

export interface ParentUser {
  role: "parent";
  email: string;
  name: string;
  token: string;
  children?: Array<{ id: string; name: string; age: number }>;
}

export type AuthUser = ParentUser;

export interface ParentLoginCredentials {
  email: string;
  password?: string;
  childName?: string;
}

const TOKEN_KEY = "neura_auth_token";
const USER_KEY = "neura_auth_user";

export function getStoredSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY);
  
  if (token && userJson) {
    try {
      return JSON.parse(userJson) as AuthUser;
    } catch {
      return null;
    }
  }
  return null;
}

export function setStoredSession(token: string, user: AuthUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export async function parentLogin(
  credentials: ParentLoginCredentials
): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  try {
    const res = await apiRequest("/api/auth/parent/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if (res.status === 200 && res.data && res.data.status === "success") {
      const user: ParentUser = { ...res.data.user, role: "parent" };
      setStoredSession(res.data.user.token, user);
      return { success: true, user };
    }
    
    return { success: false, error: res.error || res.data?.message || "Invalid credentials" };

  } catch (error: any) {
    console.error("Login failed:", error);
    return { success: false, error: "Network error. Please try again." };
  }
}

export async function logout(): Promise<void> {
  clearStoredSession();
  try {
    await apiRequest("/auth/logout", { method: "POST" });
  } catch (e) {
    console.warn("Logout API call failed, continuing local clear");
  }
}
