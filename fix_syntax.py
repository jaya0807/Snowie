import os

files = [
    "frontend/src/app/(dashboard)/grow/page.tsx",
    "frontend/src/app/(dashboard)/track/page.tsx",
    "frontend/src/app/(dashboard)/reports/page.tsx",
    "frontend/src/app/(dashboard)/sessions/page.tsx"
]

for file in files:
    with open(file, 'r') as f:
        lines = f.readlines()
        
    new_lines = []
    in_use_effect = False
    for line in lines:
        if "useEffect(() => {" in line:
            in_use_effect = True
            new_lines.append(line)
            continue
            
        if in_use_effect and "}, []);" in line:
            in_use_effect = False
            
            # For sessions/page.tsx, it needs the closing brace for the cleanup function
            if "sessions" in file:
                # Remove the weird semicolons added by sed
                while new_lines[-1].strip() == ";" or new_lines[-1].strip() == "":
                    new_lines.pop()
                new_lines.append("      };\n")
            
            new_lines.append(line)
            continue
            
        # Remove the weird closing braces added by sed for grow/track/reports
        if not ("sessions" in file) and in_use_effect and line.strip() == ";":
            continue
            
        new_lines.append(line)

    # Let's just fix it manually if it's too complex.
