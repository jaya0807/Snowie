with open("backend/src/api.py", "r") as f:
    content = f.read()

path_fix = """import sys
import os
sys.path.append(os.path.dirname(__file__))

"""

if "sys.path.append" not in content:
    content = path_fix + content
    
    # Revert my bad database fix
    content = content.replace("from src.database.database import Database", "from database.database import Database")
    
with open("backend/src/api.py", "w") as f:
    f.write(content)
