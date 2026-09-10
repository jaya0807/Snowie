with open("frontend/src/app/(dashboard)/activities/page.tsx", "r") as f:
    content = f.read()

content = content.replace("Select an activity to launch in Child Mode.", "Select an activity to launch.")
content = content.replace("handleStartChildMode", "launchActivity")

with open("frontend/src/app/(dashboard)/activities/page.tsx", "w") as f:
    f.write(content)
