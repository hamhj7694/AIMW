# SEO-GROWTH-SPECS — S9 SEO & Search Growth 화면·컴포넌트 명세

작성일: 2026-11-22  
범위: S9 모듈의 4개 탭, 화면 상태, 컴포넌트, 데이터 계약, 수용 기준.  
전제: 독립 라우트. 기본값은 **"연결 안 함"**. 개선안 전달은 사용자 클릭 시 `ModuleLink`로만 발생한다. 실제 계정 API 호출·과금·집행 실행은 MVP 범위 밖이다.

> **환경 독립 원칙**: 이 문서는 로컬 전용 캡처 경로·파일명·링크에 의존하지 않는다. 검색·광고 관련 근거는 공개 출처 등록부(`knowledge/SOURCES.md`의 S23~S26)와 자체 설계로만 표현한다.

---

## 1. 화면 구조

| 항목 | 값 |
|---|---|
| 라우트 | `/seo` (S9 단독). 쿼리 파라미터 `?tab=diagnose|keyword|forecast|rounds` |
| 진입 | 사이드바 "SEO 성장" 클릭. 다른 모듈 데이터를 자동 로드하지 않음 |
| 탭 | ① 진단 ② 키워드·콘텐츠 ③ 예산·예측(시뮬레이션, 실제 집행 없음) ④ 취합·개선 |
| 공통 상단 | 프로젝트/도메인 선택, 데이터 출처 배지, `예측` 배지 표시 규칙, 연결 상태 요약 |
| 데이터 출처 배지 | `수동 입력` / `샘플` / `공식 계정 연동(Phase B)` / `공개 검색 API` |
| 연결 상태 | 기본 "연결 안 함". `ModuleLink(s9→s2|s5|s6)`가 있을 때만 대상 표시 |
| 핵심 금지 | "최상위 노출 보장", "1위 확정", "순위 보장" 문구. 응답 템플릿에서 차단 |

---

## 2. 화면 명세

### S9-01 진단 탭

| 항목 | 내용 |
|---|---|
| 목적 | 기술·온페이지·콘텐츠 관점의 개선 후보를 확인한다 |
| 입력 | URL(선택) + 수동 입력(제목·메타·본문 요약·구조 메모). Phase A는 수동/샘플 중심 |
| 출력 | `SeoDiagnosis.findings[]` — `category`(indexability/crawler_visibility/url/canonical/title/meta/content/image/video), `severity`, `observation`, `suggestion`, `source_mode`, `source_id` |
| 규칙 근거 | 색인 여부 확인, 고유 제목, 스니펫/메타 디스크립션, 설명적 URL, 중복 정규화, 사람 중심 콘텐츠, 이미지 alt·영상 설명(`knowledge/13-seo-and-search-growth.md` KB-SEO-001~008) |
| 게이트 | 개선안은 "검토" 상태로만 생성. 자동 적용·자동 덮어쓰기 없음. 사용자가 "개선안 확정"을 눌러야 다음 탭으로 값이 전달된다(같은 모듈 내부 이동도 명시 클릭) |
| 상태 | 빈 상태(입력 없음) / 로딩 / 결과 없음 / 부분 실패(일부 항목 미확인) / 공개 범위 제한(로그인·유료벽 구역은 진단 불가로 명시) |
| 배지 | 출처 등급 A/B/C. 등급 C는 "검증 필요". 픽셀 수치 단정 금지 |
| Phase | A: 룰 엔진 + 샘플 / B: 소유 확인 계정 공식 데이터 / C: 포털 확장 |

### S9-02 키워드·콘텐츠 탭

| 항목 | 내용 |
|---|---|
| 목적 | 키워드 갭·검색 의도를 매핑하고 제목·메타·구조 개선안을 만든다 |
| 입력 | 타깃 주제, 기존 콘텐츠 메타, 수동 키워드 목록, Phase B 공식 키워드 지표 |
| 출력 | `KeywordGap[]`, `SearchIntentMap[]`, `ContentOptimization{title_proposal, meta_description_proposal, structural_notes, rationale}` |
| 보존 규칙 | 기존 제목·메타는 `source_phrase`로 보존하고 제안은 별도 필드에 저장 |
| 금지 관행 | 메타 키워드 태그 추가, 키워드 스터핑, 글자 수 마법 숫자 목표화(KB-SEO-007) |
| 상태 | 빈 상태 / 로딩 / 데이터 부족 / 의도 충돌(되묻기) / 적용 대기 |
| 연결 | "S2 브리프로 보내기" 클릭 시에만 `ModuleLink(s9→s2)` + 브리프 폼 채움 |
| Phase | A: 수동·샘플 갭 가정 / B: 공식 키워드 데이터 / C: 발견적 확장 |

### S9-03 예산·예측 탭

| 항목 | 내용 |
|---|---|
| 목적 | SEO·광고 투자비용과 예상 성과를 추정하고 예산 배분을 제안한다 |
| 입력 | 예산 범위, 기간, 목표 지표(유입/클릭/전환), 채널 가중치, 과거 실제값(선택) |
| 출력 | `SeoInvestment.forecast[]`(노출·클릭·비용·CTR·평균 CPC·전환), `BudgetRecommendation[]`, `deviation_notes[]` |
| 투명성 | 모든 값에 `예측 / 신뢰도 / 모델 / 기간` 배지, `is_forecast=true`. 과거 지표와 예측의 성격이 다름을 UI에 명시(KB-SEO-009) |
| 오차 설명 | 예측 불일치 후보(신규 계정, 네트워크 포함 여부, 좁은 지역, 키워드 경쟁, 트래픽 분할, 주간→일간 환산)를 체크리스트로 제공(KB-SEO-010) |
| 실행 경계 | 예산 변경·광고 집행 실행 버튼 없음. Phase B/C에서도 사용자 승인 후 별도 시스템에서 수행 |
| 상태 | 빈 상태 / 입력 부족 / 계산 중 / 신뢰도 낮음 / 실제값 대기 / 부분 실패 |
| Phase | A: 룰·샘플 시뮬레이션 / B: 공식 데이터 + 회귀 / C: ML 최적화 |

### S9-04 취합·개선 탭

| 항목 | 내용 |
|---|---|
| 목적 | 진단·예측·실제값을 라운드 단위로 취합하고 다음 개선안을 만든다 |
| 출력 | `SeoRound{diagnosed_at, forecast, actual, delta, improvements[]}` |
| 개선 루프 | 진단 → 예측 → (외부 집행) → 실제 입력 → 차이 분석 → 개선안. 자동 반영 없음 |
| 전달 | "콘텐츠로 보내기" 클릭 시에만 `ModuleLink(s9→s5)`, "브리프로 보내기" 클릭 시에만 `ModuleLink(s9→s2)` |
| 관찰 시점 | 검색 반영 지연을 고려해 재측정 시점을 수 주 뒤로 제안(KB-SEO-002). 사용자가 조정 가능 |
| 상태 | 라운드 없음 / 실제값 미입력 / 차이 큼 / 개선안 대기 / 링크 생성됨 |
| Phase | A: 수동 실제값 입력 + 샘플 / B: 공식 지표 자동 수집 / C: 개선 제안 자동화(실행은 승인) |

---

## 3. 컴포넌트

| 컴포넌트 | 목적 | 주요 상태·속성 | 토큰·접근성 |
|---|---|---|---|
| `SeoSourceBadge` | 데이터 출처와 신뢰 수준 표시 | `수동`/`샘플`/`공식`/`공개`, `source_id` | `surface.subtle`, 등급 색상만 사용, 텍스트 병기 |
| `DiagnosisFindingRow` | 진단 항목 한 줄 | `category`, `severity`, `observation`, `suggestion`, `source_id` | 심각도는 색+아이콘+텍스트, 확장 시 상세 근거 |
| `KeywordGapTable` | 키워드 갭 비교 | `keyword`, `current`, `target`, `intent`, `confidence` | 헤더 고정, 정렬 가능, 숫자 우선순위 아님 명시 |
| `IntentMapChip` | 검색 의도 분류 | `informational`/`navigational`/`transactional`/`commercial`, `확인 필요` | 칩+텍스트, 키보드 선택 가능 |
| `ContentOptimizationPanel` | 제목·메타·구조 제안 | `source_phrase`, `proposal`, `rationale`, `confirmed` | 원문과 제안을 분리된 영역에 표시, 자동 덮어쓰기 금지 안내 |
| `BudgetSimulator` | 예산↔성과 추정 | `budget`, `horizon`, `scenario`, `is_forecast` | 슬라이더+숫자 입력, `예측` 배지 항상 표시 |
| `ForecastBadge` | 예측임을 명시 | `model`, `confidence`, `period` | 항상 `예측` 텍스트 포함, 실제 성과 오인 방지 |
| `DeviationChecklist` | 예측 오차 후보 | `reason`, `checked` | 다중 선택, 단정 금지 문구 |
| `SerpSourceChip` | 관측 출처 표시 | `공식 API`/`공개 검색`/`수동`, `observed_at` | 출처 클릭 시 등록부 안내(외부 이동은 사용자 클릭) |
| `RoundDeltaCard` | 예측·실제 차이 | `forecast`, `actual`, `delta`, `period` | 부호+텍스트 병기, 색상만으로 전달 금지 |
| `ImprovementCard` | 개선안과 전달 버튼 | `improvement`, `target_module`, `link_state` | 버튼 없음→"연결 안 함", 클릭 시에만 `ModuleLink` |
| `ModuleLinkChip` | 연결 상태 표시 | `source`, `target`, `created_by` | 해제 버튼 제공, 자동 생성 없음 |

---

## 4. 공통 상태 정의

| 상태 | 화면 표현 | 진행 가능 여부 |
|---|---|---|
| 빈 상태 | 입력 요청 + 샘플 데이터로 둘러보기 안내 | 입력 후 가능 |
| 로딩 | 스켈레톤 + 작업 ID(JobDrawer 연결) | 대기 |
| 데이터 부족 | 부족한 필드 목록 + 수동 입력 유도 | 보완 후 가능 |
| 계정 미연결 | "공식 데이터는 Phase B에서 연결" 안내 | 수동/샘플로 가능 |
| 공개 범위 제한 | 로그인·유료벽 구역 진단 불가 명시 | 해당 항목 제외 |
| 예측 신뢰도 낮음 | `신뢰도 낮음` + 후보 오차 체크리스트 | 사용자 확인 후 가능 |
| 부분 실패 | 성공 항목 유지, 실패 항목만 재시도 | 부분 가능 |
| 연결 안 함 | 기본값. 링크 생성 버튼만 노출 | 클릭 시 생성 |

---

## 5. 모듈 경계·데이터 계약

- S9는 S4 Insights·S6 Forecast의 데이터를 복제하지 않는다. 필요한 지표는 사용자가 명시적으로 연결할 때만 ID 참조한다.
- `ModuleLink` 생성 경로는 `ImprovementCard`의 전달 버튼과 설정 화면의 연결 해제뿐이다. 자동 링크 API는 없다.
- `KnowledgeService`는 `seo_growth` 도메인 청크(`KB-SEO-…`)만 S9에 제공하고, 근거 등급과 출처 ID를 함께 반환한다.
- 모든 예측 응답은 `is_forecast=true`이며 순위 보장 문구를 포함하지 않는다.

### 5-1. 확정 정책 (DECISION-LOG J-16~20)

- **계정**: 소유 확인 계정만 사용. 미확인 시 수동 입력·샘플 유지, 실제 보유 여부만 Phase B 연동 전 확인.
- **포털**: Google 1순위, 네이버 2순위, 그 외 Phase C.
- **SERP**: 공식 API·공개 검색 API·수동 입력만. `SerpObservation`에 출처·관측시각·권리 메모 기록.
- **보유기간**: Phase A 입력·결과 90일, Phase B 예측·실적 12개월, 식별정보 미저장, 즉시 삭제 요청 항상 허용.
- **S6 경계**: 지표 복제 0건, `ModuleLink` 클릭 시에만 참조.

## 6. 수용 기준

- [ ] 4개 탭이 각각 독립 상태를 가지며 탭 전환 시 값이 섞이지 않는다.
- [ ] 기본 연결 상태가 "연결 안 함"이고, 클릭 전에는 `ModuleLink`가 생성되지 않는다.
- [ ] 예측 값 100%에 `예측/신뢰도/모델/기간` 배지가 붙는다.
- [ ] 순위 보장 문구가 화면·응답·안내에 0건이다.
- [ ] 로그인·유료벽·스크래핑 우회 경로가 없고, 공개 범위 제한 상태가 정의되어 있다.
- [ ] 실제 계정 API 호출·과금·집행 실행이 MVP에 포함되지 않는다.
- [ ] 로컬 전용 경로·파일명·캡처 링크가 0건이다.
