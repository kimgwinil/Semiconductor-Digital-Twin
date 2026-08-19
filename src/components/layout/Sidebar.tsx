import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../../context/AppContext';
import { cn } from '../../lib/utils';
import { Layers, Disc, CircleDot, Zap, ArrowDownToLine, Component, TestTube, Box } from 'lucide-react';

const modules = [
  { id: 'm1', icon: Disc, key: 'nav.m1' },
  { id: 'm2', icon: CircleDot, key: 'nav.m2' },
  { id: 'm3', icon: Layers, key: 'nav.m3' },
  { id: 'm4', icon: Zap, key: 'nav.m4' },
  { id: 'm5', icon: ArrowDownToLine, key: 'nav.m5' },
  { id: 'm6', icon: Component, key: 'nav.m6' },
  { id: 'm7', icon: TestTube, key: 'nav.m7' },
  { id: 'm8', icon: Box, key: 'nav.m8' }
];

export function Sidebar() {
  const { t } = useTranslation();
  const { state, setCurrentModule } = useAppContext();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-4 flex flex-col gap-2">
        {modules.map((m) => {
          const isActive = state.currentModule === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              onClick={() => setCurrentModule(m.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left",
                isActive 
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent"
              )}
            >
              <Icon size={18} className={isActive ? "text-cyan-400" : "text-slate-500"} />
              {t(m.key)}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
