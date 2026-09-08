with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

# Add session_id state
content = content.replace("const [stepIndex, setStepIndex] = useState(0);", 
"""const [stepIndex, setStepIndex] = useState(0);
  const [sessionId, setSessionId] = useState("");""")

# When component mounts, start a session
start_session_code = """  useEffect(() => {
    fetch(`http://localhost:8001/api/session/start?patient_id=P1&activity_id=A1`, { method: 'POST' })
      .then(res => res.json())
      .then(data => setSessionId(data.session_id))
      .catch(err => console.error(err));
  }, []);"""

content = content.replace("  // Initialize Web Speech API", start_session_code + "\n\n  // Initialize Web Speech API")

# Update nextStep to submit data
old_next = """  const nextStep = () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finish Activity - Send telemetry to backend and exit
      fetch(`http://localhost:8001/api/session/end?session_id=mock_session`, { method: 'POST' }).catch(() => {});
      router.push('/dashboard');
    }
  };"""

new_next = """  const nextStep = async () => {
    if (stepIndex < STEPS.length - 1) {
      setStepIndex(stepIndex + 1);
    } else {
      // Finish Activity - Send telemetry to backend and exit
      const sid = sessionId || "mock_session";
      
      try {
        // 1. Submit the conversational data
        await fetch(`http://localhost:8001/api/activities/a1/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            session_id: sid,
            name: name,
            feeling: feeling,
            animal: favAnimal,
            day_text: dayText
          })
        });
        
        // 2. End the session
        await fetch(`http://localhost:8001/api/session/end?session_id=${sid}`, { method: 'POST' });
      } catch (e) {
        console.error("Failed to submit A1 data", e);
      }
      
      router.push('/dashboard');
    }
  };"""

content = content.replace(old_next, new_next)

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
