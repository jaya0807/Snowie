with open("frontend/src/app/professional/layout.tsx", "r") as f:
    content = f.read()

if '"use client";' not in content:
    content = '"use client";\n' + content
    
with open("frontend/src/app/professional/layout.tsx", "w") as f:
    f.write(content)
