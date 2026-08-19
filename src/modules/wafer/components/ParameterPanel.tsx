import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';

interface ParameterPanelProps {
  params: { diameter: number; dieWidth: number; dieHeight: number };
  setParams: React.Dispatch<React.SetStateAction<{ diameter: number; dieWidth: number; dieHeight: number }>>;
  status: 'idle' | 'running' | 'completed';
  onStart: () => void;
}

export function ParameterPanel({ params, setParams, status, onStart }: ParameterPanelProps) {
  const { t } = useTranslation();
  const isRunning = status === 'running';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">
        Wafer Spec Console
      </h3>
      
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-slate-400">{t('wafer.params.diameter')} (mm)</label>
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              disabled={isRunning}
              onClick={() => setParams(p => ({ ...p, diameter: 200 }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                params.diameter === 200 ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              200mm (8 inch)
            </button>
            <button
              disabled={isRunning}
              onClick={() => setParams(p => ({ ...p, diameter: 300 }))}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                params.diameter === 300 ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              300mm (12 inch)
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('wafer.params.dieWidth')}</label>
            <span className="text-sm font-mono text-indigo-400">{params.dieWidth}</span>
          </div>
          <input 
            type="range" min="5" max="30" step="1"
            disabled={isRunning} value={params.dieWidth}
            onChange={(e) => setParams(p => ({ ...p, dieWidth: Number(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('wafer.params.dieHeight')}</label>
            <span className="text-sm font-mono text-indigo-400">{params.dieHeight}</span>
          </div>
          <input 
            type="range" min="5" max="30" step="1"
            disabled={isRunning} value={params.dieHeight}
            onChange={(e) => setParams(p => ({ ...p, dieHeight: Number(e.target.value) }))}
            className="w-full accent-indigo-500"
          />
        </div>

        <button 
          onClick={onStart} disabled={isRunning}
          className="mt-4 w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors"
        >
          <Play size={18}/> {t('wafer.controls.start')}
        </button>
      </div>
    </div>
  );
}
