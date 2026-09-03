from dataclasses import dataclass
from typing import Optional, Dict
import json
from datetime import datetime

@dataclass
class Participant:
    participant_id: str
    name: str
    age: int
    created_at: str = datetime.now().isoformat()

@dataclass
class Session:
    session_id: str
    participant_id: str
    start_time: str
    end_time: Optional[str] = None

@dataclass
class Event:
    event_id: str
    session_id: str
    timestamp: str
    event_type: str
    duration: float
    body_region: Optional[str] = None
    confidence: float = 1.0
    context: Optional[Dict] = None

    def context_to_json(self) -> str:
        return json.dumps(self.context) if self.context else "{}"
