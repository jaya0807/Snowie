export default function BackgroundScene() {
  return (
    <div className="absolute inset-0 bg-gradient-to-b from-sky-300 via-sky-100 to-[#78c05c] z-0 overflow-hidden">
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
    </div>
  );
}
