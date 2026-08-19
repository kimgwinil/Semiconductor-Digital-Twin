import React from 'react';
import { useTranslation } from 'react-i18next';
import { ThermometerSun, CheckCircle2, AlertTriangle } from 'lucide-react';

export function MeasurementPanel({ result }: { result: any }) {
  const { t } = useTranslation();
  
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <ThermometerSun size={20} className="text-orange-400" />
          Thermal Results
        </h3>
        {result.pass ? (
          <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-1 bg-emerald-400/10 rounded">
            <CheckCircle2 size={16} /> SAFE
          </span>
        ) : (
          <span className="flex items-center gap-1 text-rose-400 font-bold px-2 py-1 bg-rose-400/10 rounded">
            <AlertTriangle size={16} /> OVERHEAT
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('packaging.results.limit')}</span>
          <span className="text-xl font-mono text-slate-300">125 <span className="text-sm">°C</span></span>
        </div>
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-orange-900/50 shadow-[inset_0_0_10px_rgba(249,115,22,0.1)] col-span-2">
          <span className="text-xs text-orange-500 font-medium mb-1">{t('packaging.results.measured')}</span>
          <span className={`text-3xl font-mono font-bold ${result.pass ? 'text-orange-400' : 'text-rose-500'}`}>
            {result.junctionTemp} <span className="text-lg font-normal">°C</span>
          </span>
        </div>
      </div>
    </div>
  );
}
