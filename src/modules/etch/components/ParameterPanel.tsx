import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, RotateCcw } from 'lucide-react';

interface ParameterPanelProps {
  params: { rfPower: number; pressure: number; time: number };
  setParams: React.Dispatch<React.SetStateAction<{ rfPower: number; pressure: number; time: number }>>;
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
        
        {/* RF Power */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('etching.params.rfPower')} (W)</label>
            <span className="text-sm font-mono text-amber-400">{params.rfPower}</span>
          </div>
          <input 
            type="range" 
            min="100" max="1000" step="50"
            disabled={isRunning}
            value={params.rfPower}
            onChange={(e) => setParams(p => ({ ...p, rfPower: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Pressure */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('etching.params.pressure')} (mTorr)</label>
            <span className="text-sm font-mono text-amber-400">{params.pressure}</span>
          </div>
          <input 
            type="range" 
            min="10" max="100" step="5"
            disabled={isRunning}
            value={params.pressure}
            onChange={(e) => setParams(p => ({ ...p, pressure: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('etching.params.time')} (sec)</label>
            <span className="text-sm font-mono text-amber-400">{params.time}</span>
          </div>
          <input 
            type="range" 
            min="10" max="120" step="5"
            disabled={isRunning}
            value={params.time}
            onChange={(e) => setParams(p => ({ ...p, time: Number(e.target.value) }))}
            className="w-full accent-amber-500"
          />
        </div>

        {/* Controls */}
        <div className="mt-4">
          <button 
            onClick={onStart}
            disabled={isRunning}
            className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isRunning ? (
              <><RotateCcw className="animate-spin" size={18}/> {t('common.running')}</>
            ) : (
              <><Play fill="currentColor" size={18}/> {t('etching.controls.start')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
