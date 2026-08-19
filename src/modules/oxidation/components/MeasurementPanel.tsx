import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';

interface MeasurementPanelProps {
  result: {
    actual: number;
    measured: number;
    target: number;
  };
}

export function MeasurementPanel({ result }: MeasurementPanelProps) {
  const { t } = useTranslation();

  const errorPct = ((result.measured - result.target) / result.target) * 100;
  // Assume ±5% is passing for basic practice
  const isPass = Math.abs(errorPct) <= 5;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Activity size={20} className="text-fuchsia-400" />
          Measurement Results
        </h3>
        {isPass ? (
          <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-1 bg-emerald-400/10 rounded">
            <CheckCircle2 size={16} /> PASS
          </span>
        ) : (
          <span className="flex items-center gap-1 text-rose-400 font-bold px-2 py-1 bg-rose-400/10 rounded">
            <XCircle size={16} /> FAIL
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('oxidation.results.target')}</span>
          <span className="text-xl font-mono text-slate-300">{result.target.toFixed(1)} <span className="text-sm">nm</span></span>
        </div>
        
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('oxidation.results.actual')}</span>
          <span className="text-xl font-mono text-slate-400">{result.actual.toFixed(2)} <span className="text-sm">nm</span></span>
        </div>

        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-cyan-900/50 shadow-[inset_0_0_10px_rgba(6,182,212,0.1)] col-span-2">
          <span className="text-xs text-cyan-500 font-medium mb-1">{t('oxidation.results.measured')} (Ellipsometer)</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-mono text-cyan-400 font-bold">
              {result.measured.toFixed(2)} <span className="text-lg font-normal text-cyan-600">nm</span>
            </span>
            <div className="flex flex-col items-end">
              <span className="text-xs text-slate-500">{t('oxidation.results.error')}</span>
              <span className={`text-sm font-mono font-medium ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                {errorPct > 0 ? '+' : ''}{errorPct.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
