with open("frontend/src/app/child/page.tsx", "r") as f:
    content = f.read()

import_str = "import Activity1UI from \"@/activities/a1_natural_interaction/Activity1UI\";\n"
if "Activity1UI" not in content:
    content = content.replace("import { Play", import_str + "import { Play")

return_idx = content.find("  return (")
if return_idx != -1:
    new_return = """  if (activityId === "A1") {
    return <Activity1UI />;
  }

  return ("""
    content = content[:return_idx] + new_return + content[return_idx + 10:]

with open("frontend/src/app/child/page.tsx", "w") as f:
    f.write(content)
