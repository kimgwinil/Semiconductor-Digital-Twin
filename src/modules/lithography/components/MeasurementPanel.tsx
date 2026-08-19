import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface MeasurementPanelProps {
  result: {
    actualCD: number;
    measuredCD: number;
    resolutionLimit: number;
    targetCD: number;
    isFailed: boolean;
    message: string;
  };
}

export function MeasurementPanel({ result }: MeasurementPanelProps) {
  const { t } = useTranslation();

  const errorPct = result.isFailed ? 100 : ((result.measuredCD - result.targetCD) / result.targetCD) * 100;
  const isPass = !result.isFailed && Math.abs(errorPct) <= 10; // 10% CD variation tolerance

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Activity size={20} className="text-fuchsia-400" />
          CD Measurement
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

      {result.isFailed && (
        <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-lg flex items-start gap-2 text-rose-400">
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
          <span className="text-sm">{result.message}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('lithography.results.resolution')}</span>
          <span className="text-xl font-mono text-slate-400">{result.resolutionLimit.toFixed(1)} <span className="text-sm">nm</span></span>
        </div>
        
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('lithography.results.target')}</span>
          <span className="text-xl font-mono text-slate-300">{result.targetCD.toFixed(1)} <span className="text-sm">nm</span></span>
        </div>

        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-fuchsia-900/50 shadow-[inset_0_0_10px_rgba(217,70,239,0.1)] col-span-2">
          <span className="text-xs text-fuchsia-500 font-medium mb-1">{t('lithography.results.measured')} (CD-SEM)</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-mono text-fuchsia-400 font-bold">
              {result.isFailed ? "---" : result.measuredCD.toFixed(1)} <span className="text-lg font-normal text-fuchsia-600">nm</span>
            </span>
            {!result.isFailed && (
              <div className="flex flex-col items-end">
                <span className="text-xs text-slate-500">Error</span>
                <span className={`text-sm font-mono font-medium ${isPass ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {errorPct > 0 ? '+' : ''}{errorPct.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
