import ast
import os

files_to_fix = [
    r"c:\Users\USER\OneDrive\Desktop\snowie\frontend\src\activities\a2_follow_instruction\Activity2UI.tsx",
    r"c:\Users\USER\OneDrive\Desktop\snowie\backend\src\activities\a2_follow_instruction\logic.py"
]

for file_path in files_to_fix:
    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        try:
            # If it's a string literal like "\"use client\";\n...", ast.literal_eval will parse it to a real string
            # Sometimes json.loads is needed if it's perfectly JSON encoded string
            import json
            if content.startswith('"') and content.endswith('"'):
                decoded = json.loads(content)
            else:
                decoded = ast.literal_eval(content)
            
            with open(file_path, "w", encoding="utf-8") as f:
                f.write(decoded)
            print(f"Fixed {file_path}")
        except Exception as e:
            print(f"Failed to fix {file_path}: {e}")
