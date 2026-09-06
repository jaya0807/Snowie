import re

with open("backend/src/api.py", "r") as f:
    content = f.read()

grow_old = """@app.get("/api/grow/recommend")
def get_recommendation(patient_id: str = "P1", activity_id: str = "A2"):
    engine = RecommendationEngine(db_connection=DB_PATH)
    rec = engine.recommend_next_step(patient_id, activity_id, recent_accuracy=0.85)"""

grow_new = """@app.get("/api/grow/recommend")
def get_recommendation(patient_id: str = "P1", activity_id: str = "A2"):
    from database.database import Database
    db = Database(DB_PATH)
    history = db.get_session_history(patient_id, activity_id)
    recent_accuracy = 0.50
    if history and history[-1].get("accuracy") is not None:
        recent_accuracy = history[-1]["accuracy"]
        
    engine = RecommendationEngine(db_connection=DB_PATH)
    rec = engine.recommend_next_step(patient_id, activity_id, recent_accuracy=recent_accuracy)"""

content = content.replace(grow_old, grow_new)

with open("backend/src/api.py", "w") as f:
    f.write(content)
