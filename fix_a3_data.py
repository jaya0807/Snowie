with open("frontend/src/activities/a3_target_finding/components/data.ts", "r") as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip() in ["window.speechSynthesis.speak(utterance);", "}", "};"]:
        continue
    new_lines.append(line)

new_content = "".join(new_lines)

speak_func = """
const speak = (text: string) => {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
};
"""

new_content = new_content.replace("type TreasureObject", speak_func + "\ntype TreasureObject")
new_content = new_content.replace("export { TASKS };", "export { TASKS, speak };")

with open("frontend/src/activities/a3_target_finding/components/data.ts", "w") as f:
    f.write(new_content)

# Also fix the import in Activity3UI.tsx
with open("frontend/src/activities/a3_target_finding/Activity3UI.tsx", "r") as f:
    ui_content = f.read()

ui_content = ui_content.replace('import { TASKS } from "./components/data";', 'import { TASKS, speak } from "./components/data";')

with open("frontend/src/activities/a3_target_finding/Activity3UI.tsx", "w") as f:
    f.write(ui_content)

