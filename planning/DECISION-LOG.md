# DECISION-LOG — 의사결정 기록

작성일: 2026-11-22  
범위: AIMW 분석·설계 단계에서 내린 결정과 근거. 날짜순 + 주제별.  
표기: 결정의 변경은 새 항목을 추가하고 이전 항목은 "대체됨"으로 표시한다.

---

## A. 분석 범위·출처 결정

### A1. reference 읽기 전용, planning에만 산출물 저장
- **결정**: `reference/**`는 수정 Golden Source, 모든 결과물은 `planning/**`.
- **근거**: 사용자 요구. 원본 캡처의 해시/메타 보존 필요.
- **대안**: 원본에 주석 추가(기각 — 감사 추적 훼손).

### A2. 전체 555파일 해시 인벤토리 생성
- **결정**: 파일 수/용량/유형/역할/SHA-256을 `research/SOURCE-INVENTORY.md`에 전수 기록.
- **근거**: 누락·중복·출처 판별의 기초 데이터. 18개 중복 해시 그룹, 0KB 스텁 식별.
- **영향**: `creatify-ai/app/AGENTS.md`는 생성 코드가 아닌 보조 산출물로 재분류(수정 반영 완료).

### A3. 생성 코드와 원본 캡처의 엄격 분리
- **결정**: `monov-ai-com/app/**`, `checks/**`는 "Craft Anything 생성물"로만 취급, 원본 소스로 인용 금지.
- **근거**: `feed.json`의 58% 유사도·28/36 claims, `build.ps1` 단순 복사, 플레이스홀더 이미지, snipit 오염 FAQ.
- **영향**: MONOV는 패턴 참고만, 직접 코드 재사용 0건 원칙 확립.

### A4. Motion 레퍼런스 — 진본 재분류 (2026-11-22 재캡처로 일부 철회)
- **최종 결정**: `motionapp-com/capture/**`는 계속 전면 제외하되, **`creatify-ai/capture/routes/features-agent/**`를 Motion 진본으로 재분류**해 패턴 근거로 허용한다.
- **재캡처 근거**: `motionapp-com/investigation.cany/evidence/ac/ev_ac54ec...json:608-611` = `title: Motion | Ship more winning ads`, `url: motionapp.com`, output_directory=`creatify-ai/capture/routes/features-agent`. 해당 폴더 README:1-4도 `Capture of https://motionapp.com/`.
- **초기 판정(철회)**: README/capture.json/page.html/JSON-LD/OCR/SHA/치수가 Creatify여서 전체를 제외했으나, 원인은 **캡처 저장 경로 뒤바뀜**이었다.
- **허용 범위**: Inter Variable/`#5047eb`/`#f6f6f6`, visual-first 리포트, 자동 그룹화, AI 태깅, 주간 모멘텀 배지만 참고. 자산·UI 복제 금지, 내부 리포트 동작은 `api_operations: []`라 미단정.
- **파급**: COMPOSITION-PLAN Motion 0.00 → 3.70, REFERENCE-AUDIT 등급 X → B, FEATURE-MATRIX·DESIGN-PLAN·ARCHITECTURE 동기화. A5의 "`/features/agent` 제외"도 철회.

### A5. 오귀속 자료 추가 제거
- **결정**: MONOV `states/**`(←snipit), Foreplay `how-it-works.md`(←buffer), Buffer `states-390` state-1/2(SHA 동일)를 근거에서 제외. Creatify `/features/agent`는 A4 재캡처로 **Motion 진본 재분류**에 따라 제외 철회.
- **근거**: 각 capture.json URL/title, evidence output_directory, 해시 대조.
- **영향**: affected 서비스의 states 기반 UI 서술 신뢰도 하향, capture.json 텍스트/outline 기반으로 대체.

### A6. 이미지 직접 판독 불가 한계 명시
- **결정**: 스크린샷 시각 묘사를 "픽셀 관찰"이 아닌 "capture.json/OCR 기반 렌더링 증거"로 표기.
- **근거**: 이 모델의 PNG 입력 미지원(`this model does not support image input`), MONOV `unknowns/unk_961f...`에 동일 문제 기록.
- **대안**: OCR(Motion·Creatify)과 해시/헤더 검증으로 보완. 향후 이미지 입력 가능 에이전트에 재위임 권고.

---

## B. 제품·설계 결정

### B1. P0 F1~F7 정의 확정 및 재대조
- **결정**: F1 레퍼런스 분석 → F2 콘텐츠 기획 → F3 콘텐츠 제작 → F4 검수 → F5 발행 → F6 성과 분석 → F7 개선.
- **근거**: 사용자 정의를 서브 분석의 임의 F ID 매핑보다 우선.
- **영향**: `REFERENCE-AUDIT.md` 5절, `FEATURE-MATRIX.md`, `SCREEN-SPECS.md` 전부 재대조 완료.

### B2. 조합 점수 가중치 고정
- **결정**: P0 적합성 30 / MVP 구현 25 / UI·UX 20 / 유지보수·확장 15 / 연동·운영비용 10.
- **근거**: 사용자 요구. 합계 100%.
- **결과(최초)**: Snipit 4.50 > Buffer 4.10 > MONOV 3.80 > Creatify 3.55 > Foreplay 3.15 > Postiz 2.90, Motion 제외(0.00).
- **결과(2026-11-22 재캡처 반영)**: Snipit 4.50 > Buffer 4.10 > MONOV 3.80 > **Motion 3.70** > Creatify 3.55 > Foreplay 3.15 > Postiz 2.90. 가중치는 변경 없음.
- **영향**: 상위 2개(Snipit/Buffer)가 IA·F1·F5~F7 주 축, MONOV가 F3 축, Creatify가 F2/F3/F4 보조.

### B3. 채택 분류 5종 사용
- **결정**: 직접 코드 재사용 / 공식 API·MCP 연동 / UI·UX 패턴 참고 후 자체 구현 / 후속 개발 / 제외.
- **결과**: 직접 코드 재사용 0건, 패턴 참고 후 자체 구현이 MVP 기본.
- **근거**: 라이선스 미확인 + 오귀속 + 58% 품질.

### B4. 디자인 토큰 "재선언" 원칙
- **결정**: 원본 값(#334fff, #7133ea, #b0ec9c 등)은 참고 기록으로만 두고, 통합 팔레트는 `#3159D9` 등으로 재정의.
- **근거**: 트레이드드레스/표현 저작권 리스크 + 여러 브랜드 톤의 혼재.
- **영향**: `DESIGN-PLAN.md` 3장, `COMPOSITION-PLAN.md` 3-2절.

### B5. AI는 비동기 Job + 사람 승인
- **결정**: 모든 생성은 Job 상태(queued→…→approved→published)로 추적, 승인 전 발행 비활성.
- **근거**: Creatify "Review before approving", 게시물 큐의 상태 밀도, 운영 신뢰.
- **영향**: `ARCHITECTURE.md` JobRunner, `COMPONENT-SPECS.md` ApprovalGate/JobDrawer.

### B6. 발행/과금 Dry-run
- **결정**: MVP에서 실제 전송·결제 없이 상태/UI만 재현, DryRunBadge 상시 표시.
- **근거**: 사용자 요구(외부 API 실행/과금 금지), OAuth·인프라 비용.
- **영향**: PRD Out-of-scope, SCREEN-SPECS S3.

---

## C. 기술·운영 결정

### C1. 로컬 Ollama를 기본 추론 Provider로 확정
- **결정**: `qwen3.8-local:latest`(Qwen 27B UD-Q4_K_M + mmproj F16), `127.0.0.1:11434`, ctx 4096, 동시 추론 1개.
- **근거**: 설치·SHA 검증·API 테스트 완료(응답 "OK"). VRAM 7.6/8GB.
- **대안**: 유료 API 우선(기각 — 비용/키 관리, 사용자 승인 전).

### C2. 스택 선택: React/TS + shadcn/Tailwind v4 + FastAPI + SQLite
- **결정**: MIT/무료 OSS 조합.
- **근거**: TanStack Table v9, Recharts 3.x, React Flow, FastAPI, Pydantic, SQLite 모두 라이선스·React/TS 적합성 확인.
- **선행 조건**: npm/bun 미설치 → Node 설치 후 shadcn init 필요.

### C3. Postiz/Buffer는 연동만, 포크/내장 금지
- **결정**: Postiz AGPL-3.0 소스공개 리스크 → REST/MCP 연동만 검토, 코드 포크 보류.
- **근거**: OSS 리서치(v2.26.0, AGPL-3.0, 셀프호스트 Postgres/Redis/Temporal).
- **영향**: COMPOSITION-PLAN 3-4 제외 항목.

### C4. n8n/ComfyUI/Blender MCP 제외
- **결정**: n8n은 내부 백그라운드 자동화로 제한(사용자용 워크플로 빌더 금지, SUL), ComfyUI(GPL 파생)/Blender MCP(무가드 코드 실행·데스크톱 전용) 웹 서비스화 보류.
- **근거**: OSS 라이선스/보안 리서치.

### C5. 디자인 스킬 미설치 → 수동 체크리스트 + browser 대체
- **결정**: UI UX Pro Max / Anthropic Frontend Design / Impeccable / Vercel Guidelines / shadcn/21st.dev 모두 미설치로 확인, `browser` 스킬(사용 가능)로 렌더링·Lighthouse·콘솔 검수.
- **근거**: 로컬 skill 디렉터리 없음, 세션 사용 가능 스킬은 browser/opencode/report 3개뿐.
- **영향**: DESIGN-PLAN 8절에 가용성 표 기록.

### C6. 구현 착수 전 환경 세팅을 Day 0에 편성
- **결정**: Node/npm, Python venv 설치를 IMPLEMENTATION-PLAN 0절에 명시.
- **근거**: Snipit/MONOV 빌드가 node/bun 부재·consent_required로 무산된 이력.

---

## D. 문서 결정

### D1. 산출물 11개 문서 구조 확정
- **결정**: `research/` 4 + `design/` 3 + 루트 4(PRD/ARCHITECTURE/IMPLEMENTATION-PLAN/DECISION-LOG).
- **근거**: 사용자 요구 목록.
- **현황**: 전 문서 작성 완료, 상호 참조 일관성 검증 필요(최종 체크).

### D2. 실제 웹앱 코딩은 하지 않음
- **결정**: 분석·계획·설계 문서만 저장하고 종료.
- **근거**: 사용자 요구(구현은 별도 착수).
- **상태**: 준수 중 — `planning/**`에 마크다운만 존재.

---

## E. 수집 파이프라인 결정 (2026-11-22 사용자 결정 반영)

### E1. 캡처는 참고용, 수집·검색·분석은 자체 설계·구현
- **결정**: 7개 서비스 캡처는 인터랙션/토큰 참고용으로만 두고, "분야/우리 서비스/경쟁사 등록 → 수집 → 정리 → AI 분석" 파이프라인은 이 프로젝트용으로 새로 설계한다.
- **근거**: 사용자 명시. 캡처는 마케팅 사이트 렌더링일 뿐 실제 수집 엔진·API가 없음(`api_operations: []`).
- **대체됨**: 기존 IMPLEMENTATION-PLAN 0절/ARCHITECTURE 8절의 "외부 스크래핑은 MVP 범위 밖" 방침은 이 결정으로 대체됨. 발행 Dry-run 원칙(B6)은 유지.
- **영향**: S0 Collector 화면 신설, PRD FR-02~FR-06, ARCHITECTURE CollectorHub. 이후 S5~S7 추가로 최종 8개 화면 라우팅(DESIGN-PLAN 4절).

### E2. MVP 수집 범위 — 4개 파트 UI + 제한된 어댑터
- **결정**: 영상 광고 / 이미지 광고 / 블로그 / 뉴스 4개 파트를 독립 탭(URL)으로 노출하고, 어댑터는 수동 입력 + RSS + 공식 API 1~2개(키 발급 시)로 제한. 나머지는 "연동 대기" 배지.
- **근거**: 1~2일 현실성(약 11~12시간), 키/심사 소요, 법적 리스크.
- **영향**: IMPLEMENTATION-PLAN #4~#8, SCREEN-SPECS S0.

### E3. 1차 소스 4개 확정
- **결정**: YouTube Data API(영상+썸네일), 네이버 검색 API(한국어 뉴스+블로그), RSS/Sitemap(블로그), GDELT classic(영문 뉴스 백업)을 1차로 사용.
- **근거**: 공식 문서상 무료·심사 불필요(YouTube/네이버는 키만), 할당량 명확(YouTube 약 10,000 units/day + `search.list` 약 100/day, 네이버 25,000/day). Google News RSS는 피드가 "개인·비상업용"이라 제외.
- **영향**: ARCHITECTURE 3-1 표, PRD 가정/의존.

### E4. 광고 라이브러리는 "메타데이터만, 연동 대기"
- **결정**: Meta/TikTok/LinkedIn Ad Library는 심사·토큰 완료 후 메타데이터/스냅샷 URL만 적재. MVP에서는 실제 호출 없이 상태만 표시. Google Ads Transparency는 공식 상업 API가 확인되지 않아 BigQuery 공개 데이터셋 검토로 유보.
- **근거**: Meta 신원확인 수일 + 정치/EU 한정, TikTok 심사 + EU 한정, LinkedIn vetted + OAuth, 자동 수집 ToS 금지.
- **영향**: PRD Out-of-scope, ARCHITECTURE 연동 대기 표.

### E5. 스크래핑 금지선과 오픈소스 선택
- **결정**: 캡차 해결·지문 위조·프록시 회전·로그인 쿠키 공유 도구 사용 금지. `feedparser`(BSD-2), `trafilatura>=1.8`(Apache-2.0), `BeautifulSoup4`(MIT), `lxml`(BSD-3) 사용. 브라우저 렌더는 `Playwright`(Apache-2.0) 선택적.
- **제외**: Firecrawl 코어 self-host(AGPL-3.0), yt-dlp(저작권·ToS), 유료 Apify Actor, 라이선스 없는 GitHub 스크래퍼, Google News RSS(비상업 제한), html2text(GPLv3).
- **영향**: ARCHITECTURE 3-1, COMPONENT-SPECS 재사용 금지 목록.

### E6. MCP는 개발 도구, 운영 경로는 REST/라이브러리
- **결정**: Firecrawl MCP·Scrapling MCP·agent-browser skill은 개발 중 셀렉터/스키마 탐색에만 쓰고, 확정 스키마는 FastAPI 라이브러리 호출로 고정. 웹앱 요청 경로에 MCP를 두지 않는다.
- **근거**: MCP는 에이전트→도구 프로토콜이며 세션/컨텍스트/비결정성 비용이 큼. 제공자 정책·AGPL 리스크.
- **영향**: ARCHITECTURE 6절 경계 표.

### E7. 미디어 비재호스팅 + provenance 보존
- **결정**: 이미지·영상 파일을 내려받아 재배포하지 않고 원문/썸네일 URL만 참조. 모든 수집 항목에 출처, 방식, 수집 시각, 약관 스냅샷, 라이선스 메모를 저장.
- **근거**: 광고 크리에이티브·뉴스 사진·헤드라인의 저작권/상표/퍼블리시티 권리.
- **영향**: ARCHITECTURE 4-3/4-4, PRD NFR-09.

---

## F. 독립 모듈 결정 (2026-11-22 사용자 추가 기획 반영)

### F1. S5/S6/S7을 별도 모듈로 추가
- **결정**: S0 Collector(경쟁사)와 별개로 **S5 Own Content Hub(우리 콘텐츠)**, **S6 Performance & Forecast(성과·예측)**, **S7 Audience Segments(타깃 분류·군집)**을 신설한다.
- **근거**: 사용자 요청 — 과거 우리 콘텐츠 확인, 중복 방지/시리즈 확장, 미래 콘텐츠 후보, 과거 성과 + 미래 예측(k민즈 포함) 및 타깃 세그먼트.
- **영향**: PRD FR-21~33/NFR-12~16, SCREEN-SPECS S5~S7, COMPONENT-SPECS 3-7~3-9, ARCHITECTURE 4-2/4-3.

### F2. 모듈 엉킴 방지를 최우선 원칙으로 확정
- **결정**: 모듈별 독립 라우트·독립 테이블·독립 상태. **기본값은 연결 off.** 연결은 사용자가 "가져오기/연결/적용" 버튼을 누를 때만 `ModuleLink(source_module, source_id, target_module, target_id, created_by)`로 생성하고 설정에서 해제한다.
- **금지**: S0 결과의 S5 자동 주입, S6 예측의 S2 자동 브리프 생성, S7 추천의 자동 적용, 모듈 간 FK/데이터 복제/자동 동기화.
- **근거**: 사용자 명시 — "막 엉겨붙어서 복잡하면 안 되고 잘 분리되고 직관적이어야 하며, 필요할 때만 연동".
- **영향**: NFR-12/13, ARCHITECTURE 원칙 9·4-2 모듈 경계 규칙, ModuleLinkService만 유일한 연결 경로.

### F3. 단계 분리 — MVP는 최소/샘플, 알고리즘은 Phase B/C
- **결정**: Phase A(1~2일)는 S5 수동/CSV + 토큰 Jaccard 겹침, S6 이동평균 baseline(샘플), S7 샘플 좌표 + k 선택 UI. Phase B는 CMS 커넥터/임베딩 유사도, statsmodels·scikit-learn 예측, 실제 KMeans + silhouette. Phase C는 LightGBM/시계열 DL, 딥 임베딩 군집, CRM 연동.
- **근거**: 1~2일 현실성(약 14~16시간 상한) + 라이선스/개인정보 검토 필요.
- **영향**: IMPLEMENTATION-PLAN Day 1 #11~13 / Day 2 #22~23, PRD phase 표.

### F4. 예측·세그먼트의 안전장치
- **결정**: S6 예측은 반드시 `예측/신뢰도/모델` 배지, S7은 식별자 제외 기본 + 원본 미저장 + 보유기간·삭제 정책 + 사람이 라벨 확정.
- **근거**: 예측값 오인 및 개인정보보호법 리스크.
- **영향**: NFR-14/15, ForecastBadge/PrivacyNotice 컴포넌트.

### F5. 알고리즘 라이브러리 후보와 라이선스 원칙
- **결정**: 후보는 scikit-learn(BSD-3), statsmodels(BSD-3), LightGBM(MIT), PyTorch(BSD-3). 도입 시점에 라이선스·호환성 재검증. 미검증 패키지·MCP 경유 예측 호출 금지.
- **근거**: 사용자 제안(k민즈) 반영, 웹앱 경로는 REST/라이브러리 원칙 유지.
- **영향**: ARCHITECTURE 6절 도구 경계 표, NFR-16.

---

## G. 미결정 / 후속

| 항목 | 상태 | 결정 필요한 시점 |
|---|---|---|
| S7 실제 KMeans/CRM 연동 | 보류 | Phase B + 개인정보 검토 후 |
| S6 ML/DL 예측 모델 고도화 | 보류 | Phase B/C, 라이선스 재검증 후 |
| Motion 내부 리포트 재캡처 | 보류 | 진본 랜딩만 확보, 리포트 내부 캡처 필요 시 |
| API/MCP 사양 확인 후 연동 여부 | 보류 | Postiz/Buffer/Snipit/Foreplay/Creatify 문서 확보 시 |
| YouTube/네이버 API 키 발급 및 할당량 확인 | 보류 | 구현 Day 0 (없으면 수동+RSS+GDELT로 진행) |
| Meta/TikTok/LinkedIn Ad Library 심사·토큰 | 보류 | 공식 승인 후(메타데이터 한정 연동) |
| Google Ads Transparency BigQuery 데이터셋 검토 | 보류 | GCP 결제 설정 및 ToS 검토 후 |
| 한국어 본문 추출 품질 검증 | 보류 | trafilatura/readability-lxml 샘플 5건 테스트 시 |
| 법률 검토(AGPL/SUL/GPL/저작권/ToS) | 보류 | 배포 전 |
| shadcn/21st.dev 스킬 설치 여부 | 보류 | 구현 단계 |
| Provider 다변화(OpenAI/Anthropic/fal 등) | 보류 | MVP 이후 |
| 다중 사용자/RBAC | 보류 | MVP 이후 |
