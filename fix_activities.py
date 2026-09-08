with open("backend/src/api.py", "r") as f:
    content = f.read()

import re
old_func = re.search(r'@app\.get\("/api/activities"\).*?return acts', content, re.DOTALL).group(0)

new_func = """@app.get("/api/activities")
def get_activities():
    from activity.activity_definitions import ACTIVITIES
    acts = []
    for aid, meta in ACTIVITIES.items():
        description = meta.get("instructions", "")
        # Activity 1 doesn't have a specific description in the dict that fits well, 
        # but "instructions" works. Let's provide a friendly fallback.
        acts.append({
            "id": aid,
            "name": meta["name"],
            "domain": meta["domain"],
            "description": description,
            "difficulty_levels": meta.get("difficulty_levels", ["Low"])
        })
    return acts"""

content = content.replace(old_func, new_func)

with open("backend/src/api.py", "w") as f:
    f.write(content)
