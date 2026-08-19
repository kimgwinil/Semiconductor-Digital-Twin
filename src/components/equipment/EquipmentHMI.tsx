import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, CircleStop, Gauge, Power, RotateCcw, ShieldCheck } from 'lucide-react';
import { advanceActualValues, HmiMetric, metricWithinTolerance } from '../../simulation/models/equipmentHmi';
import { calculateProcessYield } from '../../simulation/models/equipmentHmi';
import { processProfiles, ProcessId } from '../../content/processProfiles';
import { ProcessDynamicScene } from './ProcessDynamicScene';

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

const interlockGuide: Record<ProcessId, { load: string; run: string; loadLog: string }> = {
  wafer: { load:'CZ 챔버 원료 장입·Seed chuck 고정·Ar purge 확인이 필요합니다.', run:'CZ 챔버 밀폐·Ar 유량·도가니/Seed 구동 인터록을 확인하세요.', loadLog:'CZ 챔버 밀폐 · 원료/Seed 준비' },
  oxidation: { load:'Wafer boat 삽입·Quartz tube 도어 잠금 확인이 필요합니다.', run:'Tube 도어·배기·N₂ purge·Heater zone 인터록을 확인하세요.', loadLog:'Wafer boat 삽입 · Tube 도어 잠금' },
  lithography: { load:'Reticle 장착·Wafer vacuum chuck 고정 확인이 필요합니다.', run:'Reticle clamp·Stage vacuum·광원 shutter 인터록을 확인하세요.', loadLog:'Reticle 장착 · Wafer vacuum chuck 고정' },
  etch: { load:'Load-lock wafer clamp·챔버 진공 준비 확인이 필요합니다.', run:'Load-lock gate·Base vacuum·Gas exhaust·RF 인터록을 확인하세요.', loadLog:'Load-lock 밀폐 · Wafer ESC clamp' },
  deposition: { load:'Load-lock cassette·Transfer robot home 확인이 필요합니다.', run:'Base vacuum·Target/Showerhead·Gas·고전압 인터록을 확인하세요.', loadLog:'Load-lock 밀폐 · Robot home 확인' },
  metallization: { load:'Wafer carrier·Plating cell/CMP head 준비 확인이 필요합니다.', run:'Bath circulation·Chemical exhaust·CMP guard·전원 인터록을 확인하세요.', loadLog:'Wafer carrier 장착 · Wet/CMP cell 잠금' },
  eds: { load:'Wafer ID·Notch 정렬·Probe head home 확인이 필요합니다.', run:'Chuck vacuum·Probe clearance·ATE grounding·ESD 인터록을 확인하세요.', loadLog:'Wafer 정렬 · Chuck vacuum 고정' },
  packaging: { load:'Substrate/Die magazine·Bond head home 확인이 필요합니다.', run:'Bond guard·Capillary clearance·Mold press·Heater 인터록을 확인하세요.', loadLog:'Magazine 장착 · Bond/Mold guard 잠금' },
};

function MetricControl({metric,ideal,locked,onChange}:{metric:HmiMetric;ideal:number;locked:boolean;onChange:(value:number)=>void}) {
  const increment=metric.tolerance>0?metric.tolerance:Math.max(Math.abs(ideal)*.02,.1);
  const minimum=ideal===0?-increment*10:0;
  const maximum=Math.max(increment*20,Math.abs(ideal)*2||10);
  const holdTimer=useRef<number|null>(null);
  const holdDelay=useRef<number|null>(null);
  const held=useRef(false);
  const valueRef=useRef(metric.setpoint);
  useEffect(()=>{valueRef.current=metric.setpoint;},[metric.setpoint]);
  const change=(direction:number)=>{const next=Math.min(maximum,Math.max(minimum,valueRef.current+increment*direction));valueRef.current=next;onChange(next);};
  const stopHold=()=>{if(holdDelay.current!==null){window.clearTimeout(holdDelay.current);holdDelay.current=null;}if(holdTimer.current!==null){window.clearInterval(holdTimer.current);holdTimer.current=null;}};
  const startHold=(direction:number)=>{if(locked)return;stopHold();held.current=false;holdDelay.current=window.setTimeout(()=>{held.current=true;change(direction);holdTimer.current=window.setInterval(()=>change(direction),140);},380);};
  const singleChange=(direction:number)=>{if(!held.current)change(direction);held.current=false;};
  useEffect(()=>()=>stopHold(),[]);
  const idealPosition=(ideal-minimum)/(maximum-minimum)*100;
  return <>
    <div className="mt-2 flex items-center gap-1 rounded-lg border border-cyan-900 bg-black/30 p-1">
      <button aria-label={`${metric.label} 감소`} disabled={locked} onClick={()=>singleChange(-1)} onPointerDown={()=>startHold(-1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} className="h-8 w-9 select-none rounded bg-slate-800 text-cyan-300 disabled:opacity-30">−</button>
      <label className="flex min-w-0 flex-1 items-center gap-1 text-[10px] font-bold text-cyan-300"><span>SP 조정</span><input aria-label={`${metric.label} 설정값`} disabled={locked} type="number" min={minimum} max={maximum} step={increment} value={metric.setpoint} onChange={e=>onChange(Number(e.target.value))} className="min-w-0 flex-1 rounded bg-slate-950 px-1 py-1 text-right font-mono text-white outline-none disabled:text-slate-500"/></label>
      <button aria-label={`${metric.label} 증가`} disabled={locked} onClick={()=>singleChange(1)} onPointerDown={()=>startHold(1)} onPointerUp={stopHold} onPointerLeave={stopHold} onPointerCancel={stopHold} className="h-8 w-9 select-none rounded bg-slate-800 text-cyan-300 disabled:opacity-30">＋</button>
    </div>
    <div className="relative mt-5 px-1 pb-1">
      <div className="pointer-events-none absolute -top-4 -translate-x-1/2 whitespace-nowrap text-[9px] font-bold text-emerald-300" style={{left:`${idealPosition}%`}}>▼ 이상값 {ideal}</div>
      <input aria-label={`${metric.label} 설정 슬라이더`} disabled={locked} type="range" min={minimum} max={maximum} step={increment} value={metric.setpoint} onChange={e=>onChange(Number(e.target.value))} className="h-2 w-full cursor-ew-resize accent-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"/>
      <div className="flex justify-between text-[9px] text-slate-500"><span>{minimum}</span><span>{maximum} {metric.unit}</span></div>
    </div>
  </>;
}

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
  const guide = processId ? interlockGuide[processId] : null;
  const powerToggle = () => {
    if (phase === 'off') { setAlarm(null); setPhase('ready'); log('전원 ON · 자가진단 정상'); return; }
    if (phase === 'ready') { setPhase('off'); setAlarm(null); log('전원 OFF · 안전 정지'); }
  };
  const load = () => phase === 'ready' ? (setPhase('loaded'), setAlarm(null), log(guide?.loadLog || '장비 로드 · 안전 잠금')) : interlock(phase === 'off' ? 'MAIN POWER를 켜고 자가진단을 먼저 수행하세요.' : guide?.load || '장비 로드와 안전 잠금을 확인하세요.');
  const run = () => phase === 'loaded' ? (setPhase('running'), setStep(0), setAlarm(null), log(`레시피 ${recipeName} 시작`)) : interlock(guide?.run || '장비별 운전 인터록을 확인하세요.');
  const reset = () => { setPhase('off'); setStep(0); setAlarm(null); setFaultId(null); setMetrics(initialMetrics); setEvents(['시스템 리셋 완료']); };
  const emergency = () => { setPhase('emergency'); setAlarm('비상 정지 활성: 에너지 공급 차단. 위험 요인 확인 후 RESET 하세요.'); log('E-STOP 작동'); };

  const healthy = useMemo(() => metrics.every(metricWithinTolerance), [metrics]);
  const stateColor = phase === 'emergency' ? 'bg-red-500' : phase === 'running' ? 'bg-emerald-500' : phase === 'complete' ? 'bg-cyan-400' : 'bg-slate-500';
  const powerActive = phase !== 'off' && phase !== 'emergency';
  const profile = processId ? processProfiles[processId] : null;
  const selectedFault = profile?.faults.find(f=>f.id===faultId);
  const yieldValue = profile ? calculateProcessYield(profile.baseYield, selectedFault?.yieldLoss||0, metrics.filter(m=>!metricWithinTolerance(m)).length) : 0;
  const injectFault = (id:string) => { const f=profile?.faults.find(x=>x.id===id); if(!f)return; setFaultId(id); setAlarm(`${f.name}: ${f.symptom}`); log(`트러블 발생 · ${f.name}`); };
  const adjustSetpoint = (id:string, value:number) => {
    if (phase === 'running' || phase === 'complete' || phase === 'emergency') return;
    setMetrics(items => items.map(metric => metric.id === id ? {...metric, setpoint:value} : metric));
    setAlarm(null);
  };

  return <section className="rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-4 shadow-2xl" aria-label={`${equipmentName} HMI`}>
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-3">
      <div><p className="text-xs font-semibold tracking-[.2em] text-cyan-400">EQUIPMENT CONTROL HMI</p><h3 className="text-lg font-bold text-white">{equipmentName}</h3></div>
      <div className="flex items-center gap-3"><div className={`rounded-lg border px-3 py-2 text-xs font-black tracking-widest ${powerActive?'border-emerald-500 bg-emerald-950 text-emerald-300 shadow-[0_0_18px_#10b98166]':'border-slate-700 bg-black text-slate-500'}`}><span className={`mr-2 inline-block h-3 w-3 rounded-full ${powerActive?'bg-emerald-400 shadow-[0_0_10px_#34d399]':'bg-slate-700'}`}/>MAIN POWER {powerActive?'ON':'OFF'}</div><div className="flex items-center gap-2 rounded-lg border border-slate-600 bg-black/50 px-3 py-2 text-sm"><span className={`h-3 w-3 rounded-full ${stateColor}`} /><span>{phaseLabel[phase]}</span></div></div>
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_1fr]">
      <div>
        {processId ? <ProcessDynamicScene processId={processId} running={phase==='running'} step={step} fault={Boolean(faultId)} metrics={metrics}/> : null}
        <div className="my-3 grid grid-cols-3 gap-2 rounded-xl border border-slate-700 bg-black/50 p-2 text-center text-[11px] font-bold">
          <div className={phase!=='off'?'rounded bg-emerald-950 p-2 text-emerald-300':'rounded bg-slate-900 p-2 text-slate-500'}>1 · POWER / INIT</div>
          <div className={phase==='loaded'||phase==='running'||phase==='complete'?'rounded bg-emerald-950 p-2 text-emerald-300':'rounded bg-slate-900 p-2 text-slate-500'}>2 · LOAD & LOCK</div>
          <div className={phase==='running'||phase==='complete'?'rounded bg-emerald-950 p-2 text-emerald-300':'rounded bg-slate-900 p-2 text-slate-500'}>3 · RUN RECIPE</div>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          <button onClick={powerToggle} aria-pressed={powerActive} disabled={phase !== 'off' && phase !== 'ready'} className={`hmi-button ${powerActive?'hmi-power-on':''}`}><Power size={16}/> {powerActive?'POWER ON':'POWER / INIT'}</button>
          <button onClick={load} disabled={phase === 'emergency'} className="hmi-button"><ShieldCheck size={16}/> LOAD & LOCK</button>
          <button onClick={run} disabled={phase === 'emergency'} className="hmi-button hmi-run"><Gauge size={16}/> RUN RECIPE</button>
          <button onClick={reset} className="hmi-button"><RotateCcw size={16}/> RESET</button>
          <button onClick={emergency} className="hmi-estop"><CircleStop size={18}/> E-STOP</button>
        </div>
        <div className="mb-2 flex items-center justify-between"><strong className="text-xs tracking-wider text-cyan-300">공정 조정·계측 모듈</strong><span className="text-[11px] text-slate-400">SP: 조정값 · PV: 실시간 계측값</span></div>
        <div className="grid gap-2 sm:grid-cols-2">
          {metrics.map((metric) => {
            const ok = metricWithinTolerance(metric);
            const locked = phase === 'running' || phase === 'complete' || phase === 'emergency';
            const ideal = initialMetrics.find(item=>item.id===metric.id)?.setpoint ?? metric.setpoint;
            return <div key={metric.id} className="rounded-xl border border-slate-700 bg-slate-900/80 p-3">
              <div className="flex justify-between text-xs text-slate-400"><span>{metric.label}</span><span>{ok ? '● NORMAL' : '△ RAMPING'}</span></div>
              <div className="mt-1 flex items-end justify-between"><span><span className="mr-2 text-[10px] font-bold text-emerald-400">PV 계측</span><span className="text-2xl font-mono text-white">{metric.actual.toFixed(metric.unit === 'rpm' ? 0 : 1)}</span></span><span className="text-xs text-slate-400">{metric.unit}</span></div>
              <MetricControl metric={metric} ideal={ideal} locked={locked} onChange={value=>adjustSetpoint(metric.id,value)}/>
              <div className="mt-2 text-[11px] text-slate-400">허용 편차 ±{metric.tolerance} {metric.unit} {locked?'· 운전 중 조정 잠금':'· 운전 전 조정 가능'}</div>
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
