import { GiCastle, GiRingedPlanet, GiRocketFlight, GiFlowerPot, GiStarsStack, GiAirBalloon, GiSpikyField, GiPineTree, GiMoon } from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

export default function BackgroundScene() {
  return (
    <>
      {/* Background Layer: Deep blue magical sky, moon, stars, clouds */}
      <div className="absolute inset-0 z-0 opacity-80">
        <div className="absolute top-10 right-20 opacity-90 animate-pulse"><GiMoon className="text-yellow-100 text-[180px] drop-shadow-[0_0_40px_rgba(255,255,200,0.4)]" /></div>
        <div className="absolute top-20 left-1/4 opacity-40"><GiStarsStack className="text-white text-6xl" /></div>
        <div className="absolute top-40 right-1/3 opacity-60"><GiStarsStack className="text-white text-4xl" /></div>
        <div className="absolute top-32 left-10 opacity-70"><FaCloud className="text-indigo-200/20 text-[200px]" /></div>
        <div className="absolute top-10 right-1/4 opacity-50"><FaCloud className="text-purple-200/20 text-[150px]" /></div>
        <div className="absolute bottom-1/2 left-1/4 opacity-30 animate-bounce" style={{animationDuration: '10s'}}><GiRingedPlanet className="text-indigo-400 text-[120px]" /></div>
      </div>

      {/* Middle Layer: Hills, castle, rocket */}
      <div className="absolute bottom-[5%] w-full h-1/2 z-10 pointer-events-none">
        <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-indigo-900 to-transparent opacity-50"></div>
        {/* Simple SVG hills */}
        <svg className="absolute bottom-0 w-full h-48 drop-shadow-xl opacity-90" preserveAspectRatio="none" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#2E1065" fillOpacity="1" d="M0,288L48,272C96,256,192,224,288,218.7C384,213,480,235,576,218.7C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          <path fill="#4B2A75" fillOpacity="1" d="M0,256L60,240C120,224,240,192,360,197.3C480,203,600,245,720,245.3C840,245,960,203,1080,186.7C1200,171,1320,181,1380,186.7L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
        </svg>
        
        <div className="absolute bottom-[20%] right-[10%] opacity-80"><GiCastle className="text-indigo-900 text-[200px]" /></div>
        <div className="absolute bottom-[10%] left-[5%] opacity-70"><GiPineTree className="text-purple-900 text-[150px]" /></div>
        <div className="absolute bottom-[15%] left-[15%] opacity-60"><GiPineTree className="text-purple-800 text-[100px]" /></div>
        <div className="absolute top-[10%] left-[40%] animate-pulse" style={{animationDuration: '6s'}}><GiRocketFlight className="text-pink-300/40 text-[80px]" /></div>
        <div className="absolute top-0 right-[30%] animate-bounce" style={{animationDuration: '8s'}}><GiAirBalloon className="text-orange-300/30 text-[100px]" /></div>
      </div>

      {/* Foreground Layer */}
      <div className="absolute bottom-0 w-full h-[20vh] z-20 pointer-events-none">
        <div className="absolute bottom-4 left-1/4"><GiSpikyField className="text-purple-600 text-[80px]" /></div>
        <div className="absolute bottom-8 right-1/4"><GiFlowerPot className="text-pink-800 text-[100px]" /></div>
      </div>

    </>
  );
}
