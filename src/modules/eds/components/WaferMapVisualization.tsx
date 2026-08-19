import React from 'react';

export function WaferMapVisualization({ status, result }: { status: string; result: any }) {
  const totalCells = 120;
  const goodCells = result ? Math.floor(totalCells * (result.yieldPercent / 100)) : 0;
  
  const cells = Array.from({ length: totalCells }).map((_, i) => ({
    id: i,
    isGood: i < goodCells
  })).sort(() => Math.random() - 0.5); 

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#050505] overflow-hidden">
      {/* Prober Environment */}
      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(20,184,166,0.05)_0%,transparent_80%)] pointer-events-none"></div>

      <div className="relative z-10 w-[90%] max-w-lg bg-[#0d0d0d] border border-slate-800/80 rounded-2xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col items-center">
        <h4 className="text-center text-slate-500 text-xs font-mono mb-10 tracking-widest uppercase bg-black/40 px-4 py-1 rounded-full border border-slate-800">
          Prober Station & Wafer Map
        </h4>

        {!result || status !== 'completed' ? (
           <div className="w-72 h-72 rounded-full relative flex flex-col items-center justify-center shadow-[inset_0_0_60px_rgba(0,0,0,1),0_15px_40px_rgba(0,0,0,0.8)]"
                style={{ background: 'radial-gradient(circle at 30% 30%, #334155 0%, #0f172a 70%, #000 100%)', border: '2px solid #475569' }}>
             {/* Silicon highlight */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rounded-full transform -rotate-45 pointer-events-none"></div>

             {status === 'running' ? (
               <div className="flex flex-col items-center gap-6 z-10">
                 {/* Scanning Probe Effect */}
                 <div className="w-[120%] h-1 bg-teal-400 absolute top-1/2 -left-[10%] animate-[ping_1.5s_ease-in-out_infinite] shadow-[0_0_20px_#2dd4bf] mix-blend-screen"></div>
                 <div className="w-[120%] h-[2px] bg-white absolute top-1/2 -left-[10%] animate-[pulse_1.5s_ease-in-out_infinite] opacity-50 mix-blend-screen"></div>
                 <span className="text-teal-400 font-mono text-sm tracking-widest bg-black/80 px-4 py-2 rounded-lg border border-teal-900/50 backdrop-blur-sm shadow-[0_0_15px_rgba(20,184,166,0.3)]">TESTING PINS ACTIVE</span>
               </div>
             ) : (
               <span className="text-slate-500 font-mono tracking-widest z-10 bg-black/50 px-4 py-2 rounded-lg border border-slate-800">MOUNT WAFER</span>
             )}
             <div className="absolute bottom-0 w-16 h-3 bg-[#050505] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]"></div>
           </div>
        ) : (
          <>
            <div className="w-72 h-72 rounded-full relative overflow-hidden flex flex-col items-center justify-center p-6 shadow-[inset_0_0_50px_rgba(0,0,0,0.9),0_0_40px_rgba(20,184,166,0.15)] transition-all duration-1000"
                 style={{ background: 'radial-gradient(circle at 30% 30%, #1e293b 0%, #020617 80%)', border: '2px solid #334155' }}>
              
              {/* Glassy reflection */}
              <div className="absolute inset-0 bg-gradient-to-bl from-white/10 to-transparent pointer-events-none z-30 mix-blend-overlay"></div>
              
              {/* Grid of Dies */}
              <div className="grid grid-cols-12 gap-[2px] relative z-20">
                {cells.map((c, i) => (
                  <div 
                    key={c.id} 
                    className="w-[14px] h-[14px] rounded-[1px] transition-all duration-500"
                    style={{
                      background: c.isGood ? 'linear-gradient(135deg, #2dd4bf, #0f766e)' : 'linear-gradient(135deg, #f43f5e, #be123c)',
                      boxShadow: c.isGood ? '0 0 8px rgba(45,212,191,0.6)' : 'inset 0 2px 4px rgba(0,0,0,0.6)',
                      animationDelay: `${i * 0.005}s`,
                      animation: 'fadeIn 0.5s ease-out forwards',
                      opacity: 0
                    }}
                  ></div>
                ))}
              </div>
              {/* Flat */}
              <div className="absolute bottom-0 w-16 h-3 bg-[#050505] shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)] z-30"></div>
            </div>
            
            <div className="mt-10 flex gap-10 text-xs font-mono bg-black/60 px-8 py-4 rounded-xl border border-slate-800 shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-[3px]" style={{ background: 'linear-gradient(135deg, #2dd4bf, #0f766e)', boxShadow: '0 0 10px rgba(45,212,191,0.6)' }}></div> 
                <span className="text-teal-300 font-bold tracking-widest text-sm">{result.yieldPercent.toFixed(1)}% PASS</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-[3px]" style={{ background: 'linear-gradient(135deg, #f43f5e, #be123c)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)' }}></div> 
                <span className="text-rose-400 tracking-widest font-bold text-sm">FAIL</span>
              </div>
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.8); }
                to { opacity: 1; transform: scale(1); }
              }
            `}} />
          </>
        )}
      </div>
    </div>
  );
}
