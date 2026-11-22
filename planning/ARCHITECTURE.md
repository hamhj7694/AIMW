# ARCHITECTURE — AI Marketing AX Workspace

작성일: 2026-11-22  
범위: 1~2일 MVP를 위한 **실행 가능한 구조** + 이후 확장 경로. 실제 구현 코드는 작성하지 않는다.  
관련 문서: `PRD.md`, `DESIGN-PLAN.md`, `COMPONENT-SPECS.md`, `IMPLEMENTATION-PLAN.md`, `COMPOSITION-PLAN.md`

---

## 1. 아키텍처 원칙

1. **캡처 자산은 참고만, 코드는 클린룸에서 재작성한다.** 7개 공개 서비스의 렌더링 산출물(HTML/CSS/이미지)은 라이선스 미확인이므로 복제하지 않는다. 이 저장소는 그 경로에 의존하지 않는다.
2. **AI 추론은 서버사이드 프록시 경유.** 브라우저에 API 키를 노출하지 않는다. 기본 Provider는 이미 설치·검증된 로컬 Ollama(`qwen3.8-local:latest`, `127.0.0.1:11434`)다.
3. **외부 발행·과금은 MVP에서 Dry-run.** 실제 게시/API 호출/결제는 하지 않고, 상태와 UI만 재현한다. 계정 연동은 **사용자가 직접 로그인/OAuth로** 수행하고, 실제 비용·비딩·예산 변경은 **매번 명시 동의 후**에만 실행한다(임계값 초과 시 2차 확인 팝업, NFR-26~28).
4. **상태를 화면에 노출한다.** 모든 AI 작업은 `Job` 엔티티로 추적하고, 프런트는 폴링으로 상태를 표시한다.
5. **단일 노드, 단일 DB.** SQLite + 로컬 파일 스토리지로 배포 복잡도를 최소화한다.
6. **교체 가능한 Provider/Connector.** 추론·발행·분석·수집은 인터페이스로 추상화해 후속 연동 시 구현체만 교체한다.
7. **수집은 자체 파이프라인, 캡처는 참고용.** 7개 서비스 캡처는 UI 패턴 증거일 뿐이다. 분야/도메인 등록 → 수집 → 정규화 → AI 분석은 이 프로젝트용으로 직접 설계한다.
8. **수집은 공개 범위·저영향 우선.** robots.txt/ToS/레이트리밋을 준수하고, 로그인·유료 영역 우회와 개인정보 수집을 금지한다. 미디어는 재호스팅하지 않고 출처 URL만 참조한다.
9. **모듈은 느슨하게 결합한다.** S0(남의 콘텐츠)/S5(우리 콘텐츠)/S6(성과·예측)/S7(오디언스)는 독립 서비스·독립 테이블·독립 라우트를 가진다. 모듈 간 참조는 `ModuleLink` 식별자로만 표현하며 자동 동기화·데이터 복제를 금지한다.
10. **예측과 개인정보는 명시적으로 표시·최소화한다.** S6 예측값은 모델·신뢰도 배지를 붙이고, S7은 식별자를 제외한 최소 변수만 사용한다.
11. **영상은 단계 게이트로만 진행한다.** S8은 콘티 → 3D 구도 → 애니매틱 → 단계별 렌더 순서를 강제하고, 각 단계는 사용자의 명시적 "진행" 클릭 후에만 실행한다. 요청 즉시 전체 렌더하는 경로는 제공하지 않는다.
12. **자연어는 해석 가능한 형태로만 변환한다.** 비전문 표현 → 표준 촬영·편집 용어 매핑은 `TermMapping`에 기록하고, 신뢰도와 사용자 확정을 거치지 않은 해석으로 제작을 시작하지 않는다.

---

## 2. 전체 구조도

```text
[ Browser — React + TypeScript + Vite ]
  ├─ App Shell (Sidebar / Topbar / DetailPanel / JobDrawer)
  ├─ S0 Collector  S5 Own Content  S1 References  S2 Studio
  ├─ S3 Publishing  S4 Insights  S6 Forecast  S7 Segments
  ├─ S8 Video Workbench  (분석 / 제작 / 수정 3탭 + 제작유형 6종 + 소스모드 3종, 독립 라우트)
  ├─ S9 SEO & Search Growth (진단/키워드·콘텐츠/예산·예측/취합·개선 4탭, 독립 라우트)
  └─ 공통: Token 기반 UI, TanStack Table, Recharts, React Flow(후속)
            │
            │ HTTPS / JSON (same-origin)
            ▼
[ FastAPI Backend — Python 3.11+ ]
  ├─ /api/v1/collect/sources      분야·우리 서비스·경쟁사 소스 등록/상태
  ├─ /api/v1/collect/jobs         수집 작업 생성·진행률·중지·재시도
  ├─ /api/v1/collect/items        파트별(영상/이미지/블로그/뉴스) 조회·S1 이관
  ├─ /api/v1/own-content          S5: 우리 콘텐츠 CRUD/CSV import/겹침·시리즈·아이디어
  ├─ /api/v1/forecast             S6: 지표 시계열·이동평균 baseline 예측(샘플 허용)
  ├─ /api/v1/segments             S7: 데이터/변수·k·군집 프로필(Phase B KMeans)
  ├─ /api/v1/video/modes          S8: 제작유형 6종 조회·선택·변경확인(기본 미선택)
  ├─ /api/v1/video/references     S8: 레퍼런스 서치(사용자 트리거 공개 검색 + 수동 입력)
  ├─ /api/v1/video/analyze        S8: 내용+기술 2계층 분석 (타사=메타 참조, 자기=업로드)
  ├─ /api/v1/video/interpret      S8: 자연어→용어 매핑 미리보기/확정/되묻기
  ├─ /api/v1/video/terms          S8: 용어 사전 조회·수정
  ├─ /api/v1/video/stages         S8: 콘티/3D구도/애니매틱/렌더 게이트 진행·비용 미리보기
  ├─ /api/v1/video/shots          S8: 샷 조회·버전·되돌리기
  ├─ /api/v1/video/revisions      S8: 타겟 수정 요청·영향 범위·적용
  ├─ /api/v1/knowledge/search     S8: 전문가 KB 청크 검색(KB-ID·등급·제작유형 필터)
  ├─ /api/v1/knowledge/sources    S8: 출처 등록부 조회(권리·등급·확인일)
  ├─ /api/v1/video/sources        S8: 미디어 소스 등록·권한 확인(메타데이터 전용 참조 포함)
  ├─ /api/v1/video/transforms     S8: 변환·합성 운영 미리보기(Phase A 스텁/샘플), 버전·before/after
  ├─ /api/v1/seo/diagnose         S9: 기술·온페이지·콘텐츠 진단(룰 엔진/수동 입력)
  ├─ /api/v1/seo/keywords         S9: 키워드 갭·검색 의도 매핑(공식/공개 데이터 한정)
  ├─ /api/v1/seo/forecast         S9: 투자비용↔성과 추정·예산 배분 추천(예측 배지)
  ├─ /api/v1/seo/rounds           S9: 취합·개선 라운드(actual/delta/improvements)
  ├─ /api/v1/connections/oauth/start  사용자가 직접 로그인/OAuth 승인하는 연동 시작(대리 로그인 없음)
  ├─ /api/v1/cost-approvals       실제 비용·비딩 사전 동의, 2차 확인, 승인 이력·지출 상한
  ├─ /api/v1/module-links         명시적 연결 생성/해제/목록 (자동 연결 없음)
  ├─ /api/v1/projects, /brands, /references, /boards
  ├─ /api/v1/jobs                 AI 작업 생성·상태·취소
  ├─ /api/v1/generate             카피/브리프/이미지 프롬프트 생성
  ├─ /api/v1/review               검수 체크리스트·승인
  ├─ /api/v1/publish              Dry-run 큐·예약·상태 (실제 전송 없음)
  ├─ /api/v1/insights             CSV 업로드·지표 집계·개선안
  └─ /api/v1/connections          Provider/Connector 상태 (마스킹)
            │
   ┌────────┼──────────────┬───────────────┬──────────────────┐
   ▼        ▼              ▼               ▼                  ▼
[SQLite] [Local FS]  [CollectorHub]  [InferenceGateway]  [PublishConnector]
 metadata  assets/    ├ RSS/Feed      ├ Ollama (기본)     ├ DryRun (기본)
           outputs/   ├ ArticleExtract├ OpenAI (optional) ├ Postiz REST (후속)
                      ├ PublicMeta    ├ Anthropic (opt)   └ Buffer API (후속)
                      ├ ManualInput   └ fal/Higgsfield/Kling (후속)
                      └ BrowserFallback(후속)
    │
    ├─ [OwnContentService]  S5: 자산/중복/시리즈/백로그 (독립)
    ├─ [ForecastService]    S6: 시계열+baseline → statsmodels → ML/DL (독립)
    ├─ [SegmentService]     S7: 전처리 → KMeans → 프로필 (독립)
    ├─ [VideoWorkbench]     S8: 소스선택·권한→유형선택→레퍼런스→분석→해석→콘티→3D→애니매틱→단계렌더→타겟수정 (독립)
    ├─ [SeoGrowthService]   S9: 진단→키워드/의도→개선안→예측/예산→취합→개선 (독립)
    ├─ [CostApprovalService] 횡단 승인 게이트: 상한·임계값·동의·2차 확인·이력 (승인 없이는 실행 불가)
    └─ [KnowledgeService]   S8/S9: planning/knowledge/** 읽기 전용 청크 검색·인용 조립
             (여섯 서비스는 DB 테이블을 공유하지 않고 ModuleLink로만 참조)
            │
   [JobRunner] — 백그라운드 스레드/Queue, 단계별 진행률·재시도
                 (수집 Job도 동일 프레임워크 사용)
```

---

## 3. 기술 스택 선정 (라이선스·사실 확인 반영)

| 계층 | 선택 | 근거 | 라이선스/비용 |
|---|---|---|---|
| 프런트 프레임워크 | React 18+ / TypeScript / Vite | shadcn/ui·Blocks, TanStack, Recharts 모두 React/TS 전제 | MIT / 무료 |
| UI 컴포넌트 | shadcn/ui + Tailwind v4 | 소스 복사 모델, Blocks(대시보드/사이드바/로그인), Tailwind v4·React 19 지원 | MIT / 무료(고지 유지) |
| 테이블 | TanStack Table v9 | headless·TS 우선, UI 없음 → shadcn과 조합 | MIT / 무료 |
| 차트 | Recharts 3.x | React+D3, 대시보드 카드/막대/추이 | MIT / 무료 |
| 워크플로 캔버스 | React Flow (`@xyflow/react`) — 후속 | 노드 기반 파이프라인 빌더 적합 | MIT / 무료(Pro 별도) |
| 백엔드 | FastAPI + Pydantic | 비동기, 스키마 검증, Ollama REST 호출 용이 | MIT / 무료 |
| DB | SQLite (WAL) | 단일 노드 MVP, 마이그레이션은 Alembic(후속) | 퍼블릭 도메인 |
| 파일 저장 | 로컬 FS (`storage/`) + DB 메타 | 이미지/영상/CSV 산출물 보관 | 무료 |
| 추론(기본) | Ollama 로컬 HTTP `:11434` | 설치·검증 완료, OpenAI 호환 `/v1/*`, vision 지원 | 로컬 무료(전기세만) |
| 추론(후속) | OpenAI / Anthropic / fal.ai / Higgsfield / Kling | 공식 REST+SDK, 키·과금 필요 | 종량제 |
| 자동화(후속) | n8n **내부 백그라운드 한정** | SUL상 외부 사용자용 워크플로 빌더는 엔터프라이즈 필요 | SUL(조건부 무료) |
| 발행 연동(후속) | Postiz REST/MCP — **포크 금지** | AGPL-3.0 소스공개 리스크 → 연동만 | AGPL-3.0(연동은 별도 검토) |
| 수집 — RSS/Atom | feedparser | 블로그·언론사 공식 피드 우선, 설치 쉬움 | BSD-2-Clause / 무료 |
| 수집 — 본문 추출 | trafilatura **>=1.8** | 뉴스·블로그 본문/메타/Markdown, SSRF 기본 차단 | Apache-2.0 / 무료 (구버전 GPLv3+) |
| 수집 — 폴백 추출 | newspaper4k, readability-lxml, BeautifulSoup4, lxml | 기사 객체/본문/구조 파싱 보완 | MIT / Apache-2.0 / MIT / BSD-3 |
| 수집 — 뉴스 발견 | GDELT **classic** (후속) | 1979~현재, 15분 갱신, 학술·상업 무료, 출처 명시 | 데이터 무료 / 원문 저작권 별도 |
| 수집 — JS 렌더(후속) | Playwright Python + Chromium | 동적 페이지 전용 워커, Python만으로 설치 가능 | Apache-2.0 / 브라우저 BSD-style |
| 수집 — 브라우저 대안(후속) | Crawl4AI 또는 Scrapling | REST/Python / 적응형 셀렉터. 단, ToS·표기 의무 확인 | Apache-2.0+출처표기 / BSD-3 |

> 미설치: npm/bun, shadcn CLI. 구현 착수 전 Node 런타임과 패키지 매니저 설치가 선행되어야 한다(Setup에서 npm 설치 후 shadcn init).
> 단, **수집 백엔드는 Python만으로 시작 가능**하다. `playwright` Python은 별도 Node 설치가 필요 없다.

### 3-1. 수집 스택 선정 근거 (검증된 사실 / 2026-11-22)

- **1순위 조합**: `feedparser + trafilatura(>=1.8) + BeautifulSoup4/lxml`. 뉴스·블로그의 경우 발행사 공식 RSS → 기사 URL → trafilatura 본문 추출이 설치·운영·라이선스 리스크가 모두 낮다.
- **MVP 1차 배선 소스 4개** (무료 키/공개 피드, 심사 불필요):

| 소스 | 담당 파트 | 인증 | 제한 | 근거 |
|---|---|---|---|---|
| **YouTube Data API v3** | 영상 광고 + 썸네일(이미지) | API key | 약 10,000 units/day, `search.list` 약 100 calls/day 별도 버킷(변동 가능) | [Quota](https://developers.google.com/youtube/v3/determine_quota_cost) |
| **네이버 검색 API** | 한국어 뉴스 + 블로그 | 앱 등록 Client ID/Secret | 25,000회/일, display ≤100, start ≤1000 | [뉴스](https://developers.naver.com/docs/serviceapi/search/news/news.md) · [블로그](https://developers.naver.com/docs/serviceapi/search/blog/blog.md) |
| **RSS / Sitemap** (feedparser) | 블로그 + 언론사 | 없음 | 발행사 피드 정책 준수 | 네이버 RSS는 2025-12-04부터 HTTP/1.1+ 필요 |
| **GDELT DOC API** (classic) | 영문 뉴스 백업 | 키 불필요 | 15분 갱신, 한국어 커버리지 불확실, 출처 명시 | [GDELT](https://gdeltproject.org/data.html) |

- **광고는 "메타데이터 우선"**: 이미지/영상 파일을 내려받아 재호스팅하지 않는다. MVP에서는 위 YouTube의 공개 메타 + 수동 URL 입력 + 공개 아카이브의 **스냅샷 URL/메타데이터만** 적재한다. 아래는 **"연동 대기"** 상태로 UI에 노출하고 실제 호출은 하지 않는다.

| 연동 대기 소스 | 필요한 것 | 제약 |
|---|---|---|
| Meta Ad Library API (`ads_archive`) | 계정 신원확인(수일) + 앱 + 토큰 | 정치/사회이슈 + EU/UK 한정, 일반 상업광고 미지원 |
| TikTok Commercial Content API | 개발자 신청·심사(약 2영업일) + client token | **현재 EU 데이터만** |
| LinkedIn Ad Library API | 제품 요청(vetted) + 3-legged OAuth | 프로비저닝 필요 |
| Google Ads Transparency | 공식 상업광고 API 없음 → GCP BigQuery 공개 데이터셋 별도 검토 | EEA/Turkey·정치광고 중심 |
| Facebook/Instagram 공개 페이지 API | App Review + business verification | 승인 전 라이브 접근 불가 |

- **명시적 비권장**: Google News RSS(피드가 "개인·비상업용" 명시), YouTube 자막 다운로드(타사 영상은 편집 권한 필요), 네이버 뉴스 크롤러(약관 미확인 → 공식 Search API 사용), Common Crawl(월간·최신성 낮음 → 후속).
- **Do Not Use (명시)**: Firecrawl 코어 self-host(AGPL-3.0), yt-dlp(저작권·ToS), Google News RSS(피드 자체가 개인·비상업용으로 제한), 유료 Apify Actor(과금+ToS+데이터 권리), 캡차 해결·지문 위조·프록시 회전 스크래퍼(Meta/TikTok ToS 정면 위반), 라이선스 없는 GitHub 스크래퍼.
- **MCP는 운영 경로가 아님**: Firecrawl MCP 서버(MIT)·Scrapling MCP(BSD-3)·agent-browser skill(Apache-2.0)은 **개발 에이전트가 셀렉터/스키마를 탐색할 때만** 사용하고, 확정된 스키마는 FastAPI 라이브러리 호출 코드로 고정한다. 웹앱 요청 경로에 MCP를 두지 않는다.
- **출처 표기**: Crawl4AI를 쓰면 LICENSE의 Attribution Requirement에 따라 앱 About/Credits에 지정 문구를 표시해야 한다. GDELT classic 데이터를 재배포하면 출처 명시가 필요하다.

---

## 4. 계층별 책임

### 4-1. 프런트엔드 (SPA)

- **App Shell**: 프로젝트 컨텍스트, 전역 검색(Ctrl/Cmd+K), Provider 상태 배지, JobDrawer.
- **화면 10개**: S0 Collector / S5 Own Content / S1 References / S2 Studio / S3 Publishing / S4 Insights / S6 Forecast / S7 Segments / **S8 Video Workbench** / **S9 SEO & Search Growth**(`design/SEO-GROWTH-SPECS.md`). 설정은 모달/라우트. **모듈별 독립 라우트이며, 진입 시 서로의 데이터를 자동 로드하지 않는다.** S8 내부는 분석/제작/수정 3탭으로 다시 분리되며, 탭 전환 시에도 상태가 섞이지 않는다. 미디어 소스·권한 확인 단계는 `?step=media-source`로 진입하고(`design/SCREEN-SPECS.md`), 이 단계의 결과가 분석 탭으로 자동 이동하지 않는다. S9 내부는 진단/키워드·콘텐츠/예산·예측/취합·개선 4탭으로 분리된다.
- **상태 관리**: 서버 상태는 TanStack Query(또는 경량 fetch 캐시), UI 상태는 Zustand 또는 React state. MVP에서는 단순화 가능.
- **금지**: 원본 사이트의 추적 스크립트(GA/GTM/Meta/Amplitude/Channel.io/HubSpot/OptinMonster 등) 이식, 원본 CDN 폰트·이미지 직접 참조, 인라인 스타일 난립.

### 4-2. 백엔드 (FastAPI)

- **도메인 서비스**: CollectorService, ReferenceService, BriefService, GenerationService, ReviewService, PublishingService, InsightsService, **OwnContentService, ForecastService, SegmentService, ModuleLinkService, VideoWorkbench(소스/권한/유형/레퍼런스/분석/해석/콘티/렌더/수정 9개 서브서비스), SeoGrowthService(진단/키워드/개선안/예측/취합 5개 서브서비스), KnowledgeService**.
- **모듈 경계 규칙**: OwnContentService/ForecastService/SegmentService/**VideoWorkbench**/**SeoGrowthService**/**KnowledgeService**는 서로를 import하지 않고, 공통은 `JobRunner`·`InferenceGateway`(선택)·`ProviderConnection`·디자인 토큰 뿐이다. 모듈 간 참조는 `ModuleLinkService.link(source, source_id, target, target_id, created_by)`로 사용자 액션 시에만 생성하고 `unlink()`로 해제한다. 자동 링크 API는 제공하지 않는다. S8 내부의 분석/제작/수정 탭도 각자 상태를 가지며 서로 자동으로 값을 채우지 않는다. 제작 유형 변경도 사용자 확인 없이 기존 산출물을 덮어쓰지 않는다.
- **CollectorService**: `register_target(...)`, `start_job(verticals, sources)`, `list_items(vertical)`, `promote_to_references(item_ids)`. 어댑터는 `CollectAdapter` 인터페이스(`fetch`, `normalize`, `compliance_check`)로 분리한다. 구현체: `ManualAdapter`, `YouTubeAdapter`, `NaverSearchAdapter`, `RssAdapter`, `GdeltAdapter`; `AdLibraryMetaAdapter`는 연동 대기 스텁.
- **정규화 파이프라인**: URL 정규화 → `external_id` 부여 → 본문/메타 추출(trafilatura) → **중복 제거(URL + external_id + 콘텐츠 해시)** → 파트(영상/이미지/블로그/뉴스) 분류 → `CollectedItem` 저장. 미디어 바이트는 저장하지 않고 원문/썸네일 URL만 보존한다.
- **컴플라이언스 게이트**: 모든 어댑터는 요청 전 `robots.txt`·ToS 플래그·SSRF 화이트리스트·레이트리밋(지수 백오프)·ETag 캐시를 통과해야 한다. 차단 시 아이템을 저장하지 않고 `blocked` 사유를 Job 로그에 남긴다.
- **InferenceGateway**: `generate_text(prompt, opts) -> GenerationResult`, `generate_image(...)`, `generate_video(...)`. Provider 선택은 `connections` 설정값. 기본 구현은 Ollama.
- **JobRunner**: 작업을 큐에 넣고 백그라운드에서 단계별 실행. `queued → running → streaming → reviewing → approved → published` 상태 전이를 DB에 기록. 실패 시 재시도 1회 + 오류 메시지 저장.
- **PublishConnector**: MVP는 `DryRunConnector`만 구현(큐에 기록, 외부 전송 없음). 후속에서 Postiz/Buffer 어댑터 추가.
- **OwnContentService**: `import_csv(...)`, `list_contents()`, `check_overlap(text)`(MVP 토큰 Jaccard → Phase B 임베딩), `link_series(...)`, `create_idea(...)`. CMS/채널 커넥터는 Phase B.
- **ForecastService**: `get_series(metric, granularity)`, `forecast(method="moving_average", horizon)` → `Forecast{value, confidence, model}`. Phase B에서 statsmodels/scikit-learn, Phase C에서 LightGBM/시계열 DL로 교체(인터페이스 유지). 예측은 S4 데이터를 복사하지 않고 `MetricSeries`에서 읽는다.
- **SegmentService**: `select_features(...)`, `set_k(3~6)`, `cluster()`(Phase B scikit-learn KMeans + silhouette), `profile()`. MVP는 샘플 좌표와 프로필 UI만. 식별자 컬럼은 입력 단계에서 제거하고 원본 고객정보는 저장하지 않는다.
- **VideoAnalysisService** (S8): `analyze_content(ref)` → 훅/구조/메시지/CTA/타깃/감정 곡선(타임코드 매핑). `analyze_craft(ref)` → 샷 사이즈/앵글/무브먼트/렌즈·FOV/조명/전환/구도/색보정/속도/사운드 + `confidence`. 타사 영상은 메타·스냅샷 URL·타임코드만 입력으로 받고, 프레임 분석은 사용자가 업로드한 자기 콘텐츠에 한정한다.
- **VideoTermService** (S8): `interpret(text)` → `TermMapping[] {source_phrase, standard_term, category, rationale, confidence, confirmed}`. 신뢰도 임계값 미달 시 `ClarificationQuestion`을 반환해 되묻는다. `confirm(mapping_ids)`를 호출해야 `VideoIntent`가 확정된다(자동 확정 금지). `VideoTermDictionary`는 자체 구축 + 사람 검수(설정에서 수정 가능).
- **KnowledgeService** (S8·S9): `planning/knowledge/**`를 **읽기 전용**으로 청크 단위(`### KB-…`) 검색. `search(query, mode, evidence_tier)` → `KnowledgeChunk[] {chunk_id, domain, production_mode, source_ids, evidence_tier, path}` + `KnowledgeCitation[]`. `sources()`는 출처 등록부(`SOURCES.md`)의 URL·발행자·권리 메모·확인일을 반환. 원문 복제·번역·각색을 하지 않고 **요약과 인용만** 프롬프트에 조립한다(`RAG-USAGE.md` 4장 템플릿). 등급 C는 "비공식 추정, 확인 필요" 배지를 강제. 렌더·외부 전송·모듈 간 데이터 복사를 실행하지 않는다. 인덱싱은 Phase A 로컬 키워드 → Phase B 로컬 임베딩(라이선스 재확인 후) → Phase C 재랭킹 순.
- **StoryboardService** (S8): `build_intent(confirmed_mappings)` → `VideoIntent{shots[], timing, tone, platform}`. `generate_storyboard(intent)` → `Storyboard{shots[{shot_id, timecode, visual, copy, audio, transition, camera, lighting}]}`. `generate_composition3d(storyboard)` → `Composition3D` **스키마**(카메라 위치·FOV·피사체 배치·조명 리그·모션 경로). MVP는 SVG/와이어프레임 시뮬레이션이며 실제 3D 렌더가 아님을 배지로 명시. `generate_animatic(storyboard)` → 저해상도 타임라인 미리보기(스텁).
- **ShotRenderService** (S8): `estimate(stage)` → 예상 시간/비용. `advance_stage(project_id, stage, approved_by)` → **사용자 승인 시에만** 다음 단계 실행. `render_shot(shot_id, quality)` → 샷 단위 산출물 + `ShotVersion`. MVP는 `DryRenderAdapter`(플레이스홀더/샘플), Phase B에서 저해상도→최종 렌더 어댑터 교체. 부분 실패 시 성공 샷은 유지하고 실패 샷만 재시도.
- **RevisionService** (S8): `plan(target)` → `{shot_ids[], elements[], estimated_cost, affected_scopes}` 미리보기. `apply(revision_id)` → 승인된 범위에만 패치(Phase A는 요청·미리보기 UI, Phase B 실제 diff 재렌더). 자동 전체 재생성 경로 없음.
- **SeoGrowthService** (S9): `diagnose(url_or_manual)` → `SeoDiagnosis{findings[]}`(기술/온페이지/콘텐츠, Phase A 룰 엔진 + 수동 입력). `find_keyword_gaps(...)` → `KeywordGap[]` + `SearchIntentMap[]`. `optimize_content(...)` → `ContentOptimization{title_proposal, meta_description_proposal, structural_notes, rationale}`(기존 문구는 `source_phrase`로 보존, 자동 덮어쓰기 금지). `forecast(budget, options)` → `SeoInvestment{forecast[], method, confidence, model, is_forecast=true}`. `recommend_budget(...)` → `BudgetRecommendation[]`. Phase B에서 소유 확인 계정의 공식 데이터와 공개 검색 API를 연동하고, 회귀 모형으로 예측을 교체한다. SERP 스크래핑·로그인 우회·유료벽 우회 경로는 제공하지 않는다. 순위 보장을 표현하는 응답 문구를 golden test로 차단한다. 실제 비용이 발생하는 동작은 `CostApprovalService.request()`로 승인을 요청하고, 승인 토큰이 없으면 `execute()`가 거부한다. 계정 연동도 사용자가 직접 OAuth를 완료해야 활성화되며 시스템은 대리 로그인하지 않는다.
- **보안**: API 키는 서버 환경변수/`.env`에 보관, `/connections` 응답은 마스킹(`sk-****abcd`)만 반환. S7 업로드 파일은 처리 후 즉시 삭제 정책(Phase B) 적용. S8 업로드 영상은 자기 콘텐츠로 한정, 얼굴·번호판 블러 권고, 보유기간 명시.

### 4-3. 데이터 계층

핵심 엔티티와 관계:

```text
Campaign(1) ──< CollectSource(*)      # 분야 키워드 / 우리 서비스 / 경쟁사 도메인
CollectSource(1) ──< CollectJob(*)    # 파트별 수집 작업·진행률·레이트리밋·실패
CollectJob(1) ──< CollectedItem(*)    # 영상/이미지/블로그/뉴스 항목 + provenance
CollectedItem(*) ──> Reference(...)   # "분석" 시 S1으로 이관(메타 보존)

Campaign(1) ──< Reference(*)          # 직접 저장한 광고/URL/스크린샷/메모
Campaign(1) ──> BrandKit(1)           # 톤·금지어·상품정보·색상
Campaign(1) ──< Board(*)              # 스와이프 파일/폴더
Reference(*) ──< Analysis(*)          # AI 추출: 후킹/메시지/CTA/타깃

Campaign(1) ──< Brief(*) ──< Concept(*)
Concept(1) ──< Asset(*)               # 생성 이미지/영상/카피, 버전·메타
Asset(*) ──< Review(*)                # 체크리스트·승인자·시각
Asset(*) ──< PublishJob(*)            # 채널·예약·상태·외부 ID(Dry-run)

Insight(*) ──> Improvement(*) ──> Brief(새 브리프)   # F7 순환

# 독립 모듈 (서로 FK 없음. 아래 ModuleLink로만 참조)
Campaign(1) ──< OwnContent(*) ──< ContentSeries(*)
OwnContent(*) ──< OverlapFlag(*)   # 신규/유사/확장 + 기준 콘텐츠 참조
Campaign(1) ──< IdeaBacklog(*)     # "S0 참고로 가져오기"는 ModuleLink로 첨부
MetricSeries(*) ──< Forecast(*)    # S6 전용, S4 Insight와 데이터 복제 없음
AudienceDataset(1) ──< Segment(*) ──< SegmentMember(*)   # S7, 식별자 미저장

# 영상 워크벤치 (S8, 독립. 아래 4단계 게이트를 강제)
MediaSource(*) ──< TransformOperation(*) ──< TransformVersion(*)
MediaSource(*) ──< CompositeLayer(*)     # 레이어/마스크/블렌딩/타이밍, 권한 확인 필수
TransformVersion(*) ──> Shot(*)          # 변환 결과는 4게이트를 우회하지 않음
VideoAnalysis(1) ──< TermMapping(*)      # 원문→표준용어, 신뢰도·확정여부
TermMapping(*) ──> VideoIntent(1)        # 확정된 매핑으로만 생성
VideoIntent(1) ──< Storyboard(*) ──< Shot(*)
Shot(1) ──< Composition3D(*)            # 카메라/FOV/배치/조명/모션 스키마
Storyboard(1) ──< Animatic(*)           # 저해상도 타임라인
Shot(1) ──< RenderStage(*) ──< ShotVersion(*)
Shot(*) ──< Revision(*)                 # shot_id/timecode/element 타겟 패치
Campaign(1) ──< VideoTemplate(*)        # 반복 포맷(예: 장기렌트 15초 세로)
# S8 ↔ S1/S2/S5는 FK 없이 ModuleLink로만 참조 (사용자 클릭)

# SEO 성장 (S9, 독립. S6 지표를 복제하지 않음)
SeoRound(1) ──< SeoDiagnosis(*) ──< Finding(*)
SeoRound(1) ──< KeywordGap(*) ──> SearchIntentMap(*)
SeoRound(1) ──< ContentOptimization(*)   # 제안은 source_phrase와 별도 보존
SeoRound(1) ──< SeoInvestment(*) ──< BudgetRecommendation(*)
SeoInvestment(*) ──< SerpObservation(*)  # 공식 출처만, 예측/신뢰도/모델/기간 배지
# 개선안 → S2/S5 전달은 ModuleLink(s9→s2|s5) 클릭 시에만

# 비용 승인 (횡단 게이트, 승인 없이는 실행 불가)
ProviderConnection(linked_by_user, connected_at)   # 사용자가 직접 OAuth 완료
CostApproval(id, amount, item, provider, period, requested_by, approved_by, approved_at, second_confirmation)
SpendCap(scope, limit, period, changed_by, changed_at)
ConsentRecord(approval_id, action, amount, outcome)

# 유일한 모듈 간 연결 경로 (사용자 클릭만)
ModuleLink(source_module, source_id, target_module, target_id, created_by, created_at)
  예) (s0, collected_item#12, s5, idea_backlog#3)
      (s5, own_content#7,  s6, metric_series#2)
      (s7, segment#1,      s2, brief#9)
      (s1, reference#4,    s8, video_analysis#2)   # "영상 분석" 버튼
      (s8, storyboard#1,   s2, brief#11)           # "이 콘티로 기획" 버튼

Job(*) / CostRecord(*)                # 전역 작업·비용 추적
```

`CollectedItem` 최소 필드: `source`, `source_mode`(공식API/공개피드/공개페이지/수동), `vertical`(video/image/blog/news), `external_id`, `source_url`, `title`, `summary`, `published_at`, `media_url`(참조만), `content_hash`, `fetched_at`, `terms_snapshot`, `license_note`, `status`(collected/blocked/promoted).

신규 모듈 최소 필드:
- `OwnContent`: `id`, `channel`, `published_at`, `format`, `title`, `copy`, `source_url`(참조만), `series_id?`, `linked_metric_id?`(ModuleLink로만).
- `OverlapFlag`: `idea_id`, `reference_content_id`, `level`(new/similar/extension), `score`, `method`(token_jaccard/embedding).
- `MetricSeries`: `id`, `campaign_id`, `metric`, `granularity`, `date`, `value`, `is_sample`.
- `Forecast`: `id`, `series_id`, `horizon`, `model`, `confidence`, `values[]`, `created_at`. **화면에 항상 `예측` 배지로 렌더링**.
- `AudienceDataset`: `id`, `feature_columns[]`, `excluded_columns[]`, `row_count`, `retained_until`, `is_sample`. **식별자 원본은 저장하지 않음**.
- `Segment`: `id`, `label`(사람 편집), `size`, `profile_summary`, `silhouette?`(Phase B).
- `ModuleLink`: 위 정의. 생성 시 `created_by` 필수(자동 생성 차단 감사용).

영상 모듈 최소 필드:
- `VideoReference`: `reference_id`, `source_url`, `thumbnail_url`(참조만), `platform`, `title`, `author`, `published_at`, `timecode_in/out`, `search_mode`(auto/manual), `production_mode`, `evidence_tier`, `rights_flag`, `provenance`, `created_by`. **미디어 바이트 미저장**. S0 항목은 `ModuleLink(s0→s8)`로만 참조.
- `VideoAnalysis`: `id`, `source_ref`(타사=메타/스냅샷 URL, 자기=업로드 ID), `layer`(content/craft), `findings[{timecode, category, term, rationale, confidence, kb_refs[], source_ids[], evidence_tier}]`.
- `TermMapping`: `source_phrase`, `standard_term`, `user_selected_term?`, `category`(camera/lighting/transition/compose/edit/audio/blocking/ad/platform), `rationale`, `confidence`, `kb_refs[]`, `confirmed_by`, `confirmed_at`. **미확정 매핑으로 다음 단계 진입 불가**.
- `VideoIntent`: `mappings[]`, `shots[]`, `timing`, `tone`, **`production_mode`**(live_action/short_form/film/general_video/animation/motion_graphics, 기본 미선택), `aspect_ratio`, `platform`, `status`(draft/confirmed). 유형 변경 시 기존 산출물은 `archived`로 보존.
- `Shot`: `shot_id`, `timecode_in/out`, `visual`, `copy`, `audio`, `transition`, `camera`, `lighting`, `blocking`, `props[]`, `typography?`, `production_mode`, `status`.
- `Composition3D`: `camera_position`, `fov`, `subject_layout[]`, `light_rig[]`, `motion_path[]`, `layers[]?`, `keyframes[]?`, `mode_schema`(camera_rig/safe_zone/continuity/keyframe/motion_spec), `is_schematic=true`(MVP).
- `RenderStage`: `stage`(storyboard/composition3d/animatic/render), `gate`(G1~G4), `status`, `approved_by`, `approved_at`, `estimated_cost`, `estimated_seconds`. **approved_by 없음 → 다음 단계 생성 안 함**.
- `ShotVersion`: `shot_id`, `version`, `render_url`(로컬 FS), `quality`(draft/final), `parent_version`, `production_mode`.
- `Revision`: `target_shot_ids[]`, `timecode_range`, `elements[]`, `natural_language`, `interpreted_patch`, `affected_shots[]`, `continuity_warnings[]`, `status`, `created_by`, `production_mode`.
- `VideoTemplate`: `name`, `duration`, `aspect_ratio`, `shot_pattern[]`, `tone`, `production_mode`, `transition_policy`, `safe_zone_preset?`, `loopable?` — 새 제작 시 복사해서 쓰되 기존 결과를 자동 덮어쓰지 않는다.

전문 지식베이스 최소 필드(읽기 전용, `planning/knowledge/**`에서 생성):
- `KnowledgeDoc`: `path`, `domain`, `title`, `source_ids[]`, `updated`, `rights_note`.
- `KnowledgeChunk`: `chunk_id`(안정 ID `KB-…`), `doc_path`, `domain`, `production_mode`(any/6종), `body`(정의/효과/적용/주의/근거 5줄), `source_ids[]`, `evidence_tier`(A/B/C), `updated`.
- `KnowledgeCitation`: `chunk_id`, `source_id`, `evidence_tier`, `used_in`(analysis/term_mapping/storyboard/revision), `created_at`. **원문 연속 인용 금지, 요약+인용만**.

### 4-4. 수집 컴플라이언스 체크리스트 (설계에 포함)

- [ ] 대상 호스트 `robots.txt` 확인(RFC 9309), `Disallow` 우회 금지, User-agent별 규칙 적용.
- [ ] 사이트별 ToS 확인. Meta/TikTok은 자동 수집 명시 금지 → 스크래퍼 미사용, 공식 API만 검토.
- [ ] 요청 큐 + 동시성 제한 + 429/5xx 지수 백오프. User-Agent에 목적·연락처 명시.
- [ ] ETag/Last-Modified 캐시로 증분 수집, 동일 URL 재요청 방지.
- [ ] SSRF 방지: 허용 도메인 화이트리스트, localhost/사설 IP/메타데이터 엔드포인트 차단.
- [ ] 최소 수집: 작성자 연락처 등 목적 외 개인정보 수집 금지. 포함될 경우 보유기간·삭제 요청 정책 적용.
- [ ] provenance 보존: 출처 URL·수집 시각·적용 약관 스냅샷·라이선스 메모를 레코드에 저장.
- [ ] 수집 HTML은 sanitize 후 렌더링. 스크립트 실행은 샌드박스 브라우저에서만.
- [ ] 미디어 재호스팅 금지 — 썸네일/이미지/영상은 원문 URL 참조, 저작권·상표·퍼블리시티 권리 확인 전 재사용 금지.

- SQLite WAL 모드, 단일 파일 `aimw.db`. 파일 산출물은 `storage/{campaign_id}/{asset_id}/`.
- 스키마는 Pydantic 모델 → SQLModel/SQLAlchemy 매핑. MVP에서는 마이그레이션 도구 없이 `create_all` 허용.

---

## 5. 데이터 흐름 (대표 시나리오)

1. 사용자가 S0에서 분야 키워드/우리 서비스/경쟁사 도메인 등록 → `CollectSource` 생성.
2. 파트(영상/이미지/블로그/뉴스) 선택 → `CollectJob` 생성 → 각 어댑터가 공개 범위만 수집 → 정규화·중복제거 → `CollectedItem` 저장. 화면은 파트별 탭으로 결과를 보여준다.
3. 사용자가 수집함에서 항목 선택 → "분석" → `Reference`로 이관(provenance 보존) → S1에서 AI 추출(후킹/메시지/CTA/타깃).
4. S2에서 "브리프 만들기" → `Job` 생성 → InferenceGateway가 Ollama에 프롬프트 전송 → 스트리밍 결과를 `Brief`로 저장.
5. 콘셉트 3안 생성 → 사용자가 1안 선택 → 이미지 프롬프트/카피 생성 → `Asset` 후보 4장( MONOV 패턴 ) 저장.
6. S2 검수 탭에서 체크리스트 통과 → `Review.approved=true` → 상태 `approved`.
7. S3에서 채널 선택(예: 인스타그램/스레드) → 채널별 텍스트 변환(Dry-run) → 예약 → `PublishJob.scheduled`.
8. S4에서 성과 CSV 업로드 → 지표 매핑 → 대시보드 + `Improvement` 생성 → "이 개선안으로 새 브리프" 버튼이 F7을 닫고 F2로 순환.

각 단계에서 `Job` 상태와 `CostRecord`(모델, 토큰, 예상 비용)를 기록해 우측 DetailPanel/JobDrawer에 표시한다.

**독립 모듈 흐름(자동 연결 없음)**

1. S5 진입 → CSV/수동으로 `OwnContent` 등록 → `OverlapFlag`(신규/유사/확장) 및 `ContentSeries` 확인 → `IdeaBacklog` 작성.
2. (선택) S0 수집 결과 카드의 "참고로 가져오기" 클릭 → `ModuleLink(s0→s5)` 생성. 클릭하지 않으면 S0 데이터는 S5에 나타나지 않는다.
3. (선택) 아이디어의 "이 아이디어로 기획" 클릭 → `ModuleLink(s5→s2)` 기록 + S2 BriefForm 값 채움.
4. S6 진입 → `MetricSeries` 선택 → `forecast()` → `Forecast`(예측/신뢰도/모델 배지) 표시. (선택) "S5 콘텐츠와 연결" 클릭 시 `ModuleLink(s6→s5)`만 생성.
5. S7 진입 → `AudienceDataset`에서 식별자 제외 → 변수/k 선택 → 군집 프로필. MVP는 샘플 시각화, Phase B에서 KMeans 실행. (선택) "맞춤 콘텐츠" 클릭 시 `ModuleLink(s7→s2|s5)`만 생성.

> 각 모듈은 다른 모듈의 데이터가 없어도 진입 가능하며, 샘플 데이터로 자체 상태를 완성한다. 자동 파이프라인 트리거는 존재하지 않는다.

**영상 워크벤치 흐름(S8, 게이트 강제)**

사전 단계(소스·권한 → 유형 선택 → 레퍼런스 서치):
- S8 진입 → **입력 소스 모드 명시 선택**(`generate_new` 기본 / `transform_source` / `composite`). 기존 산출물이 있으면 변경 확인 모달 후 이전 버전 `archived` 보존(덮어쓰기 금지).
- 소스 등록: 자기 업로드·사용자 제공 URL·S5 자산("S8로 가져오기" 클릭 시에만 `ModuleLink(s5→s8)`). 변환·합성 전 `rights_flag`/`rights_confirmed_by` 확인. 타사 레퍼런스는 메타데이터(URL·썸네일 URL·타임코드)만 저장하고 프레임 다운로드·분석을 하지 않는다. Phase A는 운영 미리보기·스키마·드라이런만.
- S8 진입 → **제작 유형 6종 중 사용자 명시 선택**(기본 미선택, 자동 감지·자동 변경 금지). 유형이 분석 차원·구도 스키마·게이트 산출물·템플릿 필터·비용 프로파일을 결정한다(`design/PRODUCTION-MODE-SPECS.md`). 미선택 시 G1 이후 잠금. 변경 시 재확인 후 기존 산출물 `archived` 보존.
- 레퍼런스 서치: 사용자가 검색 버튼을 누를 때만 공개 소스 어댑터(Phase A 스텁/샘플) 조회, 또는 URL·메모·타임코드 수동 입력. S0 항목은 "S8로 가져오기" 클릭 시에만 `ModuleLink(s0→s8)` 생성. 로그인·유료벽·스크래핑 우회 제외, 미디어 바이트 미저장(`knowledge/12-reference-search-playbook.md`).

1. S8 진입 또는 S1에서 "영상 분석" 클릭(이때만 `ModuleLink(s1→s8)` 생성) → 분석 탭에서 내용/기술 2계층 결과를 타임코드와 함께 표시. `KnowledgeService.search()`가 `KB-ID / Sxx / 등급`을 근거로 붙인다.
2. 제작 탭에서 비전문 자연어 입력 → `interpret()` → 원문/표준용어/신뢰도 매핑표 미리보기. 신뢰도 낮으면 되묻기 질문 카드. 사용자가 "이 해석으로 콘티"를 눌러야 `VideoIntent` 확정.
3. Gate 1 콘티: `Storyboard{Shot[]}` 생성 → 사용자가 샷별 텍스트/타임코드 수정 → "3D 구도 진행" 클릭(예상 비용/시간 표시).
4. Gate 2 3D 구도: 카메라·FOV·배치·조명·모션 경로 **스키마** 표시(MVP는 시뮬레이션 배지) → 승인 → "애니매틱 진행" 클릭.
5. Gate 3 애니매틱: 저해상도 타임라인/자막/임시 오디오 미리보기 → 승인 → "샷 렌더 진행" 클릭.
6. Gate 4 단계별 렌더: 샷 순서대로 `ShotVersion` 생성. 각 샷 확정 후 다음 샷 진행. 전체 일괄 렌더 버튼은 제공하지 않는다.
7. 수정 탭: 타임라인에서 `shot_id` 클릭 → 자연어 수정 요청 → `Revision.plan()`이 영향 샷/예상 비용 표시 → 사용자가 "이 샷만 수정" 클릭 시 해당 샷만 패치(Phase A는 요청 UI, Phase B 실제 재렌더).
8. (선택) "이 콘티로 기획" 클릭 시 `ModuleLink(s8→s2)` 기록 + S2 BriefForm 채움. 자동 전달 없음.

> 각 게이트는 `RenderStage.approved_by`가 없으면 다음 단계를 생성하지 않는다. 이는 S8의 비용·시간 절약을 위한 핵심 안전장치다(NFR-17).

> 지식 베이스(`planning/knowledge/**`)는 **읽기 전용 참고**다. 등급 C만 근거인 항목은 "비공식 추정, 확인 필요" 배지를 붙이고 사용자 확인 없이 `VideoIntent`를 확정하지 않는다. KB가 렌더·외부 전송·모듈 간 데이터 복사를 실행하지 않는다(NFR-21·22).

**SEO 성장 흐름(S9, 클릭 기반 개선 루프)**

1. S9 진입 → 진단 탭에서 URL 또는 수동 입력을 받아 `SeoDiagnosis` 표시(Phase A 룰 엔진 + 샘플). **계정은 사용자가 직접 로그인/OAuth로 연동**(Phase B), 시스템 대리 로그인 없음. 여기서는 실제 계정 호출·과금 없음.
2. 키워드·콘텐츠 탭에서 `KeywordGap[]`·`SearchIntentMap[]`·`ContentOptimization` 제안을 표시. 기존 문구는 `source_phrase`로 보존하고 제안을 별도 필드에 저장(자동 덮어쓰기 금지).
3. 예산·예측 탭에서 예산·입력값으로 `SeoInvestment.forecast[]`와 `BudgetRecommendation[]` 계산. 모든 값에 `예측/신뢰도/모델/기간` 배지(Phase A는 `샘플` 별도 추가), `is_forecast=true` 유지. 공식 Keyword Planner 예측도 추정치임을 UI에 명시(`knowledge/13-seo-and-search-growth.md`).
4. 취합·개선 탭에서 실제값(`actual`)과 예측값(`delta`)을 라운드 단위로 취합하고 개선안을 만든다. 개선안을 S2 브리프/S5 콘텐츠로 보내려면 "브리프로 보내기" 클릭 시에만 `ModuleLink(s9→s2|s5)` 생성 — 자동 반영·자동 동기화 없음.
5. 데이터 출처는 소유 확인 계정의 공식 API·공개 검색 API·수동 입력으로 제한. 스크래핑·로그인/유료벽 우회 경로는 존재하지 않는다. 순위 보장 문구는 응답 템플릿에서 차단한다.

> S6 Forecast와 S9는 지표를 복제하지 않는다. S9가 자체 `SeoInvestment`를 갖고, S6의 `MetricSeries`가 필요하면 사용자가 명시적으로 연결한다.

---

## 6. AI / MCP / 외부 도구 경계

| 구분 | 계층 | MVP 처리 | 후속 |
|---|---|---|---|
| Ollama 로컬 HTTP | 웹앱 추론 | **사용** (`qwen3.8-local`, num_ctx 4096) | vision으로 자기 콘텐츠 프레임 분석(Phase B) |
| 자체 3D 구도 스키마(SVG/와이어프레임) | S8 프리뷰 | **사용**(시뮬레이션 배지, 실제 렌더 아님) | 경량 WebGL 카메라 프리뷰(Phase B) |
| DryRenderAdapter | S8 렌더 | **사용**(플레이스홀더·샘플 산출물) | fal.ai/Kling 등 실제 렌더(Phase B/C, 예산 승인 후) |
| OpenAI / Anthropic API | 웹앱 추론 | 미사용 | 서버사이드 키로 활성화 |
| fal.ai / Higgsfield / Kling | 웹앱 추론 | 미사용(비용) | 이미지·영상 생성 Provider |
| Postiz REST/MCP | 발행 연동 | Dry-run UI만 | REST 우선, 포크 금지(AGPL) |
| Buffer API/MCP | 발행·분석 연동 | 미사용 | 공식 문서 기반 OAuth |
| Snipit/Foreplay MCP | 레퍼런스 연동 | 사양 미확인 | 문서 확인 후 연동 |
| ComfyUI / Blender MCP | 개발 에이전트 | **제외** | 웹앱 런타임 경로 아님, GPL/무가드 코드 실행 리스크 |
| n8n | 내부 자동화 | 미사용 | 내부 백그라운드만(SUL), 사용자용 빌더 금지 |
| YouTube Data API | 수집(영상+썸네일) | **사용**(API key) | 검색 할당량 모니터링 |
| 네이버 검색 API | 수집(뉴스+블로그) | **사용**(Client ID/Secret) | 25,000회/일, 개인정보 최소 수집 |
| RSS / GDELT | 수집(블로그+뉴스) | **사용**(공개) | 출처 명시, 상업용 제한 피하기 |
| Meta/TikTok/LinkedIn Ad Library API | 수집(광고 메타) | **연동 대기**(심사·신원확인) | 공식 API만, 스크래퍼 금지 |
| Firecrawl MCP / Scrapling MCP / agent-browser skill | 개발 에이전트 | **개발 중에만** | 셀렉터·스키마 탐색 후 코드로 고정, 운영 요청 경로에 두지 않음 |
| Firecrawl 코어 / yt-dlp / 유료 Apify Actor | 수집 | **제외** | AGPL / 저작권·ToS / 과금·데이터 권리 |
| scikit-learn / statsmodels | S7 KMeans·S6 예측 | 미사용(MVP 샘플) | Phase B 도입, BSD-3 라이선스 재검증 |
| LightGBM / PyTorch | S6 고도 예측 | 미사용 | Phase C, MIT/BSD-3 확인 후 별도 검토 |
| Postiz/Buffer OAuth | 발행 실연동 | 미사용 | AGPL/ToS 법률 검토 후 REST 우선 |

> 원칙: **MCP/에이전트 연결은 운영·개발 콘솔, 웹앱은 REST SDK/Python 라이브러리.** 두 경로를 혼동하지 않는다. 수집도 예외가 아니다. 예측·군집 알고리즘도 동일하게 웹앱 내부에서 직접 호출하며, 외부 에이전트 경로를 타지 않는다.

---

## 7. 비기능 요구사항

| 항목 | 목표 | 방법 |
|---|---|---|
| 응답성 | 화면 전환 < 200ms, 스트리밍 첫 토큰 < 3s(로컬) | 로컬 Ollama, 폴링 1~2s |
| 내구성 | 작업 실패 시 재시도 1회, 상태 유지 | JobRunner + DB 상태 |
| 보안 | 키 비노출, 승인 전 발행 불가 | 서버 프록시 + Approval gate |
| 관측성 | 모든 AI 호출에 모델·토큰·비용 기록 | CostRecord, JobDrawer 로그 |
| 호환성 | 1440×900 우선, 1280/768 반응형 | Tailwind 토큰, 1024 이하 사이드바 접힘 |
| 규정 준수 | 원본 자산 미복제, Dry-run 명시 | 클린룸 재작성, 배지/문구 |
| 수집 준수 | robots/ToS/레이트리밋 100% 통과, 차단 건 0건 저장 | 4-4 체크리스트, CollectAdapter 게이트, provenance 로그 |
| 수집 성능 | 파트별 1회 수집 30초 내(공식 API 기준) | 비동기 Job, 캐시, 동시성 제한 |
| 모듈 격리 | S0~S9 10개 라우트·독립 테이블, KnowledgeService는 읽기 전용 공용 서비스(라우트 아님) | 자동 데이터 로드 0건, `ModuleLink`만 사용 |
| 비용 승인 | 실제 과금·비딩·예산 변경 100%에서 사전 동의 + 승인 이력, 임계값 초과 2차 팝업 | 자동 결제·자동 입찰 0건, 상한 초과 시 하드 스톱 |
| 연결 감사 | 모든 모듈 링크에 `created_by` 기록 | `ModuleLinkService.link()`만 생성 경로 |
| 예측 투명성 | S6 결과 100%에 `예측/신뢰도/모델`, S9 결과 100%에 `예측/신뢰도/모델/기간` 배지 | `Forecast` 렌더링 규칙 |
| 개인정보 | S7 원본 식별자 저장 0건 | 업로드 시 제거, 보유기간 명시, 삭제 요청 정책 |
| 근거 인용 | 분석·매핑 카드 100%에 `KB-ID / Sxx / 등급` | `KnowledgeCitation`, 등급 C는 "검증 필요" 배지 |
| 지식베이스 권리 | 원문 복제·번역·각색 0건, 캡처 근거 0건 | `SOURCES.md` 등급/권리 메모, `RAG-USAGE.md` 금지 사항 |

---

## 8. 알려진 제약·리스크

- 로컬 Qwen(27B UD-Q4_K_M)은 VRAM 7.6GB/8GB를 사용해 **동시 추론 1개**만 안전. ctx 4096 유지, GPU 레이어 제한 필요.
- Node/npm 미설치 → 구현 착수 전 환경 세팅 필요(현재 상태는 `IMPLEMENTATION-PLAN.md` 참조).
- Postiz(AGPL), n8n(SUL), ComfyUI(GPL)는 배포 형태에 따라 소스공개/라이선스 의무 발생 → 법률 검토 필요.
- Motion은 참고 자료의 출처 불일치를 재분석해 진본 여부를 확정했고, **그룹화·AI 태깅·모멘텀 카드 패턴만 구조 설계에 참고**한다. 출처가 뒤바뀐 자료군은 계속 제외하며, 실제 내부 리포트 동작은 관찰 증거가 없어 단정하지 않는다.
- 실제 발행/과금은 MVP 범위 밖. **수집은 MVP에 포함되되 공식 API·공개 피드·수동 입력에 한정**하고, 광고 라이브러리 심사/토큰이 필요한 경로는 "연동 대기"로 둔다.
- Meta/TikTok은 공개 페이지라도 자동 수집이 ToS상 명시 금지 → 스크래퍼를 붙이지 않는다. SNS 발행과 마찬가지로 Dry-run/메타데이터 참조만 허용한다.
- YouTube `search.list` 100/day 버킷, 네이버 25,000/day 등 외부 할당량은 변동 가능 → Job에 quota 게이지를 두고 초과 시 대기 상태로 전환한다.
- **모듈 엉킴 리스크**: S5~S9·KnowledgeService를 핵심 흐름(F1~F7)에 자동 편입시키려는 유혹 → NFR 모듈 격리/연결 감사로 차단. 연결은 사용자 클릭만 허용.
- **SEO 오인 리스크**: 예측치를 실제 순위·성과로 오해하거나 "최상위 노출 보장"으로 과장 → `예측/신뢰도/모델`(S6)·`예측/신뢰도/모델/기간`(S9) 배지, 공식 가이드 근거(S23/A), 순위 보장 문구 차단 테스트.
- **S9 계정·권리 리스크**: 시스템 대리 로그인·소유 확인되지 않은 계정·SERP 스크래핑·유료벽 우회 → 사용자가 직접 OAuth로 연동한 계정 + 공식 API/공개 데이터/수동 입력만 허용.
- **비용·비딩 오남용 리스크**: 자동 결제·자동 입찰·자동 예산 변경 → `CostApprovalService`가 승인 토큰 없이 실행 거부, 임계값 초과 시 2차 팝업, 상한 초과 시 하드 스톱(NFR-27·28).
- **지식베이스 저작권 리스크**: ASC·StudioBinder·Rosco·CreativeHut 등은 저작권 보호 문서이며 CreativeHut는 복제·번역·각색에 서면 허가를 요구 → 개념 자체 서술 + 출처 ID만 저장. 저장소에 포함되지 않는 로컬 캡처 자료는 라이선스 미확인이자 경로 의존으로 KB 근거에서 제외. 플랫폼 픽셀 수치는 공식 원칙(A)과 제3자 추정(C)을 분리해 단정 금지.
- **예측 오인 리스크**: 이동평균 결과를 실제 성과로 오해 → 예측 배지·신뢰도·샘플 배지 상시 노출.
- **개인정보 리스크**: S7 고객데이터 과수집 → 식별자 제거, 최소 변수, 보유기간·삭제 정책. 법률 검토 전 실제 CRM 연동 금지.

---

## 9. 확장 경로 (MVP 이후)

1. Provider 교체: InferenceGateway에 OpenAI/Anthropic/fal 어댑터 추가.
2. 발행 연동: DryRunConnector → Postiz/Buffer REST 어댑터(법률 검토 후).
3. 광고 라이브러리 연동: Meta/TikTok/LinkedIn 심사·토큰 완료 후 `AdLibraryMetaAdapter` 활성화(메타데이터 한정). Snipit/Foreplay MCP는 사양 확인 후 별도 커넥터.
4. 영상 생성: Creatify 패턴의 URL→video/아바타 흐름을 fal.ai/Kling 기반으로 구현.
5. 워크플로 빌더: React Flow로 F1→F7 파이프라인 시각화(내부용, n8n SUL 주의).
6. 다중 사용자: SQLite → Postgres, 인증/권한(RBAC) 추가.
7. **S5 고도화**: CMS/채널 공식 커넥터, 임베딩 기반 유사도(단순 토큰 → 시맨틱 중복 탐지).
8. **S6 고도화**: `statsmodels/scikit-learn` 회귀·시계열 + 신뢰구간 → `LightGBM` Feature 기반 예측 → 시계열 DL(시나리오 분석). 항상 예측 배지 유지.
9. **S7 고도화**: scikit-learn KMeans(k 3~6, silhouette/elbow), 범주형 one-hot + 스케일링, 최종적으로 딥 임베딩 군집 + `segment_id` 기반 맞춤 콘텐츠 추천. 실제 고객데이터는 개인정보 검토 후.
10. **모듈 연결 UX**: 설정의 ModuleLink 목록에 필터·해제·감사 로그 추가(연결은 여전히 사용자 액션만).
11. **전문 지식베이스 고도화**: Phase B 로컬 임베딩(라이선스 재검증 후) + 재랭킹, Phase C 사용자 승인 용어 사전 가중치. 출처가 삭제·유료화되면 `SOURCES.md` 상태 갱신 + 등급 한 단계 하향. 플랫폼 스펙은 분기별 재확인. 항상 요약·인용만 사용.
