# SCREEN-SPECS — 화면 명세

작성일: 2026-11-22  
기준 뷰포트: 1440×900 (보조 1280 / 768). 한국어 UI.  
관련: `DESIGN-PLAN.md`, `COMPONENT-SPECS.md`, `ARCHITECTURE.md`

> 표기: 각 화면은 **목적 / 레이아웃 / 주요 요소 / 상태 / 근거 레퍼런스**를 갖는다. 근거는 실제 캡처 경로이며, 출처 불일치(Motion) 및 이미지 직접 판독 불가는 `REFERENCE-AUDIT.md`에 명시된 한계를 따른다.  
> **2026-11-22 개정**: 캡처는 참고용이고, 수집·검색·분석 파이프라인은 이 프로젝트용으로 자체 설계한다. S0 Collector를 신설하고 S1~S4와 연결했다. Motion은 `creatify-ai/capture/routes/features-agent/**`가 진본으로 확인되어 그룹화/태깅/모멘텀 카드 패턴만 참고한다(`motionapp-com/capture/**`는 Creatify라 제외). 추가로 **S5 우리 콘텐츠 허브 / S6 성과·예측 / S7 오디언스 세그먼트**를 독립 모듈로 기획한다.

---

## 전역 셸 (App Shell) — 화면 번호 없음

- **목적**: 프로젝트 컨텍스트 고정, 전역 탐색, AI 작업 상태 상시 노출.
- **레이아웃**: Sidebar 240px | Main 1fr | DetailPanel 380px(조건부). 상단 Topbar 56px.
- **Topbar**: CampaignSwitcher(장기렌트 캠페인), 전역 검색 `Ctrl/Cmd+K`, ProviderBadge(Ollama), CostBadge("로컬 · 무과금"), 알림, 사용자.
- **Sidebar**: Collector / **Own Content** / References / Studio / Publishing / Insights / **Performance** / **Segments** + 하단 설정·연결. 그룹 라벨: `[수집·자산]` / `[작업]` / `[분석]`.
- **전역 오버레이**: JobDrawer(작업 큐), DetailPanel(선택 항목), CommandPalette.
- **상태**: 연결 끊김 시 ProviderBadge 경고, 진행 중 작업 수 배지(수집 Job 포함).
- **근거**: Buffer PUBLISH 좌측 사이드바 + Postiz 상단 내비 + Snipit 전역 셸.

---

## S0. Collector — 경쟁사·분야 수집 허브 (F1 전단계) — 신규

> **이 화면은 캡처에 없다.** 7개 레퍼런스는 참고용이고, 도메인/분야 등록 → 수집 → 정리 → 분석 파이프라인은 이 프로젝트용으로 **자체 설계**한다. 구현에 사용할 오픈소스/공개 소스 목록은 `ARCHITECTURE.md`를 따른다.

- **목적**: 사용자가 입력한 **분야 키워드 / 우리 서비스 URL / 경쟁사 도메인**을 기준으로 콘텐츠를 수집하고, 수직(vertical)별로 구분해 탐색한 뒤 S1 References로 넘긴다.
- **레이아웃**: PageHeader → CollectTargetForm(한 줄 등록 바) → **VerticalTabs(전체 / 영상 광고 / 이미지 광고 / 블로그 / 뉴스)** → 좌측 SourceList(240) + 우측 결과 그리드/테이블 + DetailPanel(선택 항목).
- **주요 요소**:
  - CollectTargetForm: 분야 키워드(예: 장기렌트), 우리 서비스 URL, 경쟁사 도메인 여러 개 + `+ 소스 추가`, 수집 범위(공개 페이지만) 체크.
  - **VerticalTabs**: 5개 탭에 각각 건수 배지(예: `영상 24 / 이미지 51 / 블로그 18 / 뉴스 32`). 탭 전환 시 결과와 필터가 유지된다. 각 탭은 독립 URL(`?vertical=video|image|blog|news`)로 북마크·공유 가능.
  - SourceTile: 소스명/도메인, 방식 배지(**공식 API / 공개 페이지 / RSS / 수동 입력**), 연결 상태, 마지막 수집 시각, `수집` / `설정` / `사용` 토글.
  - CollectJobCard: 진행률, 수집 건수, 중복 제거 건수, 레이트리밋 대기, 실패·재시도, `중지`.
  - CollectedItemCard: 썸네일/플랫폼, 제목·카피, 게시일, 원문 URL, 추출 필드(후킹/CTA 후보), 체크박스.
  - ComplianceBadge: "공개 범위만 · robots.txt/ToS 준수" 상시 노출.
  - `선택 항목 분석 → S1` 버튼: 수집함에서 References로 이관하며 원본 URL·수집 소스·수집 시각 메타를 보존.
- **상태**:
  - Empty: "분야나 경쟁사를 등록하면 수집이 시작됩니다" + 예시 키워드 칩.
  - Connecting / KeyRequired: "API 키 필요 · 설정에서 연결" (MVP에서는 수동 입력/공개 소스만 활성).
  - Running: 진행률 바 + "수집 중 n · 중복 skip m · 대기 q".
  - PartialFailure: 실패 소스만 재시도, 나머지는 결과 표시.
  - Blocked: robots.txt/ToS/로그인 필요로 차단 시 사유 명시 · 저장하지 않음.
  - RateLimited: 대기 시간 표시 후 자동 재시도(설정에서 주기 통제).
- **수집 파트별 필드(탭 공통 아래에 표시)**:

| 파트 | 주요 수집 필드 | 1차 소스 | 결과 카드 |
|---|---|---|---|
| 영상 광고 | 썸네일, 길이, 광고주, 카피/자막, 게시일, 원문 URL | 공개 광고 라이브러리 / 공개 영상 페이지 | 세로 썸네일 + 자막 발췌 |
| 이미지 광고 | 이미지, 카피, CTA, 광고주, 게시일, 원문 URL | 공개 광고 라이브러리 / 공개 페이지 | 이미지 + 카피/CTA |
| 블로그 | 제목, 본문 요약, 발행일, 작성자, RSS/사이트맵, 원문 URL | RSS / 사이트맵 / 공개 글 | 제목 + 요약 + 발행일 |
| 뉴스 | 헤드라인, 요약, 언론사, 발행일, 원문 URL | 공개 뉴스 RSS / 공개 데이터셋 | 헤드라인 + 언론사 + 시각 |

- **근거**: **자체 설계**. UI 패턴만 `snipit-im/capture/routes/features-boards`(보드/개수 배지), `foreplay-co/capture/routes/discovery`(필터·탭), `buffer-com/capture/routes/community`(상태 목록) 참고.

---

## S1. References — 레퍼런스 탐색·분석 (F1)

- **목적**: S0 Collector에서 이관된 콘텐츠와 직접 저장한 레퍼런스를 정리하고, AI로 후킹/메시지/CTA를 추출해 S2 브리프의 입력으로 만든다.
- **레이아웃**: PageHeader → SearchFilterBar → 좌측 보드 목록(240) + 우측 카드 그리드/테이블 토글.
- **주요 요소**:
  - SearchFilterBar: 검색어, 세그먼트(썸네일·카피 / 장면·대사), 플랫폼/활성 상태 필터, 정렬(최근 수정일순).
  - ReferenceCard: 썸네일, 플랫폼 배지, 캡션, 저장일, "보드에 저장", "AI 분석".
  - BoardCard: 보드명/개수(예: `가격 강조 12개`), 공유(후속).
  - AnalysisPanel(우측): 후킹/메시지/CTA/타깃/톤 구조화 목록 + 원문 링크.
- **상태**:
  - Empty: "첫 레퍼런스를 저장하세요" + URL 입력 버튼.
  - Loading: 카드 스켈레톤 + "분석 중 n/5".
  - Error: 분석 실패 시 재시도 + Provider 전환 링크.
- **근거**: `snipit-im/capture/routes/features-search`, `features-boards`, `features-brand-archive`의 검색 모드·보드·위닝 배지; `foreplay-co/capture/routes/discovery`, `swipe-file`의 AI Search·필터·스와이프 파일.

---

## S2. Studio — 기획·생성·검수 (F2·F3·F4)

- **목적**: 브리프 → 콘셉트 3안 → 카피/프롬프트 → 4장 결과 → 검수·승인.
- **레이아웃**: 상단 3단계 스텝퍼(브리프 / 생성 / 검수) + 좌측 폼(360) + 우측 결과 영역 + 하단 AiComposePanel(접이식).
- **주요 요소**:
  - BriefForm: 상품 URL/이름, 타깃, 브랜드 톤, 금지어, 참고 레퍼런스 선택.
  - ConceptCards: 콘셉트 3안(제목/한 줄/톤), 선택 시 강조.
  - AiComposePanel: 프롬프트 편집, Provider/모델, 옵션, 예상 비용, 생성/중지.
  - GenerationGrid: **4장 결과 카드**(MONOV 패턴) + 재생성/수정/버전/선택. 카드마다 프롬프트·모델 메타.
  - CompareView: 두 버전 나란히/슬라이더.
  - ReviewChecklist + ApprovalGate: 상품명/가격/금지어/톤 체크 → 승인.
- **상태**:
  - Empty: "브리프를 작성하면 콘셉트가 생성됩니다".
  - Streaming: 타이핑 + "생성 중 · 중지".
  - Partial failure: 실패 카드만 재시도 배지.
  - Approval: 초안/검수중/승인됨 배지, 승인자·시각.
- **근거**: `snipit-im/capture/routes/features-ad-creation`의 4단계 흐름·빈 상태·크레딧 안내; `monov-ai-com/capture/routes/*`의 제품사진→4장→편집/히스토리; `creatify-ai/capture`의 Research/Create/Analyze 스티커리와 "Review before approving"; `foreplay-co/capture`의 Briefs 링크.

---

## S3. Publishing — 채널 변환·예약·상태 (F5)

- **목적**: 승인된 자산을 채널별로 변환·미리보고 예약 큐에 넣는다. **실제 발송 없음(Dry-run)**.
- **레이아웃**: 상단 채널 타일 행 → 툴바(List / Calendar, Today/Week/Channels/Tags, 시간대 Seoul) → 주간 그리드 또는 목록 + 우측 미리보기.
- **주요 요소**:
  - ChannelTile: 연결 상태(연결 필요 배지), 채널별 문자 수 제한.
  - PublishQueue: 게시물 카드 + 예약 시각 + 상태(초안/예약됨/시연 발행/취소).
  - ChannelPreview: 원문 → 채널별 변환 텍스트, 해시태그, 미디어 슬롯.
  - DryRunBadge: "시연 · 외부 전송 없음" 상시.
- **상태**: Scheduled(예약 시각/시간대), Published(시연), 취소, 연결 필요.
- **근거**: `buffer-com/capture/routes/publish`의 주간 캘린더·Seoul·Draft·컴포저·예약 모드; `postiz-com/capture`의 비주얼 캘린더·채널 아이콘 행; `creatify-ai` 커넥터 로고 구름(패턴만).

---

## S4. Insights — 성과 분석·개선 (F6·F7)

- **목적**: 성과 CSV를 업로드해 지표를 보고, AI 개선안을 만들어 S2 새 브리프로 순환시킨다.
- **레이아웃**: 기간 칩(7/30일) → MetricCard 4~5개 → TrendChart + TopContentTable → ImprovementCard.
- **주요 요소**:
  - CsvMapper: 업로드 + 컬럼 매핑(노출/클릭/광고비/상담/계약), 샘플 템플릿 링크.
  - MetricCard: 값 + 증감(예: `521.4k +14.0%`), `font.mono`.
  - TrendChart: 기간별 라인/막대.
  - TopContentTable: 콘텐츠별 성과, 정렬 가능.
  - ImprovementCard: AI 개선안 + **"이 개선안으로 새 브리프"** 버튼(F7→F2).
- **상태**: Empty("CSV를 업로드하세요"), 매핑 오류, 계산 중 스켈레톤, 개선안 생성 중.
- **근거**: `buffer-com/capture/routes/insights`의 기간 칩·지표 카드·Top 5 Posts·WEEKLY TAKEAWAYS; `foreplay-co/capture/routes/lens-creative-analytics`의 벤치마크·세그먼트.

---

## S5. Own Content Hub — 우리 콘텐츠 허브 (독립 모듈, S0와 별개)

> **S0가 "남의 콘텐츠 수집"이라면 S5는 "우리 콘텐츠 자산"이다.** 두 화면은 자동으로 이어지지 않는다. S0 결과를 참고할 때도 "참고로 가져오기" 버튼을 눌러야 한다.

- **목적**: 우리가 과거에 만든 콘텐츠를 한곳에서 보고, 새 아이디어가 기존과 겹치지 않게 하거나 시리즈로 확장하고, 다음 콘텐츠 후보를 뽑는다.
- **레이아웃**: PageHeader → 서브탭(보관함 / 겹침·시리즈 / 아이디어 백로그) → 좌측 필터(240) + 중앙 테이블/그리드 + DetailPanel.
- **주요 요소**:
  - OwnContentTable: 채널, 게시일, 포맷(영상/이미지/블로그), 제목, 상태, 성과 연결 여부(`content_id` 참조만).
  - ContentImport: 수동 입력 + CSV 업로드(MVP). CMS/채널 커넥터는 "연동 대기" 배지(Phase B).
  - OverlapFlag: 제목/카피 토큰 유사도 기반 `신규 / 유사 / 확장` 배지. `유사`는 기존 콘텐츠 링크를 함께 표시(임베딩은 Phase B).
  - SeriesBuilder: 기존 콘텐츠를 시리즈로 묶고 "다음 편 주제" 메모.
  - IdeaBacklog: 다음에 만들 콘텐츠 카드. **"S0 결과 참고로 가져오기"** 버튼(명시적 클릭)으로 경쟁사 항목을 첨부.
  - `이 아이디어로 기획` 버튼: S2 BriefForm에 제목/타깃/참고를 채워 이동(사용자 클릭).
- **상태**: Empty("우리 콘텐츠를 등록하세요" + CSV 템플릿) / Importing / Imported / DuplicateWarning / SeriesLinked / IdeaCreated / LinkRemoved.
- **안전장치**: S0와 자동 공유 금지. `ModuleLink`는 `s0.collected_item → s5.idea_backlog` 형태로만 기록. 미디어 재호스팅 금지.
- **근거**: **자체 설계**. 그룹화/AI 태깅/모멘텀 카드 패턴만 `creatify-ai/capture/routes/features-agent/**`(Motion 진본) 참고, 보드는 Snipit features-boards 참고.

---

## S6. Performance & Forecast — 성과·예측 (독립 모듈, S4와 별개)

> S4가 "이번 성과를 해석하는 화면"이라면 S6은 "추이를 이어 보고 미래를 예측하는 화면"이다. 예측값은 **반드시 예측 배지**와 함께 표시한다.

- **목적**: 과거 성과를 시계열로 보고 다음 기간의 추이를 예측해 본다(ML/DL은 Phase B/C).
- **레이아웃**: PageHeader(기간/지표 선택) → MetricCard 행 → TrendChart(실적 실선 + 예측 점선 신뢰구간) → ForecastPanel → ContentMetricTable.
- **주요 요소**:
  - MetricSeriesPicker: 지표(노출/클릭/광고비/상담/계약), 집계 단위(일/주), 기간.
  - TrendChart: 실적과 예측을 색상·선 스타일로 구분. 툴팁에 `모델/신뢰도`.
  - ForecastPanel: 모델 선택(MVP `이동평균 baseline`만, Phase B `선형회귀/statsmodels`, Phase C `LightGBM/시계열 DL`), 예측 기간(7/30일), 신뢰도 배지.
  - ContentMetricTable: 콘텐츠별 실적. **"S5 콘텐츠와 연결"** 버튼 클릭 시 `content_id`만 참조.
  - ScenarioNote: "예측은 참고용, 실제 성과 아님" 상시 문구.
- **상태**: NoData / SampleData(`샘플` 배지) / Uploaded / Forecasting / Result / LowConfidence(신뢰도 낮음 경고) / ModelUnavailable.
- **안전장치**: S4와 데이터를 복제하지 않음. S6 전용 `MetricSeries`를 두고, 연결은 `ModuleLink`로만 표현.
- **근거**: **자체 설계**. 지표 카드/기간 칩은 Buffer insights, 시각적 리포트/모멘텀은 Motion 진본(`creatify-ai/capture/routes/features-agent/**`) 패턴 참고.

---

## S7. Audience Segments — 타깃 분류·세그먼트 (독립 모듈)

> S6이 "성과"를 다룬다면 S7은 "사람/고객사 그룹"을 다룬다. 개인정보를 최소화하고, 군집 라벨은 사람이 확정한다.

- **목적**: 고객사·리드·분석 데이터로 타깃을 분류·군집화하고, 그룹별 맞춤 콘텐츠 방향을 확인한다(k민즈 기반, Phase B 실제 실행).
- **레이아웃**: PageHeader → 좌측 데이터/변수 패널(280) + 중앙 군집 시각화 + 우측 세그먼트 프로필(340).
- **주요 요소**:
  - AudienceDatasetPicker: CSV/샘플 선택, 식별자 제외 옵션(기본 on), 업로드 시 개인정보 경고.
  - FeatureSelector: 숫자/범주형 변수 체크. 범주형은 one-hot(Phase B), 결측/스케일링 상태 표시.
  - KMeansControls: k=3~6 슬라이더, 랜덤 시드, (Phase B) elbow/silhouette 점수.
  - SegmentMap: PCA 2D 산점도(MVP는 샘플 좌표) + 군집별 색상.
  - SegmentProfileCard: 그룹명(신규/기존/관심/잠재 등 사람이 편집), 특징 요약, 크기.
  - `이 그룹에 맞춤 콘텐츠` 버튼: 클릭 시 `segment_id` 참조만 S2/S5에 전달(자동 추천 아님).
- **상태**: NoData / SampleData / FeaturesSelected / Clustering(Phase B) / Result / PrivacyWarning / LowSilhouette.
- **안전장치**: 원본 고객 식별자 미저장, 범주형 익명화, 보유기간/삭제 요청 정책 안내. 제외된 개인정보는 화면에도 표시하지 않는다.
- **근거**: **자체 설계(k-평균)**. 타깃 시각화는 Motion 진본의 그룹화 패턴, 필터 카드는 Snipit 참고.

---

## 설정 / 연결 (전역)

- **목적**: 브랜드 키트, Provider 키 상태, 연결 관리, 비용/이력 확인.
- **요소**: BrandKit 편집(톤/금지어/상품정보/색상), Provider 상태(마스킹 키), 연결 카드(Postiz/Buffer/MCP — "연결 필요"), **모듈 연결 목록(ModuleLink: source/target/생성자/시각, 해제 버튼)**, 사용량·비용 표, 실패 재시도 로그.
- **근거**: Postiz 에이전트 연결 카드("1 Connect → 2 Ask"), Snipit MCP/브랜드 등록 문구.

---

## 반응형 규칙

| 뷰포트 | 동작 |
|---|---|
| 1440×900 | Sidebar 240 + Main + DetailPanel 380 |
| 1280 | DetailPanel 오버레이 전환 |
| 1024 이하 | Sidebar 접힘(아이콘 레일), 카드 2열 |
| 768 | 8개 화면(Collector·Own Content·References·Studio·Publishing·Insights·Performance·Segments) 세로 스택, VerticalTabs 가로 스크롤 허용(의도된 예외) |

> Foreplay의 390px 가로 오버플로(435px)는 **재현하지 않는다.** 모바일은 MVP 범위 밖이나, 최소한 가로 스크롤이 없도록 설계한다.

---

## 공통 화면 수용 기준

- [ ] 모든 화면에 Empty/Loading/Error/성공 상태가 정의되어 있다.
- [ ] S0 VerticalTabs 5개(전체/영상/이미지/블로그/뉴스)가 독립 URL로 탐색된다.
- [ ] S0 결과 카드에 출처·수집 방식·수집 시각 메타가 붙고 S1로 이관된다.
- [ ] S0->S1->S2->S3->S4->S2 순환이 버튼으로 연결된다.
- [ ] S5/S6/S7이 각각 독립 라우트로 진입 가능하고, 빈 데이터여도 샘플로 작동한다.
- [ ] 모듈 간 연결은 사용자 클릭으로만 생성되며 설정에서 해제할 수 있다.
- [ ] S6 예측에 "예측/신뢰도/모델" 배지, S7에 개인정보 경고가 표시된다.
- [ ] 발행 화면에 Dry-run 배지가 상시 표시된다.
- [ ] AI 결과에 모델·비용·상태 메타가 붙는다.
- [ ] 토큰/컴포넌트 이름이 DESIGN-PLAN/COMPONENT-SPECS와 일치한다.
