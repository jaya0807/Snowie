import boto3
import json
import os

from reporting.prompt_builder import PromptBuilder


class ReportGenerator:
    """
    Generates clinical session reports using Amazon Bedrock (Claude).
    Falls back to a structured data-driven report if AWS is unavailable.

    Required environment variables (set in EC2 IAM role or locally):
        AWS_DEFAULT_REGION   — e.g. "us-east-1"
        AWS_ACCESS_KEY_ID    — only needed outside IAM-role environments
        AWS_SECRET_ACCESS_KEY

    Optional:
        BEDROCK_MODEL_ID     — defaults to "anthropic.claude-haiku-4-5-20251001-v1:0"
    """

    DEFAULT_MODEL = "anthropic.claude-haiku-4-5-20251001-v1:0"

    def __init__(self):
        self.model_id = os.environ.get("BEDROCK_MODEL_ID", self.DEFAULT_MODEL)
        self.region = os.environ.get("AWS_DEFAULT_REGION", "us-east-1")
        self._client = None  # Lazy init — avoids crash at import time if no creds

    def _get_client(self):
        if self._client is None:
            self._client = boto3.client(
                service_name="bedrock-runtime",
                region_name=self.region,
            )
        return self._client

    def generate_report(self, session_metrics: dict, evidence: dict) -> dict:
        """
        Generates an AI-assisted session report.

        Args:
            session_metrics: Output of Database.get_session_full_summary()
            evidence: Output of EvidenceEngine.analyze_repetition_context()

        Returns:
            {
                "status": "success" | "fallback" | "error",
                "model": str,
                "report": str   # The narrative report text
            }
        """
        prompt = PromptBuilder.build_report_prompt(session_metrics, evidence)

        try:
            client = self._get_client()
            body = json.dumps({
                "anthropic_version": "bedrock-2023-05-31",
                "max_tokens": 1500,
                "temperature": 0.3,
                "messages": [
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
            })

            response = client.invoke_model(
                modelId=self.model_id,
                body=body,
                contentType="application/json",
                accept="application/json",
            )

            result = json.loads(response["body"].read())
            text = result["content"][0]["text"]
            return {"status": "success", "model": self.model_id, "report": text}

        except Exception as e:
            print(f"[ReportGenerator] Bedrock call failed: {e}. Using structured fallback.")
            return {
                "status": "fallback",
                "model": "structured_fallback",
                "report": self._structured_fallback(session_metrics, evidence),
            }

    def _structured_fallback(self, session_metrics: dict, evidence: dict) -> str:
        """
        Returns a data-driven report string without AI when Bedrock is unavailable.
        Uses real session numbers — not a mock placeholder.
        """
        session = session_metrics.get("session", {})
        telem = session_metrics.get("telemetry", {})
        event_counts = session_metrics.get("event_counts", {})

        activity_id = session.get("activity_id", "Unknown")
        accuracy = session.get("accuracy")
        acc_str = f"{int((accuracy or 0) * 100)}%" if accuracy is not None else "N/A"

        frames = telem.get("frames", 0) or 0
        focus_frames = telem.get("focus_frames", 0) or 0
        focus_pct = round(focus_frames / frames * 100, 1) if frames > 0 else 0

        motor_total = sum(
            event_counts.get(k, 0)
            for k in ["HAND_FLAPPING", "BODY_ROCKING", "WRIST_POSTURING", "FINGER_FLICKING", "HEAD_TIC"]
        )
        gaze_aversions = event_counts.get("GAZE_AVERSION", 0)

        evidence_str = ""
        if evidence:
            evidence_str = f"\n\nObserved behavioural associations: {evidence.get('statement', '')}"

        return (
            f"SESSION SUMMARY REPORT\n"
            f"======================\n\n"
            f"Activity: {activity_id}\n"
            f"Accuracy: {acc_str}\n"
            f"Visual Focus: {focus_pct}% of session\n"
            f"Gaze Aversions: {gaze_aversions}\n"
            f"Motor Events Detected: {motor_total}\n"
            f"Telemetry Frames Captured: {frames}\n"
            f"{evidence_str}\n\n"
            f"Note: This is a structured data summary generated without AI assistance. "
            f"Configure AWS credentials and enable Bedrock for full narrative reports.\n\n"
            f"DISCLAIMER: This is an observational summary only. "
            f"It does not determine the cause of any behaviour and does not provide a medical diagnosis."
        )
