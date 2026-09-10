import os, re

activities = {
    2: ("a2_follow_instruction", r'(      \{/\* Background Layer:.*?      \{/\* Exit Button & Hidden Camera Elements \*/\})'),
    3: ("a3_target_finding", r'(      \{/\* Background Layer:.*?      \{/\* Exit Button \*/\})')
}

for act_num, (folder, bg_regex) in activities.items():
    dir_path = f"frontend/src/activities/{folder}"
    ui_file = f"{dir_path}/Activity{act_num}UI.tsx"
    
    with open(ui_file, "r") as f:
        content = f.read()
        
    bg_match = re.search(bg_regex, content, re.DOTALL)
    if not bg_match: continue
        
    bg_jsx = bg_match.group(1)
    if "Exit Button" in bg_jsx:
        bg_jsx = bg_jsx[:bg_jsx.rfind("      {/* Exit Button")]
        
    import_str = ""
    if "Image " in bg_jsx or "<Image" in bg_jsx:
        import_str += 'import Image from "next/image";\n'
        
    icons_used = re.findall(r'<(Gi[a-zA-Z0-9_]+|Fa[a-zA-Z0-9_]+)', bg_jsx)
    gi_icons = list(set([i for i in icons_used if i.startswith("Gi")]))
    fa_icons = list(set([i for i in icons_used if i.startswith("Fa")]))
    
    if gi_icons: import_str += f'import {{ {", ".join(gi_icons)} }} from "react-icons/gi";\n'
    if fa_icons: import_str += f'import {{ {", ".join(fa_icons)} }} from "react-icons/fa";\n'
    
    with open(f"{dir_path}/components/BackgroundScene.tsx", "w") as f:
        f.write(import_str + "\nexport default function BackgroundScene() {\n  return (\n    <>\n")
        f.write(bg_jsx)
        f.write("    </>\n  );\n}\n")
        
    content = content.replace(bg_jsx, "      <BackgroundScene />\n")
    
    imp = 'import BackgroundScene from "./components/BackgroundScene";\n'
    content = content.replace('"use client";', '"use client";\n' + imp)
    
    with open(ui_file, "w") as f:
        f.write(content)

