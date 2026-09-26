/* eslint-disable */
"use client";

import { useEffect, useRef, useCallback } from "react";

export function useSessionWebSocket(sessionId: string) {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!sessionId) return;
    const ws = new WebSocket(`ws://${window.location.hostname}:8001/api/ws/capture/${sessionId}`);
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
