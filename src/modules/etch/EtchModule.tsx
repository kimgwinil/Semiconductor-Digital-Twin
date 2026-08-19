import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { WaferVisualization } from './components/WaferVisualization';
import { MeasurementPanel } from './components/MeasurementPanel';
import { calculateEtch } from '../../simulation/models/etch';
import { generateMeasurementNoise } from '../../simulation/utils/noise';

import koContent from '../../content/ko/etching.json';
import enContent from '../../content/en/etching.json';
import equipImage from '../../assets/images/equip_etch.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function EtchModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  
  // Simulation State
  const [params, setParams] = useState({
    rfPower: 500, // W
    pressure: 50, // mTorr
    time: 60 // sec
  });
  
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  
  const [result, setResult] = useState<{
    etchDepth: number;
    measuredDepth: number;
    undercut: number;
    anisotropy: number;
    targetDepth: number;
  } | null>(null);

  const handleStart = () => {
    setStatus('running');
    setProgress(0);
    setResult(null);

    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          completeProcess();
          return 100;
        }
        return p + 10;
      });
    }, 150);
  };

  const completeProcess = () => {
    // Vary target based on practice level
    let targetDepth = 300; 
    if (activeTab === 'intermediate') targetDepth = 500;
    if (activeTab === 'advanced') targetDepth = 800;

    const calcResult = calculateEtch({
      rfPower: params.rfPower,
      pressure: params.pressure,
      timeSec: params.time
    });

    const measuredDepth = generateMeasurementNoise(calcResult.etchDepth, 0.02);
    
    setResult({
      etchDepth: calcResult.etchDepth,
      measuredDepth,
      undercut: calcResult.undercut,
      anisotropy: calcResult.anisotropy,
      targetDepth
    });
    
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
          <h1 className="text-2xl font-bold text-slate-100">{t('etching.title')}</h1>
          <p className="text-slate-400 mt-1">{t('etching.desc')}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-800 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              if (['basic', 'intermediate', 'advanced'].includes(tab.id)) {
                setStatus('idle');
                setResult(null);
              }
            }}
            className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>

      {isPracticeTab && (
        <div className="flex flex-1 min-h-0 flex-col gap-5 overflow-y-auto">
        <EquipmentHMI processId="etch" equipmentName="ICP-RIE Plasma Etcher" recipeName={`RIE ${params.rfPower}W · ${params.pressure}mTorr`}
          metrics={[{id:'pressure',label:'Chamber Pressure',unit:'mTorr',setpoint:params.pressure,actual:760000,tolerance:2},{id:'rf',label:'RF Bias Power',unit:'W',setpoint:params.rfPower,actual:0,tolerance:10},{id:'gas',label:'CF₄/O₂ Gas Flow',unit:'sccm',setpoint:55,actual:0,tolerance:2},{id:'endpoint',label:'Endpoint Signal',unit:'%',setpoint:92,actual:0,tolerance:3}]}
          processSteps={['Load-lock 배기','Wafer clamp','Base vacuum','Gas stabilization','RF plasma etch','Endpoint·purge·vent']} hazards={['RF 고전압','부식성 가스','진공 내파','플라즈마 UV']}/>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-amber-950 border border-amber-800/50 p-4 rounded-xl">
              <h4 className="text-amber-400 font-semibold mb-1">
                {activeTab === 'basic' ? 'Level 1: Basic Etch Rate' : 
                 activeTab === 'intermediate' ? 'Level 2: Target Depth Control' : 
                 'Level 3: Anisotropy Optimization'}
              </h4>
              <p className="text-slate-300 text-sm">
                {activeTab === 'basic' ? 'Learn how RF Power affects the overall etch depth.' : 
                 activeTab === 'intermediate' ? 'Hit the 500nm target while keeping anisotropy above 0.6.' : 
                 'Etch a deep 800nm trench. You must strictly control pressure to minimize undercut.'}
              </p>
            </div>
            <ParameterPanel 
              params={params} 
              setParams={setParams} 
              status={status}
              onStart={handleStart}
            />
            {result && <MeasurementPanel result={result} />}
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-64 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
              <WaferVisualization status={status} progress={progress} params={params} result={result} />
            </div>
            
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[300px] flex items-center justify-center">
               <p className="text-slate-500">Chart implementation (Time vs Etch Depth) placeholder.</p>
            </div>
          </div>
        </div>
        </div>
      )}

      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="etch" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="etch" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="etch" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="etch" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
