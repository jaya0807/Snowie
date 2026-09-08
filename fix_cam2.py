with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

# Fix the class name conflict (remove ' relative' from the end)
content = content.replace(
    'className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500 relative"',
    'className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500"'
)

# Add camera error state
content = content.replace("const [cameraActive, setCameraActive] = useState(false);", "const [cameraActive, setCameraActive] = useState(false);\n  const [camError, setCamError] = useState('');")

# Update catch block
content = content.replace(
    '} catch(e) { console.error("Camera access denied", e); }',
    '} catch(e: any) { console.error("Camera access denied", e); setCamError(e.message || "Denied"); }'
)

# Update the camera placeholder to show error if any
old_placeholder = """        {!cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-200">
            <Camera className="w-8 h-8 text-zinc-400 animate-pulse" />
          </div>
        )}"""

new_placeholder = """        {!cameraActive && (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-zinc-200 text-center p-2">
            <Camera className={`w-8 h-8 ${camError ? 'text-red-400' : 'text-zinc-400 animate-pulse'}`} />
            {camError && <span className="text-[10px] text-red-500 font-bold leading-tight mt-1 truncate w-full">{camError}</span>}
          </div>
        )}"""
        
content = content.replace(old_placeholder, new_placeholder)

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
