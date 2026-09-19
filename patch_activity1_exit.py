import re

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

handle_exit = """
  const handleExit = async () => {
    try {
      await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId}`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.push('/dashboard');
  };

  const handleNext = async () => {
"""

content = content.replace("const handleNext = async () => {", handle_exit)
content = content.replace("onClick={() => router.push('/dashboard')}", "onClick={handleExit}")

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
