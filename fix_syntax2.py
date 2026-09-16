import re

with open("frontend/src/app/(dashboard)/calibration/page.tsx", "r") as f:
    content = f.read()

# I will find the exact broken block and replace it
broken = "{!isLoaded && !cameraError && (\n\n              {cameraError && ("

fixed = \"\"\"{!isLoaded && !cameraError && (
                <div className="absolute inset-0 flex items-center justify-center text-white/50 z-20">
                  Loading AI Models...
                </div>
              )}
              {cameraError && (\"\"\"

content = content.replace(broken, fixed)

with open("frontend/src/app/(dashboard)/calibration/page.tsx", "w") as f:
    f.write(content)
