with open("frontend/src/components/layout/Header.tsx", "r") as f:
    content = f.read()

import re
content = re.sub(r'\s*<button onClick=\{.*?router\.push\("/child"\).*?Enter Child Mode\n\s*</button>', '', content, flags=re.DOTALL)

with open("frontend/src/components/layout/Header.tsx", "w") as f:
    f.write(content)
