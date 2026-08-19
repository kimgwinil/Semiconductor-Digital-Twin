import React, { useState } from 'react';
import { BookOpen, Boxes, ChevronRight, Factory, Gauge, ShieldAlert, Workflow } from 'lucide-react';
import { processProfiles, ProcessId } from '../../content/processProfiles';
import waferImage from '../../assets/equipment-generated/wafer-cz.png';
import oxidationImage from '../../assets/equipment-generated/oxidation-furnace.png';
import lithographyImage from '../../assets/equipment-generated/lithography-scanner.png';
import etchImage from '../../assets/equipment-generated/etch-rie.png';
import depositionImage from '../../assets/equipment-generated/deposition-implant.png';
import metallizationImage from '../../assets/equipment-generated/metallization-cmp.png';
import edsImage from '../../assets/equipment-generated/eds-prober.png';
import packagingImage from '../../assets/equipment-generated/packaging-cell.png';

const equipmentImages:Record<ProcessId,string>={wafer:waferImage,oxidation:oxidationImage,lithography:lithographyImage,etch:etchImage,deposition:depositionImage,metallization:metallizationImage,eds:edsImage,packaging:packagingImage};
const hotspotPositions:Record<ProcessId,{x:number;y:number}[]>={
  wafer:[{x:50,y:60},{x:48,y:73},{x:49,y:22},{x:42,y:47},{x:78,y:55}], oxidation:[{x:55,y:43},{x:52,y:30},{x:47,y:75},{x:54,y:48},{x:88,y:65}],
  lithography:[{x:48,y:31},{x:31,y:53},{x:52,y:46},{x:55,y:74},{x:27,y:67}], etch:[{x:52,y:24},{x:52,y:65},{x:51,y:43},{x:53,y:66},{x:26,y:48}],
  deposition:[{x:76,y:45},{x:37,y:48},{x:55,y:27},{x:86,y:42},{x:19,y:58}], metallization:[{x:18,y:45},{x:51,y:51},{x:53,y:35},{x:83,y:47},{x:20,y:30}],
  eds:[{x:46,y:52},{x:48,y:66},{x:82,y:56},{x:43,y:36},{x:83,y:31}], packaging:[{x:35,y:32},{x:34,y:48},{x:39,y:51},{x:74,y:43},{x:78,y:70}]
};

export function AdvancedProcessEducation({processId,mode,existing}:{processId:ProcessId;mode:'theory'|'overview'|'equipment'|'principle';existing?:{title:string;content:string[]}}) {
  const p=processProfiles[processId];
  if(mode==='equipment') return <EquipmentStructure3D processId={processId}/>;
  const items=mode==='theory'?p.objectives:mode==='overview'?p.overview:p.principles;
  const title=mode==='theory'?'심화 이론 및 학습 목표':mode==='overview'?'전체 공정 흐름과 품질 관문':'장비 기반 동작원리';
  const Icon=mode==='theory'?BookOpen:mode==='overview'?Workflow:Gauge;
  return <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-5 md:p-7">
    <h2 className="flex items-center gap-3 text-2xl font-bold"><Icon className="text-cyan-400"/>{p.name} · {title}</h2>
    {existing?.content?.length ? <section className="mt-5 rounded-2xl border border-slate-700 bg-slate-900 p-5"><h3 className="font-bold text-slate-100">기존 핵심 이론</h3><div className="mt-3 space-y-2 text-sm leading-7 text-slate-300">{existing.content.map((x,i)=><p key={i}>{x}</p>)}</div></section>:null}
    <div className="mt-5 grid gap-4 lg:grid-cols-3">{items.map((x,i)=><article key={x} className="rounded-2xl border border-cyan-900/60 bg-gradient-to-br from-slate-900 to-cyan-950/20 p-5"><div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-cyan-500/15 font-mono font-bold text-cyan-300">{i+1}</div><p className="text-sm leading-7 text-slate-200">{x}</p></article>)}</div>
    {mode==='overview' && <div className="mt-5 space-y-4">{p.overview.map((x,i)=>{const component=p.components[i%p.components.length];const principle=p.principles[i%p.principles.length];return <article key={x} className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-900"><div className="flex items-center gap-3 border-b border-slate-700 bg-gradient-to-r from-cyan-950/70 to-slate-900 px-5 py-4"><span className="rounded-lg bg-cyan-500 px-3 py-2 font-mono text-xs font-black text-slate-950">STEP {String(i+1).padStart(2,'0')}</span><h3 className="font-bold text-slate-100">{x}</h3></div><div className="grid gap-3 p-5 md:grid-cols-3"><div><div className="text-[11px] font-bold tracking-widest text-cyan-400">사용 장비·구성품</div><strong className="mt-2 block text-sm text-slate-100">{component.name}</strong><p className="mt-1 text-xs leading-5 text-slate-400">{component.role}</p></div><div><div className="text-[11px] font-bold tracking-widest text-indigo-400">작업 원리·핵심 제어</div><p className="mt-2 text-xs leading-5 text-slate-300">{principle}</p></div><div><div className="text-[11px] font-bold tracking-widest text-emerald-400">품질 확인·다음 단계 조건</div><p className="mt-2 text-xs leading-5 text-slate-300">Setpoint–Actual 허용범위, 장비 인터록, 표면/치수/전기적 계측값을 확인하고 PASS일 때만 다음 STEP으로 이동합니다.</p></div></div></article>})}</div>}
    {mode==='principle' && <div className="mt-5 grid gap-5 xl:grid-cols-[.8fr_1.2fr]"><div className="overflow-hidden rounded-2xl border border-indigo-700 bg-black"><img src={equipmentImages[processId]} alt={`${p.equipment} 장비 구조`} className="h-full min-h-[340px] w-full object-cover"/></div><div className="rounded-2xl border border-indigo-800 bg-indigo-950/30 p-5"><h3 className="flex items-center gap-2 font-bold text-indigo-300"><Factory/>{p.equipment} 구성품 기반 동작 흐름</h3><div className="mt-4 space-y-3">{p.components.map((c,i)=><div key={c.name} className="flex gap-3 rounded-xl border border-indigo-900/70 bg-black/25 p-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-mono text-xs">{i+1}</span><div><strong className="text-indigo-200">{c.name}</strong><p className="mt-1 text-xs leading-5 text-slate-300">{c.role} → {p.overview[i]||p.overview[p.overview.length-1]}</p></div></div>)}</div><p className="mt-4 border-t border-indigo-900 pt-4 text-xs leading-6 text-slate-400">각 구성품의 센서 Actual을 Controller가 Setpoint와 비교하고 해당 구동부를 조절합니다. 허용범위 이탈 시 연결된 Utility와 에너지를 차단하고 장비별 복구 절차를 수행합니다.</p></div></div>}
  </div>;
}

export function EquipmentStructure3D({processId}:{processId:ProcessId}) {
  const p=processProfiles[processId]; const [active,setActive]=useState(0);
  const activePosition=hotspotPositions[processId][active]||{x:50,y:50};
  return <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-[#030712] p-5">
    <header><h2 className="flex items-center gap-2 text-2xl font-bold"><Boxes className="text-cyan-400"/>{p.equipment} 구조 및 구성품</h2><p className="mt-2 text-sm text-slate-400">장비 모형 또는 구성품 카드를 선택하면 위치·명칭·기능이 함께 강조됩니다.</p></header>
    <div className="mt-5 grid gap-5 xl:grid-cols-[1.3fr_1fr]">
      <div className="equipment-3d-stage min-h-[520px]">
        <img src={equipmentImages[processId]} alt={`${p.equipment} 실사형 내부 구조`} className="absolute inset-0 h-full w-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-white/5"/><div className="equipment-scanline"/>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points={`${activePosition.x},${activePosition.y} ${Math.min(92,activePosition.x+12)},${activePosition.y} 92,12`} fill="none" stroke="#67e8f9" strokeWidth="0.45" vectorEffect="non-scaling-stroke"/><circle cx={activePosition.x} cy={activePosition.y} r="1.3" fill="#22d3ee" stroke="white" strokeWidth="0.35"/></svg>
        <div className="absolute right-3 top-3 max-w-[52%] rounded-xl border border-cyan-300 bg-slate-950/95 px-4 py-3 shadow-[0_0_25px_#22d3ee77]"><div className="text-[10px] font-bold tracking-widest text-cyan-400">SELECTED COMPONENT {String(active+1).padStart(2,'0')}</div><strong className="mt-1 block text-sm text-white">{p.components[active].name}</strong><p className="mt-1 text-[11px] leading-5 text-slate-300">{p.components[active].role}</p></div>
        {p.components.map((c,i)=>{const pos=hotspotPositions[processId][i]||{x:50,y:50};return <button key={c.name} aria-label={`${i+1} ${c.name}`} onClick={()=>setActive(i)} className={`equipment-hotspot equipment-hotspot-number ${active===i?'is-active':''}`} style={{top:`${pos.y}%`,left:`${pos.x}%`}}><span>{i+1}</span></button>})}
        <div className="absolute bottom-3 left-3 rounded-lg bg-black/80 px-3 py-2 text-xs text-slate-200">공정 전용 실사형 장비 · 구성품 위치 선택 · 기능 카드 연동</div>
      </div>
      <div className="space-y-3">{p.components.map((c,i)=><button key={c.name} onClick={()=>setActive(i)} className={`w-full rounded-xl border p-4 text-left transition ${active===i?'border-cyan-400 bg-cyan-950/40 shadow-[0_0_24px_#06b6d433]':'border-slate-700 bg-slate-900'}`}><div className="flex items-center justify-between"><strong className="text-slate-100">{String(i+1).padStart(2,'0')} · {c.name}</strong><span className="rounded bg-slate-800 px-2 py-1 text-[10px] text-cyan-300">{c.zone}</span></div><p className="mt-2 text-sm leading-6 text-slate-400">{c.role}</p></button>)}</div>
    </div>
    <div className="mt-5 rounded-xl border border-amber-800 bg-amber-950/20 p-4"><h3 className="flex items-center gap-2 font-bold text-amber-300"><ShieldAlert/>구조 기반 안전 포인트</h3><p className="mt-2 text-sm text-slate-300">Chamber를 열기 전 에너지 차단·압력 평형·고온부 냉각을 확인합니다. Utility와 motion zone은 독립 인터록으로 보호되며 임의 bypass를 금지합니다.</p></div>
  </div>;
}
