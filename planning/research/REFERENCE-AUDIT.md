# REFERENCE-AUDIT — 7개 레퍼런스 통합 감사

작성일: 2026-11-22  
대상: `C:\Users\Administrator\Documents\Craft Anything\AIMW\reference` (읽기 전용, 수정 없음)  
전체 인벤토리: `SOURCE-INVENTORY.md` (555파일 / 258.34MB). 이 문서는 그 자료의 **신뢰도·출처·품질·기능/UX 근거**를 통합한다.

---

## 0. 감사 방법과 한계 (먼저 읽을 것)

- **출처 판별 원칙**: `*/capture/**` = 원본 브라우저 렌더링 산출물, `*/investigation.cany/**` = 조사 에이전트 기록(보조), `*/inbox|craft.json|feed.json|usage.json|build-activity.log` = Craft Anything 작업 메타, `monov-ai-com/app/**`·`checks/**` = **생성 재구성물**(원본 아님).
- **이미지 직접 판독 불가**: 이 모델은 PNG 입력을 지원하지 않아 스크린샷을 시각적으로 열지 못했다. 화면 기술은 `capture.json`의 `text`/`outline`/`layouts`, README, OCR(Motion·Creatify), PNG 헤더/해시에 근거한다. **"보이는 내용"은 렌더링 증거 기반이며 픽셀 직접 관찰이 아님**을 각 서비스에 명시했다.
- **P0 F1~F7 정의**: 부모 세션의 정의를 우선한다 → **F1 레퍼런스 분석 → F2 콘텐츠 기획 → F3 콘텐츠 제작 → F4 검수 → F5 발행 → F6 성과 분석 → F7 개선**. 서브 분석이 임의 매핑한 F ID는 이 정의로 재대조했다.

---

## 1. 출처 신뢰도 등급

| 등급 | 의미 | 해당 자료 |
|---|---|---|
| A — 원본 캡처 | 실제 렌더링 결과, 메타 일치 | Snipit/Foreplay/Postiz/Creatify(일부)/Buffer/MONOV `capture/**` |
| B — 보조 증거 | 조사 로그·DOM 분석, 교차 확인 필요 | `investigation.cany/evidence/**`, `how-it-works.md`, `capture.jsonhealth` |
| C — 생성 산출물 | Craft Anything 재구성, 원본 아님 | `monov-ai-com/app/**`, `checks/**` |
| X — 오귀속/불일치 | 근거로 사용 금지 | `motionapp-com/capture/**` 전반(Creatify 오염), Creatify `/features/agent` 오귀속 표기(2-7 재감사에서 Motion 진본 B등급으로 재분류), MONOV states, Foreplay how-it-works, Snipit/NONOV 상태 캡처 일부 |

---

## 2. 서비스별 감사 요약

### 2-1. Snipit (`snipit-im`) — 등급 A
- **출처**: `https://snipit.im/`, 실제 운영 서비스 마케팅 사이트. `capture/capture.json` url/푸터 `© 2026 Wessist Co., Ltd.` 일치.
- **범위**: 홈 + 4 라우트(`features/search`, `brand-archive`, `boards`, `ad-creation`). 5번째 스토어 라우트는 링크만.
- **핵심 근거**: 검색 모드(썸네일·카피 / 장면·대사), 보드/폴더/메모, 브랜드 자동 수집(위닝/A/B/타임라인), 4단계 AI 소재 생성 + 크레딧/빈 상태(`capture/routes/features-ad-creation/capture.json`).
- **품질 문제**: `channel.io` 401 전 라우트, 이름 없는 컨트롤 9개, H1 중복, `how-it-works.md`가 인용하는 JS 분석 evidence 미보관, 조사 문서 4개 0KB, 빌드 stopped(빌더가 이미지 미열람 + node/bun 없음 + consent_required).
- **판정**: **F1·F2에 최상 기여**. 발행/승인 UI 없음. 원본 HTML/이미지 복제 금지(clean room 원칙이 brief.md에 명시).

### 2-2. Foreplay (`foreplay-co`) — 등급 A(단, how-it-works는 X)
- **출처**: `https://www.foreplay.co/`, Webflow 렌더(`data-wf-domain`) 확인. 4 라우트(discovery, lens-creative-analytics, spyder-ad-spy, swipe-file).
- **핵심 근거**: Swipe File(확장 저장·태그·공유), Discovery(100M+ 검색·AI Search·Emotional Analysis), Spyder(24/7 수집·hook/transcript), Lens(벤치마크·세그먼트 리포트), Briefs.
- **품질 문제**: **모든 390px에서 435px 가로 스크롤**, 스크린샷 12000px 절단, OptinMonster/HubSpot 스크립트 오류·401/403/ORB, 2회 실행 기록·evidence 중복, **how-it-works.md가 buffer.com 분석으로 오염**(7·419행), lens/JS/watch evidence 누락.
- **판정**: **F1·F6 기여**. 실제 앱/API 응답 없음(마케팅 페이지 한정). 스크립트 이식 금지.

### 2-3. MONOV (`monov-ai-com`) — 등급 A + C 혼재
- **출처**: `https://www.monov-ai.com/workspace`. 원본 캡처(A)와 **생성 재구성 `app/**`·`checks/**`(C)**가 공존.
- **핵심 근거**: 제품사진 4장+레퍼런스 5장→광고이미지 4장(20크레딧), 이미지 편집(15크레딧·환불), 템플릿 영상 3~5초(실제 5~9초), 5열 워크스페이스, 스튜디오 다크 카탈로그(40크레딧).
- **중요 오염**: `capture/states/**`·`states-390/**`의 URL/라벨이 **snipit.im** 것임 → MONOV 메뉴 근거로 사용 불가. 생성 `app/src/**`가 이 오염 FAQ를 반영.
- **생성물 품질**: `feed.json` **"about 58% like the original, 28 of 36 claims hold"**. `app/build.ps1`은 단순 복사, 플레이스홀더 이미지, `/api/credits/balance` 등 401 다수.
- **판정**: **F3 핵심 기여(패턴만)**. `app/**` 코드는 라이선스 미확인+오염+품질 문제로 **직접 재사용 금지**. 401은 비로그인 세션 탓으로 해석.

### 2-4. Creatify (`creatify-ai`) — 등급 A(라우트 1개 X)
- **출처**: `https://creatify.ai/`. 마케팅 사이트 캡처, 생성 코드는 `app/AGENTS.md`(계획서)뿐.
- **핵심 근거**: URL→Video(단일 URL 입력→3단계), AI Avatar(3유형·감정 태그·140+ 보이스), Ad Agent/Max(Research/Create/Analyze + 승인 액션), Ad Flow(템플릿 10카테고리), 포맷 4종(UGC/Cinematic/CTV/Product).
- **품질 문제**: **`capture/routes.json`의 `/features/agent`가 실제로는 motionapp.com 캡처**(타이틀 `Motion | Ship more winning ads`) — 제외. 스크린샷 12000px 절단, 401 로그인 게이트, 상태 라벨/화면 불일치, 중복 헤딩.
- **판정**: **F2·F3·F4(사람 승인 문구) 기여**. API 스펙 없음(`api_operations: []`), UI/정적 인터랙션까지만 재현 가능.

### 2-5. Postiz (`postiz-com`) — 등급 A
- **출처**: `https://postiz.com/`. 홈 + 4 라우트(chatgpt/dots/claude/claude-duet). 1779 elements, `confidence: observed`.
- **핵심 근거**: AI agents/MCP OAuth, 30+ 채널, 비주얼 캘린더, 자동 반복/RSS, 공개 REST API + 웹훅, 애널리틱스, 멀티 브랜드(customer group), 팀 역할(Admin/Member).
- **품질 문제**: 메인은 스크립트 오류 0·이름 없는 컨트롤 0이나 **라우트 4개는 console error + 402 실패**; `states.json` 전부 빈 배열(아코디언 답변은 hidden이라 불일치); 마퀴 카드 2회 반복; `/pricing`·`/mcp`·실제 앱 미캡처.
- **판정**: **F5 핵심, F6 보조 기여**. AGPL-3.0(포크 금지), 자체 호스팅에 Postgres/Redis/Temporal 필요 → MVP에서는 UI 패턴 + 후속 REST 연동만.

### 2-6. Buffer (`buffer-com`) — 등급 A(단, states-390 중복)
- **출처**: `https://buffer.com/`. 홈 + 3 라우트(publish/insights/community). `/create` 실패.
- **핵심 근거**: PUBLISH(주간 캘린더·Seoul·Draft·예약 모드), INSIGHTS(기간 칩·지표 카드·Top5·Takeaways), COMMUNITY(인박스·Resolved), CREATE(문구만), AI assistant/MCP, Collaborate.
- **품질 문제**: **`/create` 캡처 실패 2회(연결 초기화 + 디렉터리 기존)** → screenshot만, capture.json/README 없음. 390 state-1/2 SHA 동일(라벨만 다름), Minified React error #418(insights/community), 이름 없는 컨트롤 48~61개.
- **판정**: **F5·F6·F7(Takeaways→개선) 기여**. /create 단독 캡처 없어 F2 확정 금지.

### 2-7. Motion (`motionapp-com` + `creatify-ai/capture/routes/features-agent`) — 등급 B (재캡처로 진본 확인)
- **감사 결론**: 이 폴더의 `capture/**`는 **Motion이 아니라 Creatify(`creatify.ai`)다.**
  - `craft.json` target = motionapp.com인데 `capture/README.md:1`, `capture/capture.json title/url`, `page.html` JSON-LD 전부 Creatify.
  - `evidence/1f/...json` output_directory = `motionapp-com/capture`, screenshot SHA가 로컬 creatify 캡처와 **정확 일치**. dimension도 Creatify(1440×10169)와 일치, Motion openfacts(24692×1425)와 불일치.
  - `journal:37,43,45,46`에 06:48 creatify.ai 오픈 직후 motionapp-com/capture에 저장한 기록. states 캡처 URL도 creatify.ai. OCR로 "Meet Max", "+creatify" 확인.
- **Motion 실증**: `evidence/a6/...`(title `Motion | Ship more winning ads`, 782 elements/0 forms), `evidence/d6/...`(32 scripts, 203 endpoints, `api_operations: []`), `evidence/51/...`(motionapp.com origin watch) — **페이지 존재·리소스 로드 수준뿐**.
- **판정**: **F1~F7 실질 기여 0**. `capture/**` 전면 사용 금지, 재캡처 전까지 기능/UI/토큰 "unknown". `evidence/ac/...` 라벨 오기(제목은 Motion, output은 creatify)도 발견 → evidence도 교차 확인 필요.

#### 2026-11-22 재캡처 재감사 (위 판정 일부 철회)

- **확인**: `motionapp-com/capture/**`는 여전히 Creatify이지만, **`motionapp-com/investigation.cany/evidence/ac/ev_ac54ec...json:608-611`**이 `title: Motion | Ship more winning ads`, `url: motionapp.com`으로 **Motion 캡처 성공**을 기록한다. output_directory가 `creatify-ai/capture/routes/features-agent`로 잘못 적혔을 뿐이다.
- **진본 위치**: `creatify-ai/capture/routes/features-agent/{README.md,capture.json,screenshot-*.png}` — README:1-4가 `Capture of https://motionapp.com/`, `Motion | Ship more winning ads`, "Beautiful creative reporting to help your team generate more revenue from your paid social ads"로 명시. capture.json:8364 등도 motionapp.com 자산(에셋 경로 전부 `/home/*.png` on motionapp.com).
- **기능 근거(capture.json:3064,4505)**: "AI-powered creative analytics … what's working, why … exact ads to make next", "visual-first reports for Meta/TikTok/YouTube/LinkedIn", "automatically groups creatives", "top performers gaining or losing momentum week-to-week", "auto-tags every creative asset with AI", Northbeam ROAS/CPA 연동. **즉 F1~F2~F6~F7에 직접 기여**.
- **토큰**: Inter Variable, 텍스트 `#000000/#959599/#131313`, 배경 `#5047eb`/`#f6f6f6`/`#000000`, 라운드 6/18/24/32/10px, 브레이크포인트 479/767/991px(README:17-30). **재선언 허용, 복제 금지**.
- **수정 판정**: 등급 **B**. `motionapp-com/capture/**`만 계속 제외하고, `creatify-ai/capture/routes/features-agent/**`는 **Motion 진본 패턴 근거로 재분류**한다(이전의 "Creatify /agent 오귀속" 표현은 철회). 단 스크린샷 12000px 절단·401 게이트·`api_operations: []` 한계는 유지되어, 실제 API 명세나 내부 리포트 동작을 단정하지 않는다.
- **영향**: COMPOSITION-PLAN Motion 0.00 → **3.70**, FEATURE-MATRIX/DESIGN-PLAN/DECISION-LOG 동기화.

---

## 3. 공통 품질 이슈 (교차 서비스)

| 이슈 | 영향 서비스 | 근거 | 조치 |
|---|---|---|---|
| **서비스 간 캡처 오귀속** | Motion←Creatify, Creatify `/agent`←Motion, MONOV states←Snipit, Foreplay how-it-works←Buffer | 각 `capture.json` url/title, evidence output_directory, SHA | 오귀속 자료는 근거에서 제거, 재캡처 권고 |
| **이미지 직접 판독 불가** | 전체 | 모델 이미지 입력 미지원, `unknowns/unk_961f...` | capture.json/OCR 기반 서술로 대체, 한계 명시 |
| **빌드 무산출** | 7개 전부 `status: stopped` | 각 `craft.json`, `build-activity.log` | MONOV 생성물만 존재, 나머지는 캡처만 |
| **`/api/*` 401** | MONOV, Creatify | 비로그인 세션, `api.creatify.ai` 401 | 인증 실패로 해석, 기능 단정 금지 |
| **consent_required / node·npm 부재** | Snipit, MONOV | `build-activity.log`, `unknowns/unk_0a67...` | 구현 환경 별도 준비 필요 |
| **스크립트 오류·추적 스크립트** | Foreplay, Buffer, Creatify, Postiz(라우트) | OptinMonster/HubSpot/Channel.io/401/403/ORB | 이식 금지, 클린룸 재작성 |
| **390px 가로 스크롤** | Foreplay | 전 README "page 435 px wide" | 재현 금지, 반응형 재설계 |
| **중복·스텁 파일** | 전체 | 18개 SHA 중복 그룹, 0KB 문서, build-progress 7개 동일 | 메타로만 취급 |

---

## 4. 소스 대응 관계 (원본 ↔ 생성물 ↔ 검증)

| 서비스 | 원본 캡처 | 생성 코드 | 생성 검증 | 대응 결과 |
|---|---|---|---|---|
| Snipit | 있음(A) | 없음 | 없음 | — |
| Foreplay | 있음(A) | 없음 | 없음 | — |
| MONOV | 있음(A) | **있음(C)** `app/src`, `app/dist` | `checks/round-0/` | 58% 유사, 28/36 claims, 플레이스홀더 → **패턴 참고만** |
| Creatify | 있음(A) | `app/AGENTS.md` 계획서뿐 | 없음 | — |
| Postiz | 있음(A) | 없음 | 없음 | — |
| Buffer | 있음(A) | 없음 | 없음 | — |
| Motion | 혼재: `motionapp-com/capture/**`=Creatify(X), `creatify-ai/capture/routes/features-agent/**`=진본(B) | 없음 | 없음 | 진본 위치 확인, 패턴 참고만 허용 |

---

## 5. P0 7단계 기여도 재대조 (부모 정의 기준)

| 단계 | 정의 | 1순위 근거 | 2순위 | 비고 |
|---|---|---|---|---|
| F1 레퍼런스 분석 | 레퍼런스 수집·검색·AI 추출 | Snipit(search/boards/brand-archive), Foreplay(discovery/swipe) | Buffer(community) | 가장 근거 풍부 |
| F2 콘텐츠 기획 | 브리프·콘셉트·카피 계획 | Snipit(ad-creation 4단계), Creatify(Research/Ad Agent) | Foreplay(Briefs), Buffer(CREATE 문구만) | Buffer /create 누락 주의 |
| F3 콘텐츠 제작 | 이미지·영상 생성 | MONOV(4장/편집/템플릿), Creatify(URL→Video/Avatar) | Snipit(소재 생성 UI) | 실제 생성 API 미확인 |
| F4 검수 | 브랜드·정보·카피 검수·승인 | Creatify("Review before approving"), Buffer(Collaborate/approvals) | Postiz( Member 검토 역할) | 전용 캡처 부족, 자체 설계 필요 |
| F5 발행 | 채널 변환·예약·상태 | Postiz(캘린더/자동반복/API), Buffer(publish) | — | MVP는 Dry-run |
| F6 성과 분석 | 지표 대시보드·비교 | Buffer(insights/Takeaways), Foreplay(Lens) | Postiz(애널리틱스) | 플랫폼 커버리지 제약 |
| F7 개선 | 개선안→새 브리프 순환 | Buffer(WEEKLY TAKEAWAYS), Foreplay(Spyder 리포트) | Creatify(Analyze) | 순환 버튼은 자체 설계 |

> 재캡처 전에는 Motion 기여 0이었으나, 진본 위치 확인 후 **F1·F2·F6·F7 기여**로 수정했다(`creatify-ai/capture/routes/features-agent/**`). 위 매핑은 서브 분석의 임의 F ID를 **F1~F7 실 정의로 재대조**한 결과다.

---

## 6. 활용 판정 요약

| 판정 | 자료 |
|---|---|
| **패턴 참고 가능** | 전 서비스 `capture/README.md`, `capture.json`, 스크린샷(구조 근거), 라우트 README |
| **메타 참고 가능** | `craft.json`, `feed.json`, `usage.json`, `build-activity.log` — 도구 작업 이력 확인용 |
| **직접 코드 재사용 불가** | 전 captured HTML/CSS, MONOV `app/**`(라이선스·오염·58% 품질) |
| **근거 사용 금지** | `motionapp-com/capture/**` 전체(Creatify), MONOV states, Foreplay how-it-works |
| **API 연동 사양 미확인** | Snipit/Foreplay/Creatify/MONOV의 `/api`, `/mcp` 링크 — 문서 확인 전 보류 |
| **재캡처 권장** | Motion 내부 리포트(진본은 랜딩만 확보), Buffer `/create`, Creatify `/features/agent`, MONOV video/history/my-style |

---

## 7. 감사 범위 외 — S8/전문 지식베이스 (자체 설계, 레퍼런스 점수 아님)

- **S8 Video Workbench**: 7개 캡처에 대응하는 기능/화면이 없다. 따라서 **자체 설계(레퍼런스 점수 아님)** 로 분류하고, `COMPOSITION-PLAN.md` 2장 점수표·순위에 넣지 않는다. 기존 점수·순위(Motion 4위 3.70, Creatify 5위 3.55, Foreplay 6위, Postiz 7위)는 변경하지 않는다.
- **제작 유형 체계**: 실사/숏폼/영화/영상/애니메이션/모션그래픽 6종 선택은 프로젝트 단위 사용자 명시 선택(기본 미선택, 자동 감지·변경 금지)이다. 캡처 서비스가 제시한 분류가 아니며 **자체 설계**이므로 점수에 영향 없다. 유형별 프로파일은 `planning/design/PRODUCTION-MODE-SPECS.md` 경로만 참조한다.
- **레퍼런스 서치 체계**: 자동(사용자 트리거)/수동(URL·메모·타임코드) 이원화와 공개 범위 한정(공식 API·공개 피드·공개 메타·수동; 로그인/유료벽/우회 제외), `ModuleLink(s0→s8)` 클릭 연결만 허용한다. 이 역시 **자체 설계**이며 캡처 점수·순위에 영향 없다. 검색 축 근거는 `planning/knowledge/12-reference-search-playbook.md` 경로만 참조한다.
- **전문 지식베이스**: `planning/knowledge/`는 공개된 권위 있는 영화·광고 자료를 출처로 **새로 작성**하는 지식이다. `reference/**` 캡처가 아니므로 **캡처 서비스의 증거로 취급하지 않고**, 아래 6장의 "직접 코드 재사용 불가" 원칙(0건)에도 영향하지 않는다. 숏폼·모션그래픽 공식 스펙(`10-shortform-composition.md`, `11-motion-graphics-and-animation.md`)도 이 새 자체 출처 기반이다(경로만 참조, 이 변경에서 생성하지 않음).
- **출처 경계**: 캡처 마케팅 사이트 문구를 전문 용어의 근거로 등록하지 않는다. Motion 진본 위치(`creatify-ai/capture/routes/features-agent/**`, B등급 3.70)와 `motionapp-com/capture/**` 제외, 직접 코드 재사용 0건은 그대로 유지한다.
- **A6 한계 연장**: 이미지 직접 판독 불가 한계 때문에 프레임 단위 기술 분석을 캡처 스크린샷으로 검증하지 않는다. S8의 분석 스키마는 자연어 입력 + 사용자 확인 기반이며, 타임코드 Grounding 범위는 별도 확인 사항이다.

---

## 8. 결론

2026-11-22 사용자 결정으로 **S0 Collector(분야·경쟁사 등록 → 영상/이미지/블로그/뉴스 수집 → 정리 → 분석)는 MVP에 포함**되었으나, 이 기능은 7개 캡처에 대응하는 근거가 없다. 따라서 수집 파이프라인은 자체 설계하고, 캡처는 여전히 UI·인터랙션 참고용으로만 쓴다(자세한 소스/라이선스 근거는 `ARCHITECTURE.md`, `DECISION-LOG.md` E장).

S0 Collector와 S5~S7 모듈은 **캡처에 대응하는 근거가 없어 자체 설계**한다. S8 비디오 워크벤치(제작 유형·레퍼런스 서치 포함)와 전문 지식베이스도 **캡처에 대응하는 근거가 없는 자체 설계/자체 저작**이며, 점수·순위에 반영하지 않는다(7장). 본 감사는 모듈의 UI 패턴을 정당화하지 않으며, 필요할 때만 Motion/Snipit/Buffer의 개별 패턴을 참고한다(엉킴 금지, `COMPOSITION-PLAN.md` 참조).

7개 자료는 **"재사용할 코드"가 아니라 "검증된 인터랙션 패턴과 UI(font/토큰/레이아웃)의 근거"**다. 특히 (1) Motion 캡처가 두 폴더에 뒤섞여 있었던 출처 오귀속(재캡처로 진본 위치 확인), (2) Creatify↔Motion 라우트 교차 오염, (3) MONOV 생성 코드의 58% 품질+snipit 오염, (4) 이미지 직접 판독 불가가 가장 큰 신뢰 리스크다. 오귀속 자료는 명시적으로 제외하고, 진본으로 확인된 자료도 **패턴 참고만** 허용한다. 따라서 설계는 **클린룸 재작성 + 토큰 재선언 + Dry-run** 원칙 위에 세우고, 오귀속 자료는 명시적으로 제외한다. 점수·채택 기준은 `COMPOSITION-PLAN.md`, `FEATURE-MATRIX.md`에 반영했다.
