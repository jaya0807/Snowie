with open("frontend/src/activities/a4_imitation/Activity4UI.tsx", "r") as f:
    content = f.read()

content = content.replace(
    '  const [propPos, setPropPos] = useState("opacity-0");\n',
    '  const [propPos, setPropPos] = useState("opacity-0");\n  const fallbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);\n'
)

with open("frontend/src/activities/a4_imitation/Activity4UI.tsx", "w") as f:
    f.write(content)
