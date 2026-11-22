# FEATURE-MATRIX — 서비스별 기능·UI 채택 매트릭스

작성일: 2026-11-22  
분류 5종: **직접 코드 재사용 / 공식 API·MCP 연동 / UI·UX 패턴 참고 후 자체 구현 / 후속 개발 / 제외**  
경로 규칙: 아래 경로는 모두 `C:\Users\Administrator\Documents\Craft Anything\AIMW\reference\` 기준 상대경로.  
P0 정의: F1 레퍼런스 분석 → F2 콘텐츠 기획 → F3 콘텐츠 제작 → F4 검수 → F5 발행 → F6 성과 분석 → F7 개선.

> **직접 코드 재사용은 전 서비스에서 0건**이다(라이선스 미확인 + 오귀속 + 품질 문제). "UI·UX 패턴 참고 후 자체 구현"이 MVP의 기본 채택 방식이다.  
> **2026-11-22 개정**: 아래 표의 "후속 개발"은 *해당 서비스의 기능을 따라 만드는 것*을 의미한다. 이와 별개로 **자체 수집 파이프라인(S0 Collector)은 MVP에 포함**한다(YouTube/네이버/RSS/GDELT + 수동, 4개 파트 탭). 또한 **S5 우리 콘텐츠 / S6 성과·예측 / S7 오디언스 세그먼트 / S8 비디오 워크벤치**도 캡처에 대응하는 기능이 없어 자체 설계하며, 모듈 간 연결은 사용자 클릭(ModuleLink)으로만 한다. 자세한 채택 근거는 `COMPOSITION-PLAN.md` 3-1 아래 표 참조.
>
> **S8은 "자체 설계(레퍼런스 점수 아님)"**: 제작 유형 6종 체계, 레퍼런스 서치 체계, 2계층 분석·4단계 게이트·샷 단위 수정은 모두 자체 설계이며 아래 7개 서비스 표·점수·순위에 포함되지 않는다. 전문 지식베이스(`planning/knowledge/`)는 공개 권위 자료로 **새로 저작**한 것으로 캡처 서비스의 증거가 아니다. 숏폼·모션그래픽 공식 스펙도 새 자체 출처 기반이며, 서치 플레이북(`12-reference-search-playbook.md`)과 함께 경로만 참조한다(생성하지 않음).

---

## 1. Snipit (`snipit-im`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 검색 모드 세그먼트 | 썸네일·카피 / 장면·대사, 3크레딧 버튼 | `snipit-im/capture/routes/features-search/capture.json` | SearchFilterBar + 배지 | UI·UX 패턴 참고 후 자체 구현 |
| 타임코드·대사 패널 | 장면 16개, `0:00-0:01`, 스크립트 | `snipit-im/capture/routes/features-search/capture.json` | ReferenceCard 상세 | UI·UX 패턴 참고 후 자체 구현 |
| 보드/폴더/메모 | `가격 강조 12개`, 통합 검색, 최근 수정일순 | `snipit-im/capture/routes/features-boards/capture.json` | BoardCard + CRUD | UI·UX 패턴 참고 후 자체 구현 |
| 브랜드 아카이브 | 위닝/A/B/타임라인, `수집된 광고 1,989개` | `snipit-im/capture/routes/features-brand-archive/capture.json` | 레퍼런스 분석 지표 | UI·UX 패턴 참고 후 자체 구현 |
| AI 소재 생성 4단계 | 브랜드→레퍼런스→생성중→완료, 빈 상태, 크레딧 | `snipit-im/capture/routes/features-ad-creation/capture.json` | BriefForm→GenerationGrid | UI·UX 패턴 참고 후 자체 구현 |
| 디자인 토큰 | Pretendard, `#334fff`, radius 8/12/9999 | `snipit-im/capture/capture.json` `design.css_variables` | Tailwind 토큰 재선언 | UI·UX 패턴 참고 후 자체 구현 |
| 5플랫폼 통합 검색 | AI 이미지·맥락·영상 대사 검색 | `snipit-im/capture/routes/features-search/capture.json` FAQ | 커넥터 + 벡터 검색 | 후속 개발 |
| 매일 자동 수집/종료 광고 보관 | 신규/종료 자동 보관 | `snipit-im/capture/routes/features-brand-archive/capture.json` FAQ | 스케줄러 + 아카이브 | 후속 개발 |
| MCP 시작하기 링크 | `manual.snipit.im/.../MCP-...` | `snipit-im/capture/capture.json` `links` | 연동 사양 확인 후 | 공식 API·MCP 연동(사양 확인 후) |
| 원본 HTML/이미지 | `capture/page.html`, `_astro/*` | `snipit-im/capture/page.html` | 복제 금지(clean room) | 제외 |
| channel.io 401/추적 스크립트 | 전 라우트 401 | `snipit-im/capture/routes/*/README.md` | 이식 안 함 | 제외 |
| 발행/승인 UI | 화면에 없음 | 전 라우트 `capture.json` | 정의 없음 | 제외(근거 없음) |

---

## 2. Foreplay (`foreplay-co`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 스와이프 파일 카드 | 확장 저장→태그→보드→공유 | `foreplay-co/capture/routes/swipe-file/README.md` | ReferenceCard + BoardCard | UI·UX 패턴 참고 후 자체 구현 |
| Discovery 필터/탭 | AI Search / Historical / Emotional, niche·platform·status | `foreplay-co/capture/routes/discovery/capture.json` | SearchFilterBar | UI·UX 패턴 참고 후 자체 구현 |
| Lens 분석 탭 | Creative Test / Group Comparison / Trend, 세그먼트 | `foreplay-co/capture/routes/lens-creative-analytics/capture.json` | MetricCard + 비교 테이블 | UI·UX 패턴 참고 후 자체 구현 |
| 라이트박스/모달 모션 | `--modal-in/out` cubic-bezier | `foreplay-co/capture/capture.json` `design.css_variables` | Dialog 컴포넌트 | UI·UX 패턴 참고 후 자체 구현 |
| 다크→라이트 섹션 리듬 | `#020308` → `#ffffff`/`#e9eaef` | `foreplay-co/capture/README.md`, `capture.json` | 토큰 기반 section theme | UI·UX 패턴 참고 후 자체 구현 |
| 공유/임베드 | 공개 링크, Notion/사이트 임베드, IP/Password | `foreplay-co/capture/routes/swipe-file/README.md`, `.../lens.../README.md` | 공유 모달 + 권한(후속) | 후속 개발 |
| Spyder 24/7 수집·훅 분석 | 자동 transcript, Slack/Email 알림 | `foreplay-co/capture/routes/spyder-ad-spy/README.md` | 스케줄러 + 알림 | 후속 개발 |
| `/api`, `/mcp` 링크 | nav/푸터에 존재, 스펙 없음 | `foreplay-co/capture/capture.json` `links` | 사양 확인 후 연동 | 공식 API·MCP 연동(사양 확인 후) |
| 390px 가로 스크롤 | 435px @ 390 viewport | 전 `capture/README.md` | 재현 금지, 재설계 | 제외 |
| OptinMonster/HubSpot 스크립트 | 401/403/ORB/console error | `foreplay-co/capture/README.md` Page health | 이식 안 함 | 제외 |
| how-it-works.md | buffer.com 분석으로 오염 | `foreplay-co/capture/how-it-works.md:7,419` | 근거 사용 중단 | 제외 |

---

## 3. MONOV (`monov-ai-com`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 사진→광고이미지 4장 | 업로드 4/레퍼런스 5, 비율·내 스타일, 20크레딧 | `monov-ai-com/capture/routes/workspace-create/capture.json`, `capture/README.md` | 업로더+프롬프트+GenerationGrid | UI·UX 패턴 참고 후 자체 구현 |
| 5열 워크스페이스 허브 | 좌사이드바+5열 카드+업종 탭 | `monov-ai-com/capture/README.md`, `capture/capture.json` | React 그리드+탭 | UI·UX 패턴 참고 후 자체 구현 |
| 이미지 편집 플로우 | 드롭존·빠른 수정 필·레퍼런스·15크레딧·환불 | `monov-ai-com/capture/routes/workspace-edit/capture.json` | 모드 탭+폼 | UI·UX 패턴 참고 후 자체 구현 |
| 템플릿 영상 카탈로그 | 5~9초 뱃지, `?template=tpl_*` | `monov-ai-com/capture/capture.json` LINKS/OUTLINE | 템플릿 카드+라우팅 | UI·UX 패턴 참고 후 자체 구현 |
| 로그인·크레딧 게이트 | `/workspace/video` 로그인 월, 401 | `monov-ai-com/capture/routes/workspace-video/capture.json` | 인증 가드+실패 폴백 | UI·UX 패턴 참고 후 자체 구현 |
| 디자인 토큰 | SUIT, `#7133ea`, `#eaf0f0`, radius 14 | `monov-ai-com/capture/capture.json` `design` | 토큰 재선언 | UI·UX 패턴 참고 후 자체 구현 |
| 생성 결과 그리드 레이아웃 | `.grid-5/4/3`, `.card/.thumb/.badge` | `monov-ai-com/app/src/styles/main.css` | 패턴 참고(코드 복사 금지) | UI·UX 패턴 참고 후 자체 구현 |
| 실제 이미지/영상 생성 API | `api_operations: []`, 401 엔드포인트뿐 | `monov-ai-com/capture/how-it-works.md`, `capture/capture.json` health | 자체 백엔드+Provider | 후속 개발 |
| 히스토리/내 스타일 | 링크만, 전용 캡처 없음 | `monov-ai-com/capture/capture.json` LINKS | 보관함+스타일 프로필 | 후속 개발 |
| `/studio` 다크 카탈로그 | `#262b33`, 3:4·2장·40크레딧 | `monov-ai-com/capture/routes/studio/capture.json` | 별도 다크 섹션 | 후속 개발(범위 확인 후) |
| 생성 코드 복사 | `app/src/**`, `app/dist/**` 58%·snipit 오염 | `monov-ai-com/app/build.ps1`, `feed.json` | 클린룸 재작성만 | 제외 |
| states/FAQ | URL이 snipit.im | `monov-ai-com/capture/states/states.json` | 근거로 사용 불가 | 제외 |

---

## 4. Creatify (`creatify-ai`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 히어로 프롬프트 카드 | ADD URL 칩+전송 버튼+96px h1 | `creatify-ai/capture/capture.json` 4573-4721행 | AiComposePanel 폼 | UI·UX 패턴 참고 후 자체 구현 |
| Research/Create/Analyze 스티커리 | 고정 탭+상태별 데모 패널 | `creatify-ai/capture/capture.json` 4724-4810행, `states/states.json` | Studio 3단계 스텝퍼 | UI·UX 패턴 참고 후 자체 구현 |
| URL→Video 3단계 | required URL input, "under 60 seconds" | `creatify-ai/capture/routes/features-url-to-video/capture.json` forms/headings | 단계 UI(시뮬레이션) | UI·UX 패턴 참고 후 자체 구현 |
| AI Avatar 3유형+감정 태그 | Pick/Script/Generate, 140+ 보이스, 9:16/16:9/1:1 | `creatify-ai/capture/routes/features-ai-avatar/capture.json` | 생성 옵션 UI | UI·UX 패턴 참고 후 자체 구현 |
| 사람 승인 문구 | "AI can make mistakes. Review before approving" | `creatify-ai/capture/capture.json` text | ApprovalGate 카피/원칙 | UI·UX 패턴 참고 후 자체 구현 |
| Ad Flow 템플릿 10카테고리 | Recreate CTA, Style/Product/Balanced 칩 | `creatify-ai/capture/routes/adflow-new/capture.json` | 템플릿 그리드 | UI·UX 패턴 참고 후 자체 구현 |
| 디자인 토큰 | General Sans/IBM Plex Mono, `#131415`, 12/4/20px | `creatify-ai/capture/capture.json` design | 토큰 재선언 | UI·UX 패턴 참고 후 자체 구현 |
| 커넥터 로고/포맷 캐러셀 | −8° 카드, snap-x, 4포맷 | `creatify-ai/capture/capture.json` 5588-5599, 5836-5950행 | ChannelTile + 캐러셀 | UI·UX 패턴 참고 후 자체 구현 |
| `/api`, MCP 링크 | `creatify.ai/api`, `/features/mcp` — 스펙 없음 | `creatify-ai/capture/capture.json` links | 사양 확인 후 연동 | 공식 API·MCP 연동(사양 확인 후) |
| 실제 영상 생성 | 스펙 없음, 401 log-event만 | `creatify-ai/capture/how-it-works.md` api_operations [] | fal/Higgsfield/Kling 어댑터 | 후속 개발 |
| `/features/agent` 라우트 | 실제 motionapp.com 캡처 | `creatify-ai/capture/routes/features-agent/capture.json` | **Motion 진본으로 재분류(재캡처 저널 확인)** | UI·UX 패턴 참고 후 자체 구현 |
| 401 로그인 게이트 Ad Flow | "Not signed in" | `creatify-ai/capture/routes/adflow-new/README.md` | 재현 보류 | 후속 개발 |

---

## 5. Postiz (`postiz-com`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 비주얼 캘린더/컴포저 | "Preview it all in a visual calendar" | `postiz-com/capture/capture.json` outline y=6948 | PublishQueue 주간 그리드 | UI·UX 패턴 참고 후 자체 구현 |
| 채널 아이콘 행 | 3행 30+ 채널 로고 | `postiz-com/capture/capture.json` outline y=609~ | ChannelTile 그리드 | UI·UX 패턴 참고 후 자체 구현 |
| 에이전트 연결 카드 | "1 Connect → 2 Ask", accent 색상 | `postiz-com/capture/routes/chatgpt/README.md`, `.../claude/capture.json` | 설정/연결 카드 | UI·UX 패턴 참고 후 자체 구현 |
| 기능 카드 6종 | PLANNING/AI AGENTS/ANALYTICS | `postiz-com/capture/capture.json` y=6841~9177 | 대시보드 카드 | UI·UX 패턴 참고 후 자체 구현 |
| FAQ 아코디언 | 15개 질문, chevron | `postiz-com/capture/page.html:175-283` | Dialog/Accordion | UI·UX 패턴 참고 후 자체 구현 |
| 다크 랜딩 + 알약 CTA | `#0e0e0e`, "Start for $0" | `postiz-com/capture/capture.json`, `README.md` | 다크 미리보기 패널에 제한 적용 | UI·UX 패턴 참고 후 자체 구현 |
| 공개 REST API + 웹훅 | `docs.postiz.com/public-api` | `postiz-com/capture/page.html:195` | 발행 어댑터(법률 검토 후) | 공식 API·MCP 연동(후속) |
| MCP OAuth 엔드포인트 | `mcp.postiz.com/mcp-oauth-dynamic` | `postiz-com/capture/routes/chatgpt/capture.json` | 운영 콘솔 연결 | 공식 API·MCP 연동(후속) |
| 애널리틱스/멀티 브랜드 | 플랫폼 insights, customer group | `postiz-com/capture/page.html` FAQ | Insights/BrandKit(후속) | 후속 개발 |
| 30+ 실제 채널 OAuth | FAQ 채널 목록 | `postiz-com/capture/page.html` FAQ | 자체 구현 비현실적 | 제외 |
| Postiz 코드 포크 | AGPL-3.0 소스공개 리스크 | `postiz-com/capture/page.html:279`, OSS 리서치 | 연동만, 포크 금지 | 제외 |
| 추천 마퀴 수치 | 2회 반복, 신뢰도 낮음 | `postiz-com/capture/capture.json` y=1723~ | 사용 안 함 | 제외 |

---

## 6. Buffer (`buffer-com`)

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| PUBLISH 주간 캘린더 | 시간 슬롯·Draft·Seoul·Tags, 예약 모드 | `buffer-com/capture/routes/publish/capture.json` | PublishQueue + DryRun | UI·UX 패턴 참고 후 자체 구현 |
| 컴포저(Post/Reel/Story) | Remaining:5, 해시태그, 미리보기 | `buffer-com/capture/routes/publish/capture.json` | ChannelPreview 폼 | UI·UX 패턴 참고 후 자체 구현 |
| INSIGHTS 카드/Takeaways | 521.4k +14.0%, WEEKLY TAKEAWAYS | `buffer-com/capture/routes/insights/capture.json` | MetricCard + ImprovementCard | UI·UX 패턴 참고 후 자체 구현 |
| COMMUNITY 인박스 | 17 unanswered, Resolved, saved replies | `buffer-com/capture/routes/community/capture.json` | 상태 목록(후속) | UI·UX 패턴 참고 후 자체 구현 |
| 4코어 타일 | PUBLISH/CREATE/COMMUNITY/INSIGHTS | `buffer-com/capture/README.md:105-109` | IA 매핑 | UI·UX 패턴 참고 후 자체 구현 |
| 크림 라이트 테마 | `#fefdfb`, `#213130`, `#b0ec9c` | `buffer-com/capture/capture.json` design | 토큰 재선언(민트만 accent) | UI·UX 패턴 참고 후 자체 구현 |
| Collaborate/승인 | Team plan approvals | `buffer-com/capture/routes/publish/capture.json` | ApprovalGate | UI·UX 패턴 참고 후 자체 구현 |
| 공식 API/MCP | `developers.buffer.com`, `/mcp` | `buffer-com/capture/capture.json` links | 발행/분석 어댑터(후속) | 공식 API·MCP 연동(후속) |
| `/create` 상세 | screenshot만, capture.json/README 없음 | `buffer-com/capture/routes/create/screenshot-1440.png` | 문구만 차용 | 후속 개발(재수집 필요) |
| 390 state-1/2 | SHA 동일, 라벨 불일치 | `buffer-com/capture/states-390/states.json` | 신뢰도 낮아 제외 | 제외 |

---

## 7. Motion — 부분 재평가 (진본 위치 확인)

> 2026-11-22 재캡처로 **`creatify-ai/capture/routes/features-agent/**`가 Motion 진본**임을 확인했다. `motionapp-com/capture/**`(Creatify)만 계속 제외한다.

| 항목 | 참고할 기능·UI | 근거 파일·캡처 | 구현 후보 | 채택 여부 |
|---|---|---|---|---|
| 랜딩 전체 비주얼 | "Make ads that win" / "(without getting lucky)" | `creatify-ai/capture/routes/features-agent/README.md:1-4`, `capture.json:2044,2048` | 복제 금지, 토큰만 재선언 | UI·UX 패턴 참고 후 자체 구현 |
| 크리에이티브 성과 리포트 | visual-first report, 자동 그룹화, 주간 모멘텀 | `creatify-ai/capture/routes/features-agent/capture.json:4505` | S4 카드/그룹화/모멘텀 배지 | UI·UX 패턴 참고 후 자체 구현 |
| AI 자동 태깅 | 에셋마다 AI 태그, 패턴 시각화 | `creatify-ai/capture/routes/features-agent/capture.json:4505` | CollectedItem/Asset 태그 필드 | UI·UX 패턴 참고 후 자체 구현 |
| 외부 광고 지표 연동 | Northbeam ROAS/CPA, GA4 로고 | `creatify-ai/capture/routes/features-agent/capture.json:376,382,4505` | 지표 매핑 확장 | 후속 개발(공식 API 확인 후) |
| 토큰 | Inter Variable, `#5047eb`, `#f6f6f6`, 라운드 6~32px, 479/767/991px | `creatify-ai/capture/routes/features-agent/README.md:17-30` | CSS 변수 재선언 | UI·UX 패턴 참고 후 자체 구현 |
| `motionapp-com/capture/**` | "AI Ads that win." 히어로, Research/Create/Analyze 탭 | `motionapp-com/capture/capture.json`, `capture/states/states.json` | 오귀속(Creatify) | 제외 — Motion 근거 아님 |
| Motion 내부 리포트 실제 동작 | 없음(unknown) | `api_operations: []`, 12000px 절단 | 정의 불가 | 후속 개발(내부 캡처 필요) |

---

## 8. S8 비디오 워크벤치 — 자체 설계(레퍼런스 점수 아님)

> 아래 항목은 캡처에서 유도한 기능이 아니라 **자체 설계**다. `COMPOSITION-PLAN.md` 2장의 7개 서비스 점수표·순위에 넣지 않으며, 기존 점수·순위(Motion 4위 3.70, Creatify 5위 3.55, Foreplay 6위, Postiz 7위)는 변경하지 않는다.

| 항목 | 자체 설계 내용 | 채택 분류 | 비고 |
|---|---|---|---|
| 제작 유형 6종 | 실사/숏폼/영화/영상/애니메이션/모션그래픽, 프로젝트 단위 명시 선택(기본 미선택) | 자체 설계 | 자동 감지·자동 변경 금지, 점수 영향 없음 |
| 유형별 프로파일 | 분석 차원·구도·게이트 산출물·템플릿 필터·비용 프로파일 | 자체 설계 | `planning/design/PRODUCTION-MODE-SPECS.md` 경로만 참조 |
| 레퍼런스 서치 | 자동(사용자 트리거)/수동(URL·메모·타임코드), 공개 범위만 | 자체 설계 | `planning/knowledge/12-reference-search-playbook.md` 경로만 참조, 실제 API 호출은 Phase B |
| S0 연결 | "S8로 가져오기" 클릭 시 `ModuleLink(s0→s8)` | 자체 설계 | 자동 동기화·복제 금지, 미디어 바이트 미저장 + provenance |
| 3탭 독립 상태 | 분석/제작/수정 탭별 독립 상태, S2와 공유 없음 | 자체 설계 | S2 참고는 클릭 시 `ModuleLink(s8→s2)` |
| 2계층 분석 | 콘텐츠 분석 + 기술 분석(카메라앵글·기법·전환·조명·구도·편집) | 자체 설계 | 캡처 근거 없음, 레퍼런스 점수 미산정 |
| 자연어→용어 확인 | `TermMapping` → 사용자 확인 게이트 | 자체 설계 | 미확정 시 다음 게이트 잠금 |
| 4단계 게이트 | 콘티 → 3D 구도 스키마 → 애니매틱 → 단계별 렌더(DryRender) | 자체 설계 | 샘플 프리뷰, 전체 자동 렌더 없음 |
| 샷 단위 수정 | 샷/타임코드 타겟 개정·프리뷰 | 자체 설계 | diff 재렌더는 Phase B/C |
| 용어 사전/전문 KB | `planning/knowledge/` 기반 한국어 용어 매핑 | 자체 저작(출처 명시) | 공개 권위 자료 요약·재서술, 캡처 서비스 근거 아님 |
| 숏폼/모션 전문 스펙 | `10-shortform-composition.md`, `11-motion-graphics-and-animation.md` | 자체 저작(출처 명시) | 공개 권위 자료 기반, 경로만 참조 |
| 전문 렌더/모션 내보내기 | 실제 렌더 어댑터·실제 3D·diff 재렌더·유형별 모션 내보내기 | 후속 개발(Phase B/C) | 공급자/예산/엔진 미확정 |

> **점수 미산정**: S8, 제작 유형 체계, 레퍼런스 서치 체계, 전문 KB는 7개 캡처 서비스의 점수표·순위에 포함하지 않는다. KB는 캡처 서비스가 아니라 **공개 권위 자료로 새로 작성한 지식**이므로 캡처 근거나 "직접 코드 재사용" 집계에도 넣지 않는다(해당 원칙은 0건 유지).

---

## 9. 전체 집계

| 채택 여부 | 건수(대표 항목 기준) | 의미 |
|---|---:|---|
| 직접 코드 재사용 | **0** | 전 서비스 라이선스·오귀속·품질 리스크 |
| 공식 API·MCP 연동 | 9 | 스펙 확인/법률 검토 후(Postiz/Buffer/Snipit/Foreplay/Creatify) |
| UI·UX 패턴 참고 후 자체 구현 | 40+ | MVP의 기본 방식. 토큰 재선언 + 클린룸 |
| 후속 개발 | 20+ | 실제 생성/연동/자동화/캐러셀 등 |
| 제외 | 20+ | 오귀속, 추적 스크립트, 390 오버플로, 포크, 근거 없음 |

---

## 10. 이 문서의 수용 기준

- [ ] 7개 서비스 모두 표가 존재한다.
- [ ] 각 행에 실제 상대경로 근거가 있다.
- [ ] 5개 채택 분류가 모두 사용되었다.
- [ ] `motionapp-com/capture/**`(Creatify 오귀속), MONOV-states, Foreplay-how-it-works가 명시적으로 제외되고, Motion 진본은 `creatify-ai/capture/routes/features-agent/**`로 재분류되었다.
- [ ] "직접 코드 재사용 0건"이 일관되게 유지된다.
- [ ] S8(제작 유형 6종·레퍼런스 서치 포함)이 "자체 설계(레퍼런스 점수 아님)"로 분리되어 점수표·순위에 포함되지 않는다.
- [ ] 전문 KB가 공개 권위 자료 기반 자체 저작이며 캡처 서비스 근거가 아님을 명시한다.
