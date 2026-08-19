import React from 'react';

interface WaferVisualizationProps {
  status: 'idle' | 'running' | 'completed';
  progress: number;
  params: any;
  result: any;
}

export function WaferVisualization({ status, progress, params, result }: WaferVisualizationProps) {
  const maxEtchDepth = 80;
  const etchDepth = result?.etchDepth || 0;
  const currentEtchDepth = status === 'completed' ? etchDepth : (etchDepth * (progress / 100));
  
  const displayDepth = Math.min(currentEtchDepth, maxEtchDepth);
  const displayUndercut = result ? result.undercut : 0;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Deep Vacuum Chamber background */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(88,28,135,0.08)_0%,#000000_100%)] pointer-events-none"></div>

      <div className="relative z-20 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-700/60 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] h-[440px] flex flex-col items-center justify-end pb-12">
        <h4 className="absolute top-6 text-center text-slate-500 text-xs font-mono tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800">
          RIE Plasma Chamber View
        </h4>

        {/* Plasma Source & Coil */}
        <div className={`absolute top-20 flex flex-col items-center transition-opacity duration-700 z-0 ${status === 'running' ? 'opacity-100' : 'opacity-0'}`}>
          {/* RF Coil representation */}
          <div className="w-52 h-12 border-[6px] border-orange-500/20 rounded-[100%] absolute -top-6 animate-pulse shadow-[0_0_30px_rgba(249,115,22,0.2)]"></div>
          {/* Main Plasma Glow */}
          <div className="w-72 h-48 bg-[radial-gradient(ellipse_at_top,rgba(168,85,247,0.7)_0%,rgba(147,51,234,0.2)_50%,transparent_80%)] blur-lg mix-blend-screen animate-pulse"></div>
          {/* Accelerated Ions (Vertical lines) */}
          <div className="absolute top-12 w-40 h-32 flex justify-between px-6">
             {[...Array(7)].map((_, i) => (
               <div key={i} className="w-[2px] h-full bg-gradient-to-b from-purple-400/80 to-transparent opacity-60 animate-[ping_0.4s_ease-in-out_infinite]" style={{ animationDelay: `${i * 0.15}s` }}></div>
             ))}
          </div>
        </div>

        {/* Substrate Stack */}
        <div className="relative z-10 flex flex-col items-center w-full px-12">
          
          {/* PR Mask Layer (Resist) */}
          <div className="relative w-full h-12 flex justify-center items-end drop-shadow-[0_15px_15px_rgba(0,0,0,0.9)]">
             {/* Left PR */}
             <div className="h-full w-24 rounded-tl-md border-t-2 border-l-2 border-rose-400/80 absolute left-0 bottom-0"
                  style={{ background: 'linear-gradient(180deg, #9f1239 0%, #4c0519 100%)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.15)' }}></div>
             
             {/* Open Trench Area */}
             <div className="h-full w-20 relative z-20 flex flex-col justify-end items-center">
                {/* Plasma penetrating trench */}
                {status === 'running' && <div className="w-full h-48 bg-gradient-to-b from-purple-400/50 to-fuchsia-500/80 blur-[2px] animate-pulse mix-blend-screen absolute bottom-0"></div>}
             </div>

             {/* Right PR */}
             <div className="h-full w-24 rounded-tr-md border-t-2 border-r-2 border-rose-400/80 absolute right-0 bottom-0"
                  style={{ background: 'linear-gradient(180deg, #9f1239 0%, #4c0519 100%)', boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.15)' }}></div>
          </div>
          
          {/* Target Layer (Oxide/Poly) - This gets etched */}
          <div className="w-full h-28 relative overflow-hidden flex flex-col items-center"
               style={{
                 background: 'linear-gradient(180deg, #0e7490 0%, #164e63 100%)',
                 borderTop: '2px solid #22d3ee',
                 boxShadow: 'inset 0 10px 25px rgba(0,0,0,0.9)'
               }}>
             
             {/* Etched Void (The Trench) */}
             {displayDepth > 0 && (
               <div 
                 className="absolute top-0 z-10 transition-all duration-200 shadow-[inset_0_20px_30px_rgba(0,0,0,1)] rounded-b-md"
                 style={{ 
                   height: `${displayDepth}px`, 
                   width: `calc(5rem + ${displayUndercut * 2}px)`, // 5rem = 80px (trench width) + undercut
                   background: '#030303',
                   borderBottom: '2px solid rgba(255,255,255,0.15)',
                   borderLeft: '2px solid rgba(255,255,255,0.1)',
                   borderRight: '2px solid rgba(255,255,255,0.1)',
                 }}
               >
                 {status === 'completed' && (
                   <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-[#0a0a0a] border border-purple-900/60 px-3 py-1 rounded shadow-[0_0_20px_rgba(168,85,247,0.4)] z-20 whitespace-nowrap">
                     <span className="text-xs font-mono text-purple-300 font-bold tracking-widest">DEPTH: {result?.etchDepth.toFixed(1)}nm</span>
                   </div>
                 )}
               </div>
             )}
          </div>
          
          {/* Base Silicon Substrate */}
          <div className="w-full h-14 flex items-center justify-center relative z-10 rounded-b-xl"
               style={{
                 background: 'linear-gradient(180deg, #1e293b 0%, #020617 100%)',
                 borderTop: '2px solid #475569',
                 boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.9)'
               }}>
             <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay rounded-b-xl"></div>
             <span className="text-slate-500/80 text-xs font-mono tracking-widest font-bold z-10">Si SUBSTRATE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
