import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { WaferVisualization } from './components/WaferVisualization';
import { MeasurementPanel } from './components/MeasurementPanel';
import { ResultChart } from './components/ResultChart';
import { calculateOxideThickness } from '../../simulation/models/oxidation';
import { generateMeasurementNoise } from '../../simulation/utils/noise';

import koContent from '../../content/ko/oxidation.json';
import enContent from '../../content/en/oxidation.json';
import equipImage from '../../assets/images/equip_oxidation.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function OxidationModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  
  // Simulation State
  const [params, setParams] = useState({
    temperature: 1000,
    time: 60,
    isWet: false
  });
  
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  
  const [result, setResult] = useState<{
    actual: number;
    measured: number;
    target: number;
  } | null>(null);

  const [history, setHistory] = useState<any[]>([]);

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
    }, 200);
  };

  const completeProcess = () => {
    const calcResult = calculateOxideThickness({
      temperature: params.temperature,
      timeMin: params.time,
      isWet: params.isWet,
      initialOxideNm: 0
    });

    const measured = generateMeasurementNoise(calcResult.actualThicknessNm, 0.02);
    
    // Vary target based on practice level
    let target = 100;
    if (activeTab === 'intermediate') target = 250;
    if (activeTab === 'advanced') target = 500;
    if (params.isWet && activeTab === 'basic') target = 500;

    const newResult = {
      actual: calcResult.actualThicknessNm,
      measured: measured,
      target: target
    };
    
    setResult(newResult);
    setStatus('completed');
    
    setHistory(prev => [...prev, {
      time: params.time,
      thickness: newResult.measured,
      temp: params.temperature,
      type: params.isWet ? 'Wet' : 'Dry'
    }]);
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
          <h1 className="text-2xl font-bold text-slate-100">{t('oxidation.title')}</h1>
          <p className="text-slate-400 mt-1">{t('oxidation.desc')}</p>
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
        <EquipmentHMI
          processId="oxidation"
          equipmentName="Horizontal Oxidation Furnace · 산화 확산로"
          recipeName={`${params.isWet ? 'WET' : 'DRY'} OX · ${params.temperature}°C`}
          metrics={[
            { id:'temp', label:'Furnace Temperature', unit:'°C', setpoint:params.temperature, actual:25, tolerance:2 },
            { id:'pressure', label:'Tube Pressure', unit:'Torr', setpoint:760, actual:760, tolerance:5 },
            { id:'o2', label:'O₂ Flow', unit:'slm', setpoint:params.isWet ? 2.0 : 4.5, actual:0, tolerance:0.15 },
            { id:'steam', label:'H₂O Vapor', unit:'slm', setpoint:params.isWet ? 3.5 : 0, actual:0, tolerance:0.12 },
          ]}
          processSteps={['전원 및 배기 확인','Boat 로드·도어 잠금','N₂ 퍼지','온도 안정화','산화 가스 투입','퍼지·냉각·언로드']}
          hazards={['고온 화상','O₂ 산화성 가스','Wet oxidation 증기','Quartz 파손 위험']}
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-cyan-950 border border-cyan-800/50 p-4 rounded-xl">
              <h4 className="text-cyan-400 font-semibold mb-1">
                {activeTab === 'basic' ? 'Level 1: Basic Practice' : 
                 activeTab === 'intermediate' ? 'Level 2: Intermediate Challenge' : 
                 'Level 3: Advanced Optimization'}
              </h4>
              <p className="text-slate-300 text-sm">
                {activeTab === 'basic' ? 'Learn the basic operation of the furnace.' : 
                 activeTab === 'intermediate' ? 'Achieve the target thickness by finding the right combination of temperature and time.' : 
                 'Optimize the recipe to meet strict thickness uniformity and time limits.'}
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
              <WaferVisualization 
                status={status} 
                progress={progress} 
                params={params}
                result={result ? { oxideThickness: result.measured } : null}
              />
            </div>
            
            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl p-4 min-h-[300px]">
              <ResultChart data={history} />
            </div>
          </div>
        </div>
        </div>
      )}

      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="oxidation" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="oxidation" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="oxidation" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="oxidation" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
