with open("frontend/src/app/child/page.tsx", "r") as f:
    content = f.read()

# Fix the broken useEffect
content = content.replace("""  useEffect(() => {
    if (activityId === "A1") {
    return <Activity1UI />;
  }

  return () => stopAll();
  }, []);""", """  useEffect(() => {
    return () => stopAll();
  }, []);""")

# Add the real return logic at the end before the main render
if "if (activityId === \"A1\")" not in content:
    render_idx = content.rfind("  return (")
    new_render = """  if (activityId === "A1") {
    return <Activity1UI />;
  }

  return ("""
    content = content[:render_idx] + new_render + content[render_idx + 10:]

with open("frontend/src/app/child/page.tsx", "w") as f:
    f.write(content)
