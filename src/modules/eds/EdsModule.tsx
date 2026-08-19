import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { MeasurementPanel } from './components/MeasurementPanel';
import { WaferMapVisualization } from './components/WaferMapVisualization';
import { calculateEDS } from '../../simulation/models/eds';

import koContent from '../../content/ko/eds.json';
import enContent from '../../content/en/eds.json';
import equipImage from '../../assets/images/equip_eds.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function EdsModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  const [params, setParams] = useState({ defectDensity: 0.5, dieArea: 1.0 });
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleStart = () => {
    setStatus('running');
    setTimeout(() => {
      const totalDies = 500; // Mock total dies for 300mm wafer assumption
      const calc = calculateEDS({ totalDies, dieAreaMm2: params.dieArea * 100, defectDensity: params.defectDensity });
      setResult({ ...calc, totalDies });
      setStatus('completed');
    }, 800);
  };

  const tabs = [
    { id: 'theory', key: 'tabs.theory' }, { id: 'overview', key: 'tabs.overview' }, { id: 'equipment', key: 'tabs.equipment' },
    { id: 'principle', key: 'tabs.principle' }, { id: 'basic', key: 'tabs.basic' },
    { id: 'intermediate', key: 'tabs.intermediate' }, { id: 'advanced', key: 'tabs.advanced' },
    { id: 'test', key: 'tabs.test' }, { id: 'evaluation', key: 'tabs.evaluation' },
  ];
  const isPracticeTab = ['basic', 'intermediate', 'advanced'].includes(activeTab);

  return (
    <div className="flex flex-col h-full bg-slate-950 p-6 gap-6">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">{t('eds.title')}</h1>
          <p className="text-slate-400 mt-1">{t('eds.desc')}</p>
        </div>
      </div>
      <div className="flex border-b border-slate-800 overflow-x-auto shrink-0">
        {tabs.map(tab => (
          <button key={tab.id}
            onClick={() => { setActiveTab(tab.id); if (isPracticeTab) { setStatus('idle'); setResult(null); } }}
            className={`px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            {t(tab.key)}
          </button>
        ))}
      </div>
      {isPracticeTab && (
        <div className="flex flex-1 min-h-0 flex-col gap-5 overflow-y-auto">
        <EquipmentHMI processId="eds" equipmentName="Automatic Wafer Prober & ATE" recipeName="WAFER SORT · PARAMETRIC + FUNCTIONAL"
          metrics={[{id:'force',label:'Probe Contact Force',unit:'gf',setpoint:7,actual:0,tolerance:0.5},{id:'temp',label:'Chuck Temperature',unit:'°C',setpoint:25,actual:20,tolerance:1},{id:'leak',label:'Leakage Limit',unit:'nA',setpoint:10,actual:0,tolerance:2},{id:'timing',label:'Test Clock',unit:'MHz',setpoint:500,actual:0,tolerance:5}]}
          processSteps={['Wafer ID 확인','Notch alignment','Prober contact','Parametric test','Functional/binning','Map 저장·unload']} hazards={['미세 Probe 손상','Chuck 이동부','정전기 ESD','고속 신호/전원']}/>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <ParameterPanel params={params} setParams={setParams} status={status} onStart={handleStart} />
            {result && <MeasurementPanel result={result} />}
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
               <WaferMapVisualization status={status} result={result} />
            </div>
          </div>
        </div>
        </div>
      )}
      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="eds" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="eds" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="eds" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="eds" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
