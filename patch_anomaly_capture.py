import re

with open("frontend/src/activities/a1_natural_interaction/components/HiddenCameraProcessor.tsx", "r") as f:
    content = f.read()

capture_fn = """
  const captureAnomaly = (eventType: string) => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoRef.current, 0, 0);
    const base64 = canvas.toDataURL("image/jpeg", 0.7);
    
    fetch(`http://${window.location.hostname}:8000/api/media/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: sessionId,
        event_type: eventType,
        timestamp: Date.now(),
        image_base64: base64
      })
    }).catch(e => console.error("Upload error", e));
  };
"""

content = content.replace("export function HiddenCameraProcessor({ sessionId }: { sessionId: string }) {", "export function HiddenCameraProcessor({ sessionId }: { sessionId: string }) {\n" + capture_fn)

content = content.replace(
    'if (em.lastGazeStatus !== "Distracted") em.aversions += 1;',
    'if (em.lastGazeStatus !== "Distracted") { em.aversions += 1; captureAnomaly("Gaze Distraction"); }'
)
content = content.replace(
    'if (em.lastGazeStatus !== "Avoidance") em.aversions += 1;',
    'if (em.lastGazeStatus !== "Avoidance") { em.aversions += 1; captureAnomaly("Gaze Avoidance"); }'
)

# Hand flapping capture
content = content.replace(
    'if (!em.isFlapping) { em.flappingEvents += 1; em.isFlapping = true; }',
    'if (!em.isFlapping) { em.flappingEvents += 1; em.isFlapping = true; captureAnomaly("Motor Tic (Hand Flapping)"); }'
)

with open("frontend/src/activities/a1_natural_interaction/components/HiddenCameraProcessor.tsx", "w") as f:
    f.write(content)
