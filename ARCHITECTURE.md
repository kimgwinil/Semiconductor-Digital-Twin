# Architecture Overview

## 1. Directory Structure

- `src/components/layout`: 글로벌 UI (Sidebar, Header, Registration)
- `src/context`: 앱 전반의 상태 관리 (User, Wafer Thread)
- `src/i18n`, `src/locales`: 다국어 지원 시스템
- `src/lib/utils.ts`: Tailwind 병합 등 범용 유틸리티
- `src/modules/*`: 반도체 8대 공정별 독립 모듈
  - `components/`: 모듈에 종속된 UI (컨트롤 패널, 차트, 시각화)
  - `[ModuleName]Module.tsx`: 해당 모듈의 컨테이너 (상태 관리 및 조립)
- `src/simulation`: UI와 독립된 코어 물리 엔진
  - `models/`: Deal-Grove 등 수학적 공정 모델
  - `utils/`: 노이즈 생성 등 시뮬레이션 지원 함수
- `src/types`: 글로벌 TypeScript 인터페이스

## 2. Data Flow
1. 사용자가 `ParameterPanel`에서 입력값(Set Point) 변경
2. `onStart` 호출 시 UI 상태가 'running'으로 전환
3. 타이머 완료 후 `simulation/models/*`의 순수 함수(Pure Function) 호출
4. 계산된 Actual Value에 `noise`를 추가하여 Measured Value 생성
5. 결과를 Local State에 반영하고 `WaferVisualization`, `MeasurementPanel`, `ResultChart`가 업데이트됨
6. (향후 확장) 최종 공정 결과가 `WaferContext`의 Process History에 저장되어 다음 모듈로 전달 (Digital Thread)
