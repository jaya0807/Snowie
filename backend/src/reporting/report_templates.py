import copy


class ReportTemplates:
    """
    Defines the canonical 6-section structure for a session report.
    Uses deep copy to prevent cross-request template mutation.
    """

    BASE_REPORT_STRUCTURE: dict = {
        "1_session_overview": {
            "title": "Session Overview",
            "content": "",
        },
        "2_domain_observations": {
            "title": "Domain Observations",
            "content": "",
        },
        "3_key_events": {
            "title": "Key Clinical Events",
            "content": "",
        },
        "4_contextual_patterns": {
            "title": "Contextual Patterns",
            "content": "",
        },
        "5_longitudinal_trends": {
            "title": "Longitudinal Trends",
            "content": "",
        },
        "6_professional_review": {
            "title": "Professional Review",
            "content": "",
            "system_limitation": (
                "This is an AI-assisted observational summary. "
                "It does not determine the cause of a behaviour "
                "and does not provide a medical diagnosis."
            ),
        },
    }

    @classmethod
    def get_empty_template(cls) -> dict:
        """Returns an independent deep copy — safe to mutate per request."""
        return copy.deepcopy(cls.BASE_REPORT_STRUCTURE)
