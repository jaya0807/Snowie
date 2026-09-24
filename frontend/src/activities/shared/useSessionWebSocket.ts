/* eslint-disable */
"use client";

import { useEffect, useRef, useCallback } from "react";

export function useSessionWebSocket(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const getWsUrl = (sessionId: string) => {
      const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || `http://${window.location.hostname}:8000`;
      const wsBase = apiBase.replace("http://", "ws://").replace("https://", "wss://");
      return `${wsBase}/api/ws/capture/${sessionId}`;
    };
    const ws = new WebSocket(getWsUrl(sessionId));
    wsRef.current = ws;
    ws.onerror = (e) => console.warn("[Tracker] WS error:", e);

    return () => {
      ws.close();
      wsRef.current = null;
    };
  }, [sessionId]);

  const send = useCallback((data: any) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    return false;
  }, []);

  return { send, ws: wsRef.current };
}
