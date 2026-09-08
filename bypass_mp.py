with open("backend/src/api.py", "r") as f:
    content = f.read()

content = content.replace("pipeline = PerceptionPipeline()", """try:
    pipeline = PerceptionPipeline()
except Exception as e:
    print(f"Warning: PerceptionPipeline disabled ({e})")
    pipeline = None""")

with open("backend/src/api.py", "w") as f:
    f.write(content)
