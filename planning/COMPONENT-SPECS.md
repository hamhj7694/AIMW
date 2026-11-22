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
  ProductionModePicker, ReferenceSearchPanel, ReferenceCard(S8), ManualReferenceInput,
  AnalysisCard, TermMappingPreview, ClarificationCard, ConfidenceBadge,
  GateStepper, StoryboardGrid, Composition3DSchemaView, AnimaticTimeline,
  ShotTimeline, ShotVersionChip, RevisionPanel, CostTimeGauge,
  SafeZoneOverlay, VideoTemplatePicker,
  InputModePicker, MediaSourcePicker, TransformOperationPicker, CompositeLayerPanel,
  MaskingCanvasStub, BeforeAfterCompare, RightsConfirmationDialog, TransformCostPreview
layout/
  AppShell, Sidebar, Topbar, DetailPanel, JobDrawer, PageHeader
composite/
  CollectorPanel, OwnContentPanel, ForecastPanel, SegmentPanel,
  AiComposePanel, GenerationGrid, CompareView, ApprovalGate, CsvMapper,
  VideoWorkbenchPanel
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
| Sidebar | 10개 메뉴(Collector/Own Content/References/Studio/Publishing/Insights/Performance/Segments/Video Workbench/SEO & Search Growth — 별도 문서 작성중, 항목만 표시) + 하단 설정·연결. 그룹 라벨 `[수집·자산]/[작업(S8 포함)]/[분석]`. 활성 아이템 `primary.50` 배경 + `primary.500` 텍스트 |
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

### 3-10. S8 Video Workbench (독립 모듈, S2 서브탭 아님)

> S8 3탭(분석/제작/수정)은 상태를 섞지 않는다. 이 절의 `mode`는 **제작 유형(`productionMode`: 실사/숏폼/영화/영상/애니메이션/모션그래픽)**을 뜻하며, `SCREEN-SPECS.md`의 내부 탭 쿼리(`?tab=analysis|production|revision`)와는 별개다. `mode`는 프로젝트 단위 명시 선택값(기본 미선택)이며 모든 S8 컴포넌트의 공통 입력이다. 자동 감지·자동 변경 금지, 변경 시 확인 모달을 거치고 기존 결과를 덮어쓰지 않는다. 제작 유형·숏폼·모션그래픽·레퍼런스 서치 기준은 별도 문서로 작성중이며 이 문서에서는 내용을 다루지 않는다.

| 컴포넌트 | 목적 | 입력(props) | 출력/상태 | mode 의존 | 토큰 | a11y·인터랙션 |
|---|---|---|---|---|---|---|
| ProductionModePicker | 제작 유형 6종 프로젝트 단위 선택 | `실사/숏폼/영화/영상/애니메이션/모션그래픽`, 현재 값(기본 미선택), 프로젝트 컨텍스트 | 미선택 시 안내 + 3탭 진입 차단. 변경 요청 → 확인 모달(영향 목록) → 확정 전 기존 결과 유지 | 없음(값 자체가 mode) | `s8.mode.picker`, `radius.md`, `primary.50`, `text.muted`, 유형별 Lucide 선형 아이콘 + 텍스트 라벨 | `role=radiogroup`, 미선택 상태 텍스트 명시, 모달 focus trap + ESC + 포커스 복귀 |
| ReferenceSearchPanel | 제작 전 레퍼런스 서치(자동/수동) | `mode`(검색 축), 검색어, 검색 버튼, S0 가져오기 버튼 | 자동=버튼 클릭 시에만 공개 범위 수집, 수동=`ManualReferenceInput`. 결과 없음·쿼터 소진·중복·낮은 신뢰도 상태 | 높음(검색 축 기본값) | `surface.default`, `warning.50`, `s8.reference.card`, `s8.dryRun.badge` | 검색 버튼 `aria-label`, 상태 변경 `aria-live=polite`, 출처 등급 텍스트 병기, S0 링크는 "S8 참고로 가져오기" 라벨 |
| ReferenceCard (S8) | 수집·수동 레퍼런스 결과 카드 | 원문 URL·썸네일 URL·타임코드·출처 등급·권리 배지·provenance·자동/수동 구분 | 선택→근거로 첨부, 중복 배지, **미디어 바이트 미저장** | 중간(유형별 근거 라벨) | `s8.reference.card`, `text.xs`, `font.mono`, `border.default` | `aria-label`에 출처·타임코드·권리 상태, 외부 링크임을 텍스트로 안내 |
| ManualReferenceInput | URL·메모·타임코드 직접 입력 | 원문 URL(필수), 메모, 타임코드 시작/끝, 출처 등급, 권리 확인 체크, 검색 축 태그 | `ManualReference` 생성, 권리 미확인 시 저장 차단, 타임코드 역전 오류 표시 | 중간(검색 축 태그 기본값) | `Input/Textarea`, `Checkbox`, `border.strong`, `warning.50` | 필수 필드 `aria-required`, 오류 `aria-describedby`, 타임코드 형식 힌트 제공 |
| AnalysisCard (내용/기술 2종) | 2레이어 영상 분석 결과 표시 | `layer=내용|기술`, 항목(내용: 훅/구조/메시지/CTA/타깃/감정곡선 + timecode, 기술: 앵글·기법·전환·조명·구도·편집 + confidence), `mode` | timecode 클릭→해당 구간만 미리보기, 신뢰도 배지, 접기/펼치기 | 높음(분석 차원) | `s8.analysis.card`, `s8.confidence.badge`, `font.mono` | 레이어 구분 헤더 + `aria-label`, timecode 버튼 라벨, 배지 텍스트 병기 |
| TermMappingPreview | 자연어 → 표준 용어 매핑 검토 | 원문, 매핑 후보(표준용어/근거/신뢰도/지식베이스 출처), `mode` | 4열 표(원문/표준용어/근거/신뢰도), 행 선택, 낮은 신뢰도 되묻기 표시, 사용자 확인 전 `VideoIntent` 생성 차단 | 중간 | `s8.term.table`, `s8.confidence.badge`, `Table` | `<th scope="col">`, 행 선택 키보드 가능, 비활성 사유 텍스트 제공 |
| ClarificationCard | 모호·저신뢰 항목 되묻기 | 모호 항목, 질문 문구, 선택지/자유 입력 | 답변→매핑 재계산, 미답변 시 다음 단계 잠김 | 낮음 | `warning.50`, `warning.500`, `surface.default` | 질문 `aria-live=polite`, 포커스 이동, ESC 닫되 미답변 상태 유지 |
| ConfidenceBadge | 분석·매핑 신뢰도 표시 | `value 0~1`, `level 상|중|하`, 근거 툴팁 | "신뢰도 높음/보통/낮음" 텍스트 + 색, 낮음은 되묻기 트리거 | 없음 | `s8.confidence.badge` | 색만 의존 금지, 툴팁 포커스로 열림 |
| GateStepper | 4게이트 진행·잠금·승인 | 4게이트(콘티/3D 구도 스키마/애니매틱/단계별 렌더), 상태(완료/현재/잠김), 승인 여부, `mode` | 현재 단계 강조, 미승인 시 다음 비활성 + 사유, 건너뛰기 없음 | 중간(산출물 라벨) | `s8.gate.stepper` | `aria-current="step"`, 잠김 단계 `aria-disabled` + 사유 텍스트, 완료 단계만 이동 |
| StoryboardGrid | 게이트 1 콘티 산출물 | shot_id/timecode/샷 설명/선택 상태, `mode`(콘티 서식) | 샷 카드 그리드, 클릭→상세·수정 대상 지정, 승인 체크 | 높음(콘티 서식·길이) | `surface.subtle`, `border.default`, `s8.shot.timeline` | 카드 `aria-label`에 샷 ID·타임코드, 체크박스 키보드 조작 |
| Composition3DSchemaView | 게이트 2 구도 스키마 미리보기 | 카메라/앙글/구도/비율/세이프존/시뮬레이션 여부, `mode` | 와이어프레임·시뮬레이션 뷰 + **시뮬레이션 배지**(실제 3D 렌더 아님), Phase B 실제 프리뷰 | 높음(구도 규칙) | `s8.safeZone.overlay`, `border.strong`, `surface.inverse`, `s8.dryRun.badge` | `role=img` + 대체 설명(구도·앙글·안전영역 텍스트), 비율 전환 버튼 라벨 |
| AnimaticTimeline | 게이트 3 저해상도 스텁 | 샷 순서/타임코드/스텁 프레임/재생 상태, `mode`(프레임 단위 여부) | 저해상도 스텁 재생 + 스텁 배지, 일시정지/샷 이동 | 중간 | `s8.shot.timeline`, `surface.subtle`, `text.muted`, `s8.dryRun.badge` | 재생 버튼 `aria-label`, timecode 텍스트 제공, reduced-motion 시 자동 재생 없음 |
| ShotTimeline | 샷 단위 선택·수정 대상 지정 | shot_id/timecode/구간/현재 위치/선택 | 트랙 클릭→샷 선택, "이 샷 수정" 클릭 시에만 수정 탭으로 값 전달, 전체 수정 버튼 없음 | 중간(샷 길이 프로파일) | `s8.shot.timeline`, `primary.50`, `primary.500` | 샷 버튼 키보드 이동, `aria-pressed`, 타임코드 병기 |
| ShotVersionChip | 샷 버전 표시·비교 | `v1/v2/수정본`, 상태(초안/승인), 비교 대상, `mode` | 칩 클릭→비교/복원, 자동 덮어쓰기 없음 | 낮음 | `s8.version.chip`, `radius.pill`, `primary.50` | 버튼 + `aria-current="true"`, 변경 요약 툴팁 |
| RevisionPanel | 대상 샷만 수정 요청 | shot_id/timecode, 수정 요청 자연어, 영향 범위, 예상비용/시간, 확인 상태, `mode` | 미리보기 먼저 → "이 샷만 수정" 활성, 전체 재생성 없음 | 중간(영향 범위 계산) | `s8.cost.gauge`, `warning.50`, `surface.default` | 영향 범위 텍스트 목록, 확인 다이얼로그 focus trap |
| CostTimeGauge | 예상 비용·시간 사전 표시 | 샷 수/비율/템플릿/스텁 여부/모델/렌더 모드/`mode` | "예상 비용 n · 예상 시간 n" + 산출 근거, 임계치 경고, 실제 과금·렌더 아님 명시 | 높음(비용/시간 프로파일) | `s8.cost.gauge`, `font.mono`, `warning.500` | 단위 병기("원", "분"), 변경 시에만 `aria-live=polite` |
| SafeZoneOverlay | 비율별 안전 영역 가이드 | 비율(9:16/1:1/16:9), 자막/CTA 영역 on/off, `mode` | 점선 가이드 + 안전 영역, 이탈 시 경고 | 높음(세이프존 규칙) | `s8.safeZone.overlay`, `border.strong`, `primary.50` | 텍스트 요약("상단 n%, 하단 n% 안전"), 색만 의존 금지 |
| VideoTemplatePicker | 제작 유형별 템플릿 선택 | 템플릿 목록(유형별 필터), 비율, 길이, 샘플 여부, `mode` | 선택→콘티/구도 기본값 반영(덮어쓰기 전 확인), 샘플 템플릿 배지 | 높음(사용 가능 템플릿) | `s8.dryRun.badge`, `surface.subtle`, `border.default` | `role=radiogroup`, 비율·길이 텍스트 병기 |

> S8 모듈 분리·안전 규칙: 분석/제작/수정 탭은 상태를 공유하지 않고, 레퍼런스 서치도 탭에 자동 삽입되지 않는다. 레퍼런스는 사용자 트리거 자동 검색·수동 입력·`ModuleLink(s0→s8)` 클릭으로만 들어오며 공개 범위(공식 API·공개 피드·공개 메타데이터·수동 입력)만 사용한다. 로그인/유료벽/스크래핑 우회 제외, 미디어 바이트 미저장(원문 URL·썸네일 URL·타임코드만). Phase A는 텍스트·스키마·샘플 미리보기 + DryRenderAdapter 플레이스홀더만, Phase B/C에서 실제 렌더·3D 프리뷰·diff-only 재렌더로 교체한다. 전체 영상 즉시 생성/일괄 렌더 버튼은 없다.
>
> 이름 주의: `ReferenceCard (S8)`는 3-3의 S1 `ReferenceCard`와 이름이 같지만 **모듈 내부 컴포넌트 재사용 금지** 원칙에 따라 S8 전용 별도 컴포넌트로 정의한다.

#### 3-10-1. 기존 S8 컴포넌트의 소스 모드(`inputMode`) 의존 매트릭스

> `mode`(제작 유형)와 `inputMode`(소스 모드)는 별개 축이다. 아래 표는 위 18개 기존 정의를 유지하면서 소스 모드 관점을 추가 표시한 것이다. 소스 모드가 바뀌어도 3탭 독립 상태와 4게이트 승인 규칙은 그대로 유지된다.

| 기존 컴포넌트 | 기존 `mode` 의존(요약) | `inputMode` 의존 표시 |
|---|---|---|
| ProductionModePicker | 없음(값 자체가 mode) | 독립. 제작 유형과 소스 모드는 별개 선택 |
| ReferenceSearchPanel | 높음(검색 축) | 독립. 레퍼런스는 메타데이터 전용, 소스로 자동 전환 없음 |
| ReferenceCard (S8) | 중간(유형별 근거 라벨) | 독립. 변환 소스 아님, 프레임 미분석 |
| ManualReferenceInput | 중간(검색 축 태그) | 독립. URL 참조만, 업로드 소스 아님 |
| AnalysisCard | 높음(분석 차원) | 있음. 소스 출처 라벨(신규=레퍼런스·샘플, 변환·합성=자기 소스) |
| TermMappingPreview | 중간 | 있음. 변환 작업을 표준 용어로 매핑 |
| ClarificationCard | 낮음 | 있음. 권리·출처 모호 시 되묻기 |
| ConfidenceBadge | 없음 | 독립. 신뢰도 표시는 소스 모드와 무관 |
| GateStepper | 중간(산출물 라벨) | 독립. 모든 소스 모드가 동일 4게이트 경유 |
| StoryboardGrid | 높음(콘티 서식·길이) | 있음. 변환 결과를 `Shot`으로 표시 |
| Composition3DSchemaView | 높음(구도 규칙) | 있음. 합성 레이어를 스키마로 반영 |
| AnimaticTimeline | 중간 | 있음. 변환 샷의 저해상도 스텁 |
| ShotTimeline | 중간(샷 길이 프로파일) | 있음. 변환·합성 버전 선택 |
| ShotVersionChip | 낮음 | 있음. 변환·합성 버전 보존, 자동 덮어쓰기 없음 |
| RevisionPanel | 중간(영향 범위 계산) | 있음. 대상 샷만 diff 수정, 전체 자동 재렌더 없음 |
| CostTimeGauge | 높음(비용/시간 프로파일) | 있음. 변환·합성 작업별 비용 프로파일 반영 |
| SafeZoneOverlay | 높음(세이프존 규칙) | 있음. 리사이즈·재구도 결과에 가이드 적용 |
| VideoTemplatePicker | 높음(사용 가능 템플릿) | 있음. 변환·합성에 맞는 템플릿 필터 |

#### 3-10-2. 신규 소스·변환·합성 컴포넌트

| 컴포넌트 | 목적 | 입력(props) | 출력/상태 | mode 의존 | 토큰 | a11y·인터랙션 |
|---|---|---|---|---|---|---|
| InputModePicker | 소스 모드 3종 명시 선택 | `generate_new`(기본 표시)/`transform_source`/`composite`, 현재 값, 프로젝트 컨텍스트 | 전환 요청 → 확인 모달(영향 목록) → 이전 버전 보존. 자동 감지·자동 전환 없음 | 없음(값 자체가 inputMode), 제작 유형 mode와 독립 | `s8.mode.picker` 패턴, `radius.md`, `primary.50`, `text.muted`, Lucide 선형 아이콘 + 한글 라벨 | `role=radiogroup`, 기본값 텍스트 명시, 모달 focus trap + ESC + 포커스 복귀 |
| MediaSourcePicker | 업로드·사용자 URL·S5 자산 소스 선택 | `inputMode`, 소스 목록(업로드/URL/S5), `ModuleLink(s5→s8)` 생성 버튼, 권리 상태, 타임코드 | 소스 카드 생성·선택, S5는 클릭 시에만 참조, 서드파티는 메타데이터만, 권리 미확인 시 변환 차단 | 높음(모드별 선택 가능 소스와 안내가 다름) | `s8.source.card`, `s8.rights.badge`, `s8.dryRun.badge`, `font.mono` | 소스 종류·권리 상태 텍스트 병기, `aria-label`, S5 링크 라벨 명시, 업로드 오류 `aria-describedby` |
| TransformOperationPicker | 이미지·영상·합성 작업 그룹 선택 | `inputMode`, 그룹(이미지/영상/합성), 작업 목록, 상충 작업 규칙 | 작업 칩 선택→`TransformOperation` 저장, 조합 변경 시 비용 미리보기 갱신 | 높음(모드에 따라 기본 그룹이 다름) | `s8.operation.chip`, `radius.pill`, `primary.50`, `surface.subtle`, `text.muted` | `role=group`, 그룹 헤더 텍스트, 선택 상태 `aria-pressed`, 비활성 사유 제공 |
| CompositeLayerPanel | 합성 레이어 순서·보임·잠금·타이밍 편집 | 레이어 목록(배경/인물/제품/텍스트/로고/이펙트), 순서, 보임, 잠금, 블렌드, 시작·끝 타임코드 | 레이어 행 추가·정렬·삭제(확인 필요), 미리보기 반영, 게이트 승인 전 확정 없음 | 높음(`composite` 전용, 다른 모드에서는 비활성) | `s8.layer.row`, `surface.subtle`, `primary.50`, `font.mono` | 키보드 순서 이동, 보임·잠금 `aria-pressed`, 타임코드 병기, 삭제 확인 다이얼로그 |
| MaskingCanvasStub | 마스크 가이드 오버레이(Phase A 스텁) | 소스 미리보기, 마스크 경계 가이드, 제외 영역, `inputMode` | 경계·제외 영역 시각화만 제공, 실제 브러시 연산 없음, 스텁 배지 상시 | 중간(변환·합성에서만 노출) | `s8.mask.overlay`, `border.strong`, `surface.inverse`, `s8.dryRun.badge` | `role=img` + 대체 설명, 조작 불가 이유 텍스트, reduced-motion 시 애니메이션 없음 |
| BeforeAfterCompare | 원본·변환 결과 전·후 비교 | 원본 미리보기, 결과 미리보기, 비교 위치, 샘플 여부 | 구분선 슬라이더, 좌우 라벨, Phase A는 샘플만 표시 | 중간(변환·합성 결과일 때 표시) | `s8.beforeAfter.split`, `border.strong`, `surface.subtle`, `s8.dryRun.badge` | 슬라이더 `role=slider` + 키보드 이동, 좌우 라벨 텍스트, 실제 렌더 아님 배지 |
| RightsConfirmationDialog | 변환·합성 전 권리 확인 | `rights_flag`, `rights_confirmed_by`, 확인 시각, 사용 범위, 소스 목록 | 확인 시 권리 상태 갱신 후 작업 활성, 취소 시 소스 유지, 거부 시 진행 차단 | 높음(`generate_new`에서는 표시하지 않음) | `s8.rights.badge`, `Dialog`, `warning.50`, `danger.50` | focus trap, ESC 취소, 포커스 복귀, 거부 사유 텍스트, 색만 의존 금지 |
| TransformCostPreview | 작업별 예상 비용·시간 표시 | 작업 조합, 소스 길이·해상도, 레이어 수, 드라이런 여부, 임계치, `inputMode` | "예상 비용 n · 예상 시간 n" + 산출 근거, 임계치 경고, 자동 실행 없음 | 높음(비용 프로파일이 모드에 따라 다름) | `s8.transformCost.preview`, `s8.cost.gauge`, `font.mono`, `warning.500` | 단위 병기("원", "분"), 변경 시 `aria-live=polite`, 실제 과금 아님 배지 |

> 소스 모드 안전 규칙: 소스는 사용자 업로드·사용자 URL·`ModuleLink(s5→s8)` 클릭으로만 들어온다. 서드파티 레퍼런스는 메타데이터 전용이며 프레임을 다운로드하거나 분석하지 않는다. 변환 결과는 `Shot`으로, 합성 레이어는 `Composition3D` 스키마로 들어가 동일 4게이트를 통과한다. 3탭 독립 상태, 전체 자동 재렌더 금지, 모듈 자동 동기화 금지, 무단 웹 서비스 코드 실행 금지가 적용된다. 실제 어댑터는 공식·라이선스 확인된 공급자 또는 검증된 로컬 도구만 Phase B/C에서 예산·라이선스 승인 후 사용한다.

### 3-11. 공통 상태·피드백

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
| 참고 대상 사이트의 원본 HTML·정적 자산·CDN 리소스 | 표현 저작권·트레이드드레스·ToS 미확인 |
| 생성 재구성 코드·빌드 산출물 | 품질 58%·라이선스 불명 → 패턴만 참고 |
| 레퍼런스 로고/브랜드 이미지 | 타사 자산, 권한 확인 전 사용 금지 |
| 추적 스크립트(GA/GTM/Meta/Amplitude/Channel.io/HubSpot/OptinMonster 등) | 오류 유발 + 프라이버시 리스크 |
| 출처 불일치가 확인된 자료군 | 오귀속 근거로 사용 금지 |
| 진본으로 재분류된 자료군 | 패턴 참고만 허용, UI/자산 복제 금지 |
| 캡타차 해결·지문 위조·프록시 회전·로그인 쿠키 공유 스크래퍼 | Meta/TikTok ToS의 명시적 자동 수집 금지 조항과 충돌 → 사용 금지 |
| Firecrawl 코어 self-host/수정 | AGPL-3.0 카피레프트 → MCP 클라이언트만 사용, 코어 내장 금지 |

---

## 6. 이 문서의 수용 기준

- [ ] S0 Collector 컴포넌트가 5개 파트(전체/영상/이미지/블로그/뉴스)를 지원한다.
- [ ] 모든 화면 요소가 위 컴포넌트 이름으로 매핑된다.
- [ ] shadcn primitives와 도메인 컴포넌트가 분리되어 있다.
- [ ] 각 상태 컴포넌트(Empty/Loading/Error/Approval/DryRun)가 정의되어 있다.
- [ ] 접근성 규칙이 모든 컴포넌트에 적용된다.
- [ ] S8 컴포넌트 26개(기존 18개 + 소스·변환·합성 8개)가 이름·목적·props/상태·토큰·a11y 규칙으로 정의되어 있다.
- [ ] S8 모든 컴포넌트에 제작 유형(`mode`) 의존성이 표시되어 있고, 기본 미선택·자동 변경 금지·변경 확인 모달이 적용된다.
- [ ] S8 레퍼런스 서치 컴포넌트가 권리 배지·provenance·타임코드·출처 등급·자동/수동 구분을 다루고 미디어 바이트를 저장하지 않는다.
- [ ] S8 3탭 상태 분리, 4게이트 승인, 샷 단위 수정, Dry-run·시뮬레이션·스텁 배지가 컴포넌트 수준에서 보장된다.
- [ ] 재사용 금지 목록이 명시되어 있다.
- [ ] 기존 S8 컴포넌트에 제작 유형(`mode`)과 별개인 소스 모드(`inputMode`) 의존성이 표시되어 있다.
- [ ] 소스 모드 전환 시 확인 다이얼로그와 이전 버전 보존이 적용되고, 서드파티 레퍼런스는 메타데이터 전용이다.
- [ ] 변환·합성 결과가 `Shot` / `Composition3D`로 동일 4게이트에 투입되고 전체 자동 재렌더·모듈 자동 동기화가 없다.
