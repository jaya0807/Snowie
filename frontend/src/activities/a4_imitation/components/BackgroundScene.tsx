/* eslint-disable */

export default function BackgroundScene() {
  return (
    <>
      {/* Studio Background Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-30 flex items-start justify-around pt-10">
         <div className="w-1 bg-zinc-700 h-64 relative shadow-2xl">
           <div className="absolute bottom-0 -left-6 w-12 h-8 bg-zinc-800 rounded-t-xl"></div>
           <div className="absolute bottom-4 -left-12 w-24 h-24 bg-yellow-100 rounded-full blur-[50px] opacity-80 animate-pulse"></div>
         </div>
         <div className="w-1 bg-zinc-700 h-48 relative shadow-2xl">
           <div className="absolute bottom-0 -left-6 w-12 h-8 bg-zinc-800 rounded-t-xl"></div>
           <div className="absolute bottom-4 -left-12 w-24 h-24 bg-yellow-100 rounded-full blur-[50px] opacity-80 animate-pulse delay-1s"></div>
         </div>
      </div>

    </>
  );
}
