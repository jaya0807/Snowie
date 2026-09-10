import os, re

def extract_for_activity(activity_num, folder_name):
    dir_path = f"frontend/src/activities/{folder_name}"
    ui_file = f"{dir_path}/Activity{activity_num}UI.tsx"
    
    with open(ui_file, "r") as f:
        content = f.read()
        
    os.makedirs(f"{dir_path}/components", exist_ok=True)
    
    # Extract imports
    imports_match = re.search(r'(import .*?;.*?)(?=\n\n|//)', content, re.DOTALL)
    imports_text = imports_match.group(1) if imports_match else ""
    
    # Extract speak
    speak_match = re.search(r'(// Speak utility.*?\n\};\n)', content, re.DOTALL)
    speak_text = speak_match.group(1) if speak_match else ""
    if speak_text:
        content = content.replace(speak_text, "")
        
    # Extract TASKS/LEVELS
    tasks_match = re.search(r'(type TreasureObject = \{.*?\n\};\n\n// Task Bank Pool\nconst TASKS = \[.*?\];\n)', content, re.DOTALL)
    if not tasks_match:
        tasks_match = re.search(r'(const TASKS = \[.*?\];\n)', content, re.DOTALL)
        
    levels_match = re.search(r'(const LEVELS = \[.*?\];\n)', content, re.DOTALL)
    
    data_text = tasks_match.group(1) if tasks_match else (levels_match.group(1) if levels_match else "")
    if data_text:
        content = content.replace(data_text, "")
        
    if not data_text and not speak_text: return
        
    # Write data.ts
    with open(f"{dir_path}/components/data.ts", "w") as f:
        f.write(imports_text + "\n\n" + speak_text + "\n\n" + data_text + "\n\n")
        exports = []
        if speak_text: exports.append("speak")
        if tasks_match: exports.append("TASKS")
        if levels_match: exports.append("LEVELS")
        f.write(f"export {{ {', '.join(exports)} }};\n")
        
    # Update main file imports
    imp = f'import {{ {", ".join(exports)} }} from "./components/data";\n'
    content = content.replace('"use client";\n', '"use client";\n' + imp)
    
    with open(ui_file, "w") as f:
        f.write(content)
        
extract_for_activity(3, "a3_target_finding")
