import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';

export function ParameterPanel({ params, setParams, status, onStart }: any) {
  const { t } = useTranslation();
  const isRunning = status === 'running';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">
        Thermal Test Console
      </h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('packaging.params.power')}</label>
            <span className="text-sm font-mono text-orange-400">{params.power} W</span>
          </div>
          <input 
            type="range" min="1" max="50" step="1"
            disabled={isRunning} value={params.power}
            onChange={(e) => setParams((p:any) => ({ ...p, power: Number(e.target.value) }))}
            className="w-full accent-orange-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('packaging.params.thermalResistance')}</label>
            <span className="text-sm font-mono text-orange-400">{params.thermalResistance}</span>
          </div>
          <input 
            type="range" min="0.5" max="10" step="0.5"
            disabled={isRunning} value={params.thermalResistance}
            onChange={(e) => setParams((p:any) => ({ ...p, thermalResistance: Number(e.target.value) }))}
            className="w-full accent-orange-500"
          />
        </div>
        <button 
          onClick={onStart} disabled={isRunning}
          className="mt-4 w-full bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors"
        >
          <Play size={18}/> {t('packaging.controls.start')}
        </button>
      </div>
    </div>
  );
}
