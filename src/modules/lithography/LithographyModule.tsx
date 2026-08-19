import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { WaferVisualization } from './components/WaferVisualization';
import { MeasurementPanel } from './components/MeasurementPanel';
import { calculateLithography } from '../../simulation/models/lithography';
import { generateMeasurementNoise } from '../../simulation/utils/noise';

import koContent from '../../content/ko/lithography.json';
import enContent from '../../content/en/lithography.json';
import equipImage from '../../assets/images/equip_lithography.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function LithographyModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  
  // Simulation State
  const [params, setParams] = useState({
    wavelength: 193, // ArF
    na: 0.8,
    dose: 30
  });
  
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [progress, setProgress] = useState(0);
  
  const [result, setResult] = useState<{
    actualCD: number;
    measuredCD: number;
    resolutionLimit: number;
    targetCD: number;
    isFailed: boolean;
    message: string;
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
    }, 150); // fast simulation
  };

  const completeProcess = () => {
    // Vary target based on practice level
    let targetCD = 100; // Basic target
    if (activeTab === 'intermediate') targetCD = 65;
    if (activeTab === 'advanced') targetCD = 45;

    const calcResult = calculateLithography({
      wavelength: params.wavelength,
      na: params.na,
      dose: params.dose,
      targetCD
    });

    const measuredCD = calcResult.isResolutionFailed ? 0 : generateMeasurementNoise(calcResult.actualCD, 0.02);
    
    setResult({
      actualCD: calcResult.actualCD,
      measuredCD,
      resolutionLimit: calcResult.resolutionLimit,
      targetCD,
      isFailed: calcResult.isResolutionFailed,
      message: calcResult.message
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
          <h1 className="text-2xl font-bold text-slate-100">{t('lithography.title')}</h1>
          <p className="text-slate-400 mt-1">{t('lithography.desc')}</p>
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
        <EquipmentHMI processId="lithography" equipmentName="ArF Stepper / Scanner" recipeName={`ArF ${params.wavelength}nm · CD ${activeTab==='advanced'?45:activeTab==='intermediate'?65:100}nm`}
          metrics={[{id:'dose',label:'Exposure Dose',unit:'mJ/cm²',setpoint:params.dose,actual:0,tolerance:1},{id:'focus',label:'Focus Offset',unit:'nm',setpoint:0,actual:0,tolerance:8},{id:'overlay',label:'Overlay Error',unit:'nm',setpoint:5,actual:0,tolerance:2},{id:'vacuum',label:'Wafer Stage Vacuum',unit:'kPa',setpoint:80,actual:0,tolerance:3}]}
          processSteps={['Coat·soft bake','Wafer load·vacuum chuck','Alignment','Focus leveling','Exposure scan','PEB·develop·CD inspection']} hazards={['ArF UV 광원','고속 스테이지','진공 chuck','PR 용제']}/>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[560px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-fuchsia-950 border border-fuchsia-800/50 p-4 rounded-xl">
              <h4 className="text-fuchsia-400 font-semibold mb-1">
                {activeTab === 'basic' ? 'Level 1: Basic Resolution' : 
                 activeTab === 'intermediate' ? 'Level 2: Finer Patterns' : 
                 'Level 3: Advanced EUV/ArF Tuning'}
              </h4>
              <p className="text-slate-300 text-sm">
                {activeTab === 'basic' ? 'Draw a stable 100nm line using optimal dose.' : 
                 activeTab === 'intermediate' ? 'Push the limits of ArF limits to hit 65nm.' : 
                 'Adjust Wavelength and NA to achieve a 45nm CD without pattern collapse.'}
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
               <p className="text-slate-500">Chart implementation (Dose vs CD) placeholder.</p>
            </div>
          </div>
        </div>
        </div>
      )}

      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="lithography" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="lithography" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="lithography" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="lithography" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
