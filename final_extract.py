import os, re

slices = {
    2: ("a2_follow_instruction", 13, 60, "TASKS"),
    3: ("a3_target_finding", 21, 80, "TASKS"),
    4: ("a4_imitation", 7, 51, "LEVELS"),
    5: ("a5_emotion_social", 7, 87, "TASKS"),
    6: ("a6_controlled_challenge", 8, 40, "LEVELS")
}

for act_num, (folder, start, end, export_name) in slices.items():
    dir_path = f"frontend/src/activities/{folder}"
    ui_file = f"{dir_path}/Activity{act_num}UI.tsx"
    
    os.makedirs(f"{dir_path}/components", exist_ok=True)
    
    with open(ui_file, "r") as f:
        lines = f.readlines()
        
    data_lines = lines[start-1:end]
    data_text = "".join(data_lines)
    
    # Check if 'speak' is in the text
    has_speak = "const speak = " in data_text
    
    # Check for react-icons
    icons = re.findall(r'(Gi[a-zA-Z0-9_]+|Fa[a-zA-Z0-9_]+)', data_text)
    icons = list(set(icons))
    
    import_str = ""
    gi_icons = [i for i in icons if i.startswith("Gi")]
    fa_icons = [i for i in icons if i.startswith("Fa")]
    
    if gi_icons: import_str += f'import {{ {", ".join(gi_icons)} }} from "react-icons/gi";\n'
    if fa_icons: import_str += f'import {{ {", ".join(fa_icons)} }} from "react-icons/fa";\n'
    
    # Check for Lucide icons (RotateCcw, Play, etc)
    lucide_icons = re.findall(r'(RotateCcw|Play|CheckCircle2|X|ChevronRight|Star)', data_text)
    lucide_icons = list(set(lucide_icons))
    if lucide_icons: import_str += f'import {{ {", ".join(lucide_icons)} }} from "lucide-react";\n'
    
    with open(f"{dir_path}/components/data.ts", "w") as f:
        f.write(import_str + "\n" + data_text)
        exports = [export_name]
        if has_speak: exports.append("speak")
        f.write(f"\nexport {{ {', '.join(exports)} }};\n")
        
    # Replace in original file
    lines[start-1:end] = []
    content = "".join(lines)
    
    imp = f'import {{ {", ".join(exports)} }} from "./components/data";\n'
    content = content.replace('"use client";\n', '"use client";\n' + imp)
    
    with open(ui_file, "w") as f:
        f.write(content)

