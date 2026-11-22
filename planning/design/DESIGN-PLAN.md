# DESIGN-PLAN — AI Marketing AX Workspace 디자인 계획

작성일: 2026-11-22  
대상: 데스크톱 1440×900 우선, React + TypeScript + Tailwind + shadcn/ui 즉시 구현 가능한 명세 지향  
관련 문서: `SOURCE-INVENTORY.md`, `REFERENCE-AUDIT.md`, `FEATURE-MATRIX.md`, `COMPOSITION-PLAN.md`, `SCREEN-SPECS.md`, `COMPONENT-SPECS.md`

---

## 1. 디자인 콘셉트: Creative Operations Studio

크리에이티브 제작 도구의 "결과물 중심 작업 공간"과 SaaS 운영 대시보드의 "상태·데이터 밀도"를 하나로 결합한다.

레퍼런스 7개에서 가져오는 것은 **화면 전체가 아니라 인터랙션 단위의 패턴**이다.

| 레퍼런스 | 가져오는 인터랙션 단위 | 가져오지 않는 것 |
|---|---|---|
| Snipit | 레퍼런스 검색/필터, 보드, 브랜드 아카이브 | 마케팅 랜딩 페이지 전체 |
| Foreplay | 스와이프 파일 카드, 위닝 패턴 표시, 성과/크리에이티브 병렬 보기 | 다크 랜딩 히어로 전면 복제 |
| MONOV | 입력 → 4장 결과 그리드 → 편집/히스토리 흐름, 내 스타일 | 생성 재구성 코드 그대로 사용 |
| Creatify | 포맷 카탈로그, 소스 연결 → 생성 → 배포 흐름 | 대형 히어로 카피/가격 섹션 |
| Postiz | AI 에이전트 연결 카드, 채널 연결 상태, 캘린더/자동화 개념 | 보라 다크 테마 그대로 |
| Buffer | 채널 타일, PUBLISH/CREATE/COMMUNITY/INSIGHTS 4축 구조, AI assistant | 크림색 랜딩 톤 그대로 |
| Motion | 진본 위치 확인(`creatify-ai/capture/routes/features-agent/**`) → Visual-first 리포트/그룹화/AI 태깅 패턴 참고 | `motionapp-com/capture/**`(Creatify)를 Motion 근거로 단정 |

---

## 2. 디자인 원칙

1. **결과물이 화면의 중심이다.** 생성 이미지/영상/카피 카드가 가장 큰 시각 비중을 갖는다.
2. **AI는 상태가 보이는 비동기 작업이다.** `queued → running → streaming → reviewing → approved → published`를 숨기지 않는다.
3. **사람이 승인한다.** 모든 생성 결과는 기본적으로 `초안`이며, 승인 전 발행 버튼은 비활성 또는 확인 모달을 거친다.
4. **한 화면에 주 액션은 하나다.** 보조 액션은 드로어/메뉴/오버플로에 둔다.
5. **비용과 출처를 표시한다.** 모델 Provider, 토큰/이미지 장수, 예상 비용, 프롬프트 버전을 결과물에 메타로 붙인다.
6. **빈 화면을 설계한다.** "데이터 없음"이 아니라 "첫 레퍼런스를 저장하세요" 같은 다음 행동을 제시한다.
7. **토큰과 재사용 컴포넌트만 쓴다.** 임의 색상·간격·radius를 화면에 직접 박지 않는다.
8. **이모지 아이콘 금지.** Lucide 계열의 선형 아이콘과 텍스트 라벨을 사용한다.
9. **한국어 UI 카피.** 영문 원어를 그대로 섞지 않고, 필요할 때만 괄호로 병기한다.
10. **과도한 카드 중첩 금지.** 카드 안 카드 대신 구분선·섹션 헤더·탭을 사용한다.

---

## 3. 디자인 토큰

### 3-1. 색상

| 토큰 | 값 | 용도 |
|---|---|---|
| `bg.app` | `#F7F8FA` | 전체 배경 |
| `surface.default` | `#FFFFFF` | 카드/테이블/패널 |
| `surface.subtle` | `#F1F3F7` | 섹션 배경, 코드 블록 |
| `surface.inverse` | `#202937` | 다크 미리보기, 로그 패널 |
| `text.primary` | `#202937` | 본문/제목 |
| `text.secondary` | `#5B6670` | 보조 설명 |
| `text.muted` | `#8A93A2` | 메타/타임스탬프 |
| `text.inverse` | `#FFFFFF` | 다크 배경 위 |
| `primary.500` | `#3159D9` | 주 버튼, 활성 탭, 링크 |
| `primary.600` | `#2747B4` | hover/active |
| `primary.50` | `#EEF2FF` | 선택 배경, 태그 |
| `success.500` | `#16806A` | 승인/발행 성공 |
| `success.50` | `#E7F5F1` | 성공 배지 배경 |
| `warning.500` | `#D69A38` | 검수 필요, 비용 경고 |
| `warning.50` | `#FFF6E6` | 경고 배지 배경 |
| `danger.500` | `#C53D3D` | 실패, 삭제 |
| `danger.50` | `#FCECEC` | 오류 배지 배경 |
| `border.default` | `#E3E7EE` | 카드/인풋 테두리 |
| `border.strong` | `#CBD2DE` | 포커스 아웃라인, 구분 강조 |

> 레퍼런스에서 관측된 #334fff(Snipit), #7133ea(MONOV), #0e0e0e/#190b30(Postiz), #b0ec9c(Buffer)는 **브랜드 톤 참고용 근거**로만 기록하고, 통합 제품 팔레트에는 직접 채택하지 않는다. Primary는 가독성과 중립성을 고려해 `#3159D9`로 정한다.

### 3-2. 타이포그래피

| 토큰 | 값 | 용도 |
|---|---|---|
| `font.sans` | Pretendard, -apple-system, system-ui, sans-serif | 기본 UI |
| `font.mono` | "JetBrains Mono", "SFMono-Regular", Consolas, monospace | 숫자, 로그, 비용, ID |
| `text.xs` | 12px / 16 | 메타, 배지 |
| `text.sm` | 13px / 18 | 테이블, 보조 |
| `text.base` | 14px / 20 | 본문, 버튼 |
| `text.md` | 16px / 24 | 카드 제목 |
| `text.lg` | 20px / 28 | 섹션 제목 |
| `text.xl` | 28px / 36 | 페이지 제목 |
| `weight` | 400 / 500 / 600 / 700 | 본문/강조/제목 |

한글 자간은 `-0.01em`, 영문/숫자는 `0`를 기본으로 한다. 줄바꿈은 `word-break: keep-all`을 한글 문단에 적용한다.

### 3-3. 간격·그리드·반경

| 토큰 | 값 |
|---|---|
| spacing scale | 4, 8, 12, 16, 20, 24, 32, 40, 48, 64 |
| radius.sm / md / lg / pill | 6 / 10 / 14 / 9999 |
| shadow.card | `0 1px 2px rgba(32,41,55,.04), 0 8px 24px rgba(32,41,55,.05)` |
| shadow.overlay | `0 16px 48px rgba(32,41,55,.16)` |
| app grid | sidebar 240px + main 1fr + optional detail 380px |
| content max | 1200px (본문 영역), 테이블은 가용 전체 |
| gutter | 24px (1440), 16px (1280 이하) |

### 3-4. 아이콘·모션

- 아이콘: Lucide, 16/20px, `stroke-width: 1.75`, 라벨과 함께 사용.
- 모션: hover 120ms, drawer 180ms ease-out, skeleton pulse 1.4s. `prefers-reduced-motion`에서는 pulse/transition 비활성.
- 그라데이션·네온·글래스모피즘·이모지 아이콘 사용 금지.

---

## 4. 정보구조 (IA)

```text
AI Marketing AX Workspace
├── 전역 셸
│   ├── 상단 바: 프로젝트 선택 / Provider 선택 / 전역 검색 / 알림 / 사용량·비용 / 사용자
│   ├── 좌측 사이드바: Collector / Own Content / References / Studio / Publishing / Insights / Performance / Segments / 설정·연결
│   │   └── 그룹 구분: [수집·자산] S0·S5 / [작업] S1~S3 / [분석] S4·S6·S7
│   │       (기본은 각 그룹 독립. 연결은 사용자 명시적 클릭 시에만 생성)
│   └── 우측 상세 패널(조건부): 선택 항목의 분석·버전·승인·작업 로그
│
├── S0. Collector         도메인·경쟁사 등록 → 콘텐츠 수집 (자체 파이프라인)
│   ├── 수집 대상 등록: 분야 키워드 / 우리 서비스 URL / 경쟁사 도메인
│   ├── 수집 소스별 탐색: 영상 광고 / 이미지 광고 / 블로그 / 뉴스 보도
│   ├── 소스 상태: 연결됨 / 키 필요 / 수동 입력 / 실패·재시도
│   ├── 수집 작업: Collector Job(진행률·레이트리밋·중복 제거)
│   └── 수집함 → "분석" → S1 References 로 이동
│
├── S5. Own Content Hub   우리 콘텐츠 자산 (S0와 별개, 독립 모듈)
│   ├── 보관함: 우리 과거 콘텐츠(수동/CSV, 후속 CMS 커넥터)
│   ├── 겹침·시리즈: 유사 콘텐츠 배지(신규/유사/확장), 시리즈 묶음
│   ├── 아이디어 백로그: 다음에 만들 콘텐츠 후보
│   └── 명시적 연결: S0 결과 "참고로 가져오기", S2 "이 아이디어로 기획" (자동 아님)
│
├── S1. References        레퍼런스 탐색·분석·보드
│   ├── 통합 검색/필터 (S0 수집 결과 포함)
│   ├── 보드(캠페인별 스와이프 파일)
│   ├── 브랜드 아카이브
│   └── 분석 리포트(후킹/메시지/CTA/성과)
│
├── S2. Creative Studio   기획·카피·이미지·영상·검수
│   ├── 브리프
│   ├── 콘셉트 3안
│   ├── 카피/원고
│   ├── 이미지/영상 프롬프트 및 생성
│   ├── 자산/버전 관리
│   └── 검수·승인
│
├── S3. Publishing        채널 변환·예약·상태
│   ├── 채널 연결 상태
│   ├── 게시물 큐/캘린더
│   ├── 채널별 미리보기/변환
│   └── 발행 이력
│
├── S4. Insights          성과 분석·개선안
│   ├── CSV 업로드/지표 매핑
│   ├── 대시보드(노출/클릭/광고비/상담/계약)
│   ├── 콘텐츠별 비교
│   └── AI 개선안 → 새 브리프
│
├── S6. Performance & Forecast  성과 추이·예측 (S4와 별개 라우트)
│   ├── 지표 업로드/선택(샘플 허용)
│   ├── 추이 차트 + 이동평균 baseline 예측 밴드("예측" 배지 필수)
│   └── 명시적 연결: "S5 콘텐츠와 연결" 클릭 시 content_id 참조만
│
├── S7. Audience Segments       타깃 분류·군집 (S6와 별개 라우트)
│   ├── 데이터/변수 선택(개인정보 최소화)
│   ├── k 선택(3~6) + 군집 카드/산점도(샘플 뷰)
│   ├── 세그먼트 프로필/페르소나 라벨
│   └── 명시적 연결: "이 그룹에 맞춤 콘텐츠" 클릭 시 segment_id 참조만
│
└── 설정/연결
    ├── 브랜드 키트
    ├── Model Provider / API 키 상태
    ├── MCP·외부 도구 연결
    ├── 모듈 연결 상태(ModuleLink 목록, 연결/해제)
    ├── 작업 이력·실패 재시도
    └── 비용·사용량
```

전역 객체: `Campaign`, `BrandKit`, `CollectSource`, `CollectedItem`, `Asset`, `Job`, `ProviderConnection`, `CostRecord` — 화면 어디서든 우측 패널로 연결된다.
모듈 전용 객체: `OwnContent`, `ContentSeries`, `IdeaBacklog`, `OverlapFlag` (S5) / `MetricSeries`, `Forecast` (S6) / `AudienceDataset`, `Segment`, `SegmentMember` (S7). 이들은 서로 FK를 갖지 않고 `ModuleLink`로만 참조된다.

> **설계 원칙 재확인**: 캡처한 7개 서비스는 인터랙션·토큰 참고용일 뿐이다. 실제 수집/검색/분석 파이프라인은 이 프로젝트에 맞춰 **직설계·직구현**하며, 오픈소스 수집 툴은 라이선스를 확인한 뒤 라이브러리/서비스 형태로만 사용한다. S0의 소스별 탐색은 "수집기"를 사용자에게 노출하는 네비게이션이며, 크롤링 대상·범위·주기는 설정에서 통제한다.

> **모듈 분리 원칙 (최우선)**: S0(남의 콘텐츠 수집) / S5(우리 콘텐츠) / S6(성과·예측) / S7(오디언스)는 **서로 다른 질문에 답하는 별도 화면**이다.
> 1. 각 모듈은 독립 라우트·독립 상태·독립 빈 화면을 가진다. 진입은 사이드바에서 직접 한다.
> 2. **연결은 기본 off.** 사용자가 "가져오기 / 연결 / 적용" 버튼을 눌러야만 `ModuleLink`가 생긴다.
> 3. 연결은 **식별자 참조만**(`content_id`, `segment_id`). 데이터를 복사하거나 자동 동기화하지 않는다.
> 4. 한 모듈에 데이터가 없어도 나머지는 샘플 데이터로 정상 작동한다(차단 전파 금지).
> 5. 공유 대상은 디자인 토큰·App Shell·JobDrawer·ProviderConnection 뿐이다. 모듈 내부 컴포넌트는 재사용하지 않는다.
> 6. 설정의 "모듈 연결"에서 생성된 링크를 한눈에 확인/해제할 수 있다.

---

## 5. UX 흐름 원칙

### 5-1. 대표 시나리오 흐름

```text
[장기렌트 선택]
   ↓ 프로젝트/캠페인 컨텍스트가 전역에 고정
S0 수집 대상 등록: 분야 키워드 / 우리 서비스 URL / 경쟁사 도메인
   ↓ 소스별 수집 Job: 영상 광고 · 이미지 광고 · 블로그 · 뉴스 (공개 범위만)
   ↓ 수집함에서 중복 제거·출처 확인 → "분석" 요청
S1 References: AI 분석 - 후킹·메시지·CTA·타깃·톤 추출
S2 브리프 자동 생성 → 콘셉트 3안 → 카피/원고 → 이미지·영상 프롬프트
   ↓ 결과 카드 선택 → 우측 패널에서 수정/재생성/버전 비교
검수: 브랜드·상품정보·카피 체크리스트 → 승인
   ↓
S3 채널별 변환 → 예약 → 발행 상태 추적
   ↓
S4 CSV 성과 업로드 → 지표 비교 → AI 개선안 → 새 브리프로 순환
```

**독립 진입 시나리오 (자동 연결 없음)**

```text
[우리 콘텐츠 관리] S5 진입 → 보관함(수동/CSV) → 겹침 배지 확인 → 시리즈 지정
   → 아이디어 백로그 → (선택) S0 결과 "참고로 가져오기" 클릭 → (선택) "이 아이디어로 기획" → S2

[성과 예측] S6 진입 → 샘플/CSV 지표 → 이동평균 예측 밴드
   → (선택) "S5 콘텐츠와 연결" 클릭 시 content_id만 참조

[오디언스] S7 진입 → 변수/k 선택 → 군집 카드·프로필
   → (선택) "이 그룹에 맞춤 콘텐츠" 클릭 시 segment_id만 참조
```

> 위 세 흐름은 **S0~F7 파이프라인과 자동으로 이어지지 않는다.** 사용자가 각 진입점에서 시작하고, 연결 버튼을 눌렀을 때만 `ModuleLink`가 기록된다.

### 5-2. 전역 인터랙션 패턴

| 패턴 | 정의 |
|---|---|
| Command palette | `Ctrl/Cmd+K` — 프로젝트 전환, 레퍼런스 검색, 작업 재실행 |
| AI compose panel | 우측 또는 하단 드로어. 프롬프트, Provider, 모델, 옵션, 예상 비용, 생성 버튼 |
| Job drawer | 실행 중/대기/실패 작업 목록. 단계별 진행률과 재시도 버튼 |
| Detail panel | 카드 클릭 시 우측 380px. 원본/분석/버전/승인/로그 탭 |
| Compare view | 두 버전을 나란히 또는 슬라이더로 비교 |
| Approval gate | 승인 모달에 체크리스트 결과와 변경 요약 표시 |
| Dry-run badge | 실제 발행/과금 전 상태임을 명시 (`시연`, `샘플 데이터`, `연결 필요`) |
| Module link chip | 연결이 사용자 액션으로 생성됐음을 표시 (`S0 → S5 참고`, `S6 → S5 content_id`). 설정에서 해제 가능 |
| Forecast badge | S6 예측값에 `예측 / 신뢰도 / 모델` 명시. 실제 성과와 색상 구분 |
| Segment tag | S7 군집 라벨(`신규/기존/관심/잠재`). 사람이 이름을 편집 가능, 자동 확정 금지 |

---

## 6. 화면·컴포넌트 상태

| 상태 | 표현 규칙 |
|---|---|
| Empty | 관련 일러스트 대신 단순 아이콘 + 한 줄 설명 + 주 액션 버튼 |
| Loading | 스켈레톤 카드 + "단계 n/5" 텍스트. 전체 화면 스피너 금지 |
| Streaming | 텍스트가 타이핑되며 하단에 `생성 중 · 중지` 표시 |
| Success | 결과 카드 + 저장/승인/다음 단계 버튼. 토스트는 보조 |
| Partial failure | 성공 항목은 유지, 실패 카드에 재시도 배지. 전체 실패로 처리하지 않음 |
| Error | 오류 이유 + 재시도 + Provider 전환 링크. 원시 스택은 접어서 표시 |
| Approval | 초안/검수중/승인됨 배지 + 승인자·시각 |
| Scheduled | 예약 시각, 채널,시간대 표시. 취소 가능 |
| Published | 플랫폼 게시물 링크/ID, 성과 수치 연결 |
| Archived | 흐리게 표시, 복원 버튼 제공 |

---

## 7. 접근성·반응형

- 대비: 본문 4.5:1, 큰 텍스트/UI 경계 3:1 이상.
- 모든 인터랙션은 키보드로 도달 가능, 포커스 링은 `border.strong` 2px.
- 표는 `<table>` 의미 구조 유지, 숫자는 `font.mono` + 우측 정렬.
- 이미지/카드에는 대체 텍스트 또는 `aria-label` 제공.
- 1440×900 기준. 1280 이하에서 우측 패널은 오버레이로 전환, 1024 이하에서 사이드바는 접힘, 768 이하에서는 8개 화면(Collector·Own Content·References·Studio·Publishing·Insights·Performance·Segments)을 세로 스택으로 재배치(단, MVP는 데스크톱 우선).

---

## 8. 디자인 스킬·검수 도구 가용성

현재 세션에서 실제 사용 가능한 스킬은 `browser`, `opencode`, `report` 3개뿐이며, 요청된 디자인 스킬은 모두 로컬에 설치되어 있지 않습니다.

| 스킬/리소스 | 환경 내 상태 | 계획 단계 배치 |
|---|---|---|
| UI UX Pro Max | 미설치 (외부 저장소만 존재) | 설치 시 0~1단계 스타일/UX 가이드 수립. 현재는 수동 체크리스트 대체 |
| Anthropic Frontend Design | 미설치 | 1단계 비주얼 방향, "AI 기본 디자인 회피" 원칙 수립 시 참조 |
| Impeccable | 미설치 | 2~3단계 `/polish`, `/audit` 성격의 마감 검수 시 참조 |
| Vercel Web Design Guidelines | 미설치 | 3단계 접근성/성능/UX 가이드라인 체크리스트로 참조 |
| shadcn/ui + Blocks | 스킬 아님, 미설치. npm/bun도 미설치 | 2단계 React/Tailwind 조립 레퍼런스 (MIT, 고지 유지) |
| 21st.dev | 스킬 아님, 미설치 | 2단계 영감/블록 참조. 무료 일 2회 복사 제한, 유료 플랜 확인 필요 |
| browser 스킬 | **사용 가능** | 3단계 실제 렌더링, 스크린샷, Lighthouse, 콘솔/네트워크 검수 |

Figma는 필수가 아니다. 대신 `browser.screenshot` + `browser.preview`, `browser.lighthouse`, `browser.evaluate`(대비비·오버플로·aria 검사), `browser.console/network`를 검수 도구로 사용한다.

---

## 9. 레퍼런스 토큰 대조 기록

| 서비스 | 관측 토큰 (capture/README.md 기준) | 통합 제품에서의 처리 |
|---|---|---|
| Snipit | Pretendard, `#334fff`, `#fefeff`, radius 9999/4/16 | 폰트는 채택, Primary 블루는 `#3159D9`로 재정의 |
| Foreplay | Inter, `#020308`, `#090a0e`, radius 10/24/12 | 다크 톤은 로그/미리보기 패널에만 제한적 사용 |
| MONOV | SUIT Variable, `#7133ea`, `#eaf0f0`, radius 14/12 | 보라 Primary는 채택하지 않고 생성 결과 그리드 레이아웃만 참고 |
| Creatify | General Sans, IBM Plex Mono, `#131415`, `#f5f5f5` | 모노 폰트를 숫자/로그에 채택 |
| Postiz | DM Sans, Plus Jakarta, `#0e0e0e`, `#190b30` | 에이전트 연결 카드 패턴만 참고, 다크 테마는 미채택 |
| Buffer | Figtree/Stolzl, `#fefdfb`, `#213130`, `#b0ec9c` | 4축 구조(PUBLISH/CREATE/COMMUNITY/INSIGHTS)를 S1~S4에 매핑. S0 Collector는 자체 설계(캡처 근거 없음) |
| Motion | Inter Variable, `#5047eb`, `#f6f6f6`, radius 6/18/24/32/10, bp 479/767/991 (`creatify-ai/capture/routes/features-agent/README.md:17-30`) | 보라는 Primary로 쓰지 않고 **S4/S6 시그널 컬러**로만 제한 사용. Visual-first 리포트/모멘텀 배지 패턴 참고 |

---

## 10. 이 문서의 수용 기준

- [ ] 모든 화면이 위 토큰만 사용한다.
- [ ] 화면마다 빈/로딩/성공/실패/승인 상태가 정의되어 있다.
- [ ] AI 생성 작업은 항상 Provider·모델·비용·상태를 노출한다.
- [ ] 이모지 아이콘, 그라데이션, 글래스모피즘이 없다.
- [ ] React/Tailwind/shadcn/ui 구조로 그대로 매핑 가능한 컴포넌트 이름이 `COMPONENT-SPECS.md`에 정의되어 있다.
