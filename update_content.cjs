const fs = require('fs');
const path = require('path');

const koTheories = {
  wafer: {
    title: "1. 실리콘 단결정 성장 및 웨이퍼 제조 이론",
    content: [
      "반도체 소자의 근간이 되는 실리콘(Si) 웨이퍼는 고순도의 다결정 실리콘을 용융시킨 후, 단결정으로 성장시켜 만듭니다.",
      "가장 대표적인 방법은 초크랄스키(Czochralski, CZ) 법입니다. 1400°C 이상의 고온 석영 도가니에서 실리콘을 녹이고, 단결정 시드(Seed)를 접촉시켜 회전하며 천천히 끌어올림으로써 원기둥 모양의 잉곳(Ingot)을 성장시킵니다.",
      "이후 잉곳의 양 끝을 절단하고, 일정한 두께로 썰어내는 슬라이싱(Slicing) 공정을 거칩니다.",
      "슬라이싱된 웨이퍼는 표면의 굴곡과 결함을 제거하기 위해 래핑(Lapping)과 에칭(Etching) 공정을 거치며, 최종적으로 거울처럼 평탄한 표면을 만들기 위해 화학적 기계적 연마(CMP, Chemical Mechanical Polishing)를 수행합니다.",
      "이렇게 완성된 베어 웨이퍼(Bare Wafer) 위에서 비로소 반도체 8대 공정의 후속 작업들이 이루어지게 됩니다."
    ]
  },
  oxidation: {
    title: "2. 산화 공정 (Oxidation) 심화 이론",
    content: [
      "산화 공정은 실리콘(Si) 웨이퍼 표면에 산소(O2) 또는 수증기(H2O)를 반응시켜 얇고 균일한 실리콘 산화막(SiO2)을 형성하는 열역학적 과정입니다.",
      "이 산화막은 매우 훌륭한 부도체(절연체)로 작용하며, 트랜지스터의 게이트 산화막, 이온 주입 공정에서의 확산 방지 마스크, 그리고 소자 간 격리(Isolation) 등 반도체 제조에서 필수 불가결한 역할을 합니다.",
      "가장 널리 쓰이는 물리 모델은 딜-그로브(Deal-Grove) 모델입니다. 이 모델은 산소 분자가 1) 가스 영역에서 산화막 표면으로 이동, 2) 기존에 형성된 산화막을 뚫고 내부로 확산, 3) 실리콘-산화막 계면에서 화학 반응(Si + O2 -> SiO2)을 일으키는 세 가지 플럭스(Flux)의 연속성으로 산화막의 성장 속도를 수학적으로 정의합니다.",
      "건식 산화(Dry Oxidation)는 순수한 산소 가스를 사용하여 성장 속도는 느리지만 전기적 특성이 우수하고 치밀한 막을 형성합니다. 주로 게이트 산화막과 같이 얇고 품질이 중요한 곳에 쓰입니다.",
      "습식 산화(Wet Oxidation)는 수증기를 함께 주입하여 성장 속도가 매우 빠릅니다. 주로 두꺼운 보호막이나 격리막을 형성할 때 사용됩니다."
    ]
  },
  lithography: {
    title: "3. 포토리소그래피 (Photolithography) 심화 이론",
    content: [
      "포토리소그래피는 빛을 이용하여 레티클(마스크)에 그려진 미세한 회로 패턴을 웨이퍼 위에 코팅된 감광액(Photoresist, PR)에 전사하는 공정입니다. 반도체의 집적도를 결정하는 가장 중요하고 비용이 많이 드는 핵심 공정입니다.",
      "이 공정의 핵심 지표는 해상도(Resolution, R)와 초점 심도(Depth of Focus, DOF)입니다.",
      "레일리 기준(Rayleigh's criterion)에 따르면 해상도 R = k1 * (λ / NA) 로 표현됩니다. 즉, 더 미세한 회로(더 작은 R)를 그리기 위해서는 광원의 파장(λ)을 줄이거나, 렌즈의 개구수(NA)를 키워야 합니다.",
      "이에 따라 광원은 G-line(436nm) -> I-line(365nm) -> KrF(248nm) -> ArF(193nm)를 거쳐 현재 최첨단 공정에서는 극자외선인 EUV(13.5nm)를 사용하기에 이르렀습니다.",
      "또한 액체를 렌즈와 웨이퍼 사이에 채워 NA를 극대화하는 액침 노광(Immersion Lithography) 기술과, 한 패턴을 여러 번 나누어 찍는 다중 패터닝(Multi-Patterning) 기술이 미세화 한계를 극복하기 위해 사용됩니다."
    ]
  },
  etching: {
    title: "4. 식각 공정 (Etching) 심화 이론",
    content: [
      "식각 공정은 포토리소그래피를 통해 형성된 PR 패턴을 마스크로 삼아, 하부의 산화막, 금속막, 다결정 실리콘 등의 막질 중 패턴이 덮이지 않은 부위를 선택적으로 깎아내는 공정입니다.",
      "초기에는 화학 용액을 사용하는 습식 식각(Wet Etch)이 쓰였으나, 이는 등방성(Isotropic) 식각 특성 때문에 수평 방향으로도 막이 깎이는 언더컷(Undercut)이 발생하여 미세 패턴 구현에 한계가 있었습니다.",
      "이를 극복하기 위해 현재는 플라즈마를 이용한 건식 식각(Dry Etch)을 주력으로 사용합니다. 진공 챔버에 가스를 주입하고 고주파(RF) 전력을 인가하여 이온(Ion)과 라디칼(Radical)이 공존하는 플라즈마 상태를 만듭니다.",
      "이온은 척(Chuck)에 인가된 바이어스 전압에 의해 수직으로 강하게 가속되어 물리적으로 웨이퍼 표면을 때려 깎아냅니다(이온 충격). 이는 수직 방향의 비등방성(Anisotropic)을 확보하게 해줍니다.",
      "라디칼은 화학적 반응성이 높은 중성 입자로, 피각물과 결합하여 휘발성 가스를 형성해 배기구로 빠져나가게 함으로써 식각 속도와 선택비(Selectivity)를 높이는 역할을 합니다. 이 두 메커니즘을 결합한 것이 RIE(Reactive Ion Etching)입니다."
    ]
  },
  eds: {
    title: "7. EDS (Electrical Die Sorting) 심화 이론",
    content: [
      "전공정(Front-end)을 마친 웨이퍼 상태의 각 칩들이 원하는 전기적 특성과 기능을 제대로 수행하는지 판별하는 공정으로, '웨이퍼 테스트' 또는 '프로브 테스트'라고도 부릅니다.",
      "이 과정은 수백~수천 개의 미세한 핀(Pin)이 박힌 프로브 카드(Probe Card)를 웨이퍼의 패드(Pad)에 직접 물리적으로 접촉시켜, 반도체 테스터 장비와 전기적 신호를 주고받는 방식으로 진행됩니다.",
      "DC 테스트(단락, 누설전류), AC 테스트(동작 속도), 펑션 테스트(논리 동작) 등을 수행하며, 수선 가능한 메모리 반도체의 경우 여분의 셀(Redundancy Cell)로 불량 셀을 대체하는 리페어(Repair) 공정 연산도 이때 수행됩니다.",
      "수율(Yield)은 투입된 웨이퍼에서 생산 가능한 최대 칩 개수 대비 합격품(Good Die)의 비율을 뜻하며, 제조 경쟁력의 핵심 지표입니다.",
      "통계적 수율 모델 중 포아송(Poisson) 모델에 따르면, 수율 Y = exp(-D*A) 로 표현됩니다. 즉 칩의 면적(A)이 커질수록, 공정 중 발생하는 결함 밀도(D)가 클수록 수율은 기하급수적으로 하락하게 됩니다."
    ]
  },
  packaging: {
    title: "8. 패키징 (Packaging) 심화 이론",
    content: [
      "패키징은 웨이퍼에서 낱개로 잘려진 칩(Die)을 외부의 물리적 충격, 수분, 부식 등으로부터 보호하고, 시스템 보드(PCB)와 전기적, 기계적, 열적으로 연결해 주는 후공정(Back-end)입니다.",
      "기본 공정은 1) 웨이퍼 절단(Dicing), 2) 칩을 리드프레임이나 서브스트레이트에 붙이는 칩 접착(Die Attach), 3) 칩과 기판을 전선으로 연결하는 와이어 본딩(Wire Bonding), 4) 열경화성 수지(EMC)로 칩을 덮어씌우는 성형(Molding) 순으로 이루어집니다.",
      "칩의 동작 시 발생하는 막대한 '열'을 어떻게 방출할 것인가는 패키징 설계의 핵심 과제입니다. 열 회로 모델에 따르면 칩 내부 접합부 온도(Tj) = 외부 온도(Ta) + 소비 전력(P) * 열 저항(θJA) 입니다. 고성능 칩일수록 0에 가까운 열 저항 구조를 가져야 합니다.",
      "최근 무어의 법칙(Moore's Law) 한계를 극복하기 위해, 와이어 대신 칩 아랫면에 범프(Bump)를 만들어 뒤집어 붙이는 플립칩(Flip-Chip), 실리콘 칩을 관통하는 전극을 뚫어 칩을 수직으로 쌓는 TSV(Through Silicon Via), 여러 종류의 칩을 하나의 기판(Silicon Interposer)에 모아 성능을 극대화하는 2.5D/3D Advanced Packaging(어드밴스드 패키징) 기술이 폭발적으로 발전하고 있습니다."
    ]
  }
};

const enTheories = {
  wafer: {
    title: "1. Silicon Crystal Growth & Wafer Theory",
    content: [
      "The silicon (Si) wafer, which is the foundation of semiconductor devices, is made by melting high-purity polycrystalline silicon and then growing it into a single crystal.",
      "The most representative method is the Czochralski (CZ) process. Silicon is melted in a quartz crucible at a high temperature of over 1400°C, and a single crystal seed is brought into contact with the melt and slowly pulled upwards while rotating to grow a cylindrical ingot.",
      "Afterwards, both ends of the ingot are cut off, and it goes through a slicing process to be cut into uniform thicknesses.",
      "The sliced wafers go through lapping and etching processes to remove surface irregularities and defects, and finally, Chemical Mechanical Polishing (CMP) is performed to create a mirror-flat surface.",
      "Subsequent operations of the 8 major semiconductor processes take place on this completed bare wafer."
    ]
  },
  oxidation: {
    title: "2. Oxidation Process Advanced Theory",
    content: [
      "The oxidation process is a thermodynamic process that forms a thin and uniform silicon dioxide (SiO2) layer on the surface of a silicon (Si) wafer by reacting oxygen (O2) or water vapor (H2O).",
      "This oxide layer acts as an excellent insulator and plays an indispensable role in semiconductor manufacturing, such as the gate oxide of transistors, a diffusion barrier mask during ion implantation, and isolation between devices.",
      "The most widely used physical model is the Deal-Grove model. This model mathematically defines the growth rate of the oxide layer through the continuity of three fluxes: 1) movement of oxygen molecules from the gas region to the oxide surface, 2) diffusion through the previously formed oxide layer, and 3) a chemical reaction (Si + O2 -> SiO2) at the silicon-oxide interface.",
      "Dry Oxidation uses pure oxygen gas, which has a slow growth rate but forms a dense film with excellent electrical properties. It is mainly used where a thin and high-quality layer is required, such as a gate oxide.",
      "Wet Oxidation utilizes water vapor, resulting in a very fast growth rate. It is mainly used to form thick protective layers or isolation layers."
    ]
  },
  lithography: {
    title: "3. Photolithography Advanced Theory",
    content: [
      "Photolithography is the process of transferring a microscopic circuit pattern drawn on a reticle (mask) onto a photoresist (PR) coated on a wafer using light. It is the most important and expensive core process that determines the integration density of a semiconductor.",
      "The core metrics of this process are Resolution (R) and Depth of Focus (DOF).",
      "According to Rayleigh's criterion, the resolution is expressed as R = k1 * (λ / NA). In other words, to draw a finer circuit (smaller R), the wavelength of the light source (λ) must be reduced, or the numerical aperture (NA) of the lens must be increased.",
      "Accordingly, the light source has evolved from G-line (436nm) -> I-line (365nm) -> KrF (248nm) -> ArF (193nm), and current cutting-edge processes use Extreme Ultraviolet (EUV) at 13.5nm.",
      "In addition, Immersion Lithography, which maximizes NA by filling a liquid between the lens and the wafer, and Multi-Patterning technologies, which print a pattern multiple times, are used to overcome the limits of miniaturization."
    ]
  },
  etching: {
    title: "4. Etching Process Advanced Theory",
    content: [
      "The etching process selectively removes uncoated parts of films, such as oxide layers, metal layers, and polycrystalline silicon, under the PR pattern formed through photolithography acting as a mask.",
      "Initially, Wet Etching using a chemical solution was used, but due to its isotropic etching characteristics, undercut occurred where the film was also etched in the horizontal direction, limiting the implementation of fine patterns.",
      "To overcome this, Dry Etching using plasma is currently the primary method. Gas is injected into a vacuum chamber and radio frequency (RF) power is applied to create a plasma state where ions and radicals coexist.",
      "Ions are strongly accelerated vertically by the bias voltage applied to the chuck, physically striking and cutting away the wafer surface (ion bombardment). This ensures vertical anisotropy.",
      "Radicals are highly reactive neutral particles that chemically bond with the etched material to form volatile gases that escape through the exhaust port, thereby increasing the etch rate and selectivity. RIE (Reactive Ion Etching) is a combination of these two mechanisms."
    ]
  },
  eds: {
    title: "7. EDS (Electrical Die Sorting) Advanced Theory",
    content: [
      "This is a process that determines whether each chip on a wafer that has completed front-end processes properly performs the desired electrical characteristics and functions. It is also called 'wafer test' or 'probe test'.",
      "This process is performed by physically contacting a probe card with hundreds to thousands of microscopic pins to the pads of the wafer and exchanging electrical signals with the semiconductor tester equipment.",
      "DC tests (short circuit, leakage current), AC tests (operating speed), and function tests (logical operation) are performed. For repairable memory semiconductors, a repair calculation process that replaces defective cells with redundant cells is also performed at this time.",
      "Yield refers to the ratio of passed products (Good Dies) to the maximum number of chips that can be produced from the input wafer, and is a key indicator of manufacturing competitiveness.",
      "According to the Poisson model among statistical yield models, yield is expressed as Y = exp(-D*A). In other words, as the area (A) of the chip increases and the defect density (D) generated during the process increases, the yield drops exponentially."
    ]
  },
  packaging: {
    title: "8. Packaging Advanced Theory",
    content: [
      "Packaging is a back-end process that protects the individual chips (Dies) cut from the wafer from external physical impacts, moisture, and corrosion, and electrically, mechanically, and thermally connects them to the system board (PCB).",
      "The basic process consists of 1) Wafer Dicing, 2) Die Attach, which attaches the chip to a lead frame or substrate, 3) Wire Bonding, which connects the chip and the substrate with wires, and 4) Molding, which covers the chip with epoxy molding compound (EMC).",
      "How to dissipate the immense 'heat' generated when the chip operates is a key challenge in packaging design. According to the thermal circuit model, internal junction temperature of the chip (Tj) = external temperature (Ta) + power consumption (P) * thermal resistance (θJA). High-performance chips must have a thermal resistance structure close to 0.",
      "Recently, to overcome the limits of Moore's Law, Flip-Chip technology, which makes bumps on the bottom of the chip and attaches it upside down instead of wires, TSV (Through Silicon Via) technology, which stacks chips vertically by making electrodes that penetrate the silicon chip, and 2.5D/3D Advanced Packaging technologies, which gather various types of chips on a single substrate (Silicon Interposer) to maximize performance, are developing explosively."
    ]
  }
};

const updateFile = (lang, dict) => {
  for (const module of Object.keys(dict)) {
    const p = path.join('src/content', lang, `${module}.json`);
    if (fs.existsSync(p)) {
      const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
      data.theory = dict[module];
      fs.writeFileSync(p, JSON.stringify(data, null, 2));
    }
  }
}

updateFile('ko', koTheories);
updateFile('en', enTheories);
console.log('JSONs updated successfully');
