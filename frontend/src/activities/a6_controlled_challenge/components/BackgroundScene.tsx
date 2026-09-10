
export default function BackgroundScene() {
  return (
    <>
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[20%] animate-[bounce_8s_ease-in-out_infinite]">
          <img src="/assets/space/star.png" alt="Star" className="w-16 h-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
        <div className="absolute bottom-[20%] right-[15%] animate-[bounce_10s_ease-in-out_infinite_reverse]">
          <img src="/assets/space/star.png" alt="Star" className="w-24 h-24 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        </div>
        <div className="absolute top-[50%] left-[5%] opacity-20">
          <img src="/assets/space/galaxy.png" alt="Galaxy" className="w-[800px] -rotate-12 animate-[spin_120s_linear_infinite]" />
        </div>
      </div>

    </>
  );
}
