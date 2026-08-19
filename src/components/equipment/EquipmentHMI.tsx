import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, CircleStop, Gauge, Power, RotateCcw, ShieldCheck } from 'lucide-react';
import { advanceActualValues, HmiMetric, metricWithinTolerance } from '../../simulation/models/equipmentHmi';
import { calculateProcessYield } from '../../simulation/models/equipmentHmi';
import { processProfiles, ProcessId } from '../../content/processProfiles';

type Phase = 'off' | 'ready' | 'loaded' | 'running' | 'complete' | 'emergency';

interface EquipmentHMIProps {
  equipmentName: string;
  recipeName: string;
  metrics: HmiMetric[];
  processSteps: string[];
  hazards: string[];
  processId?: ProcessId;
  onComplete?: (metrics: HmiMetric[], events: string[]) => void;
}

const phaseLabel: Record<Phase, string> = {
  off: '전원 꺼짐 / POWER OFF', ready: '준비 / READY', loaded: '웨이퍼 로드 / LOADED',
  running: '공정 가동 / RUN', complete: '공정 완료 / COMPLETE', emergency: '비상 정지 / E-STOP',
};

export function EquipmentHMI({ equipmentName, recipeName, metrics: initialMetrics, processSteps, hazards, processId, onComplete }: EquipmentHMIProps) {
  const [phase, setPhase] = useState<Phase>('off');
  const [metrics, setMetrics] = useState(initialMetrics);
  const [step, setStep] = useState(0);
  const [events, setEvents] = useState<string[]>(['시스템 대기']);
  const [alarm, setAlarm] = useState<string | null>(null);
  const [faultId, setFaultId] = useState<string | null>(null);

  useEffect(() => setMetrics(initialMetrics), [initialMetrics]);
  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => setMetrics((current) => advanceActualValues(current, true)), 450);
    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;
    const timer = window.setInterval(() => setStep((current) => {
      if (current >= processSteps.length - 1) {
        setPhase('complete');
        setEvents((log) => [`${new Date().toLocaleTimeString()} 공정 완료`, ...log]);
        return current;
      }
      return current + 1;
    }), 1800);
    return () => window.clearInterval(timer);
  }, [phase, processSteps.length]);

  useEffect(() => {
    if (phase === 'complete') onComplete?.(metrics, events);
  }, [phase]);

  const log = (message: string) => setEvents((items) => [`${new Date().toLocaleTimeString()} ${message}`, ...items].slice(0, 8));
  const interlock = (message: string) => { setAlarm(message); log(`인터록: ${message}`); };
  const powerToggle = () => {
    if (phase === 'off') { setAlarm(null); setPhase('ready'); log('전원 ON · 자가진단 정상'); return; }
    if (phase === 'ready') { setPhase('off'); setAlarm(null); log('전원 OFF · 안전 정지'); }
  };
  const load = () => phase === 'ready' ? (setPhase('loaded'), log('도어 잠금 · 웨이퍼 로드')) : interlock('전원을 켜고 초기화를 먼저 수행하세요.');
  const run = () => phase === 'loaded' ? (setPhase('running'), setStep(0), setAlarm(null), log(`레시피 ${recipeName} 시작`)) : interlock('웨이퍼 로드와 도어 인터록 확인이 필요합니다.');
  const reset = () => { setPhase('off'); setStep(0); setAlarm(null); setFaultId(null); setMetrics(initialMetrics); setEvents(['시스템 리셋 완료']); };
  const emergency = () => { setPhase('emergency'); setAlarm('비상 정지 활성: 에너지 공급 차단. 위험 요인 확인 후 RESET 하세요.'); log('E-STOP 작동'); };

  const healthy = useMemo(() => metrics.every(metricWithinTolerance), [metrics]);
  const stateColor = phase === 'emergency' ? 'bg-red-500' : phase === 'running' ? 'bg-emerald-500' : phase === 'complete' ? 'bg-cyan-400' : 'bg-slate-500';
  const powerActive = phase !== 'off' && phase !== 'emergency';
  const profile = processId ? processProfiles[processId] : null;
  const selectedFault = profile?.faults.find(f=>f.id===faultId);
  const yieldValue = profile ? calculateProcessYield(profile.baseYield, selectedFault?.yieldLoss||0, metrics.filter(m=>!metricWithinTolerance(m)).length) : 0;
  const injectFault = (id:string) => { const f=profile?.faults.find(x=>x.id===id); if(!f)return; setFaultId(id); setAlarm(`${f.name}: ${f.symptom}`); log(`트러블 발생 · ${f.name}`); };

  return <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 shadow-2xl" aria-label={`${equipmentName} HMI`}>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
      <div><p className="text-xs font-semibold tracking-[.2em] text-cyan-400">EQUIPMENT CONTROL HMI</p><h3 className="text-lg font-bold text-white">{equipmentName}</h3></div>
      <div className="flex items-center gap-3"><div className={`rounded-lg border px-3 py-2 text-xs font-black tracking-widest ${powerActive?'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_18px_#10b98166]':'border-slate-700 bg-black text-slate-500'}`}><span className={`mr-2 inline-block h-3 w-3 rounded-full ${powerActive?'bg-emerald-400 shadow-[0_0_10px_#34d399]':'bg-slate-700'}`}/>MAIN POWER {powerActive?'ON':'OFF'}</div><div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-black/50 px-3 py-2 text-sm"><span className={`h-3 w-3 rounded-full ${stateColor}`} /><span>{phaseLabel[phase]}</span></div></div>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div>
        <div className={`mb-3 h-48 overflow-hidden rounded-xl border border-slate-700 bg-[radial-gradient(circle_at_center,#334155_0%,#020617_70%)] ${phase==='running'?'equipment-running':''}`}><div className="relative mx-auto mt-4 h-36 w-64 rounded-[2rem] border-[12px] border-slate-500 bg-black shadow-[inset_0_0_45px_#22d3ee66,0_20px_35px_#000]"><div className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cyan-300 bg-gradient-to-br from-slate-100 via-indigo-400 to-slate-900 shadow-[0_0_30px_#22d3ee]"/><div className={`absolute left-1/2 top-0 h-28 w-2 -translate-x-1/2 bg-gradient-to-b from-fuchsia-300 to-transparent transition-opacity ${phase==='running'?'opacity-90':'opacity-0'}`}/></div></div>
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={powerToggle} aria-pressed={powerActive} disabled={phase !== 'off' && phase !== 'ready'} className={`hmi-button ${powerActive?'hmi-power-on':''}`}><Power size={16}/> {powerActive?'POWER ON':'POWER / INIT'}</button>
          <button onClick={load} disabled={phase === 'emergency'} className="hmi-button"><ShieldCheck size={16}/> LOAD & LOCK</button>
          <button onClick={run} disabled={phase === 'emergency'} className="hmi-button hmi-run"><Gauge size={16}/> RUN RECIPE</button>
          <button onClick={reset} className="hmi-button"><RotateCcw size={16}/> RESET</button>
          <button onClick={emergency} className="hmi-estop"><CircleStop size={18}/> E-STOP</button>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => {
            const ok = metricWithinTolerance(metric);
            return <div key={metric.id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
              <div className="flex justify-between text-xs text-slate-400"><span>{metric.label}</span><span>{ok ? '● NORMAL' : '△ RAMPING'}</span></div>
              <div className="mt-1 flex items-end justify-between"><span className="text-2xl font-mono text-white">{metric.actual.toFixed(metric.unit === 'rpm' ? 0 : 1)}</span><span className="text-xs text-slate-400">{metric.unit}</span></div>
              <div className="mt-2 text-xs text-cyan-300">SP {metric.setpoint} {metric.unit} · 허용 ±{metric.tolerance}</div>
              <div className="mt-2 h-1.5 overflow-hidden rounded bg-slate-800"><div className={`h-full transition-all ${ok ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{width: `${Math.min(100, Math.max(4, metric.actual / Math.max(metric.setpoint, 1) * 100))}%`}}/></div>
            </div>;
          })}
        </div>
      </div>

      <div className="space-y-3">
        {profile && <div className="rounded-xl border border-slate-700 bg-slate-900 p-3"><div className="flex items-center justify-between"><span className="text-xs font-bold text-slate-400">공정 예상 수율 / PROCESS YIELD</span><strong className={`${yieldValue>=95?'text-emerald-400':yieldValue>=85?'text-amber-400':'text-red-400'} text-2xl`}>{yieldValue.toFixed(1)}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded bg-slate-800"><div className={`${yieldValue>=95?'bg-emerald-500':yieldValue>=85?'bg-amber-500':'bg-red-500'} h-full`} style={{width:`${yieldValue}%`}}/></div></div>}
        <div className="rounded-xl border border-slate-700 bg-black/40 p-3"><div className="mb-2 text-xs font-semibold text-slate-400">RECIPE · {recipeName}</div>{processSteps.map((item, index) => <div key={item} className={`flex items-center gap-2 py-1 text-sm ${index === step && phase === 'running' ? 'text-emerald-300' : index < step || phase === 'complete' ? 'text-cyan-300' : 'text-slate-500'}`}>{index < step || phase === 'complete' ? <CheckCircle2 size={14}/> : <span className="w-3 text-center">{index + 1}</span>}{item}</div>)}</div>
        <div className={`rounded-xl border p-3 ${alarm ? 'border-red-500 bg-red-950/50' : healthy && phase === 'running' ? 'border-emerald-700 bg-emerald-950/30' : 'border-amber-700/60 bg-amber-950/20'}`}><div className="flex items-center gap-2 font-semibold"><AlertTriangle size={16}/>{alarm ? 'INTERLOCK / ALARM' : 'SAFETY STATUS'}</div><p className="mt-1 text-xs text-slate-200">{alarm || hazards.join(' · ')}</p></div>
        <div className="rounded-xl border border-slate-700 bg-black/50 p-3"><div className="mb-2 text-xs font-semibold text-slate-400">EVENT / PRACTICE RECORD</div><div className="max-h-28 space-y-1 overflow-y-auto font-mono text-[11px] text-slate-300">{events.map((item, i) => <div key={`${item}-${i}`}>{item}</div>)}</div></div>
        {profile && <div className="rounded-xl border border-red-900 bg-red-950/20 p-3"><div className="mb-2 text-xs font-bold text-red-300">TROUBLE INJECTION · 불량 시나리오</div><div className="grid gap-2">{profile.faults.map(f=><button key={f.id} onClick={()=>injectFault(f.id)} className={`rounded border px-3 py-2 text-left text-xs ${faultId===f.id?'border-red-400 bg-red-900/50':'border-slate-700 bg-slate-900'}`}><strong>{f.name}</strong><span className="block text-slate-400">원인: {f.cause}</span></button>)}</div>{selectedFault&&<div className="mt-3 space-y-1 rounded bg-black/40 p-2 text-xs"><p><b className="text-red-300">예상 불량:</b> {selectedFault.defect}</p><p><b className="text-cyan-300">복구:</b> {selectedFault.recovery}</p><p><b className="text-amber-300">수율 영향:</b> -{selectedFault.yieldLoss}%p</p></div>}</div>}
      </div>
    </div>
  </section>;
}
