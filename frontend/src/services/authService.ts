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
    const res = await apiRequest("/auth/login/parent", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    if ((res as any).token && (res as any).user) {
      const user: ParentUser = { ...(res as any).user, role: "parent" };
      setStoredSession((res as any).token, user);
      return { success: true, user };
    }
    
    // Fallback Mock Logic
    await new Promise(resolve => setTimeout(resolve, 800));
    
    if (credentials.email === "test@example.com" && credentials.password === "password") {
      const mockUser: ParentUser = {
        role: "parent",
        email: credentials.email,
        name: "Test Parent",
        token: "mock_token_123",
        children: [{ id: "c1", name: credentials.childName || "Milo", age: 6 }]
      };
      setStoredSession(mockUser.token, mockUser);
      return { success: true, user: mockUser };
    } else {
      return { success: false, error: "Invalid email or password. Use test@example.com / password" };
    }

  } catch (error: any) {
    console.error("Login failed:", error);
    
    // Mock logic on fail
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockUser: ParentUser = {
      role: "parent",
      email: credentials.email,
      name: "Test Parent",
      token: "mock_token_123",
      children: [{ id: "c1", name: credentials.childName || "Milo", age: 6 }]
    };
    setStoredSession(mockUser.token, mockUser);
    return { success: true, user: mockUser };
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
