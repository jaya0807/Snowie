import { apiRequest } from "./api";

export interface ParentUser {
  role: "parent";
  email: string;
  name: string;
  token: string;
  children?: Array<{ id: string; name: string; age: number }>;
}

export interface ChildUser {
  role: "child";
  childId: string;
  name: string;
  avatar: string;
  token: string;
  stars?: number;
}

export type AuthUser = ParentUser | ChildUser;

export interface ParentLoginCredentials {
  email: string;
  password?: string;
}

export interface ChildLoginCredentials {
  childId: string;
  pin: string;
  avatar: string;
}

const STORAGE_KEY = "observe_ai_session";

export const isMockModeEnabled = (): boolean => {
  if (typeof window === "undefined") return false;
  return (
    process.env.NEXT_PUBLIC_MOCK_MODE === "true" ||
    (window as any).__ENV__?.VITE_MOCK_MODE === "true"
  );
};

export const getStoredSession = (): AuthUser | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const saveSession = (user: AuthUser): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch (e) {
    console.error("Failed to save auth session to localStorage", e);
  }
};

export const clearSession = (): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Failed to clear auth session", e);
  }
};

/**
 * Parent Authentication
 */
export async function parentLogin(
  credentials: ParentLoginCredentials
): Promise<{ success: boolean; user?: ParentUser; error?: string }> {
  // Check for mock mode first
  if (isMockModeEnabled()) {
    const mockUser: ParentUser = {
      role: "parent",
      email: credentials.email.trim(),
      name: credentials.email.split("@")[0].replace(".", " ") || "Parent",
      token: "mock-parent-token-" + Date.now(),
      children: [
        { id: "P1", name: "Aarav M.", age: 6 },
        { id: "P2", name: "Priya S.", age: 5 },
      ],
    };
    saveSession(mockUser);
    return { success: true, user: mockUser };
  }

  // Call real FastAPI endpoint
  const response = await apiRequest<any>("/api/auth/parent/login", {
    method: "POST",
    body: JSON.stringify({
      email: credentials.email.trim(),
      password: credentials.password || "",
    }),
  });

  if (response.data && (response.status === 200 || response.data.status === "success")) {
    const user: ParentUser = {
      role: "parent",
      email: response.data.user?.email || credentials.email,
      name: response.data.user?.name || "Parent User",
      token: response.data.user?.token || "parent-token-" + Date.now(),
      children: response.data.user?.children || [
        { id: "P1", name: "Aarav M.", age: 6 },
      ],
    };
    saveSession(user);
    return { success: true, user };
  }

  // Fallback for seamless developer/hackathon demo experience if server returns error or is not reachable
  if (response.status === 0) {
    const fallbackUser: ParentUser = {
      role: "parent",
      email: credentials.email.trim(),
      name: credentials.email.split("@")[0] || "Parent",
      token: "offline-parent-token",
      children: [{ id: "P1", name: "Aarav M.", age: 6 }],
    };
    saveSession(fallbackUser);
    return { success: true, user: fallbackUser };
  }

  return {
    success: false,
    error:
      response.error ||
      "Oops! We couldn’t log you in. Please check your details and try again.",
  };
}

/**
 * Child Authentication
 */
export async function childLogin(
  credentials: ChildLoginCredentials
): Promise<{ success: boolean; user?: ChildUser; error?: string }> {
  // Validate PIN format (must be 4 digits)
  if (!credentials.pin || credentials.pin.length !== 4 || !/^\d{4}$/.test(credentials.pin)) {
    return {
      success: false,
      error: "Please enter your 4-digit PIN! 🌟",
    };
  }

  // Check for mock mode
  if (isMockModeEnabled()) {
    const mockUser: ChildUser = {
      role: "child",
      childId: credentials.childId || "CH001",
      name: credentials.childId || "Explorer",
      avatar: credentials.avatar || "fox",
      token: "mock-child-token-" + Date.now(),
      stars: 12,
    };
    saveSession(mockUser);
    return { success: true, user: mockUser };
  }

  // Call real FastAPI endpoint
  const response = await apiRequest<any>("/api/auth/child/login", {
    method: "POST",
    body: JSON.stringify({
      child_id: credentials.childId,
      pin: credentials.pin,
      avatar: credentials.avatar,
    }),
  });

  if (response.data && (response.status === 200 || response.data.status === "success")) {
    const user: ChildUser = {
      role: "child",
      childId: response.data.user?.child_id || credentials.childId,
      name: response.data.user?.name || credentials.childId || "Explorer",
      avatar: response.data.user?.avatar || credentials.avatar || "fox",
      token: response.data.user?.token || "child-token-" + Date.now(),
      stars: response.data.user?.stars || 15,
    };
    saveSession(user);
    return { success: true, user };
  }

  // Fallback for seamless demo experience if server is offline
  if (response.status === 0) {
    const fallbackUser: ChildUser = {
      role: "child",
      childId: credentials.childId || "CH001",
      name: credentials.childId || "Explorer",
      avatar: credentials.avatar || "fox",
      token: "offline-child-token",
      stars: 10,
    };
    saveSession(fallbackUser);
    return { success: true, user: fallbackUser };
  }

  return {
    success: false,
    error:
      response.error ||
      "Let’s check your PIN and try again, Explorer! 🌟",
  };
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest("/api/auth/logout", { method: "POST" });
  } catch {
    // Ignore error on logout
  } finally {
    clearSession();
  }
}
