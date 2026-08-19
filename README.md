# Semiconductor 8 Process Digital Twin Training Simulator

## 프로젝트 개요 / Project Overview
본 프로젝트는 반도체 8대 공정의 원리와 장비 구조를 기반으로 하는 **교육용 Engineering Simulator**입니다. 단순 애니메이션이 아닌 실제 공정 Parameter에 따른 물리/수학적 계산 결과를 실시간으로 제공하며, 공정 변수 최적화 및 문제 해결 능력을 기르는 것을 목표로 합니다.

## 아키텍처 원칙 / Architectural Principles
1. **Simulation & UI Separation**: 수치해석/물리모델 엔진과 React UI 렌더링을 완전히 분리합니다.
2. **Deterministic Physics**: Random이 아닌 수학 모델(예: Deal-Grove Model)을 기반으로 실제값(Process Actual)을 계산합니다.
3. **Measurement System**: 현실 세계의 계측 오차를 반영하여 실제값과 계측값(Measured Value)을 분리합니다.
4. **Digital Thread**: 앞 공정의 결과(Wafer State)가 다음 공정으로 연결되는 구조를 갖습니다.

## 주요 기능 / Key Features
- **다국어 지원 (i18n)**: 한국어/영어 실시간 전환
- **공정 파라미터 제어**: 온도, 시간, 가스 등 장비 조작
- **동적 시각화**: Wafer 단면 및 장비 애니메이션
- **데이터 분석**: Recharts를 이용한 공정 결과 트렌드 그래프
- **학생/교수자 권한**: 향후 Dashboard 및 평가 시스템 연동

## 개발 및 설치 / Setup & Run
```bash
npm install
npm run dev
```

## 모듈 구현 현황 / Module Status
- [ ] Module 01: Wafer Manufacturing
- [x] Module 02: Oxidation (Reference Module 완벽 구현)
- [x] Module 03: Photolithography (Rayleigh & Dose Model 구현)
- [x] Module 04: Etching (RIE, Anisotropy Model 구현)
- [ ] Module 05: Deposition & Ion Implantation
- [ ] Module 06: Metal Interconnect
- [ ] Module 07: EDS
- [ ] Module 08: Packaging

## 향후 확장 (AI Agent Guide)
AGENTS.md 및 ARCHITECTURE.md 파일을 참조하여 향후 코딩 에이전트가 시스템을 안전하게 확장할 수 있도록 설계되었습니다.
