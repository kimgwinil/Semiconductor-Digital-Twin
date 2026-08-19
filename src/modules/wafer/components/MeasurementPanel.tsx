import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle2, LayoutGrid } from 'lucide-react';

interface MeasurementPanelProps {
  result: {
    grossDies: number;
    dieArea: number;
    targetDPW: number;
  };
}

export function MeasurementPanel({ result }: MeasurementPanelProps) {
  const { t } = useTranslation();
  const isPass = result.grossDies >= result.targetDPW;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col gap-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <LayoutGrid size={20} className="text-indigo-400" />
          Layout Results
        </h3>
        {isPass && (
          <span className="flex items-center gap-1 text-emerald-400 font-bold px-2 py-1 bg-emerald-400/10 rounded">
            <CheckCircle2 size={16} /> PASS
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('wafer.results.area')}</span>
          <span className="text-xl font-mono text-slate-300">{result.dieArea.toFixed(1)} <span className="text-sm">mm²</span></span>
        </div>
        
        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-500 mb-1">{t('wafer.results.target')}</span>
          <span className="text-xl font-mono text-slate-400">{result.targetDPW} <span className="text-sm">ea</span></span>
        </div>

        <div className="flex flex-col bg-slate-950 p-3 rounded-lg border border-indigo-900/50 shadow-[inset_0_0_10px_rgba(99,102,241,0.1)] col-span-2">
          <span className="text-xs text-indigo-500 font-medium mb-1">{t('wafer.results.measured')}</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-mono text-indigo-400 font-bold">
              {result.grossDies} <span className="text-lg font-normal text-indigo-600">Dies</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
