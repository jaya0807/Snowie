import glob
import re

files = glob.glob("frontend/src/activities/*/*UI.tsx")
for path in files:
    if "Activity1UI.tsx" in path:
        continue # Already done
        
    with open(path, "r") as f:
        content = f.read()
        
    # Check if there is an exit button logic
    if "onClick={() => router.push('/dashboard')}" in content or "onClick={() => router.push('/activities')}" in content:
        # We need to find where to inject handleExit
        # They usually have a sessionId state.
        
        handle_exit = """
  const handleExit = async () => {
    try {
      await fetch(`http://${window.location.hostname}:8000/api/session/end?session_id=${sessionId || "demo-session"}`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    router.push('/dashboard');
  };
"""
        
        # Inject handleExit before return (
        content = re.sub(r'(\n  return \()', handle_exit + r'\1', content)
        
        # Replace the onClick
        content = re.sub(r'onClick=\{\(\) => router\.push\(\'/(dashboard|activities)\'\)\}', 'onClick={handleExit}', content)
        
        with open(path, "w") as f:
            f.write(content)
