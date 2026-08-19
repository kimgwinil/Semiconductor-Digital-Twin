import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ParameterPanel } from './components/ParameterPanel';
import { MeasurementPanel } from './components/MeasurementPanel';
import { PackagingVisualization } from './components/PackagingVisualization';
import { calculatePackaging } from '../../simulation/models/packaging';

import koContent from '../../content/ko/packaging.json';
import enContent from '../../content/en/packaging.json';
import equipImage from '../../assets/images/equip_packaging.jpg';
import { TheoryView } from '../../components/education/TheoryView';
import { EquipmentView } from '../../components/education/EquipmentView';
import { QuizView } from '../../components/education/QuizView';
import { EvaluationView } from '../../components/education/EvaluationView';
import { EquipmentHMI } from '../../components/equipment/EquipmentHMI';
import { AdvancedProcessEducation } from '../../components/education/AdvancedProcessEducation';

export function PackagingModule() {
  const { t, i18n } = useTranslation();
  const content = i18n.language === 'ko' ? koContent : enContent;
  
  const [activeTab, setActiveTab] = useState('theory');
  const [params, setParams] = useState({ power: 5, thermalResistance: 15, ambientTemp: 25 });
  const [status, setStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [result, setResult] = useState<any>(null);

  const handleStart = () => {
    setStatus('running');
    setTimeout(() => {
      const calc = calculatePackaging(params);
      setResult(calc);
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
          <h1 className="text-2xl font-bold text-slate-100">{t('packaging.title')}</h1>
          <p className="text-slate-400 mt-1">{t('packaging.desc')}</p>
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
        <EquipmentHMI processId="packaging" equipmentName="Die Bonder & Wire Bonder Cell" recipeName="DIE ATTACH · Au WIRE · MOLD"
          metrics={[{id:'force',label:'Bond Force',unit:'gf',setpoint:35,actual:0,tolerance:2},{id:'temp',label:'Bond Stage Temp',unit:'°C',setpoint:180,actual:25,tolerance:3},{id:'time',label:'Bond Time',unit:'ms',setpoint:42,actual:0,tolerance:3},{id:'pull',label:'Wire Pull Strength',unit:'gf',setpoint:8,actual:0,tolerance:0.5}]}
          processSteps={['Substrate load','Die attach','Epoxy cure','Wire bonding','Molding·deflash','X-ray·pull/shear 검사']} hazards={['가열 Stage','미세 Capillary','Epoxy 화학물질','Press/금형 끼임']}/>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[520px]">
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <ParameterPanel params={params} setParams={setParams} status={status} onStart={handleStart} />
            {result && <MeasurementPanel result={result} />}
          </div>
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="h-[400px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative">
               <PackagingVisualization status={status} result={result} />
            </div>
          </div>
        </div>
        </div>
      )}
      {!isPracticeTab && (
        <div className="flex-1 flex overflow-hidden">
          {activeTab === 'theory' && <AdvancedProcessEducation processId="packaging" mode="theory" existing={content.theory} />}
          {activeTab === 'overview' && <AdvancedProcessEducation processId="packaging" mode="overview" existing={content.overview} />}
          {activeTab === 'equipment' && <AdvancedProcessEducation processId="packaging" mode="equipment" />}
          {activeTab === 'principle' && <AdvancedProcessEducation processId="packaging" mode="principle" existing={content.principle} />}
          {activeTab === 'test' && <QuizView questions={content.test} />}
          {activeTab === 'evaluation' && <EvaluationView />}
        </div>
      )}
    </div>
  );
}
