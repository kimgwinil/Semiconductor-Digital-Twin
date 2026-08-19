import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Square, RotateCcw } from 'lucide-react';

interface ParameterPanelProps {
  params: { temperature: number; time: number; isWet: boolean };
  setParams: React.Dispatch<React.SetStateAction<{ temperature: number; time: number; isWet: boolean }>>;
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
        {/* Oxidation Type */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-400">{t('oxidation.params.type')}</label>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              disabled={isRunning}
              onClick={() => setParams(p => ({ ...p, isWet: false }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                !params.isWet 
                  ? 'bg-slate-800 text-cyan-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t('oxidation.params.dry')}
            </button>
            <button
              disabled={isRunning}
              onClick={() => setParams(p => ({ ...p, isWet: true }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                params.isWet 
                  ? 'bg-slate-800 text-blue-400 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {t('oxidation.params.wet')}
            </button>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('oxidation.params.temperature')} (°C)</label>
            <span className="text-sm font-mono text-cyan-400">{params.temperature}</span>
          </div>
          <input 
            type="range" 
            min="800" max="1200" step="10"
            disabled={isRunning}
            value={params.temperature}
            onChange={(e) => setParams(p => ({ ...p, temperature: Number(e.target.value) }))}
            className="w-full accent-cyan-500"
          />
          <div className="flex justify-between text-xs text-slate-600 font-mono">
            <span>800</span>
            <span>1000</span>
            <span>1200</span>
          </div>
        </div>

        {/* Time */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('oxidation.params.time')} (min)</label>
            <span className="text-sm font-mono text-cyan-400">{params.time}</span>
          </div>
          <input 
            type="range" 
            min="10" max="300" step="5"
            disabled={isRunning}
            value={params.time}
            onChange={(e) => setParams(p => ({ ...p, time: Number(e.target.value) }))}
            className="w-full accent-cyan-500"
          />
        </div>

        {/* Controls */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button 
            onClick={onStart}
            disabled={isRunning}
            className="col-span-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            {isRunning ? (
              <><RotateCcw className="animate-spin" size={18}/> {t('common.running')}</>
            ) : (
              <><Play fill="currentColor" size={18}/> {t('oxidation.controls.start')}</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
