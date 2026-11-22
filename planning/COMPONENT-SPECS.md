# COMPONENT-SPECS — 컴포넌트 명세

작성일: 2026-11-22  
전제: shadcn/ui + Tailwind v4 토큰 위에 구현. 모든 이름은 `DESIGN-PLAN.md` 토큰/`SCREEN-SPECS.md` 화면과 1:1 대응.  
금지: 이모지 아이콘, 그라데이션, 글래스모피즘, 원본 사이트 마크업 복제, 인라인 스타일 난립.

---

## 1. 컴포넌트 계층

```text
primitives/     (shadcn 기반 최소 단위)
  Button, Badge, Input, Textarea, Select, Tabs, Checkbox,
  Dialog, DropdownMenu, Tooltip, Skeleton, Progress, Separator, ScrollArea
domain/         (프로젝트 도메인)
  CampaignSwitcher, ProviderBadge, CostBadge, JobStatusBadge,
  CollectTargetForm, VerticalTabs, SourceTile, CollectJobCard,
  ComplianceBadge, CollectedItemCard,
  ReferenceCard, BoardCard, ConceptCard, AssetCard, ReviewChecklist,
  ChannelTile, PublishQueueRow, MetricCard, InsightRow, EmptyState,
  OverlapFlag, SeriesTag, IdeaCard, ForecastBadge, SegmentTag, ModuleLinkChip
layout/
  AppShell, Sidebar, Topbar, DetailPanel, JobDrawer, PageHeader
composite/
  CollectorPanel, OwnContentPanel, ForecastPanel, SegmentPanel,
  AiComposePanel, GenerationGrid, CompareView, ApprovalGate, CsvMapper
```

---

## 2. 공통 Primitives (shadcn 매핑)

| 컴포넌트 | shadcn 기반 | 변형/규칙 |
|---|---|---|
| Button | `button` | variant: `primary / secondary / ghost / danger`, size: `sm/md`, 아이콘은 Lucide 16px + 라벨 |
| Badge | `badge` | 상태 색상 토큰 사용(초안=secondary, 검수중=warning, 승인=success, 실패=danger) |
| Input/Textarea | `input`, `textarea` | 포커스 링 `border.strong` 2px, 높이 36/40px |
| Select | `select` | 키보드 탐색 가능, 그룹 라벨 지원 |
| Tabs | `tabs` | 언더라인 활성(primary.500 2px), `role=tablist` |
| Dialog | `dialog` | modal=false 드로어도 동일 컴포넌트, ESC 닫힘, focus trap |
| Skeleton | `skeleton` | 카드와 동일 치수, pulse 1.4s |
| Progress | `progress` | 단계 텍스트("2/5")와 함께 사용 |
| Table | `table` + TanStack Table v9 | 숫자 우측 정렬 + `font.mono`, sticky 헤더 |
| Chart | Recharts 3.x | 색상은 토큰만, 축 라벨 12px |

---

## 3. 도메인 컴포넌트 상세

### 3-1. AppShell / Sidebar / Topbar

| 항목 | 정의 |
|---|---|
| AppShell | `sidebar 240px + main 1fr + (detail 380px 조건부)`. 1280 이하 detail은 오버레이, 1024 이하 sidebar 접힘 |
| Sidebar | 8개 메뉴(Collector/Own Content/References/Studio/Publishing/Insights/Performance/Segments) + 하단 설정·연결. 그룹 라벨 `[수집·자산]/[작업]/[분석]`. 활성 아이템 `primary.50` 배경 + `primary.500` 텍스트 |
| Topbar | CampaignSwitcher, 전역 검색(Ctrl/Cmd+K), ProviderBadge, 사용량/비용, 사용자 메뉴 |
| CampaignSwitcher | 장기렌트 캠페인 컨텍스트. 전환 시 모든 화면 데이터 재바인딩 |
| ProviderBadge | 현재 추론 Provider(Ollama 기본). 연결 상태 점 + 모델명 툴팁 |
| CostBadge | 이번 세션 예상 비용, `font.mono`. 로컬이면 "로컬 · 무과금" |

### 3-2. S0 Collector (자체 설계)

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| CollectTargetForm | 분야 키워드 / 우리 서비스 URL / 경쟁사 도메인 목록 | 소스 등록 → CollectSource 생성 | 자체 설계 |
| VerticalTabs | `전체 / 영상 / 이미지 / 블로그 / 뉴스` + 건수 배지 | 독립 URL(`?vertical=`) 전환, 필터 유지 | Foreplay Discovery 탭(패턴만) |
| SourceTile | 소스명/방식(공식API·공개페이지·RSS·수동)/상태/마지막 수집 | 수집·설정·사용 토글 | Postiz 연결 카드(패턴만) |
| CollectJobCard | 진행률/수집·중복·대기 건수/실패 | 진행 바, 중지, 실패만 재시도 | 자체 설계 |
| CollectedItemCard | 썸네일/제목/카피/게시일/원문 URL/추출 필드 | 체크→"분석"→S1 이관, 메타 보존 | Snipit 보드 카드, Foreplay 스와이프(패턴만) |
| ComplianceBadge | — | "공개 범위만 · robots.txt/ToS 준수" 상시 | 자체 규칙 |

> Collector의 어댑터·라이선스· compliance 체크리스트는 `ARCHITECTURE.md`에 명세한다. UI 컴포넌트는 소스 구현을 직접 호출하지 않고 `CollectorService` API만 사용한다.

### 3-3. S1 References

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| ReferenceCard | 썸네일/플랫폼/캡션/저장일 | 클릭→DetailPanel, 보드 이동, 분석 요청 | Foreplay 스와이프 카드, Snipit 보드 카드 |
| BoardCard | 보드명/개수/최근수정 | 필터, 공유(후속) | Snipit `가격 강조 12개` |
| SearchFilterBar | 검색어+세그먼트(썸네일·카피 / 장면·대사)+플랫폼/상태 필터 | 결과 목록 갱신, 3크레딧 안내는 자체 비용 배지로 대체 | Snipit search, Foreplay Discovery |
| AnalysisPanel | AI 추출 결과(후킹/메시지/CTA/타깃/톤) | 구조화된 목록 + 원문 링크 | Foreplay Lens 메타데이터 |

### 3-4. S2 Studio

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| BriefForm | 상품/타깃/브랜드 톤/금지어/참고 레퍼런스 | 제출→Job 생성 | Snipit ad-creation 4단계 |
| ConceptCards | 콘셉트 3안(제목/한 줄/톤) | 선택→카피 생성, 선택 strongly 표시 | 자체 설계 |
| AiComposePanel | 프롬프트/Provider/모델/옵션/예상비용/생성 | 스트리밍 텍스트, 중지 버튼 | 공통 패턴 |
| GenerationGrid | 4장 결과 카드 + 재생성/수정/선택 | 카드 클릭→DetailPanel, 부분 실패 재시도 배지 | **MONOV 4장 결과 그리드** |
| AssetCard | 이미지/카피/프롬프트/버전/메타 | 비교, 버전 선택, 승인으로 전달 | MONOV edit/history |
| CompareView | 두 버전 | 나란히 또는 슬라이더 | 자체 설계 |
| ReviewChecklist | 항목별 체크(상품명/가격/금지어/톤) | 모두 통과 시 ApprovalGate 활성 | Buffer Collaborate/승인 |
| ApprovalGate | 변경 요약 + 체크 결과 | 승인→상태 `approved`, 승인자·시각 기록 | Buffer approvals |

### 3-5. S3 Publishing

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| ChannelTile | 채널명/연결상태 | "연결 필요" 배지, 클릭→연결 안내(후속) | Buffer 채널 타일, Postiz 채널 아이콘 |
| PublishQueue | 게시물/채널/예약시각/상태 | 주간 캘린더 그리드 + 목록 토글, 취소 | Buffer publish 캘린더, Postiz 캘린더 |
| ChannelPreview | 원문 → 채널별 변환 텍스트 | 포맷/길이/해시태그 미리보기 | Buffer Post/Reel/Story |
| DryRunBadge | — | "시연 · 외부 전송 없음" 상시 표시 | 자체 규칙 |

### 3-6. S4 Insights

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| CsvMapper | 업로드 CSV + 컬럼 선택 | 지표 매핑(노출/클릭/광고비/상담/계약) | 자체 설계 |
| MetricCard | 지표명/값/증감 | 지표 카드, `font.mono` 숫자 | Buffer `Impressions 521.4k +14.0%` |
| TrendChart | 기간별 지표 | 라인/막대, 기간 칩(7/30일) | Buffer insights |
| TopContentTable | 콘텐츠별 성과 | TanStack Table 정렬 | Foreplay Lens 비교 |
| ImprovementCard | AI 개선안 | "새 브리프로 사용" 버튼 → F7→F2 | Buffer Takeaways + 자체 순환 |

### 3-7. S5 Own Content Hub (독립 모듈)

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| OwnContentTable | 채널/게시일/포맷/제목/상태/성과연결 | 정렬·필터, 행 클릭→DetailPanel | 자체 설계 + Motion 그룹화(패턴만) |
| ContentImport | 수동 입력 / CSV | OwnContent 생성, 실패 행 표시 | 자체 설계 |
| OverlapFlag | 새 아이디어 제목·카피 vs 기존 콘텐츠 | `신규 / 유사 / 확장` 배지 + 기존 링크 | 자체 규칙(토큰 유사도 → Phase B 임베딩) |
| SeriesTag | 시리즈명/순서 | 시리즈 묶음, "다음 편 주제" 메모 | Motion 그룹화(패턴만) |
| IdeaCard | 제목/타깃/참고 항목 | "이 아이디어로 기획" → S2 BriefForm 채움 | 자체 설계 |
| ModuleLinkChip | `S0 → S5 참고` 등 | 사용자 클릭으로 생성, 설정에서 해제 | 자체 규칙 |

> S5는 `CollectorService`를 호출하지 않는다. S0 결과는 사용자가 "참고로 가져오기"를 누른 뒤에만 `ModuleLink`로 첨부한다.

### 3-8. S6 Performance & Forecast (독립 모듈)

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| MetricSeriesPicker | 지표/집계단위/기간 | 시계열 선택, 샘플 배지 | Buffer 기간 칩 |
| TrendChart | 실적 + 예측 구간 | 실선(실적)/점선(예측), 툴팁에 모델·신뢰도 | Motion visual-first 리포트(패턴만) |
| ForecastBadge | 모델/신뢰도/기간 | "예측 · 신뢰도 n% · 모델명" 상시 | 자체 규칙(오인 방지) |
| ForecastPanel | 모델 선택/예측 기간 | baseline 이동평균(MVP) → ML/DL(Phase B/C) | 자체 설계 |
| ContentMetricTable | 콘텐츠별 실적 | "S5 콘텐츠와 연결" 클릭 시 `content_id` 참조 | 자체 설계 |

> S6은 S4의 데이터를 복사하지 않고 전용 `MetricSeries`를 쓴다. 자동 예측→브리프 생성은 금지.

### 3-9. S7 Audience Segments (독립 모듈)

| 컴포넌트 | 입력 | 출력/상태 | 근거 패턴 |
|---|---|---|---|
| AudienceDatasetPicker | CSV/샘플 + 식별자 제외 옵션 | 업로드, 개인정보 경고 | 자체 규칙 |
| FeatureSelector | 숫자/범주형 변수 체크 | 선택 상태, 스케일링/결측 표시 | 자체 설계 |
| KMeansControls | k=3~6, 시드, (Phase B) silhouette | 군집 실행(Phase B), 점수 표시 | 자체 설계 |
| SegmentMap | PCA 2D 좌표 + 군집 색 | 산점도, 호버 프로필 | Motion 그룹화(패턴만) |
| SegmentProfileCard | 그룹명/특징/크기 | 이름 편집(사람 확정), 맞춤 콘텐츠 버튼 | 자체 설계 |
| PrivacyNotice | 보유기간/삭제 정책 | 상시 안내, 식별자 미저장 확인 | 자체 규칙 |

> S7의 맞춤 콘텐츠는 추천 결과가 아니라 `segment_id` 참조 링크다. 자동 적용 금지.

### 3-10. 공통 상태·피드백

| 컴포넌트 | 규칙 |
|---|---|
| EmptyState | 아이콘 + 한 줄 설명 + 주 액션 버튼. "데이터 없음" 금지 |
| JobStatusBadge | queued/running/streaming/reviewing/approved/published/failed 색상 매핑 |
| JobDrawer | 실행 중/대기/실패 작업 목록, 단계 진행률, 재시도 버튼 |
| DetailPanel | 선택 항목의 원본/분석/버전/승인/로그 탭(380px) |
| Toast | 보조 피드백만. 핵심 상태는 배지/패널에 상시 표시 |

---

## 4. 접근성 규칙 (모든 컴포넌트 공통)

- 포커스 링 2px `border.strong`, 키보드 Tab 순서 논리적.
- 아이콘 전용 버튼은 `aria-label` 필수.
- 상태 배지는 색만으로 의미 전달 금지 → 텍스트 라벨 병기.
- 모달은 focus trap + ESC 닫힘 + 닫힌 뒤 트리거로 포커스 복귀.
- 숫자/코드/토큰은 `font.mono`, 표는 의미 구조(`<th scope>`) 유지.
- 최소 대비 4.5:1(본문), 3:1(큰 텍스트/경계).

---

## 5. 재사용 금지 목록

| 항목 | 이유 |
|---|---|
| `capture/page.html` 및 `_astro/*`, Webflow CDN 자산 | 표현 저작권·트레이드드레스·ToS 미확인 |
| MONOV `app/src`, `app/dist` 코드 | Craft Anything 생성물, 품질 58%·라이선스 불명 → 패턴만 참고 |
| 레퍼런스 로고/브랜드 이미지 | 타사 자산, 권한 확인 전 사용 금지 |
| 추적 스크립트(GA/GTM/Meta/Amplitude/Channel.io/HubSpot/OptinMonster 등) | 오류 유발 + 프라이버시 리스크 |
| `motionapp-com/capture/**` | 출처 불일치(Creatify 캡처) → 근거로 사용 금지 |
| `creatify-ai/capture/routes/features-agent/**` | Motion 진본으로 재분류. 패턴 참고만, UI/자산 복제 금지 |
| 캡타차 해결·지문 위조·프록시 회전·로그인 쿠키 공유 스크래퍼 | Meta/TikTok ToS의 명시적 자동 수집 금지 조항과 충돌 → 사용 금지 |
| Firecrawl 코어 self-host/수정 | AGPL-3.0 카피레프트 → MCP 클라이언트만 사용, 코어 내장 금지 |

---

## 6. 이 문서의 수용 기준

- [ ] S0 Collector 컴포넌트가 5개 파트(전체/영상/이미지/블로그/뉴스)를 지원한다.
- [ ] 모든 화면 요소가 위 컴포넌트 이름으로 매핑된다.
- [ ] shadcn primitives와 도메인 컴포넌트가 분리되어 있다.
- [ ] 각 상태 컴포넌트(Empty/Loading/Error/Approval/DryRun)가 정의되어 있다.
- [ ] 접근성 규칙이 모든 컴포넌트에 적용된다.
- [ ] 재사용 금지 목록이 명시되어 있다.
