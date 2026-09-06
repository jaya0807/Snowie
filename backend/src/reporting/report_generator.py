import google.generativeai as genai
import os
import json

class ReportGenerator:
    def __init__(self):
        pass

    def generate_report(self, session_metrics, evidence):
        # According to the frozen MVP spec, AI should only write reports from validated evidence.
        # It must NOT invent data, diagnose, or claim causality.
        
        prompt = f"""
You are a professional behavioral report writer. Based on the following structured evidence from an observation session, generate a professional summary report. 

Rules:
- Do not invent numbers, events, observations or causes.
- Do not diagnose autism or another medical condition.
- Describe measurements as observations.
- Describe relationships as associations, not causes.
- State when evidence is insufficient.
- Preserve supplied numerical values.

Session Metrics:
{json.dumps(session_metrics, indent=2)}

Pattern Evidence:
{json.dumps(evidence, indent=2)}
"""
        
        # If API key is not present, return a mocked response for the MVP
        api_key = os.environ.get("GEMINI_API_KEY")
        if not api_key:
            return {
                "status": "mock",
                "report": "This is a mock report since no GEMINI_API_KEY is configured. \n\nSession summary: The session completed with " + str(session_metrics.get("activities_completed", 0)) + " activities. \n\nObserved movement: " + str(session_metrics.get("repetitive_movement_events", 0)) + " repetitive movement events were detected."
            }
        
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-pro')
            response = model.generate_content(prompt)
            return {
                "status": "success",
                "report": response.text
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }
