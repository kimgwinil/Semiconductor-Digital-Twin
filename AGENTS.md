# Agent Instructions (AGENTS.md)

미래의 Claude, ChatGPT, Gemini 등 Coding Agent가 이 프로젝트를 수정하거나 고도화할 때 반드시 지켜야 하는 규칙입니다.

## 1. 코어 원칙
- **기존 기능 삭제 금지**: 기존에 구현된 교육용 탭, 시뮬레이션 로직 등을 임의로 삭제하지 마십시오.
- **물리 모델 임의 변경 금지**: 단순 Random 값을 발생시키도록 Simulation 코드를 바꾸지 마십시오. 모델을 수정할 경우 반드시 `SIMULATION_MODELS.md`를 먼저 업데이트하십시오.
- **Simulation Engine과 UI의 분리**: React Component(`*.tsx`) 내부에서 물리량/수학 식을 직접 계산하지 마십시오. 반드시 `/src/simulation/models` 내부의 함수를 호출하여 반환된 객체를 UI에서 렌더링하도록 유지하십시오.

## 2. 확장 가이드
- **신규 Module 추가**: Oxidation Module(`src/modules/oxidation`)의 디렉토리 구조와 설계 패턴(ParameterPanel, Visualization, ResultChart, MeasurementPanel 분리)을 그대로 본따서 구현하십시오.
- **신규 Parameter 추가**: Parameter 추가 시 반드시 TypeScript Type 정의(`src/types/index.ts`)와 다국어 파일(`ko.json`, `en.json`)을 동시 업데이트하십시오.
- **보안 및 환경 변수**: `.env` 파일에 API Key나 Secret을 추가하되, 클라이언트 브라우저 노출을 방지하기 위해 서버 측 로직 분리를 고려하십시오. 학생 점수나 개인정보 로그(`console.log`) 출력을 절대 금지합니다.

## 3. 테스트
- 주요 Simulation 함수 (예: 식각률 계산, 이온 주입량 계산) 작성 시 가급적 관련 단위 테스트 코드를 작성하여 무결성을 검증하십시오.
