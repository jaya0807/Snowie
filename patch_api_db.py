import re

with open("backend/src/api.py", "r") as f:
    content = f.read()

# Make sure Database is imported
if "from database.database import Database" not in content:
    content = "from database.database import Database\nimport time\n" + content

# Fix start_session
start_session_old = """@app.post("/api/session/start")
def start_session(activity_id: str, patient_id: str = "P1"):
    # In a real app we'd fetch the type and difficulty from activity_definitions
    session_id = f"sess_{len(active_sessions) + 1}"
    
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    
    active_sessions[session_id] = runtime
    
    return {"status": "started", "session_id": session_id}"""

start_session_new = """@app.post("/api/session/start")
def start_session(activity_id: str, patient_id: str = "P1"):
    import uuid
    session_id = f"sess_{uuid.uuid4().hex[:8]}"
    
    runtime = ActivityRuntime(session_id, activity_id, "instruction_following", "Low")
    runtime.start()
    
    active_sessions[session_id] = runtime
    
    # Save to SQLite
    db = Database(DB_PATH)
    # Ensure participant exists
    db.add_participant(patient_id, "Child", 5, time.time())
    db.start_session(session_id, patient_id, time.time(), activity_id, "Low")
    
    return {"status": "started", "session_id": session_id}"""

content = content.replace(start_session_old, start_session_new)

# Fix end_session
end_session_old = """@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id not in active_sessions:
        return {"error": "Session not found"}
        
    runtime = active_sessions[session_id]
    
    # Mocking a response for the demo (child got 2 out of 3 steps right)
    accuracy = ScoringEngine.calculate_multi_step_accuracy(correct_steps=2, total_steps=3)
    response_time = 4.2
    
    result = runtime.finish(completion_status="COMPLETED", accuracy=accuracy, response_time=response_time)
    
    del active_sessions[session_id]
    
    return {"status": "ended", "result": result}"""

end_session_new = """@app.post("/api/session/end")
def end_session(session_id: str):
    if session_id not in active_sessions:
        return {"error": "Session not found"}
        
    runtime = active_sessions[session_id]
    
    import random
    # Generate somewhat realistic but random scores for the demo
    accuracy = random.choice([0.33, 0.66, 1.0])
    response_time = round(random.uniform(2.0, 6.0), 1)
    
    result = runtime.finish(completion_status="COMPLETED", accuracy=accuracy, response_time=response_time)
    
    del active_sessions[session_id]
    
    # Save to SQLite
    db = Database(DB_PATH)
    db.end_session(session_id, time.time(), accuracy, response_time)
    
    return {"status": "ended", "result": result}"""

content = content.replace(end_session_old, end_session_new)

with open("backend/src/api.py", "w") as f:
    f.write(content)
