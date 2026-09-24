/* eslint-disable */
import { GiGalleon, GiPalmTree, GiIsland } from "react-icons/gi";
import { FaCloud } from "react-icons/fa";

export default function BackgroundScene() {
  return (
    <>
      {/* Background Layer: Ocean and Clouds */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-gradient-to-b from-[#4facfe] to-[#00f2fe]">
        <div className="absolute top-10 left-10 opacity-70 animate-pulse"><FaCloud className="text-white text-[150px]" /></div>
        <div className="absolute top-20 right-1/4 opacity-50"><FaCloud className="text-white text-[200px]" /></div>
      </div>

      {/* Middle Layer: Pirate Ship and Island */}
      <div className="absolute bottom-[20%] w-full h-1/2 z-10 pointer-events-none">
        <div className="absolute bottom-[30%] right-[5%] animate-pulse duration-6s"><GiGalleon className="text-[#8B4513] text-[250px] drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]" /></div>
        <div className="absolute bottom-[-10%] left-[-5%]"><GiIsland className="text-[#DEB887] text-[400px]" /></div>
        <div className="absolute bottom-[20%] left-[10%]"><GiPalmTree className="text-[#228B22] text-[180px] drop-shadow-xl" /></div>
        <div className="absolute bottom-[10%] left-[25%]"><GiPalmTree className="text-[#228B22] text-[120px] drop-shadow-xl" /></div>
      </div>

      {/* Foreground Layer: Sandy Beach Floor */}
      <div className="absolute bottom-0 w-full h-[30vh] z-20 pointer-events-none bg-[#F4A460] rounded-t-[100px] border-t-8 border-[#CD853F]">
      </div>

    </>
  );
}
