with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "r") as f:
    content = f.read()

# Make buttons 3D tactile (game style)
content = content.replace(
    'className="bg-[#FF7A00] hover:bg-[#FF8C20] text-white font-black text-xl px-12 py-5 rounded-full shadow-[0_8px_30px_rgba(255,122,0,0.4)] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 active:scale-95 flex items-center gap-2"',
    'className="bg-[#FF7A00] hover:bg-[#FF8C20] text-white font-black text-2xl px-14 py-6 rounded-full shadow-[0_8px_0_#CC6200,0_15px_30px_rgba(255,122,0,0.5)] transition-all duration-300 transform hover:-translate-y-1 active:translate-y-2 active:shadow-[0_0px_0_#CC6200] flex items-center gap-3"'
)

# Character overlapping the card (Peeking effect)
# Find the character div
char_old = """        {/* Animated Character */}
        <div 
          key={step.char} 
          className="text-[120px] drop-shadow-2xl animate-bounce mb-[-20px] z-20 transition-all duration-500 transform scale-110"
          style={{ animationDuration: '2s' }}
        >
          {step.char}
        </div>"""

char_new = """        {/* Animated Character (Peeking from behind card) */}
        <div 
          key={step.char} 
          className="text-[140px] md:text-[180px] drop-shadow-[0_20px_30px_rgba(0,0,0,0.2)] animate-bounce mb-[-60px] md:mb-[-80px] z-10 transition-all duration-700 transform hover:scale-110 origin-bottom"
          style={{ animationDuration: '2.5s' }}
        >
          {step.char}
        </div>"""
        
content = content.replace(char_old, char_new)

# Card changes - add dialogue tail and make it super soft
card_old = """<div className="bg-white/95 backdrop-blur-xl w-full max-w-2xl rounded-[40px] shadow-2xl p-8 md:p-12 flex flex-col items-center text-center border-4 border-white/50 transition-all duration-500">"""
card_new = """<div className="relative bg-white/95 backdrop-blur-xl w-full max-w-3xl rounded-[50px] shadow-[0_20px_60px_rgba(0,0,0,0.1),inset_0_4px_0_rgba(255,255,255,1)] p-10 md:p-14 flex flex-col items-center text-center border-[8px] border-white/50 transition-all duration-500 z-20">"""
content = content.replace(card_old, card_new)

# Add floating stars to background
bg_old = """      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-400 z-0 flex flex-col justify-end">
        {/* Mocking the lush hills using basic CSS shapes for the MVP layout */}
        <div className="w-[150%] h-[40%] bg-green-500/80 rounded-[100%] absolute -bottom-[10%] -left-[25%] blur-[2px]"></div>
        <div className="w-[150%] h-[50%] bg-green-600 rounded-[100%] absolute -bottom-[20%] -right-[25%] blur-[1px]"></div>
        
        {/* The Sun */}
        <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(253,224,71,0.8)] flex items-center justify-center text-4xl">
          ☀️
        </div>
      </div>"""
      
bg_new = """      <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-[#78c05c] z-0 overflow-hidden">
        {/* Lush Hills */}
        <div className="w-[200%] h-[50%] bg-[#8cdb6c] rounded-[100%] absolute -bottom-[20%] -left-[50%] shadow-inner"></div>
        <div className="w-[150%] h-[60%] bg-[#72ba56] rounded-[100%] absolute -bottom-[30%] -right-[25%] shadow-[inset_0_20px_40px_rgba(255,255,255,0.2)]"></div>
        
        {/* The Sun */}
        <div className="absolute top-12 right-12 w-32 h-32 bg-yellow-300 rounded-full shadow-[0_0_80px_rgba(253,224,71,1),inset_0_0_20px_rgba(255,255,255,0.8)] flex items-center justify-center text-6xl animate-pulse" style={{ animationDuration: '4s' }}>
          ☀️
        </div>
        
        {/* Floating Clouds/Stars */}
        <div className="absolute top-[20%] left-[10%] text-white/60 text-6xl animate-pulse" style={{ animationDuration: '3s' }}>☁️</div>
        <div className="absolute top-[30%] right-[20%] text-white/50 text-5xl animate-bounce" style={{ animationDuration: '6s' }}>☁️</div>
        <div className="absolute top-[40%] left-[25%] text-yellow-300 text-3xl animate-pulse" style={{ animationDuration: '2s' }}>✨</div>
        <div className="absolute top-[20%] right-[40%] text-yellow-300 text-4xl animate-pulse" style={{ animationDuration: '2.5s' }}>⭐</div>
      </div>"""
content = content.replace(bg_old, bg_new)

# Improve Voice Input button
content = content.replace(
    "bg-brand/5 border-brand/20 text-brand hover:bg-brand/10",
    "bg-white border-b-4 border-brand text-brand hover:bg-brand/5 active:border-b-0 active:translate-y-1 shadow-sm"
)
content = content.replace(
    "bg-brand text-white shadow-lg shadow-brand/30 hover:scale-105 transform",
    "bg-brand border-b-4 border-brand-dark text-white hover:brightness-110 active:border-b-0 active:translate-y-1 shadow-lg shadow-brand/30"
)

with open("frontend/src/activities/a1_natural_interaction/Activity1UI.tsx", "w") as f:
    f.write(content)
