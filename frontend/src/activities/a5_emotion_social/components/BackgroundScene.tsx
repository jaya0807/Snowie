/* eslint-disable */

export default function BackgroundScene() {
  return (
    <>
      {/* 1. Sky & Distant Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-300 via-sky-200 to-green-300">
        <div className="absolute top-10 right-20 animate-[spin_60s_linear_infinite]">
          <img src="/assets/storyworld/sun.png" alt="Sun" className="w-48 h-48 drop-shadow-xl" />
        </div>
        
        {/* Clouds */}
        <div className="absolute top-16 left-10 animate-[bounce_8s_ease-in-out_infinite]">
          <img src="/assets/storyworld/cloud.png" alt="Cloud" className="w-64 h-64 opacity-80" />
        </div>
        <div className="absolute top-8 right-1/3 animate-[bounce_10s_ease-in-out_infinite_reverse]">
          <img src="/assets/storyworld/cloud.png" alt="Cloud" className="w-48 h-48 opacity-70" />
        </div>
        
        {/* Rainbow */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <img src="/assets/storyworld/rainbow.png" alt="Rainbow" className="w-[800px] opacity-40 mix-blend-multiply" />
        </div>
      </div>

      {/* 2. Midground Landscape */}
      <div className="absolute bottom-0 w-full h-1/2 z-10 pointer-events-none">
        <svg className="absolute bottom-0 w-full h-full drop-shadow-2xl" preserveAspectRatio="none" viewBox="0 0 1440 320" xmlns="http://www.w3.org/2000/svg">
          <path fill="#86efac" fillOpacity="1" d="M0,192L60,186.7C120,181,240,171,360,176C480,181,600,203,720,208C840,213,960,203,1080,181.3C1200,160,1320,128,1380,112L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          <path fill="#4ade80" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
        </svg>
        
        <img src="/assets/storyworld/house.png" alt="House" className="absolute bottom-[40%] right-[10%] w-64 h-64 drop-shadow-xl" />
        <img src="/assets/storyworld/tree1.png" alt="Tree" className="absolute bottom-[35%] left-[5%] w-80 h-80 drop-shadow-2xl" />
        <img src="/assets/storyworld/tree2.png" alt="Tree" className="absolute bottom-[45%] left-[25%] w-64 h-64 opacity-90 drop-shadow-xl" />
      </div>

      {/* 3. Foreground Decorations */}
      <div className="absolute bottom-0 w-full h-1/4 z-20 pointer-events-none">
        <img src="/assets/storyworld/flower.png" alt="Flower" className="absolute bottom-10 right-[25%] w-24 h-24 drop-shadow-md animate-[bounce_4s_ease-in-out_infinite]" />
        <img src="/assets/storyworld/flower.png" alt="Flower" className="absolute bottom-5 left-[15%] w-20 h-20 drop-shadow-md animate-[bounce_5s_ease-in-out_infinite]" />
        <img src="/assets/storyworld/butterfly.png" alt="Butterfly" className="absolute bottom-32 left-[30%] w-16 h-16 animate-[bounce_2s_linear_infinite]" />
      </div>

    </>
  );
}
