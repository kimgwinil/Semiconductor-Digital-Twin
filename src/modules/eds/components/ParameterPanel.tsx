import React from 'react';
import { useTranslation } from 'react-i18next';
import { Play } from 'lucide-react';

export function ParameterPanel({ params, setParams, status, onStart }: any) {
  const { t } = useTranslation();
  const isRunning = status === 'running';

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 border-b border-slate-800 pb-2">
        Probe Test Console
      </h3>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('eds.params.defectDensity')}</label>
            <span className="text-sm font-mono text-teal-400">{params.defectDensity.toFixed(2)}</span>
          </div>
          <input 
            type="range" min="0.05" max="1.5" step="0.05"
            disabled={isRunning} value={params.defectDensity}
            onChange={(e) => setParams((p:any) => ({ ...p, defectDensity: Number(e.target.value) }))}
            className="w-full accent-teal-500"
          />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-slate-400">{t('eds.params.dieArea')}</label>
            <span className="text-sm font-mono text-teal-400">{params.dieArea}</span>
          </div>
          <input 
            type="range" min="0.1" max="5.0" step="0.1"
            disabled={isRunning} value={params.dieArea}
            onChange={(e) => setParams((p:any) => ({ ...p, dieArea: Number(e.target.value) }))}
            className="w-full accent-teal-500"
          />
        </div>
        <button 
          onClick={onStart} disabled={isRunning}
          className="mt-4 w-full bg-teal-600 hover:bg-teal-500 disabled:bg-slate-800 text-white py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition-colors"
        >
          <Play size={18}/> {t('eds.controls.start')}
        </button>
      </div>
    </div>
  );
}
