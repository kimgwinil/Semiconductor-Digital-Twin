# Simulation Models Documentation

본 문서는 시뮬레이터 내부의 `/src/simulation/models`에 구현된 수학적/물리적 모델들을 설명합니다. 코드를 수정하는 Agent는 반드시 본 문서와 식을 일치시켜야 합니다.

## Module 02: Oxidation (산화공정)

### 1. Deal-Grove Model
실리콘 웨이퍼 표면의 산화막 성장 두께를 계산하는 표준 모델입니다.

**수식:**
`x² + A·x = B(t + τ)`

해 (근의 공식):
`x = [-A + √(A² + 4B(t+τ))] / 2`

**변수 정의:**
- `x`: 산화막 두께 (μm, 계산 후 nm로 변환)
- `t`: 공정 시간 (hr)
- `B`: Parabolic rate constant (μm²/hr)
- `B/A`: Linear rate constant (μm/hr)
- `τ`: 초기 산화막 두께 형성에 필요한 가상의 시간

**Rate Constants (Arrhenius Equation):**
`Rate = C · exp(-Ea / kT)`
- `k`: Boltzmann constant (8.617e-5 eV/K)
- `T`: 절대온도 (K)

**교육용 근사 상수 (Simulation Defaults):**
*Wet Oxidation (H2O):*
- B: Ea = 0.71 eV, C = 3.86e2
- B/A: Ea = 2.05 eV, C = 1.63e8
*Dry Oxidation (O2):*
- B: Ea = 1.24 eV, C = 7.72e2
- B/A: Ea = 2.0 eV, C = 6.23e6

### 2. Measurement Noise (계측 오차)
현실적인 계측기기의 오차율을 모사합니다.

**수식:**
`MeasuredValue = ActualValue + (Random(-1, 1) * ActualValue * Tolerance)`
- Tolerance: 기본 1%~2% (0.01~0.02)

## Module 03: Photolithography (포토공정)

### 1. Rayleigh Criterion (해상도 한계)
렌즈의 해상력을 결정하는 레일리 기준을 계산합니다.

**수식:**
`Resolution = k1 * (λ / NA)`
- `k1`: 공정 상수 (교육용 기본값 0.6)
- `λ`: 노광 파장 (365nm, 248nm, 193nm)
- `NA`: 개구수 (Numerical Aperture, 0.5 ~ 1.35)

### 2. Dose Sensitivity Model
노광량(Dose) 변화에 따른 선폭(CD)의 변화를 계산합니다. (Positive PR 가정)

**수식:**
`ActualCD = TargetCD - (Dose - OptimalDose) * DoseSensitivity`
- `OptimalDose`: 타겟 CD 달성을 위한 최적 노광량 (기본값 30 mJ/cm²)
- `DoseSensitivity`: 노광량 당 CD 변화율 (기본값 1.5 nm/mJ)
- **제한 조건:** 
  - `Resolution > TargetCD * 1.2` 인 경우 물리적으로 패턴이 뭉개진다고 판별(패턴 소실).
  - 과노광 시 CD가 0 미만으로 떨어지면 패턴 소실 처리.

## Module 04: Etching (식각공정)

### 1. Dry Etch Rate Model
건식 식각 시 RF Power 및 챔버 압력에 따른 식각률(Etch Rate)을 계산합니다.

**수식:**
`BaseRate = RFPower * 0.005` (1000W 시 약 5 nm/s)
`PressureModifier = 1 - ((Pressure - 50)/100)^2` (50 mTorr에서 식각률 최대화 가정)
`EtchRate = BaseRate * PressureModifier`
`EtchDepth = EtchRate * Time`

### 2. Anisotropy & Undercut Model
챔버 압력에 의한 이온 충돌 빈도 증가를 모사하여, 식각의 비등방성(방향성)과 Undercut(수평 식각)을 계산합니다.

**수식:**
`Anisotropy = 1 - (Pressure / 200)` 
- 압력이 낮을수록 이온의 직진성이 높아져 비등방성이 1에 가까워짐.
- `Undercut = EtchDepth * (1 - Anisotropy)`
# 공통 장비 HMI 동특성

`src/simulation/models/equipmentHmi.ts`는 모든 교육용 HMI에서 Setpoint와 Actual의 동적 응답을 동일하게 처리한다. 가동 중 Actual은 매 샘플마다 `(Setpoint - Actual) × 0.18`만큼 수렴하며, 정지 상태에서는 0.06 응답계수를 사용한다. 표시 정상 여부는 공정별 허용오차 이내인지로 판정한다. 이는 실제 장비의 1차 지연 응답을 교육용으로 단순화한 모델이며 임의 난수를 사용하지 않는다.

공통 HMI는 웨이퍼 성장, 산화, 포토, 식각, 증착/이온주입, 금속배선, EDS, 패키징 전 공정에 적용한다. 공정별 Setpoint와 단위·허용오차는 각 모듈이 선언하고, 실제값의 시간응답과 정상 판정은 공통 모델만 담당한다.
