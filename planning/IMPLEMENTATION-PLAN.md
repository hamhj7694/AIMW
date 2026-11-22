# IMPLEMENTATION-PLAN — 1~2일 MVP 실행 계획 (수집기 + 독립 모듈 개정)

작성일: 2026-11-22  
전제: **문서 작성만 수행, 실제 웹앱 코딩은 하지 않음.** 이 문서는 "착수 시 무엇을 어떤 순서로 만들지"에 대한 실행 지침이다.  
관련 문서: `PRD.md`, `ARCHITECTURE.md`, `DESIGN-PLAN.md`, `COMPONENT-SPECS.md`, `SCREEN-SPECS.md`

> **2026-11-22 개정**: 기존에는 수집을 후속으로 뒀으나, 사용자 결정으로 **MVP에 Collector(S0)를 포함**한다. 캡처는 참고용이고 수집·정규화·분석 파이프라인은 이 프로젝트용으로 직접 설계·구현한다. 추가로 **S5 우리 콘텐츠 허브(최소), S6 성과·예측(샘플 뷰), S7 오디언스 세그먼트(샘플 뷰)**를 독립 모듈로 편성한다. Motion은 재캡처로 진본 위치(`creatify-ai/capture/routes/features-agent/**`)가 확인되어 그룹화/태깅/모멘텀 패턴만 참고한다.

---

## 0. 현실성 판정 (먼저 읽을 것)

1~2일 MVP의 목표는 **"경쟁사 콘텐츠 수집(S0) → 우리 콘텐츠 관리(S5) → F1~F7 작업 흐름 → 성과·예측(S6)·오디언스(S7)까지 모듈별로 독립된 화면을 직접 눌러 확인할 수 있는 동작 프로토타입"**이다.

- **포함**: S0 Collector(4 파트 탐색, 수동+RSS+공개 API), S5 Own Content(보관함·겹침·시리즈·백로그, 최소), S1 References, S2 Studio, S3 Publishing(Dry-run), S4 Insights, S6 Forecast(샘플 + 이동평균), S7 Segments(샘플 UI), 개선 순환, ModuleLink(수동 연결만).
- **의도적 제외**: 실제 소셜 발행/결제, 30+ 채널 OAuth, 영상 생성, 심사·토큰 필요한 Ad Library 연동, 플랫폼 ToS 금지 스크래핑, 미디어 재호스팅, 다중 사용자/권한, Postiz 포크, n8n 사용자용 빌더.
- **모듈 MVP의 현실적 한계**: S5는 수동/CSV만, S6은 샘플 데이터 + 이동평균 baseline만, S7은 샘플 좌표 + k 선택 UI만. **KMeans 실제 실행, ML/DL 학습, CRM 연동은 Phase B/C.** 모듈 간 자동 연결·자동 동기화는 만들지 않는다(사용자 클릭으로만 `ModuleLink` 생성).
- **수집 MVP의 현실적 한계**: 4개 파트 **UI/탐색은 전부** 만들고, 어댑터는 **수동 입력 + RSS(항상) + 공식 API 1~2개(키 발급 시)** 로 제한한다. 키가 없는 소스는 "연동 대기" 배지로 표시하고 실제 호출하지 않는다.

> 로컬 Qwen 27B는 VRAM 7.6/8GB를 점유하므로 **동시 추론 1개**, `num_ctx 4096` 유지. 생성은 비동기 Job으로 처리한다(수집 Job도 동일 프레임워크 재사용).

---

## 1. 사전 환경 준비 (착수 전 30~45분, 구현 일자에 포함)

| 항목 | 상태 | 조치 |
|---|---|---|
| Node/npm | **미설치** 확인됨 | Node 20 LTS + npm 설치, `npm create vite@latest` 준비 |
| shadcn/ui | 미설치(CLI 없음) | Vite + Tailwind v4 초기화 후 `npx shadcn@latest init` |
| Python/FastAPI | 확인 필요 | Python 3.11+ venv, `fastapi uvicorn pydantic sqlalchemy httpx` 설치 |
| **수집 라이브러리** | 미설치 | `feedparser trafilatura>=1.8 beautifulsoup4 lxml readability-lxml newspaper4k` 설치 |
| **수집용 키** | 미발급 | YouTube Data API key(영상+썸네일), 네이버 검색 Client ID/Secret(뉴스+블로그). **없으면 수동+RSS+GDELT로 진행** |
| Playwright | 선택 | JS 렌더 필요 시 `pip install playwright` + `playwright install chromium` (Python만으로 가능, Node 불필요) |
| Ollama | **설치·검증 완료** | `qwen3.8-local:latest` 사용, API `127.0.0.1:11434` |
| 디자인 스킬 | 미설치 | `browser` 스킬 + DESIGN-PLAN 체크리스트로 대체 |
| 패키지 라이선스 | 확인 완료 | MIT/Apache/BSD 위주. Firecrawl(AGPL)·html2text(GPLv3)·trafilatura<1.8(GPLv3+) 제외 |
| 수집 대상 검토 | 필수 | robots.txt/ToS 확인, 허용 도메인 화이트리스트 작성 |

---

## 2. Day 1 — 골격 + 수집기 + 레퍼런스 (S0 → F1)

### 오전: 프로젝트 골격 + Collector

1. Vite + React + TS + Tailwind v4 초기화, shadcn init, 토큰을 `DESIGN-PLAN.md` 값으로 주입(`--primary` 등).
2. FastAPI 스켈레톤 + SQLite `create_all` + CORS(로컬 only). `CollectSource/CollectJob/CollectedItem` 스키마 포함.
3. App Shell 구현: 240px Sidebar(그룹 라벨 `[수집·자산]/[작업]/[분석]`, 8개 메뉴), Topbar(프로젝트/Provider/검색/사용량), 라우팅 8개 슬롯.
4. S0 Collector UI: `CollectTargetForm` + **VerticalTabs(전체/영상/이미지/블로그/뉴스, 독립 URL)** + `SourceList` + 결과 그리드 + `ComplianceBadge`.
5. `CollectAdapter` 인터페이스 + `ManualAdapter`(URL/메모 직접 입력), `RssAdapter`(feedparser), `AdLibraryMetaAdapter` 스텁("연동 대기").
6. 키가 있으면 `YouTubeAdapter`(영상+썸네일) 또는 `NaverSearchAdapter`(뉴스+블로그) 중 **1개 우선 연결**. GDELT는 영문 뉴스 백업으로 선택.
7. 정규화·중복제거(URL + external_id + content_hash) + `CollectedItem` 저장. 미디어는 재호스팅하지 않고 원문/썸네일 URL만 보관.
8. `CollectJob` 상태(진행/중복 skip/대기/실패 재시도)를 JobDrawer에 표시.

### 오후: References + S5 Own Content Hub (최소)

9. S1: S0에서 "분석" 버튼으로 이관된 항목 + 직접 저장한 레퍼런스 목록, 보드 필터, TanStack Table, 빈/로딩 상태. 이관 시 `source/source_mode/fetched_at/terms_snapshot` 보존.
10. S1 → "AI 분석": Ollama에 후킹/메시지/CTA 추출 프롬프트 → `Analysis` 저장 → 우측 패널 표시.
11. S5 골격: `OwnContent` 테이블 + 수동/CSV import(샘플 템플릿) + 서브탭(보관함/겹침·시리즈/아이디어 백로그). **S0 데이터는 자동 로드하지 않는다.**
12. S5 겹침: 제목/카피 토큰 Jaccard로 `신규/유사/확장` 배지 + 기존 콘텐츠 링크. 시리즈 태그와 아이디어 카드 작성까지.
13. ModuleLinkService: `link(source, source_id, target, target_id, created_by)` / `unlink()` + 설정의 연결 목록 UI. S0 "참고로 가져오기"와 S5 "이 아이디어로 기획" 버튼에만 연결(자동 링크 없음).

**Day 1 완료 기준**: 분야/경쟁사를 등록해 4개 파트 탭에서 결과(또는 연동 대기/Empty)를 보고, 선택 항목이 S1로 이관되어 AI 분석 결과가 보이며, S5에서 우리 콘텐츠를 등록해 겹침 배지와 아이디어 카드를 확인할 수 있다. S0↔S5 연결은 버튼을 누를 때만 생긴다.

---

## 3. Day 2 — 기획·제작·검수·발행·분석·예측·세그먼트 (F2~F7 + S6/S7)

### 오전: S2 Studio + S3 Publishing

14. S2: 브리프 생성 폼(상품/타깃/브랜드 톤, 참고 레퍼런스 + S5 아이디어 선택) → `Job` 생성 → Ollama 스트리밍 → `Brief` 저장.
15. 콘셉트 3안 생성 → 1안 선택 → 카피 + 이미지 프롬프트 생성.
16. MONOV 패턴의 **4장 결과 그리드**(카드 + 재생성/수정 버튼) 구현. 실제 이미지는 후속이므로 MVP에서는 플레이스홀더 + 프롬프트 텍스트 표시.
17. 검수 탭: 체크리스트(상품명/가격/금지어/브랜드 톤) + 승인 버튼 → `Review.approved`, 상태 배지.
18. S3: 채널 타일(연결 필요 배지), 게시물 큐 + 주간 그리드(Buffer publish 패턴), 채널별 텍스트 변환 미리보기.
19. "예약" 클릭 → `PublishJob.scheduled` + **Dry-run 배지**. 실제 외부 전송 코드 없음.

### 오후: S4 Insights + S6 Forecast + S7 Segments + 순환 + 마감

20. S4: CSV 업로드 → 지표 매핑(노출/클릭/광고비/상담/계약) → Recharts 카드/막대 + Top 콘텐츠 테이블.
21. "개선안 만들기" → Ollama가 지표 기반 제안 생성 → "이 개선안으로 새 브리프" 버튼이 S2 브리프 폼에 값 채워 이동(**F7→F2 순환**).
22. S6: 별도 라우트. `MetricSeries`(샘플/CSV) → 이동평균 baseline 예측 → 실선/점선 차트 + **예측·신뢰도·모델 배지**. "S5 콘텐츠와 연결"은 클릭 시 `ModuleLink(s6→s5)`만 생성.
23. S7: 별도 라우트. `AudienceDataset`(샘플, 식별자 제외 기본) → 변수 체크 → k=3~6 선택 → 군집 카드/산점도 + 프로필(사람 편집). 실제 KMeans는 Phase B이므로 `샘플` 배지 필수.
24. `browser` 스킬로 1440 스크린샷 + 콘솔/네트워크 오류 확인, Lighthouse 접근성, 대비비·가로 오버플로 점검.
25. DESIGN-PLAN 수용 기준 체크, Dry-run/샘플/예측/개인정보 배지 확인, 모듈 간 자동 연결이 0건인지 확인, 문서-화면 라벨 일치 확인.

**Day 2 완료 기준**: 승인→예약(Dry-run)→성과 업로드→개선안→새 브리프까지 클릭 흐름이 끊기지 않고, S6/S7이 독립 진입되어 샘플 상태를 표시하며, 모듈 간 연결은 사용자 클릭으로만 기록된다. 모든 화면에 빈/로딩/성공/실패 상태가 존재한다.

---

## 4. 작업 단위 체크리스트

| # | 작업 | 산출 | 의존 | 예상 |
|---:|---|---|---|---|
| 1 | Vite/Tailwind/shadcn 초기화 + 토큰 | 프런트 골격 | Node 설치 | 40m |
| 2 | FastAPI + SQLite 스키마(수집 엔티티 포함) | 백엔드 골격 | Python | 40m |
| 3 | App Shell(Sidebar 8메뉴/Topbar/라우팅 8개) | 공통 레이아웃 | 1 | 50m |
| 4 | S0 Collector UI + VerticalTabs | Collector 화면 | 1,3 | 60m |
| 5 | CollectAdapter + Manual/RSS + 스텁 | 수집 파이프라인 | 2 | 60m |
| 6 | 공식 API 어댑터 1개(YouTube 또는 네이버) | 실제 수집 | 5, 키 | 50m |
| 7 | 중복제거·provenance·S1 이관 | 데이터 품질 | 5 | 40m |
| 8 | S1 레퍼런스 목록 + AI 분석 | References | 4,7 | 60m |
| 9 | S5 수동/CSV 보관함 + 겹침/시리즈/백로그 | Own Content(최소) | 2,3 | 70m |
| 10 | ModuleLinkService + 설정 연결 목록 | 모듈 격리 | 2 | 40m |
| 11 | InferenceGateway + Ollama 연결 | AI 호출 경로 | 2 | 30m |
| 12 | 브리프/콘셉트/카피 생성 Job | Studio 생성 | 11 | 70m |
| 13 | 4장 결과 그리드 + 상태 | Studio 결과 | 12 | 40m |
| 14 | 검수 체크리스트 + 승인 | Review 흐름 | 13 | 30m |
| 15 | S3 큐/캘린더(Dry-run) | Publishing | 14 | 60m |
| 16 | S4 CSV 업로드 + 차트 | Insights | 2 | 60m |
| 17 | 개선안 → 새 브리프 순환 | F7 완성 | 12,16 | 30m |
| 18 | S6 샘플 시계열 + 이동평균 + 예측 배지 | Forecast | 2,3 | 50m |
| 19 | S7 샘플 변수/k/군집 프로필 + 개인정보 경고 | Segments | 2,3 | 50m |
| 20 | 공통 상태(empty/loading/error/sample/예측) | 품질 | 전반 | 40m |
| 21 | browser 검수 + 문서 정합 | 마감 | 전반 | 30m |

합계 약 14~16시간(1인 기준 2일 내 달성 가능하나 **상한**. 키 미발급 시 #6은 스텁으로 대체하고 20분 단축, 시간 부족 시 #18/#19는 라우트 + Empty/샘플 배지만 먼저 붙이고 Phase B로 이관).

---

## 5. 위험·완화

| 위험 | 완화 |
|---|---|
| npm/bun 미설치로 착수 지연 | Day 0에 설치 완료, Ollama는 이미 준비됨 |
| Qwen VRAM 포화 | 동시 추론 1개, ctx 4096, Job 직렬화 |
| 수집 API 키/할당량 부족 | 키 없으면 수동+RSS+GDELT로 진행, "연동 대기" 배지 표시. YouTube 100/day·네이버 25,000/day 게이지 |
| 수집 차단/ToS 위반 | 허용 도메인 화이트리스트, robots 확인, 지수 백오프, 차단 건 미저장. Meta/TikTok 스크래퍼 미사용 |
| 중복/오래된 수집 결과 | URL 정규화 + external_id + content_hash, ETag 캐시, fetched_at 노출 |
| 한국어 본문 추출 품질 | trafilatura 1.8+, readability-lxml 폴백, 샘플 5건 수동 검수 |
| 스트리밍 지연/끊김 | 첫 토큰 전에 "생성 중" 상태 노출, 재시도 1회 |
| CSV 스키마 불일치 | 샘플 CSV 템플릿 제공, 컬럼 매핑 UI |
| 범위 확산(실발행/영상/심사 API) | Dry-run 배지 + 명시적 제외 목록 준수 |
| 원본 자산 복제 유혹 | 클린룸 원칙, 토큰만 재선언 |
| 모듈이 서로 엉킴 | S0/S5/S6/S7 독립 라우트·테이블, ModuleLink만 허용. 자동 링크 API 없음 |
| S5~S7 때문에 2일 초과 | S5 최소 / S6·S7 샘플 뷰로 제한, KMeans·ML/DL·CRM은 Phase B/C로 명시적 이관 |
| 예측값을 실제 성과로 오인 | `예측/신뢰도/모델` + `샘플` 배지 상시 |
| 고객정보 과수집 | 식별자 제외 기본, 원본 미저장, 보유기간·삭제 정책 안내 |

---

## 6. 완료 후 다음 단계 (MVP 아님)

1. 광고 라이브러리 공식 연동: Meta/TikTok/LinkedIn 심사·토큰 완료 후 `AdLibraryMetaAdapter` 활성화(메타데이터 한정).
2. Provider 다변화(OpenAI/Anthropic/fal.ai/Higgsfield/Kling) — key 관리 강화.
3. Postiz/Buffer REST 연동(AGPL/OAuth 법률 검토 후), Snipit/Foreplay MCP 사양 확인.
4. 영상 생성 파이프라인, React Flow 워크플로 빌더, 인증·RBAC, Postgres 전환.
5. S5 CMS/채널 커넥터 + 임베딩 유사도(Phase B).
6. S6 statsmodels/scikit-learn → LightGBM/시계열 DL 예측(Phase B/C, 라이선스 재검증).
7. S7 scikit-learn KMeans + silhouette/elbow, 딥 임베딩 군집 + segment_id 추천(Phase B/C, 개인정보 검토 후).

---

## 7. 이 문서의 수용 기준

- [ ] 1~2일 범위가 명시적으로 정의되고 제외 항목이 있다.
- [ ] S0 수집 → F1~F7 순환이 Day 1~2 작업에 모두 매핑된다.
- [ ] S5/S6/S7이 독립 모듈로 Day 1~2 작업에 매핑되고, Phase B/C 항목과 구분된다.
- [ ] 모듈 간 연결이 사용자 클릭(ModuleLink)으로만 발생한다.
- [ ] 4개 파트(영상/이미지/블로그/뉴스) UI와 적어도 2개 이상의 실제 수집 경로가 있다.
- [ ] 로컬 Ollama가 실제 생성 경로로 지정되어 있다.
- [ ] 발행/과금은 Dry-run, 예측은 `예측` 배지, S7은 개인정보 경고로 명시되어 있다.
- [ ] Motion 진본 소스 위치와 재평가 점수가 반영되어 있다.
- [ ] 사전 환경(미설치 항목·수집 키)이 착수 전 체크된다.
