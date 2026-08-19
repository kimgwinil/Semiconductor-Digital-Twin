import React from 'react';

export function PackagingVisualization({ status, result }: { status: string; result: any }) {
  const ratio = result ? Math.min(1, Math.max(0, (result.junctionTemp - 25) / 100)) : 0; 
  const isOverheat = result ? !result.pass : false;
  
  const heatColor = isOverheat 
    ? 'rgba(225, 29, 72, 0.95)' // Rose 600
    : ratio > 0.6 
        ? 'rgba(245, 158, 11, 0.85)' // Amber
        : ratio > 0.3 
            ? 'rgba(16, 185, 129, 0.85)' // Emerald
            : 'rgba(59, 130, 246, 0.85)'; // Blue

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Packaging Lab Environment */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(circle_at_bottom,rgba(16,185,129,0.08)_0%,transparent_100%)] pointer-events-none"></div>

      <div className="relative z-10 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center">
        <h4 className="text-center text-slate-500 text-xs font-mono mb-10 tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800">
          Wire Bonding & Thermal Analysis
        </h4>

        {!result || status !== 'completed' ? (
          <div className="w-[320px] h-56 bg-[#0a0a0a] border-2 border-slate-800 rounded-2xl relative flex flex-col items-center justify-center shadow-[inset_0_10px_40px_rgba(0,0,0,0.9),0_10px_30px_rgba(0,0,0,0.5)]">
            {status === 'running' ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="w-12 h-12 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin shadow-[0_0_15px_rgba(245,158,11,0.2)]"></div>
                  <div className="absolute inset-0 blur-md bg-amber-500/20 rounded-full"></div>
                </div>
                <span className="text-amber-500 font-mono text-sm tracking-widest bg-amber-950/30 px-4 py-1 rounded-lg border border-amber-900/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]">ANALYZING THERMALS...</span>
              </div>
            ) : (
              <span className="text-slate-600 font-mono tracking-widest bg-black/50 px-4 py-2 rounded-lg border border-slate-800">AWAITING TEST</span>
            )}
          </div>
        ) : (
          <>
            {/* PCB Substrate (Realistic Green FR4) */}
            <div 
              className="w-[320px] h-56 rounded-2xl relative flex items-center justify-center shadow-[0_25px_50px_rgba(0,0,0,0.9),inset_0_2px_15px_rgba(255,255,255,0.15)]"
              style={{
                background: 'linear-gradient(135deg, #064e3b 0%, #022c22 100%)',
                border: '2px solid #065f46'
              }}
            >
              {/* PCB Traces / Pattern */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCI+CjxwYXRoIGQ9Ik0wIDEyaDI0TTEyIDB2MjQiIHN0cm9rZT0iI2ZhY2ExNSIgc3Ryb2tlLXdpZHRoPSIwLjUiIGZpbGw9Im5vbmUiLz4KPC9zdmc+')] rounded-2xl mix-blend-overlay"></div>
              
              {/* Additional Gold Pads on PCB */}
              <div className="absolute top-4 left-4 w-4 h-4 rounded-full border-2 border-yellow-600/50"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-yellow-600/50"></div>

              {/* IC Chip (Epoxy Package) */}
              <div 
                className="w-32 h-32 relative z-10 flex items-center justify-center rounded-lg shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
                style={{
                  background: 'linear-gradient(135deg, #1e293b 0%, #020617 100%)',
                  borderTop: '2px solid #475569',
                  borderLeft: '2px solid #334155',
                  borderRight: '2px solid #000',
                  borderBottom: '2px solid #000',
                }}
              >
                {/* Thermal Glow Overlay */}
                <div 
                  className="absolute inset-0 blur-2xl transition-all duration-1000 z-0 mix-blend-screen"
                  style={{ backgroundColor: heatColor, opacity: ratio + 0.4 }}
                ></div>
                {/* Core Heat Spot */}
                <div 
                  className="absolute w-16 h-16 blur-xl transition-all duration-1000 z-0 mix-blend-screen rounded-full"
                  style={{ backgroundColor: heatColor, opacity: ratio + 0.6 }}
                ></div>
                
                <div className="relative z-20 w-20 h-20 bg-gradient-to-br from-gray-800 to-black border border-gray-700/80 rounded flex items-center justify-center shadow-[inset_0_2px_5px_rgba(255,255,255,0.05)]">
                   <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyIiBoZWlnaHQ9IjIiPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] mix-blend-overlay"></div>
                   <span className="text-[10px] text-gray-400/80 font-bold tracking-widest bg-black/60 px-2 py-1 rounded shadow-inner z-10">IC_DIE</span>
                </div>
              </div>

              {/* Gold Wire Bonds (Left & Right) */}
              <div className="absolute left-10 top-0 bottom-0 flex flex-col justify-around z-20 py-8">
                {[...Array(7)].map((_, i) => (
                  <div key={`l-${i}`} className="w-16 h-[2px] rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.9)] relative"
                       style={{ background: 'linear-gradient(90deg, #fcd34d 0%, #d97706 50%, #78350f 100%)' }}>
                       {/* Wire highlight */}
                       <div className="absolute top-0 left-[20%] w-4 h-[1px] bg-white/60 rounded-full"></div>
                  </div>
                ))}
              </div>
              <div className="absolute right-10 top-0 bottom-0 flex flex-col justify-around z-20 py-8">
                {[...Array(7)].map((_, i) => (
                  <div key={`r-${i}`} className="w-16 h-[2px] rounded-full shadow-[0_3px_5px_rgba(0,0,0,0.9)] relative"
                       style={{ background: 'linear-gradient(90deg, #78350f 0%, #d97706 50%, #fcd34d 100%)' }}>
                       {/* Wire highlight */}
                       <div className="absolute top-0 right-[20%] w-4 h-[1px] bg-white/60 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Thermal Legend & Status */}
            <div className="mt-10 flex flex-col gap-4 items-center w-full">
              {isOverheat && (
                 <div className="text-rose-500 font-bold tracking-widest text-sm bg-rose-950/40 px-4 py-1 rounded-full border border-rose-900/50 shadow-[0_0_15px_rgba(225,29,72,0.3)] animate-pulse">
                   CRITICAL TEMPERATURE EXCEEDED
                 </div>
              )}
              <div className="flex gap-4 items-center text-xs font-mono bg-black/60 px-6 py-3 rounded-full border border-slate-800 w-full justify-center shadow-inner">
                <span className="text-slate-400 tracking-widest">Tj SCALE:</span>
                <div className="w-48 h-3 rounded-sm bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-rose-600 shadow-[inset_0_1px_3px_rgba(0,0,0,0.9)] border border-white/5"></div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
