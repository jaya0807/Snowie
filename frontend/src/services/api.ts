/**
 * Centralized API Client for Snowie
 * Connects frontend to the FastAPI Python backend
 */

const getApiBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    // Client-side environment check
    return (
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      (window as any).__ENV__?.VITE_API_BASE_URL ||
      "http://localhost:8001"
    );
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8001";
};

export const API_BASE_URL = getApiBaseUrl();

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  status: number;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const contentType = response.headers.get("content-type");
    let responseData: any = null;

    if (contentType && contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorMsg =
        typeof responseData === "object" && responseData?.detail
          ? responseData.detail
          : typeof responseData === "object" && responseData?.message
          ? responseData.message
          : "Oops! We encountered an issue. Please try again.";
      return {
        status: response.status,
        error: errorMsg,
      };
    }

    return {
      status: response.status,
      data: responseData as T,
    };
  } catch (err: any) {
    return {
      status: 0,
      error: "Unable to connect to the observation server. Please check your connection.",
    };
  }
}
