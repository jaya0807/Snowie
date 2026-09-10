with open("frontend/src/activities/a4_imitation/components/MovieStage.tsx", "r") as f:
    content = f.read()

content = content.replace('  return (\n', '  return (\n    <>\n')
content = content.replace('  );\n}\n', '    </>\n  );\n}\n')

with open("frontend/src/activities/a4_imitation/components/MovieStage.tsx", "w") as f:
    f.write(content)
