import json

class PromptBuilder:
    @staticmethod
    def build_report_prompt(session_data, evidence_insights):
        """
        Builds a strict prompt for the LLM to generate a report based ONLY on supplied evidence.
        """
        prompt = """
You are an AI assistant helping a professional write an observational report for a child development session.
Your task is to generate a professional, readable report based strictly on the provided structured data.

CRITICAL RULES:
- Use ONLY the supplied structured data.
- Do not invent numbers, events, observations, or causes.
- Do NOT diagnose autism or any other medical condition.
- Do NOT claim one behaviour proves or rules out a condition.
- Describe measurements strictly as observations.
- Describe relationships as associations, not causes (e.g., use "observed alongside" rather than "caused by").
- State when evidence is insufficient.
- Preserve the exact supplied numerical values.

STRUCTURED DATA (EVIDENCE):
"""
        prompt += f"\nSession Metrics:\n{json.dumps(session_data, indent=2)}\n"
        prompt += f"\nValidated Insights:\n{json.dumps(evidence_insights, indent=2)}\n"
        
        prompt += """
Format the output into the following sections:
1. Session Overview (Duration, activities, completion)
2. Domain Observations (Movement, head orientation, task performance)
3. Key Events (Important events/timestamps)
4. Contextual Patterns (Relationships between demand and observations)
5. Longitudinal Trends (Comparison with prior sessions, if data exists)
6. Professional Review (Summary for the professional to review and append notes)
"""
        return prompt
