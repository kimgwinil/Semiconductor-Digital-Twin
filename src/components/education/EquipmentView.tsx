import React, { useState } from 'react';
import { Settings2, Plus, Info } from 'lucide-react';

interface EquipmentViewProps {
  data: {
    title: string;
    components: { name: string; desc: string }[];
  };
  imageUrl?: string;
}

export function EquipmentView({ data, imageUrl }: EquipmentViewProps) {
  const [activeComp, setActiveComp] = useState<number | null>(null);

  if (!data) return null;

  return (
    <div className="flex-1 flex flex-col w-full h-full overflow-hidden bg-slate-950 rounded-xl border border-slate-800 shadow-2xl relative">
      {/* Background Ambience */}
      {imageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-screen blur-xl scale-110 pointer-events-none"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-950/60 pointer-events-none"></div>
        </>
      )}

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col h-full overflow-y-auto p-4 md:p-8">
        <div className="max-w-6xl mx-auto w-full flex flex-col h-full">
          
          <header className="mb-6 md:mb-8 shrink-0">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-100 flex items-center gap-3">
              <Settings2 className="text-cyan-400" size={28} />
              {data.title}
            </h2>
            <p className="text-slate-400 mt-2 text-sm md:text-base">Equipment Structure & Components Analysis</p>
          </header>

          <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-0">
            {/* Left side: Visual representation / Pointers */}
            <div className="relative rounded-2xl border border-slate-700/50 overflow-hidden bg-slate-900/50 backdrop-blur-sm min-h-[300px] lg:min-h-[400px] flex items-center justify-center shadow-[inset_0_0_50px_rgba(0,0,0,0.5)]">
              {imageUrl ? (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: `url(${imageUrl})` }} />
                  {/* Scanner overlay line */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(20,184,166,0.1)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
                  
                  {/* Dynamic Hotspots */}
                  {data.components.map((comp, idx) => {
                     const total = data.components.length;
                     const isLeft = idx % 2 === 0;
                     // Pseudo-distribute hotspots along edges
                     const yPos = 20 + ((idx / Math.max(1, total - 1)) * 60);
                     const xPos = isLeft ? 15 + (idx * 2) : 85 - (idx * 2);
                     
                     return (
                       <div 
                         key={`spot-${idx}`} 
                         className="absolute group z-20"
                         style={{ top: `${yPos}%`, left: `${xPos}%` }}
                         onMouseEnter={() => setActiveComp(idx)}
                         onMouseLeave={() => setActiveComp(null)}
                       >
                         {/* Connecting Line (visual only) */}
                         <div className={`absolute top-1/2 ${isLeft ? 'left-6 w-12 md:w-20' : 'right-6 w-12 md:w-20'} h-[1px] bg-cyan-400/50 transform -translate-y-1/2 ${isLeft ? 'origin-left' : 'origin-right'} transition-all duration-300 ${activeComp === idx ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}></div>

                         {/* Pulse Dot */}
                         <div className={`relative w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full flex items-center justify-center cursor-pointer transition-all ${activeComp === idx ? 'bg-cyan-500 scale-125 shadow-[0_0_20px_#06b6d4] z-30' : 'bg-slate-800/90 border-2 border-cyan-500/50 hover:border-cyan-400'}`}>
                           {activeComp === idx ? <Info size={14} className="text-white" /> : <Plus size={14} className="text-cyan-400" />}
                         </div>
                         
                         {/* Floating Label */}
                         <div className={`absolute top-1/2 -translate-y-1/2 ${isLeft ? 'left-8 md:left-14' : 'right-8 md:right-14'} whitespace-nowrap bg-black/90 backdrop-blur-md border border-cyan-900/80 px-3 py-1.5 rounded-lg transition-all duration-300 z-30 shadow-[0_5px_15px_rgba(0,0,0,0.8)] ${activeComp === idx ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'}`}>
                           <span className="text-cyan-300 font-mono text-xs md:text-sm tracking-widest font-bold">{comp.name}</span>
                         </div>
                       </div>
                     );
                  })}
                </div>
              ) : (
                <div className="text-slate-500 font-mono flex flex-col items-center gap-4">
                   <Settings2 size={48} className="opacity-20" />
                   <span>No Equipment Image Available</span>
                </div>
              )}
            </div>

            {/* Right side: Component Details */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
              {data.components.map((comp, idx) => (
                <div 
                  key={idx} 
                  onMouseEnter={() => setActiveComp(idx)}
                  onMouseLeave={() => setActiveComp(null)}
                  className={`p-5 md:p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeComp === idx 
                      ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transform scale-[1.02] z-10' 
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 rounded-lg transition-colors ${activeComp === idx ? 'bg-cyan-500 text-white shadow-[0_0_15px_#06b6d4]' : 'bg-slate-800 text-cyan-400'}`}>
                      <span className="font-mono font-bold text-sm">{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className={`text-base md:text-lg font-bold ${activeComp === idx ? 'text-cyan-300' : 'text-slate-200'}`}>
                      {comp.name}
                    </h3>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed pl-11 md:pl-12">
                    {comp.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
