# 07. 자연어 → 전문 용어 매핑표 (Korean Term Mapping)

S8 `VideoTermService`가 사용하는 **초안 사전**. 사용자가 고칠 수 있고, 모든 확정은 사용자 확인 게이트를 거친다. 자동 확정 금지.

## 1. 매핑 정책

| 신뢰도 | 동작 |
|---|---|
| ≥ 0.80 | 매핑표 미리보기 + "이 해석으로 콘티" 버튼 |
| 0.50 ~ 0.79 | 미리보기 + 확인 체크박스 필수 |
| < 0.50 | 되묻기 카드. `VideoIntent` 확정 불가 |

- `TermMapping`은 `source_phrase`(원문), `standard_term`, `category`, `rationale`, `confidence`, `confirmed_by`, `confirmed_at`을 저장한다.
- 원문은 절대 덮어쓰지 않는다. 사용자가 다른 용어를 고르면 `user_selected_term`에 별도 저장.
- `reference`가 필요하면 `kb_refs[]`에 KB ID를 넣는다(예: `KB-CAM-002`).

## 2. 공통 매핑

| 자연어 표현(예) | 표준 용어(한) | 표준 용어(영) | 카테고리 | KB | 되묻기/주의 |
|---|---|---|---|---|---|
| "인물 살짝 커지게" | 클로즈업 / 푸시인 | CU / push-in | framing | KB-FRM-001, KB-CAM-002 | 줌인인가 돌리인가? "카메라가 다가가나요, 렌즈로 당기나요?" |
| "배경 흐리게" | 얕은 피사계 심도 | shallow depth of field | camera | KB-FRM-006 | 제품 글자까지 흐려지면 안 됨 |
| "초점이 앞에서 뒤로" | 랙 포커스 | rack focus | camera | KB-FRM-006 | 어느 물체로 옮기는가? |
| "가운데 딱" | 중앙·대칭 구도 | centered / symmetrical | composition | KB-FRM-003 | 규칙을 깬 의도인가? |
| "오른쪽에 살짝" | 삼분할 교점 배치 | rule of thirds | composition | KB-FRM-002 | 화면 기준인가 인물 기준인가? |
| "시선이 가게" | 리딩 라인 | leading lines | composition | KB-FRM-004 | 어떤 선을 쓸까? |
| "눈높이에서" | 아이레벨 | eye-level | camera | KB-FRM-005 | 공감 의도인가? |
| "갑자기 확" | 하드 컷 | hard cut | edit | KB-EDT-001 | 점프 컷인가 단순 컷인가? |
| "천천히 겹치게" | 디졸브 | dissolve | edit | KB-EDT-009 | 시간 경과 의도 확인 |
| "소리 먼저" | J컷 | J cut | edit | KB-EDT-007 | — |
| "소리 이어지게" | L컷 | L cut | edit | KB-EDT-007 | — |
| "똑같은 모양으로 이어" | 그래픽 매치 | graphic match | edit | KB-EDT-006 | — |
| "움직임 이어서" | 액션 매치 | action match | edit | KB-EDT-006 | 움직임 도중 컷 |
| "빛 부드럽게" | 소프트라이트 / 디퓨전 | soft light / diffusion | lighting | KB-LIT-003 | 기존 하드 광원 교체 필요 |
| "그림자 진하게" | 로우키 / 네거티브 필 | low key / negative fill | lighting | KB-LIT-002, KB-LIT-007 | 노출 감소인가 대비 증가인가? |
| "밝고 깔끔" | 하이키 | high key | lighting | KB-LIT-002 | — |
| "따뜻한 느낌" | 웜 톤(약2700~3200K) | warm / 2700–3200K | lighting | KB-LIT-006 | 브랜드 컬러 우선 |
| "차가운 느낌" | 쿨 톤(약5600K) | cool / 5600K | lighting | KB-LIT-006 | — |
| "눈에 불빛" | 아이 라이트 / 캐치 라이트 | eye light / catch light | lighting | KB-LIT-007 | — |
| "걸어가며 계속 따라가" | 워크앤톡 / 스테디캠 | walk-and-talk / stabilizer | camera | KB-CAM-006 | 좁은 공간이면 짐벌(KB-CAM-005) |
| "위에서 시작해 내려" | 크레인 다운 / 확립 | crane down / establishing | camera | KB-CAM-007, KB-FRM-001 | 옥외 안전 확인 |
| "아주 살짝만 이동" | 슬라이더 | slider | camera | KB-CAM-004 | — |
| "손에 든 거 중요" | 히로 소품 / 인서트 | hero prop / insert | blocking | KB-PRD-003, KB-EDT-005 | 어떤 물건인가? |
| "배경에 뭐 좀" | 세트 드레싱 | set dressing | blocking | KB-PRD-003 | 배우가 만지는가? |
| "왼쪽 오른쪽 헷갈려" | 화면 좌우 기준 확인 | screen-left/right | blocking | KB-PRD-009 | 반드시 되묻기 |
| "3초 안에 끌게" | 훅 | hook | ad | KB-AD-001, KB-AD-002 | — |
| "글자 잘리지 않게" | 세이프 존 | safe zone | platform | KB-AD-005~009 | 어떤 플랫폼인가? |
| "마지막에 누르게" | CTA | call to action | ad | KB-AD-001 | 목적지와 이유 확인 |

## 3. 제작 유형별 추가 매핑

| 제작 유형 | 자연어 예 | 표준 용어 | KB |
|---|---|---|---|
| 실사 | "리얼하게 흔들" | 핸드헬드 / 다큐멘터리 룩 | KB-CAM-001 |
| 숏폼 | "빠르게 잘라" | 하드 컷 + 점프 컷 리듬 | KB-EDT-001, KB-EDT-008 |
| 숏폼 | "자막 크게 중간에" | 세이프존 내 자막 | KB-AD-009 |
| 영화 | "시네마틱하게" | 와이드 + 딥포커스 + 로우키(조합 제안, 단정 금지) | KB-FRM-001, KB-FRM-007, KB-LIT-002 |
| 영상 | "정보가 잘 보이게" | 인서트 + 그래픽 오버레이 레이어 | KB-EDT-005 |
| 애니메이션 | "튀게 움직여" | 스쿼시&스트레치 / 예상 동작 | KB-ANI-001~003 |
| 모션그래픽 | "부드럽게 등장" | 이징(감속) + 지속시간 토큰 | KB-MOT-001~003 |
| 모션그래픽 | "글자가 살아 움직여" | 키네틱 타이포그래피 | KB-MOT-004 |

## 4. 감사 로그 규칙

- `TermMapping.confirmed_by`가 없으면 `Storyboard` 생성 API가 거부한다(NFR-18, G4).
- 사용자가 제안을 수정하면 `rationale`에 "사용자 선택"을 기록하고 원래 KB 근거는 `kb_refs`에 남긴다.
- 등급 C KB만 근거인 매핑은 확정 전 "검증 필요" 배지를 출력한다.
