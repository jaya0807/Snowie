import re

with open("frontend/src/app/(dashboard)/sessions/page.tsx", "r") as f:
    content = f.read()

# Replace the broken useEffect
effect = """  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8001/api/ws/session");
    wsRef.current = ws;
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === "telemetry") {
          setSessionActive(true);
          setTelemetry(prev => {
            const newEvents = [data.event, ...prev.events].slice(0, 5);
            return {
              engagement: data.engagement,
              latency: data.latency,
              events: newEvents
            };
          });
        } else if (data.type === "session_end") {
          setSessionActive(false);
        }
      } catch (e) {
        console.error("WS Parse error", e);
      }
    };

    return () => {
      if (wsRef.current) wsRef.current.close();
    };
  }, []);"""

new_content = re.sub(r'useEffect\(\(\) => \{.*?\}, \[\]\);', '', content, flags=re.DOTALL)
insert_pos = new_content.find("return (")
final_content = new_content[:insert_pos] + effect + "\n\n  " + new_content[insert_pos:]

with open("frontend/src/app/(dashboard)/sessions/page.tsx", "w") as f:
    f.write(final_content)
