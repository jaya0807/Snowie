with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

import re
# Remove the duplicate import lines
content = re.sub(r'import \{ useState, useEffect, useRef \} from "react";\nimport \{ useState, useEffect, useRef \} from "react";', 'import { useState, useEffect, useRef } from "react";', content)

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
