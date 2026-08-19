import React from 'react';
import { useTranslation } from 'react-i18next';
import { Activity } from 'lucide-react';

export function MeasurementPanel({ result }: { result: any }) {
  const { t } = useTranslation();
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <Activity size={20} className="text-teal-400" />
          Test Results
        </h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('eds.results.total')}</span>
          <span className="text-xl font-mono text-slate-300">{result.totalDies} <span className="text-sm">ea</span></span>
        </div>
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('eds.results.good')}</span>
          <span className="text-xl font-mono text-emerald-400">{result.goodDies} <span className="text-sm">ea</span></span>
        </div>
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-teal-900/50 shadow-[inset_0_0_10px_rgba(20,184,166,0.1)] col-span-2">
          <span className="text-xs text-teal-500 font-medium mb-1">{t('eds.results.measured')}</span>
          <span className="text-3xl font-mono text-teal-400 font-bold">
            {result.yieldPercent}%
          </span>
        </div>
      </div>
    </div>
  );
}
