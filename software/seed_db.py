import uuid
from database.database import Database
from database.models import Participant, Session
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "observe.db")
db = Database(db_path=DB_PATH)

p1 = Participant(participant_id=str(uuid.uuid4()), name="Aarav M.", age=6)
p2 = Participant(participant_id=str(uuid.uuid4()), name="Priya S.", age=5)
p3 = Participant(participant_id=str(uuid.uuid4()), name="Rohan K.", age=7)

db.add_participant(p1)
db.add_participant(p2)
db.add_participant(p3)

s1 = Session(session_id="S-001", participant_id=p1.participant_id, start_time="Today, 10:42 AM", end_time="Today, 11:10 AM")
s2 = Session(session_id="S-002", participant_id=p2.participant_id, start_time="Yesterday, 2:15 PM", end_time="Yesterday, 2:47 PM")
s3 = Session(session_id="S-003", participant_id=p3.participant_id, start_time="Aug 28, 11:00 AM", end_time="Aug 28, 11:25 AM")

db.start_session(s1)
db.start_session(s2)
db.start_session(s3)

print("Database seeded!")
