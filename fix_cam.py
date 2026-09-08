with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

# Fix the JSX
old_jsx = """      <div className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500">
        {!cameraActive ? (
          <Camera className="w-8 h-8 text-zinc-400 animate-pulse" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover transform -scale-x-100" // Mirror effect
          />
        )}
      </div>"""

new_jsx = """      <div className="absolute top-6 right-6 z-50 overflow-hidden w-32 h-32 md:w-48 md:h-48 rounded-full border-4 border-white shadow-[0_10px_30px_rgba(0,0,0,0.3)] bg-zinc-200 flex items-center justify-center transition-all duration-500 relative">
        {!cameraActive && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-zinc-200">
            <Camera className="w-8 h-8 text-zinc-400 animate-pulse" />
          </div>
        )}
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="w-full h-full object-cover transform -scale-x-100 absolute inset-0 z-0" 
        />
      </div>"""

content = content.replace(old_jsx, new_jsx)

# Fix the initialization to not rely on checking videoRef immediately if we want
# Actually, since it's always rendered now, videoRef.current will NOT be null.

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
