import React from 'react';
import { ProcessTrainingModule } from '../../components/equipment/ProcessTrainingModule';

export function DepositionModule() {
  return <ProcessTrainingModule config={{
    processId:'deposition',
    title:'증착 & 이온주입 (Deposition & Ion Implantation)', description:'박막 형성과 도펀트 주입을 실제 진공장비 운전 순서로 학습합니다.',
    equipmentName:'Cluster PVD/CVD & Ion Implanter', recipeName:'PVD-TiN / IMPLANT-B',
    metrics:[
      {id:'pressure',label:'Chamber Pressure',unit:'mTorr',setpoint:5,actual:760000,tolerance:0.5},
      {id:'power',label:'RF / DC Power',unit:'W',setpoint:750,actual:0,tolerance:15},
      {id:'flow',label:'Process Gas Flow',unit:'sccm',setpoint:45,actual:0,tolerance:2},
      {id:'dose',label:'Implant Dose',unit:'E13/cm²',setpoint:5,actual:0,tolerance:0.2}],
    steps:['Load-lock 배기','Pre-clean','Target pre-sputter','박막 증착','Implant energy/dose 설정','Anneal·언로드'],
    hazards:['고전압 이온원','진공 내파','독성/가연성 가스','RF·고온 표면'],
    principles:['CVD는 표면 화학반응, PVD는 물리적 기상수송으로 막을 형성','막두께와 균일도는 전력·압력·유량·시간의 함수','이온 에너지는 접합 깊이, Dose는 활성 도펀트 농도를 지배'],
    defects:['Particle·pin-hole','Step coverage 불량','Channeling 및 dose 오차','막 응력·박리'],
    checklist:['가스 캐비닛과 배기 확인','Load-lock base pressure 확인','Target/wafer ID 대조','막두께·4-point probe·SIMS 결과 기록']
  }}/>;
}
