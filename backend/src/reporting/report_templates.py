class ReportTemplates:
    """
    Standardizes the JSON structure or text layout for the final report.
    """
    
    BASE_REPORT_STRUCTURE = {
        "1_session_overview": {
            "title": "1. Session Overview",
            "content": ""
        },
        "2_domain_observations": {
            "title": "2. Domain Observations",
            "content": ""
        },
        "3_key_events": {
            "title": "3. Key Events",
            "content": ""
        },
        "4_contextual_patterns": {
            "title": "4. Contextual Patterns",
            "content": ""
        },
        "5_longitudinal_trends": {
            "title": "5. Longitudinal Trends",
            "content": ""
        },
        "6_professional_review": {
            "title": "6. Professional Review",
            "content": "",
            "system_limitation": "This is an AI-assisted observational summary. It does not determine the cause of a behaviour and does not provide a medical diagnosis."
        }
    }
    
    @classmethod
    def get_empty_template(cls):
        return cls.BASE_REPORT_STRUCTURE.copy()
