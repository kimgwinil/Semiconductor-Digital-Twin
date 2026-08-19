import React from 'react';

interface WaferVisualizationProps {
  status: 'idle' | 'running' | 'completed';
  progress: number;
  params: any;
  result: any;
}

export function WaferVisualization({ status, progress, params, result }: WaferVisualizationProps) {
  const visualCD = result ? (result.actualCD / 100) * 128 : 64; 
  
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Yellow Room Ambient Light */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.08)_0%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] h-[440px]">
        <h4 className="absolute top-6 left-1/2 -translate-x-1/2 text-center text-slate-500 text-xs font-mono tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800 whitespace-nowrap z-30">
          Stepper Optics & Exposure Stage
        </h4>

        <div className="relative flex flex-col items-center justify-end h-full pb-8 pt-10">
          
          {/* Complex Lens System */}
          <div className={`absolute top-12 transition-transform duration-1000 flex flex-col items-center z-20 ${status === 'running' ? 'translate-y-4' : '-translate-y-10'}`}>
            {/* Upper Lens Housing */}
            <div className="w-32 h-6 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-800 rounded-t-lg border-b-2 border-gray-900 shadow-[0_5px_15px_rgba(0,0,0,0.8)]"></div>
            {/* Reticle / Mask */}
            <div className="w-44 h-3 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-700 shadow-[0_0_15px_rgba(234,179,8,0.4)] flex justify-center border-y border-yellow-900/50">
               <div className="w-20 h-full bg-[#050505]"></div> {/* Mask Opening */}
            </div>
            {/* Lower Projection Lens */}
            <div className="w-28 h-12 bg-gradient-to-b from-gray-800 to-gray-950 rounded-b-[2rem] border-2 border-gray-700 relative overflow-hidden flex justify-center shadow-[0_10px_20px_rgba(0,0,0,0.9)]">
              {/* Glass Lens reflection */}
              <div className="absolute bottom-0 w-20 h-6 bg-gradient-to-r from-blue-900/30 via-cyan-400/60 to-blue-900/30 blur-[2px] rounded-full opacity-80"></div>
              <div className="absolute bottom-1 w-16 h-2 bg-white/20 rounded-full blur-[1px]"></div>
            </div>

            {/* Laser Light Beam (EUV / ArF etc) */}
            <div 
              className="w-28 h-40 origin-top opacity-0 transition-opacity duration-300 mix-blend-screen"
              style={{
                background: 'linear-gradient(to bottom, rgba(217,70,239,0.8) 0%, rgba(217,70,239,0.05) 100%)',
                clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                opacity: (status === 'running' && progress > 15 && progress < 85) ? 1 : 0,
                filter: 'blur(2px)',
                boxShadow: '0 0 40px rgba(217,70,239,0.6)'
              }}
            ></div>
          </div>

          {/* Wafer Stage & Substrate */}
          <div className="relative flex flex-col items-center w-full px-8 z-10">
            
            {/* PR Layer (Glossy Red/Magenta) */}
            <div className="relative w-full h-12 flex justify-center items-end bg-transparent z-20 drop-shadow-[0_10px_15px_rgba(0,0,0,0.9)]">
               {/* Left PR */}
               <div 
                 className="h-full flex-1 rounded-tl-sm border-t-2 border-l-2 border-rose-400/80 transition-all duration-300"
                 style={{ background: 'linear-gradient(180deg, #be123c 0%, #881337 100%)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.2)' }}
               ></div>
               
               {/* Exposed Region */}
               <div 
                 className="h-full flex items-center justify-center relative transition-all duration-700"
                 style={{ 
                   width: `${visualCD}px`,
                   background: result?.isFailed ? 'linear-gradient(180deg, #be123c 0%, #881337 100%)' : (status === 'completed' ? 'transparent' : 'linear-gradient(180deg, #fb7185 0%, #e11d48 100%)'),
                   opacity: (status === 'completed' && !result?.isFailed) ? 0 : 1,
                   borderTop: (status === 'completed' && !result?.isFailed) ? 'none' : '2px solid rgba(253,164,175,0.8)',
                   boxShadow: (status === 'running' && progress > 50) ? 'inset 0 0 20px rgba(255,255,255,0.5)' : 'none'
                 }}
               >
                  {status === 'completed' && !result?.isFailed && (
                     <span className="absolute -top-10 text-xs font-mono text-fuchsia-300 bg-[#0a0a0a] border border-fuchsia-900/50 px-3 py-1 rounded shadow-[0_0_20px_rgba(217,70,239,0.3)] whitespace-nowrap">
                       CD: {result.actualCD.toFixed(1)}nm
                     </span>
                  )}
               </div>
               
               {/* Right PR */}
               <div 
                 className="h-full flex-1 rounded-tr-sm border-t-2 border-r-2 border-rose-400/80 transition-all duration-300"
                 style={{ background: 'linear-gradient(180deg, #be123c 0%, #881337 100%)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.2)' }}
               ></div>
            </div>
            
            {/* Silicon / Oxide Substrate */}
            <div 
              className="w-full h-20 relative z-10 flex items-center justify-center rounded-b-xl"
              style={{
                background: 'linear-gradient(180deg, #0f766e 0%, #134e4a 30%, #042f2e 100%)',
                borderTop: '2px solid #2dd4bf',
                boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.5)'
              }}
            >
              {/* Grain/texture */}
              <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay"></div>
              <span className="text-teal-400/70 text-xs font-mono tracking-widest font-bold z-10">SiO₂ / Si BULK</span>
            </div>
          </div>

          {status === 'completed' && result?.isFailed && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 text-rose-400 font-bold tracking-widest text-xl border-4 border-rose-600/80 bg-[#0a0a0a]/90 px-6 py-3 rounded-xl backdrop-blur-md shadow-[0_0_40px_rgba(225,29,72,0.5)] z-40 whitespace-nowrap">
              RESOLUTION FAILED
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
