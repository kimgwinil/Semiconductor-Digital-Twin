import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw } from 'lucide-react';

interface ParameterPanelProps {
  params: { wavelength: number; na: number; dose: number };
  setParams: React.Dispatch<React.SetStateAction<{ wavelength: number; na: number; dose: number }>>;
  status: 'idle' | 'running' | 'completed';
  onStart: () => void;
}

export function ParameterPanel({ params, setParams, status, onStart }: ParameterPanelProps) {
  const { t } = useTranslation();
  const isRunning = status === 'running';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">
        Process Control Console
      </h3>
      
      <div className="flex flex-col gap-5">
        
        {/* Wavelength */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-400">{t('lithography.params.wavelength')} (nm)</label>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[365, 248, 193].map(w => (
              <button
                key={w}
                disabled={isRunning}
                onClick={() => setParams(p => ({ ...p, wavelength: w }))}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  params.wavelength === w 
                    ? 'bg-slate-800 text-fuchsia-400 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {w}
              </button>
            ))}
          </div>
        </div>

        {/* NA */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('lithography.params.na')}</label>
            <span className="text-sm font-mono text-fuchsia-400">{params.na.toFixed(2)}</span>
          </div>
          <input 
            type="range" 
            min="0.5" max="1.35" step="0.05"
            disabled={isRunning}
            value={params.na}
            onChange={(e) => setParams(p => ({ ...p, na: Number(e.target.value) }))}
            className="w-full accent-fuchsia-500"
          />
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <span>0.5</span>
            <span>1.35</span>
          </div>
        </div>

        {/* Dose */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('lithography.params.dose')} (mJ/cm²)</label>
            <span className="text-sm font-mono text-fuchsia-400">{params.dose}</span>
          </div>
          <input 
            type="range" 
            min="10" max="50" step="1"
            disabled={isRunning}
            value={params.dose}
            onChange={(e) => setParams(p => ({ ...p, dose: Number(e.target.value) }))}
            className="w-full accent-fuchsia-500"
          />
        </div>

        {/* Controls */}
        <div className="mt-4">
          <button 
            onClick={onStart}
            disabled={isRunning}
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isRunning ? (
              <><RotateCcw className="animate-spin" size={18}/> {t('common.running')}</>
            ) : (
              <><Play fill="currentColor" size={18}/> {t('lithography.controls.start')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
