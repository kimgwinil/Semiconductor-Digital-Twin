import React from 'react';

export function WaferVisualization({ params, result }: { params: any, result: any }) {
  const diameter = params?.diameter || 300;
  const visualScale = diameter / 300;
  const gridSizeX = Math.max(2, ((params?.dieWidth || 10) / diameter) * 100);
  const gridSizeY = Math.max(2, ((params?.dieHeight || 10) / diameter) * 100);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Chamber Lighting */}
      <div className="absolute top-0 w-full h-48 bg-gradient-to-b from-slate-900 to-transparent opacity-50"></div>
      
      <div className="relative z-10 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center">
        <h4 className="text-center text-slate-500 text-xs font-mono mb-10 tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800">
          Czochralski (CZ) Puller / Wafer View
        </h4>
        
        {/* The Wafer (Photorealistic CSS) */}
        <div className="relative flex items-center justify-center" style={{ perspective: '1000px' }}>
          {/* Crucible / Base Glow (Active when running) */}
          <div className="absolute inset-0 rounded-full bg-orange-600/10 blur-3xl scale-150 pointer-events-none"></div>

          <div 
            className="rounded-full relative overflow-hidden flex items-center justify-center transition-all duration-700 shadow-[inset_-3px_-3px_15px_rgba(0,0,0,0.9),inset_3px_3px_15px_rgba(255,255,255,0.15),0_20px_40px_rgba(0,0,0,0.8)]"
            style={{ 
              width: `${250 * visualScale}px`, 
              height: `${250 * visualScale}px`,
              background: 'radial-gradient(circle at 30% 30%, #94a3b8 0%, #475569 20%, #1e293b 60%, #0f172a 100%)',
              transform: 'rotateX(15deg)'
            }}
          >
            {/* Silicon reflection highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 rotate-45 pointer-events-none"></div>

            {/* Grid (Dies) */}
            <div 
              className="absolute inset-0 opacity-40 mix-blend-overlay"
              style={{
                 backgroundImage: `linear-gradient(rgba(0,0,0,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.9) 1px, transparent 1px)`,
                 backgroundSize: `${gridSizeX}% ${gridSizeY}%`
              }}
            ></div>
            
            {/* Wafer Flat */}
            <div className="absolute bottom-0 w-16 h-3 bg-[#0a0a0a] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]"></div>
          </div>
        </div>
        
        <div className="mt-12 flex items-center justify-between w-full px-6 py-4 bg-black/60 rounded-xl border border-slate-800 shadow-inner">
           <span className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-slate-500"></div>
             <span className="text-xs text-slate-400 font-mono tracking-widest">Ø {diameter}mm</span>
           </span>
           {result && (
             <span className="text-xs font-mono text-cyan-400 tracking-widest">
               DIES: <strong className="text-cyan-300 text-base">{result.grossDies}</strong>
             </span>
           )}
        </div>
      </div>
    </div>
  );
}
