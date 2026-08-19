import React from 'react';

interface WaferVisualizationProps {
  status: 'idle' | 'running' | 'completed';
  progress: number;
  params: any;
  result: any;
}

export function WaferVisualization({ status, progress, params, result }: WaferVisualizationProps) {
  const thickness = result?.oxideThickness || 0;
  const visualThickness = thickness * 0.1;
  const currentVisualThickness = status === 'completed' ? visualThickness : (visualThickness * (progress / 100));

  const isDry = !params?.isWet;

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Chamber Lighting */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,#1f1000_0%,#000000_100%)] opacity-80 pointer-events-none"></div>

      <div className="relative z-10 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <h4 className="text-center text-slate-500 text-xs font-mono mb-8 tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800 w-max mx-auto">
          Furnace Chamber Cross-Section
        </h4>
        
        {/* Furnace Interior Glow */}
        <div className={`absolute top-0 left-0 right-0 h-48 transition-opacity duration-1000 rounded-t-2xl pointer-events-none ${status === 'running' ? 'opacity-100' : 'opacity-0'}`}
             style={{ background: isDry ? 'linear-gradient(to bottom, rgba(239,68,68,0.15), transparent)' : 'linear-gradient(to bottom, rgba(249,115,22,0.2), transparent)' }}>
           {/* Plasma / Gas Flow effect */}
           <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] animate-[pulse_2s_ease-in-out_infinite]"></div>
        </div>

        <div className="relative flex flex-col items-center px-6 pt-16 pb-8">
          
          {/* Oxide Layer (Glassy, transluscent) */}
          <div 
            className="w-full relative z-20 flex items-center justify-center transition-all duration-200 ease-linear shadow-[0_-5px_20px_rgba(6,182,212,0.4)] backdrop-blur-md rounded-t-sm"
            style={{ 
              height: `${Math.max(currentVisualThickness, 2)}px`,
              background: 'linear-gradient(180deg, rgba(103,232,249,0.75) 0%, rgba(6,182,212,0.5) 100%)',
              borderTop: '2px solid rgba(255,255,255,0.7)',
              borderLeft: '1px solid rgba(255,255,255,0.3)',
              borderRight: '1px solid rgba(255,255,255,0.3)',
              boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.5)'
            }}
          >
            {/* Surface Reflection */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full h-full skew-x-12 opacity-50 pointer-events-none"></div>

            {status === 'completed' && thickness > 0 && (
              <span className="absolute -right-24 text-xs font-mono text-cyan-300 bg-[#0a0a0a] px-3 py-1 border border-cyan-900 rounded-md shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {thickness.toFixed(1)}nm
              </span>
            )}
          </div>
          
          {/* Silicon Substrate (Metallic dark grey) */}
          <div 
            className="w-full h-24 relative z-10 flex items-center justify-center rounded-b-lg"
            style={{
              background: 'linear-gradient(180deg, #334155 0%, #0f172a 100%)',
              borderTop: '1px solid #475569',
              boxShadow: 'inset 0 5px 20px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.8)'
            }}
          >
            {/* Silicon Texture pattern */}
            <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay"></div>

            <span className="text-slate-400/80 text-xs font-mono tracking-widest font-bold z-10">Si SUBSTRATE</span>
            <span className="absolute -right-20 text-xs font-mono text-slate-600 font-bold">BULK</span>
          </div>
        </div>

        {/* Status Panel */}
        <div className="mt-6 bg-black/60 rounded-xl border border-slate-800 p-5 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-3">
            <div className="relative flex h-3 w-3">
              {status === 'running' && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${
                status === 'running' ? 'bg-orange-500 shadow-[0_0_12px_#f97316]' : 
                status === 'completed' ? 'bg-emerald-500 shadow-[0_0_12px_#10b981]' : 'bg-slate-600'
              }`}></span>
            </div>
            <span className="text-xs font-mono text-slate-300 tracking-widest">
              {status === 'running' ? 'FURNACE ACTIVE' : status === 'completed' ? 'PROCESS COMPLETE' : 'STANDBY'}
            </span>
          </div>
          
          {status === 'running' && (
            <div className="text-sm font-mono text-orange-400 font-bold tracking-widest">
              {progress.toFixed(0)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
