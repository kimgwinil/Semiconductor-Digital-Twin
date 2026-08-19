import React from 'react';
import { ProcessTrainingModule } from '../../components/equipment/ProcessTrainingModule';

export function MetallizationModule() {
  return <ProcessTrainingModule config={{
    processId:'metallization',
    title:'금속배선 (Metal Interconnect)', description:'Barrier/Seed, Cu 충진, CMP 및 배선 전기검사를 통합 실습합니다.',
    equipmentName:'Cu Electroplating & CMP Cluster', recipeName:'DUAL DAMASCENE CU',
    metrics:[
      {id:'seed',label:'Seed Thickness',unit:'nm',setpoint:80,actual:0,tolerance:4},
      {id:'current',label:'Plating Current',unit:'A',setpoint:12,actual:0,tolerance:0.4},
      {id:'flow',label:'Electrolyte Flow',unit:'L/min',setpoint:8,actual:0,tolerance:0.3},
      {id:'resistance',label:'Line Resistance',unit:'Ω',setpoint:0.18,actual:0,tolerance:0.02}],
    steps:['Via/Trench 세정','Barrier 증착','Cu Seed 증착','Electroplating 충진','Anneal','CMP·Open/Short 검사'],
    hazards:['도금액 화학물질','회전체 끼임','고전류 전원','CMP slurry 노출'],
    principles:['Barrier는 Cu 확산을 차단하고 Seed는 연속 도금 경로를 형성','전류밀도와 유동은 via bottom-up fill과 void 발생을 좌우','배선 저항은 재료 비저항·길이·단면적의 함수'],
    defects:['Via void/seam','Overburden 및 dishing','Open/short','Electromigration 취약부'],
    checklist:['Barrier/Seed 연속성 확인','도금액 농도·온도 확인','CMP endpoint와 평탄도 확인','Kelvin 저항 및 open/short map 기록']
  }}/>;
}
