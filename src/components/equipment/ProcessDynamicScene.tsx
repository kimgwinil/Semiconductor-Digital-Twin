import React from 'react';
import { processProfiles, type ProcessId } from '../../content/processProfiles';
import { equipmentImages, hotspotPositions } from '../education/AdvancedProcessEducation';
import type { HmiMetric } from '../../simulation/models/equipmentHmi';

const sceneIds:Record<ProcessId,string>={
  wafer:'wafer-cz',oxidation:'oxidation-furnace',lithography:'lithography-scanner',etch:'etch-rie',
  deposition:'deposition-cluster',metallization:'metallization-plating-cmp',eds:'eds-prober',packaging:'packaging-bond-mold'
};

const activityNames:Record<ProcessId,string>={
  wafer:'Seed 인상·도가니 역회전',oxidation:'O₂/H₂O 가스·열 확산',lithography:'Reticle–Lens–Stage 동기 주사',etch:'ICP Plasma·Ion bias',
  deposition:'Robot transfer·증착/주입',metallization:'Cu 도금·CMP 연마',eds:'Probe contact·Die scan',packaging:'Die/Wire bond·Mold press'
};

type FlowSpec={d:string;color:string;label:string};
const equipmentFlows:Record<ProcessId,FlowSpec[]>={
  wafer:[
    {d:'M50 59 L50 20',color:'#f8fafc',label:'Seed/Crystal 인상'},
    {d:'M38 60 C40 70 60 70 63 60 C60 53 42 53 38 60',color:'#fb923c',label:'용융 Si·도가니 역회전'},
    {d:'M80 67 C72 58 72 44 78 34',color:'#67e8f9',label:'Ar purge·배기'}],
  oxidation:[
    {d:'M8 51 C24 48 43 48 88 51',color:'#67e8f9',label:'O₂/H₂O 공정가스'},
    {d:'M18 38 C38 31 65 31 84 39',color:'#fb923c',label:'3-Zone 열전달'},
    {d:'M88 57 C70 61 36 61 10 57',color:'#a7f3d0',label:'N₂ purge·배기'}],
  lithography:[
    {d:'M50 18 L50 29 L50 43 L50 67',color:'#e879f9',label:'ArF 광학 경로'},
    {d:'M26 69 C40 73 58 73 75 69',color:'#67e8f9',label:'Wafer stage scan'},
    {d:'M27 53 C36 50 43 48 50 43',color:'#fde68a',label:'Alignment 검출'}],
  etch:[
    {d:'M51 13 C42 23 42 31 50 39',color:'#67e8f9',label:'Process gas'},
    {d:'M50 34 L50 67',color:'#e879f9',label:'Ion/Radical 수직 입사'},
    {d:'M51 69 C43 72 34 67 25 58',color:'#a7f3d0',label:'Throttle·진공배기'}],
  deposition:[
    {d:'M76 45 C65 48 58 54 50 58 C38 60 27 58 19 58',color:'#67e8f9',label:'Wafer robot transfer'},
    {d:'M37 33 L37 51',color:'#fde68a',label:'PVD/CVD source flux'},
    {d:'M86 41 C75 42 65 47 56 55',color:'#f472b6',label:'Mass-selected ion beam'}],
  metallization:[
    {d:'M18 31 C14 40 20 52 49 52',color:'#fb923c',label:'Barrier/Seed→Cu plating'},
    {d:'M48 35 C55 42 68 47 83 47',color:'#67e8f9',label:'Wafer transfer→CMP'},
    {d:'M73 48 C78 39 89 39 92 49 C88 58 77 58 73 48',color:'#a7f3d0',label:'Slurry·Platen 회전'}],
  eds:[
    {d:'M43 34 L47 54',color:'#fde68a',label:'Probe needle contact'},
    {d:'M32 55 C39 47 55 47 65 55 C58 68 40 69 32 55',color:'#67e8f9',label:'Die coordinate scan'},
    {d:'M49 55 C62 56 71 56 82 56',color:'#a7f3d0',label:'ATE 신호·Bin data'}],
  packaging:[
    {d:'M34 45 C31 54 36 60 47 61',color:'#fde68a',label:'Die pick & place'},
    {d:'M39 49 C44 42 52 45 55 57',color:'#fbbf24',label:'Wire bond loop'},
    {d:'M54 58 C63 53 68 47 74 43',color:'#67e8f9',label:'Transfer→Mold press'}]
};

function ActuatorOverlay({processId}:{processId:ProcessId}) {
  if(processId==='wafer') return <div className="actuator wafer-actuator"><i className="wafer-shaft"/><i className="wafer-crystal"/><i className="wafer-melt"/></div>;
  if(processId==='oxidation') return <div className="actuator oxidation-actuator"><i/><i/><i/><span>O₂ / H₂O →</span></div>;
  if(processId==='lithography') return <div className="actuator lith-actuator"><i className="lith-scan-beam"/><i className="lith-moving-stage"/></div>;
  if(processId==='etch') return <div className="actuator etch-actuator"><i className="etch-plasma-cloud"/><i className="etch-ion-stream">↓↓↓↓↓</i></div>;
  if(processId==='deposition') return <div className="actuator deposition-actuator"><i className="depo-robot-arm"/><i className="depo-moving-wafer"/><i className="depo-beam"/></div>;
  if(processId==='metallization') return <div className="actuator metal-actuator"><i className="metal-bubbles">○ ○ ○</i><i className="metal-cmp-disc"/></div>;
  if(processId==='eds') return <div className="actuator eds-actuator"><i className="eds-probe-bank"/><i className="eds-scan-line"/></div>;
  return <div className="actuator package-actuator"><i className="package-bond-head"/><i className="package-wire"/><i className="package-press"/></div>;
}

export function ProcessDynamicScene({processId,running,step,fault,metrics=[]}:{processId:ProcessId;running:boolean;step:number;fault:boolean;metrics?:HmiMetric[]}) {
  const profile=processProfiles[processId];
  const points=hotspotPositions[processId];
  const active=step%points.length;
  const flows=equipmentFlows[processId];
  const proximity=metrics.length?metrics.reduce((sum,m)=>sum+Math.max(0,1-Math.abs(m.actual-m.setpoint)/Math.max(Math.abs(m.setpoint),m.tolerance,1)),0)/metrics.length:0;
  const motionSeconds=(2.6-proximity*1.35).toFixed(2);
  return <div style={{'--motion-seconds':`${motionSeconds}s`} as React.CSSProperties} className={`equipment-image-simulator ${running?'is-running':''} ${fault?'has-fault':''}`} data-process-scene={sceneIds[processId]}>
    <img key={`sim-${processId}`} loading="eager" fetchPriority="high" src={`${equipmentImages[processId]}?v=20260819-3`} alt={`${profile.equipment} 실습 시뮬레이터 본체`} className="equipment-simulator-image"/>
    <div className="equipment-simulator-vignette"/>
    <ActuatorOverlay processId={processId}/>
    <svg className="equipment-flow-layer" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      <defs><marker id={`arrow-${processId}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill={fault?'#ef4444':'#cffafe'}/></marker></defs>
      {flows.map((flow,index)=><path key={flow.label} className={`registered-flow ${running?'is-flowing':''} ${index===step%flows.length?'is-current':''}`} d={flow.d} fill="none" stroke={fault?'#ef4444':flow.color} strokeWidth={index===step%flows.length?'1.15':'.62'} strokeDasharray="3 2" markerEnd={`url(#arrow-${processId})`} vectorEffect="non-scaling-stroke"><title>{flow.label}</title></path>)}
    </svg>
    <div className="equipment-live-title"><strong>{profile.equipment}</strong><span>{running?'● LIVE OPERATION':'○ READY / 설정 후 운전'}</span></div>
    <div className="sim-flow-legend">{flows.map((flow,index)=><span key={flow.label} className={index===step%flows.length&&running?'active':''}><i style={{background:flow.color}}/>{flow.label}</span>)}</div>
    {profile.components.map((component,index)=>{
      const point=points[index]||{x:50,y:50};
      return <div key={component.name} className={`sim-component ${active===index&&running?'is-active':''}`} style={{left:`${point.x}%`,top:`${point.y}%`}}>
        <span>{index+1}</span><label>{component.name}</label>
      </div>;
    })}
    <div className="sim-operation-panel"><span>현재 동작</span><strong>{running?activityNames[processId]:'SP 조정 → POWER → LOAD → RUN'}</strong><small>{running?`${step+1}단계 · ${profile.overview[Math.min(step,profile.overview.length-1)]}`:'장비 구성품 위치와 운전 경로가 실습 단계에 따라 활성화됩니다.'}</small></div>
    {fault&&<div className="sim-fault-overlay">ALARM · 비정상 설정/장비 이상</div>}
  </div>;
}
