# IMPLEMENTATION-PLAN — 1~2일 MVP 실행 계획 (수집기 + 독립 모듈 개정)

작성일: 2026-11-22  
전제: **문서 작성만 수행, 실제 웹앱 코딩은 하지 않음.** 이 문서는 "착수 시 무엇을 어떤 순서로 만들지"에 대한 실행 지침이다.  
관련 문서: `PRD.md`, `ARCHITECTURE.md`, `DESIGN-PLAN.md`, `COMPONENT-SPECS.md`, `SCREEN-SPECS.md`

> **2026-11-22 개정**: 기존에는 수집을 후속으로 뒀으나, 사용자 결정으로 **MVP에 Collector(S0)를 포함**한다. 캡처는 참고용이고 수집·정규화·분석 파이프라인은 이 프로젝트용으로 직접 설계·구현한다. 추가로 **S5 우리 콘텐츠 허브(최소), S6 성과·예측(샘플 뷰), S7 오디언스 세그먼트(샘플 뷰), S8 비디오 워크벤치(Phase A-lite)**를 독립 모듈로 편성한다. Motion은 재캡처로 진본 위치(`creatify-ai/capture/routes/features-agent/**`)가 확인되어 그룹화/태깅/모멘텀 패턴만 참고한다.

---

## 0. 현실성 판정 (먼저 읽을 것)

1~2일 MVP의 목표는 **"경쟁사 콘텐츠 수집(S0) → 우리 콘텐츠 관리(S5) → F1~F7 작업 흐름 → 성과·예측(S6)·오디언스(S7)·비디오 워크벤치(S8, Phase A-lite)까지 모듈별로 독립된 화면을 직접 눌러 확인할 수 있는 동작 프로토타입"**이다.

- **포함**: S0 Collector(4 파트 탐색, 수동+RSS+공개 API), S5 Own Content(보관함·겹침·시리즈·백로그, 최소), S1 References, S2 Studio, S3 Publishing(Dry-run), S4 Insights, S6 Forecast(샘플 + 이동평균), S7 Segments(샘플 UI), **S8 Video Workbench(Phase A-lite: 제작 유형 선택·레퍼런스 서치·분석 스키마·용어 확인·4단계 샘플 게이트·샷 단위 수정 프리뷰)**, 개선 순환, ModuleLink(수동 연결만).
- **의도적 제외**: 실제 소셜 발행/결제, 30+ 채널 OAuth, 실제 영상 생성·렌더(**진짜 렌더 어댑터·실제 3D 프리뷰·diff 재렌더·유형별 모션 내보내기는 Phase B/C**), 심사·토큰 필요한 Ad Library 연동, 플랫폼 ToS 금지 스크래핑, 미디어 재호스팅, 다중 사용자/권한, Postiz 포크, n8n 사용자용 빌더.
- **모듈 MVP의 현실적 한계**: S5는 수동/CSV만, S6은 샘플 데이터 + 이동평균 baseline만, S7은 샘플 좌표 + k 선택 UI만. **S8은 제작 유형 6종 중 사용자 명시 선택(기본 미선택, 자동 감지·자동 변경 금지) + 레퍼런스 서치(사용자 트리거 공개 소스 스텁/샘플 + 수동 URL·메모·타임코드, S0는 클릭 시 `ModuleLink`) + 2계층 분석 스키마 + `TermMapping` 사용자 확인 게이트 + 콘티/3D 구도 스키마/애니매틱/단계별 렌더 샘플 게이트 + 샷·타임코드 단위 수정 프리뷰 + 용어 사전 설정까지.** **KMeans 실제 실행, ML/DL 학습, CRM 연동, S8의 실제 렌더 어댑터·실제 3D·diff 재렌더·유형별 실제 렌더/모션 내보내기·레퍼런스 서치 실제 API 호출/쿼터 운영은 Phase B/C.** 모듈 간 자동 연결·자동 동기화는 만들지 않는다(사용자 클릭으로만 `ModuleLink` 생성).
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
3. App Shell 구현: 240px Sidebar(그룹 라벨 `[수집·자산]/[작업]/[분석]`, 9개 메뉴 — S8 Video Workbench 포함), Topbar(프로젝트/Provider/검색/사용량), 라우팅 9개 슬롯.
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

## 3. Day 2 — 기획·제작·검수·발행·분석·예측·세그먼트·비디오 (F2~F7 + S6/S7/S8)

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

### 추가 트랙: S8 Video Workbench (Phase A-lite, S2와 독립)

26. S8 별도 라우트 + 3탭(분석/제작/수정) **독립 상태**. S2의 브리프·Job·승인 상태를 재사용하지 않고, 연결은 사용자가 "참고로 가져오기"를 누를 때만 `ModuleLink(s8→s2)` 생성.
27. **제작 유형 선택(프로젝트 단위)**: `실사 / 숏폼 / 영화 / 영상 / 애니메이션 / 모션그래픽` 6종 중 **사용자가 명시적으로 1개 선택**(기본 미선택). 자동 감지·자동 변경 금지, 변경 시 재확인. 선택 값이 분석 차원·구도 스키마·게이트 산출물·템플릿 필터·비용 프로파일을 결정한다(`planning/design/PRODUCTION-MODE-SPECS.md` 참조 — 이 문서에서는 생성하지 않음). 미선택 시 분석·제작 게이트 잠금.
28. **레퍼런스 서치**: 자동(사용자가 누를 때만 실행하는 공개 소스 검색 — 어댑터 스텁/샘플 결과) + 수동(URL·메모·타임코드 입력) 이원 UI. 공식 API·공개 피드·공개 메타만 대상으로 하고 로그인/유료벽/스크래핑 우회는 제외. 미디어 바이트 미저장, provenance(출처·방식·수집 시각·약관 스냅샷) 보존. **제작 유형별 검색 축** 적용(`planning/knowledge/12-reference-search-playbook.md` 참조 — 생성하지 않음). S0 결과는 "S8로 가져오기" 클릭 시에만 `ModuleLink(s0→s8)` 생성(자동 동기화·복제 금지). **실제 API 호출·쿼터 운영은 Phase B.**
29. 분석 탭: 콘텐츠 분석(훅·메시지·CTA·톤) + 기술 분석(카메라앵글·기법·전환·조명·구도·편집) 2계층 스키마 UI. 레퍼런스 서치 결과를 입력으로 받고 **제작 유형별 분석 차원 필터**를 적용한다. 비전문가 자연어 문장을 `TermMapping`(표준 용어 + 원문 근거)으로 매핑해 **사용자 확인 게이트**에서 수정·확정. 미확정이면 콘티 게이트 잠금. 숏폼/모션그래픽 용어는 자체 저작 KB(`planning/knowledge/10-shortform-composition.md`, `planning/knowledge/11-motion-graphics-and-animation.md`, 경로만 참조) 안정 ID를 참조.
30. 제작 탭: 4단계 게이트 ①콘티 → ②3D 구도 스키마 → ③애니매틱 → ④단계별 렌더. **유형별 구도/산출물/템플릿 필터**를 각 게이트에 적용하고, `DryRenderAdapter`의 샘플 프리뷰/스켈레톤만 표시. 명시적 승인 후에만 다음 단계로 진행. **전체 자동 렌더·모션 내보내기는 실행하지 않는다**(Phase B/C).
31. 수정 탭: 샷 ID/타임코드 선택 → 해당 구간만 개정 요청 → 영향 구간 프리뷰 + 샷 단위 개정 메모 저장. 전체 재렌더를 트리거하지 않는다(diff 재렌더·유형별 모션 재내보내기는 Phase B/C).
32. 설정: 용어 사전(비전문가 표현 ↔ 표준 촬영·편집 용어) 목록/추가/수정 UI + `TermMapping` 이력. 자체 저작 전문 지식베이스(`planning/knowledge/`, 이 문서에서는 생성하지 않음)의 안정 ID를 참조.

**S8 완료 기준**: 제작 유형이 기본 미선택이고 사용자 클릭으로만 선택·변경되며, 3탭 상태가 서로 섞이지 않는다. 레퍼런스 서치는 사용자 트리거/공개 범위/수동 입력만 제공되고 S0 링크는 클릭 시에만 생성된다. 자연어→용어 확인 전에는 콘티가 잠기고, 콘티→3D 스키마→애니매틱→렌더 샘플까지 단계별 승인으로만 진행되며, 샷/타임코드 수정이 전체 렌더를 트리거하지 않는다. 렌더/3D/재렌더/모션 내보내기/실제 검색 API 화면에는 `Phase B/C` 배지가 붙는다.

---

## 4. 작업 단위 체크리스트

| # | 작업 | 산출 | 의존 | 예상 |
|---:|---|---|---|---|
| 1 | Vite/Tailwind/shadcn 초기화 + 토큰 | 프런트 골격 | Node 설치 | 40m |
| 2 | FastAPI + SQLite 스키마(수집 엔티티 포함) | 백엔드 골격 | Python | 40m |
| 3 | App Shell(Sidebar 9메뉴/Topbar/라우팅 9개, S8 포함) | 공통 레이아웃 | 1 | 50m |
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
| 22 | S8 라우트 + 3탭 독립 상태 + 수동 ModuleLink(s8→s2) | Video Workbench 골격 | 2,3 | 25m |
| 23 | 제작 유형 6종 선택 UI + 프로젝트 모델(기본 미선택) + 템플릿 필터 | 유형 프로파일 | 22 | 25m |
| 24 | 레퍼런스 서치 UI(자동 스텁/샘플 + 수동 URL·메모·타임코드) + S0 명시적 링크 | 검색/근거 | 22,23 | 30m |
| 25 | S8 2계층 분석 스키마 + 유형별 분석 차원 + TermMapping 확인 게이트 | 분석 UI | 24 | 40m |
| 26 | 4단계 샘플 게이트(콘티→3D 스키마→애니매틱→DryRender) + 유형별 산출물 | 단계별 승인 | 25 | 50m |
| 27 | 샷/타임코드 타겟 수정 프리뷰 + 개정 메모 | 수정 UI | 26 | 35m |
| 28 | 용어 사전 설정 UI + Phase B/C 배지·공통 상태 | 설정/품질 | 22 | 25m |

핵심 1~2일 MVP 합계 약 14~16시간(1인 기준 2일 내 달성 가능하나 **상한**. 키 미발급 시 #6은 스텁으로 대체하고 20분 단축, 시간 부족 시 #18/#19는 라우트 + Empty/샘플 배지만 먼저 붙이고 Phase B로 이관).  
**S8 Phase A-lite(#22~#28)는 별도 트랙 약 3시간 50분(총 18~20시간)** 이므로 2일 상한을 넘기 쉽다. 시간이 부족하면 #18/#19의 샘플 뷰를 Phase B로 이관해 S8 Phase A-lite 전체를 확보한다. 실제 렌더 어댑터·실제 3D 프리뷰·diff 재렌더·유형별 실제 렌더/모션 내보내기·**레퍼런스 서치 실제 API 호출/쿼터 운영**은 위 합계에 포함되지 않는다(**Phase B/C**).

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
| 모듈이 서로 엉킴 | S0/S5/S6/S7/S8 독립 라우트·테이블, ModuleLink만 허용. 자동 링크 API 없음 |
| S5~S8 때문에 2일 초과 | S5 최소 / S6·S7 샘플 뷰로 제한 / S8 Phase A-lite 트랙 분리, KMeans·ML/DL·CRM·실제 렌더·모션 내보내기는 Phase B/C로 명시적 이관 |
| 예측값을 실제 성과로 오인 | `예측/신뢰도/모델` + `샘플` 배지 상시 |
| 고객정보 과수집 | 식별자 제외 기본, 원본 미저장, 보유기간·삭제 정책 안내 |
| S8이 S2와 엉킴 | S8 별도 라우트·3탭 독립 상태, S2 Job/승인 상태 재사용 금지, `ModuleLink`만 허용 |
| S8 범위 확산(실제 렌더·3D·전체 재렌더·모션 내보내기) | `DryRenderAdapter` + 단계별 승인 게이트 + `Phase B/C` 배지, 전체 자동 렌더/내보내기 경로 없음 |
| 자연어→전문용어 오매핑 | `TermMapping` 사용자 확인 게이트, 미확정 시 다음 게이트 잠금, 용어 사전 수정 이력 보존 |
| 제작 유형 자동 변경/오선택 | 프로젝트 단위 명시 선택만 허용, 기본 미선택, 자동 감지·자동 변경 금지, 변경 시 재확인 + 기존 산출물 처리 정책 대기(DECISION-LOG 확인 필요) |
| 유형별 템플릿·비용 프로파일 과다 확장 | Phase A-lite는 템플릿 **필터/샘플 프리뷰**만, 유형별 기본 템플릿 소유와 실제 렌더 비용 산정은 확정 후(Phase B/C) |
| 4단계 게이트 클릭 피로 | 각 게이트에 샘플 프리뷰 + 기본값 제안, 승인은 명시적 클릭만(자동 통과 금지) |
| 레퍼런스 서치가 S0와 자동 엉킴 | `ModuleLink(s0→s8)`만 허용, 자동 동기화·복제·공유 FK 없음. 가져오기 버튼 외 경로 없음 |
| 공개 범위 초과(로그인/유료벽/우회) | 공식 API·공개 피드·공개 메타·수동만, 캡차·지문·프록시·쿠키 공유 금지(E5), 미디어 바이트 미저장 + provenance 보존(E7) |
| 검색 API 쿼터 초과/예산 불명 | Phase A는 스텁·샘플 결과만, 실제 호출과 쿼터 예산은 Phase B에서 승인 후 운영 |

---

## 6. 완료 후 다음 단계 (MVP 아님)

1. 광고 라이브러리 공식 연동: Meta/TikTok/LinkedIn 심사·토큰 완료 후 `AdLibraryMetaAdapter` 활성화(메타데이터 한정).
2. Provider 다변화(OpenAI/Anthropic/fal.ai/Higgsfield/Kling) — key 관리 강화.
3. Postiz/Buffer REST 연동(AGPL/OAuth 법률 검토 후), Snipit/Foreplay MCP 사양 확인.
4. 영상 생성 파이프라인, React Flow 워크플로 빌더, 인증·RBAC, Postgres 전환.
5. S5 CMS/채널 커넥터 + 임베딩 유사도(Phase B).
6. S6 statsmodels/scikit-learn → LightGBM/시계열 DL 예측(Phase B/C, 라이선스 재검증).
7. S7 scikit-learn KMeans + silhouette/elbow, 딥 임베딩 군집 + segment_id 추천(Phase B/C, 개인정보 검토 후).
8. S8 실제 렌더 어댑터 + 경량 3D 구도 프리뷰 → 실제 3D 프리뷰(Phase B/C, 공급자·예산 확정 후).
9. S8 diff 재렌더 + **제작 유형별 실제 렌더/모션 내보내기**(숏폼 플랫폼·모션그래픽 엔진 확정 후, Phase B/C).
10. S8 유형별 기본 템플릿·비용 프로파일 확정, 전문 KB RAG 확장(`planning/knowledge/` 자체 저작 경로만 참조).
11. S8 레퍼런스 서치 실제 공개 API 어댑터 + 쿼터 예산 운영/우선 플랫폼 확정(Phase B), 타임코드 Grounding 범위 검토 후 확장.

---

## 7. 이 문서의 수용 기준

- [ ] 1~2일 범위가 명시적으로 정의되고 제외 항목이 있다.
- [ ] S0 수집 → F1~F7 순환이 Day 1~2 작업에 모두 매핑된다.
- [ ] S5/S6/S7/S8이 독립 모듈로 Day 1~2 작업에 매핑되고, Phase B/C 항목과 구분된다.
- [ ] S8 제작 유형 6종(실사/숏폼/영화/영상/애니메이션/모션그래픽)이 프로젝트 단위 명시 선택(기본 미선택·자동 감지/변경 금지)으로 정의되고, 템플릿 필터와 유형별 분석 차원·산출물·비용 프로파일에 연결된다.
- [ ] S8 레퍼런스 서치가 자동(사용자 트리거)/수동 이원, 공개 범위 한정, `ModuleLink(s0→s8)` 클릭 연결만 허용하며 실제 API 호출·쿼터는 Phase B로 분류된다.
- [ ] S8의 용어 확인 게이트·4단계 샘플 게이트·샷 단위 수정 프리뷰가 Phase A-lite 범위이고, 실제 렌더/3D/diff 재렌더/유형별 모션 내보내기는 Phase B/C로 명시된다.
- [ ] 모듈 간 연결이 사용자 클릭(ModuleLink)으로만 발생한다.
- [ ] 4개 파트(영상/이미지/블로그/뉴스) UI와 적어도 2개 이상의 실제 수집 경로가 있다.
- [ ] 로컬 Ollama가 실제 생성 경로로 지정되어 있다.
- [ ] 발행/과금은 Dry-run, 예측은 `예측` 배지, S7은 개인정보 경고로 명시되어 있다.
- [ ] Motion 진본 소스 위치와 재평가 점수가 반영되어 있다.
- [ ] 사전 환경(미설치 항목·수집 키)이 착수 전 체크된다.
