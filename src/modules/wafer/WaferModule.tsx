import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { MeasurementPanel } from './components/MeasurementPanel';
import { WaferVisualization } from './components/WaferVisualization';
import { calculateWafer } from '../../simulation/models/wafer';

import koContent from '../../content/ko/wafer.json';
import enContent from '../../content/en/wafer.json';
import equipImage from '../../assets/images/equip_wafer.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function WaferModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  
  const [params, setParams] = useState({
    diameter: 300,
    dieWidth: 10,
    dieHeight: 10
  });
  
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [result, setResult] = useState<{ grossDies: number; dieArea: number; targetDPW: number; } | null>(null);

  const handleStart = () => {
    setStatus('running');
    setTimeout(() => completeProcess(), 500); // Quick sim for layout calc
  };

  const completeProcess = () => {
    let targetDPW = 500;
    if (activeTab === 'intermediate') targetDPW = 1000;
    if (activeTab === 'advanced') targetDPW = 2000;

    const calcResult = calculateWafer(params);
    setResult({ ...calcResult, targetDPW });
    setStatus('completed');
  };

  const tabs = [
    { id: 'theory', key: 'tabs.theory' },
    { id: 'overview', key: 'tabs.overview' },
    { id: 'equipment', key: 'tabs.equipment' },
    { id: 'principle', key: 'tabs.principle' },
    { id: 'basic', key: 'tabs.basic' },
    { id: 'intermediate', key: 'tabs.intermediate' },
    { id: 'advanced', key: 'tabs.advanced' },
    { id: 'test', key: 'tabs.test' },
    { id: 'evaluation', key: 'tabs.evaluation' },
  ];

  const isPracticeTab = ['basic', 'intermediate', 'advanced'].includes(activeTab);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 gap-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t('wafer.title')}</h1>
          <p className="text-slate-400 mt-1">{t('wafer.desc')}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-800 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (['basic', 'intermediate', 'advanced'].includes(tab.id)) {
                setStatus('idle'); setResult(null);
              }
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      {isPracticeTab && (
        <div className="flex flex-1 min-h-0 flex-col gap-5 overflow-y-auto">
        <EquipmentHMI
          processId="wafer"
          equipmentName="CZ Crystal Puller · 단결정 성장로"
          recipeName={activeTab === 'advanced' ? 'CZ-300 ULTRA FINE' : activeTab === 'intermediate' ? 'CZ-300 HIGH YIELD' : 'CZ-300 TRAINING'}
          metrics={[
            { id:'temp', label:'Melt Temperature', unit:'°C', setpoint:1420, actual:25, tolerance:3 },
            { id:'heater', label:'Heater Power', unit:'%', setpoint:82, actual:0, tolerance:2 },
            { id:'pull', label:'Pull Rate', unit:'mm/min', setpoint:1.2, actual:0, tolerance:0.08 },
            { id:'seed', label:'Seed Rotation', unit:'rpm', setpoint:15, actual:0, tolerance:1 },
          ]}
          processSteps={['자가진단 및 Ar 퍼지','실리콘 용융','시드 접촉','Neck 성장','Body 직경 제어','Tail 및 냉각']}
          hazards={['고온 1420°C','고전류 히터','Ar 질식 위험','도가니 회전부']}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
             <div className="bg-indigo-950 border border-indigo-800/50 p-4 rounded-xl">
              <h4 className="text-indigo-400 font-semibold mb-1">
                {activeTab === 'basic' ? 'Level 1: Basic DPW' : 
                 activeTab === 'intermediate' ? 'Level 2: Maximize Output' : 
                 'Level 3: Micro Die Challenge'}
              </h4>
              <p className="text-slate-300 text-sm">
                 {activeTab === 'basic' ? 'Calculate how many 10x10mm dies fit on a 300mm wafer.' : 
                  activeTab === 'intermediate' ? 'Adjust die size to yield at least 1000 dies per wafer.' : 
                  'Design ultra-small dies to reach 2000 DPW target.'}
              </p>
            </div>
            <ParameterPanel params={params} setParams={setParams} status={status} onStart={handleStart} />
            {result && <MeasurementPanel result={result} />}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
               <WaferVisualization params={params} result={result} />
            </div>
          </div>
        </div>
        </div>
      )}

      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="wafer" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="wafer" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="wafer" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="wafer" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
