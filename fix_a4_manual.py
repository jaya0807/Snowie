import os

with open("frontend/src/activities/a4_imitation/Activity4UI.tsx", "r") as f:
    lines = f.readlines()
    
# Extract lines 192 to 233
movie_stage_jsx = "".join(lines[192:234])

with open("frontend/src/activities/a4_imitation/components/MovieStage.tsx", "w") as f:
    f.write('import React from "react";\n\n')
    f.write('export default function MovieStage(props: any) {\n')
    f.write('  const { sessionState, currentLevel, emmaPos, propPos } = props;\n')
    f.write('  return (\n')
    f.write(movie_stage_jsx)
    f.write('  );\n}\n')
    
# Replace in original
lines[192:234] = ["            <MovieStage sessionState={sessionState} currentLevel={currentLevel} emmaPos={emmaPos} propPos={propPos} />\n"]

content = "".join(lines)
content = content.replace('"use client";\n', '"use client";\nimport MovieStage from "./components/MovieStage";\n')

with open("frontend/src/activities/a4_imitation/Activity4UI.tsx", "w") as f:
    f.write(content)

