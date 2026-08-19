import React, { useState } from 'react';
import { BookOpen, ClipboardCheck, Factory, FlaskConical, ShieldAlert } from 'lucide-react';
import { EquipmentHMI } from './EquipmentHMI';
import type { HmiMetric } from '../../simulation/models/equipmentHmi';
import type { ProcessId } from '../../content/processProfiles';
import { AdvancedProcessEducation } from '../education/AdvancedProcessEducation';

export interface TrainingProcessConfig {
  processId: ProcessId;
  title: string;
  description: string;
  equipmentName: string;
  recipeName: string;
  metrics: HmiMetric[];
  steps: string[];
  hazards: string[];
  principles: string[];
  defects: string[];
  checklist: string[];
}

export function ProcessTrainingModule({ config }: { config: TrainingProcessConfig }) {
  const [tab, setTab] = useState<'theory'|'overview'|'equipment'|'principle'|'basic'|'intermediate'|'advanced'|'evaluation'>('theory');
  const tabs = [
    ['theory','이론 학습'],['overview','공정 개요'],['equipment','장비 구조'],['principle','동작 원리'],['basic','기초 실습'],['intermediate','응용 실습'],['advanced','심화 실습'],['evaluation','평가결과']
  ] as const;

  return <div className="flex h-full flex-col gap-5 overflow-y-auto bg-slate-950 p-6">
    <header className="border-b border-slate-800 pb-4"><h1 className="text-2xl font-bold">{config.title}</h1><p className="mt-1 text-slate-400">{config.description}</p></header>
    <nav className="flex overflow-x-auto border-b border-slate-800">{tabs.map(([id,label]) => <button key={id} onClick={()=>setTab(id)} className={`whitespace-nowrap border-b-2 px-6 py-3 text-sm font-semibold ${tab===id?'border-cyan-400 text-cyan-300':'border-transparent text-slate-400'}`}>{label}</button>)}</nav>

    {tab === 'theory' && <AdvancedProcessEducation processId={config.processId} mode="theory"/>}
    {tab === 'overview' && <AdvancedProcessEducation processId={config.processId} mode="overview"/>}
    {tab === 'principle' && <AdvancedProcessEducation processId={config.processId} mode="principle"/>}

    {tab === 'equipment' && <AdvancedProcessEducation processId={config.processId} mode="equipment"/>}

    {(tab === 'basic' || tab === 'intermediate' || tab === 'advanced') && <div className="space-y-4">
      <div className="rounded-xl border border-indigo-800 bg-indigo-950/40 p-4"><h3 className="font-bold text-indigo-300">{tab==='basic'?'기초 실습: 안전 순서와 표준 레시피':tab==='intermediate'?'응용 실습: 설정값 조정과 공정 결과 비교':'심화 실습: 공정창 최적화 및 이상 대응'}</h3><p className="mt-1 text-sm text-slate-300">SP 설정 조정 → POWER/INIT → LOAD & LOCK → RUN RECIPE → PV 계측값·실사 장비 동작 관찰 → 이상 시 E-STOP/RESET → 결과 기록 순서로 수행합니다.</p></div>
      <EquipmentHMI processId={config.processId} equipmentName={config.equipmentName} recipeName={tab==='advanced'?`${config.recipeName} ADVANCED`:tab==='intermediate'?`${config.recipeName} APPLICATION`:config.recipeName} metrics={config.metrics} processSteps={config.steps} hazards={config.hazards}/>
    </div>}

    {tab === 'evaluation' && <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">{[['안전·순서 준수','25점'],['파라미터 정확도','25점'],['공정 품질','25점'],['알람 대응','15점'],['기록 완성도','10점']].map(([label,score])=><div key={label} className="rounded-xl border border-slate-700 bg-slate-900 p-5"><div className="text-sm text-slate-400">{label}</div><div className="mt-2 text-2xl font-bold text-cyan-300">{score}</div><button onClick={()=>setTab('basic')} className="mt-4 text-xs text-indigo-300 underline">해당 항목 재실습</button></div>)}</div>}
  </div>;
}

function TheoryCard({icon,title,items}:{icon:React.ReactNode;title:string;items:string[]}) {
  return <section className="rounded-2xl border border-slate-700 bg-slate-900 p-5"><h3 className="flex items-center gap-2 font-bold text-cyan-300">{icon}{title}</h3><ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">{items.map(item=><li key={item} className="flex gap-2"><span className="text-cyan-500">●</span>{item}</li>)}</ul></section>;
}
