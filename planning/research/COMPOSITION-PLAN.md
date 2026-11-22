# COMPOSITION-PLAN — 레퍼런스 조합·점수화

작성일: 2026-11-22  
평가 대상: 7개 서비스 캡처 자료  
가중치(고정): **P0 적합성 30% / MVP 구현 가능성 25% / UI·UX 효율성 20% / 유지보수·확장성 15% / 연동·운영 비용 10%**  
점수 척도: 각 항목 0~5점(5=최고). 가중 합계 = Σ(항목점수 × 가중치), 최대 5.00.

> 평가 근거는 `REFERENCE-AUDIT.md`, `FEATURE-MATRIX.md`의 파일 기반 감사 결과다.  
> **2026-11-22 재캡처 반영**: `motionapp-com/capture/**`는 여전히 Creatify이므로 제외하되, **`creatify-ai/capture/routes/features-agent/**`가 실제 Motion(`Motion | Ship more winning ads`) 캡처로 확인**되어 Motion을 재평가했다(상세: `REFERENCE-AUDIT.md` 2-7). 아래 점수는 30/25/20/15/10 가중치를 그대로 사용한다.

---

## 1. 채점 기준 (고정 루브릭)

| 항목 | 가중치 | 5점 | 3점 | 0~1점 |
|---|---:|---|---|---|
| P0 적합성 | 30% | F1~F7 중 3단계 이상 직접 기여 | 1~2단계 기여 | 기여 없음/출처 불일치 |
| MVP 구현 가능성 | 25% | UI 패턴 즉시 전환 가능, 환경 준비됨 | 패턴은 가능하나 API/데이터 부족 | 재구성 불가/오귀속 |
| UI·UX 효율성 | 20% | 명확한 IA·상태·토큰, 검증됨 | 양호하나 결함(오버플로/오류) 있음 | 근거 없음 |
| 유지보수·확장성 | 15% |토큰/인터페이스 분리, 재작성 용이 | 부분 의존 | 복제 시 리스크 큼 |
| 연동·운영 비용 | 10% | 로컬/무료, 키 불필요 | 유료 API/인프라 필요 | 고비용/법률 리스크 |

---

## 2. 서비스별 점수표

| 서비스 | P0 적합성(30%) | MVP 구현(25%) | UI·UX(20%) | 유지보수·확장(15%) | 연동·운영비용(10%) | **가중 합계** | 순위 |
|---|---:|---:|---:|---:|---:|---:|---:|
| **Snipit** | 5 (1.50) | 4 (1.00) | 5 (1.00) | 4 (0.60) | 4 (0.40) | **4.50** | 1 |
| **Buffer** | 4 (1.20) | 4 (1.00) | 5 (1.00) | 4 (0.60) | 3 (0.30) | **4.10** | 2 |
| **MONOV** | 5 (1.50) | 3 (0.75) | 4 (0.80) | 3 (0.45) | 3 (0.30) | **3.80** | 3 |
| **Motion** | 5 (1.50) | 3 (0.75) | 4 (0.80) | 3 (0.45) | 2 (0.20) | **3.70** | 4 |
| **Creatify** | 4 (1.20) | 3 (0.75) | 4 (0.80) | 4 (0.60) | 2 (0.20) | **3.55** | 5 |
| **Foreplay** | 3 (0.90) | 3 (0.75) | 3 (0.60) | 4 (0.60) | 3 (0.30) | **3.15** | 6 |
| **Postiz** | 4 (1.20) | 2 (0.50) | 4 (0.80) | 2 (0.30) | 1 (0.10) | **2.90** | 7 |

### 점수 산정 근거 (요약)

- **Snipit 4.50**: F1·F2 직접 기여, 한국어 UI·토큰·텍스트 근거 풍부, 패턴 전환 용이. 단, 실제 검색/수집 API는 후속(구현 4점), 플랫폼 연동 비용(비용 4점).
- **Buffer 4.10**: F5·F6·F7 기여, PUBLISH/INSIGHTS 캡처의 상태·토큰이 매우 구체적. `/create` 누락과 React 오류가 감점(적합성 4, UI는 5 유지). 공식 API는 있으나 유료(비용 3).
- **MONOV 3.80**: F3 핵심(4장 생성/편집/템플릿). 생성 코드가 58%·snipit 오염이라 패턴만 참고(구현 3, 유지보수 3), 이미지 생성은 유료 API 필요(비용 3).
- **Creatify 3.55**: F2·F3·F4 기여, 스티커리·프롬프트 카드 우수. 영상 생성 고비용·API 스펙 없음(구현 3, 비용 2). `/agent` 오귀속은 제외 항목으로 별도 처리.
- **Foreplay 3.15**: F1·F6 기여, 카드/필터 패턴 좋으나 390 가로 스크롤·스크립트 오류(UI 3), 실제 데이터 소스 필요(구현 3, 비용 3).
- **Postiz 2.90**: F5 핵심 기여이나 AGPL 포크 리스크·30+ OAuth·인프라(유지보수 2, 비용 1), states 없음. **연동은 후속, 패턴만 MVP 반영**.
- **Motion 3.70 (재평가)**: `motionapp-com/capture/**`는 Creatify라 제외, **`creatify-ai/capture/routes/features-agent/**`가 진짜 Motion 근거**. F1(경쟁사 크리에이티브 그룹화/AI 태깅)·F6(성과 리포트/모멘텀)·F7(다음 광고 제안)에 직접 기여(적합성 5). 다만 실제 API 명세가 없고 외부 광고 플랫폼 연동이 필요해 구현 3·비용 2. 토큰은 Inter Variable + `#5047eb`, 라운드 6~32px, 브레이크포인트 479/767/991px가 확인되어 **재선언 대상**(UI 4, 유지보수 3).
  - 근거 경로: `creatify-ai/capture/routes/features-agent/README.md:1-31`, `capture.json:3064,4505`, `motionapp-com/investigation.cany/evidence/ac/...json:608-611`.
  - **주의**: "복제"가 아니라 *visual-first 리포트/그룹화/AI 태깅 패턴만 참고*. 외부 리포트 화면을 그대로 옮기지 않는다.

---

## 3. 조합 결정 (Composition)

### 3-1. MVP에 즉시 조합하는 것 (UI·UX 패턴 참고 후 자체 구현)

| P0 단계 | 주 조합 | 보조 조합 | 조합 방식 |
|---|---|---|---|
| F1 레퍼런스 분석 | Snipit 검색/보드/브랜드 아카이브 | Foreplay Discovery/Swipe | 검색 모드 세그먼트 + 카드 그리드 + AI 추출 패널 |
| F2 콘텐츠 기획 | Snipit ad-creation 4단계 | Creatify Research/Ad Agent | 브리프 폼 → 콘셉트 3안 → 카피 |
| F3 콘텐츠 제작 | MONOV 사진→4장/편집/템플릿 | Creatify URL→Video/아바타 | GenerationGrid 4장 + 프롬프트 패널, 실제 생성은 로컬/후속 API |
| F4 검수 | Creatify "Review before approving" | Buffer Collaborate/approvals | 체크리스트 + ApprovalGate |
| F5 발행 | Buffer PUBLISH 캘린더/컴포저 | Postiz 캘린더/채널/연결 카드 | 주간 그리드 + ChannelTile + DryRun |
| F6 성과 분석 | Buffer INSIGHTS 카드/Takeaways | Foreplay Lens | MetricCard + TrendChart + TopContentTable |
| F7 개선 | Buffer WEEKLY TAKEAWAYS | Foreplay Spyder 리포트 | ImprovementCard → 새 브리프 버튼(순환) |

**S0 수집은 위 표와 성격이 다르다.** 캡처에 수집 엔진이 없으므로 패턴 참고가 아니라 **자체 설계 + 검증된 오픈소스 라이브러리**로 조합한다.

| 단계 | 조합 | 채택 분류 | 방식 |
|---|---|---|---|
| S0-F1 수집 대상 등록 | 분야 키워드/우리 서비스/경쟁사 도메인 | 자체 설계 | CollectTargetForm + CollectSource |
| S0-F2 파트별 수집 | 영상/이미지/블로그/뉴스 4탭 | 자체 설계 | VerticalTabs(독립 URL) + CollectAdapter |
| S0-F3 소스 | YouTube/네이버/RSS/GDELT + 수동 | 공식 API·MCP 연동(공식 API 한정) | 키/공개 피드만, Ad Library는 연동 대기 |
| S0-F4 정규화 | feedparser + trafilatura + bs4/lxml | 직접 코드 재사용 아님(라이브러리 사용) | 중복 제거 + provenance 보존 |

**S5~S7도 캡처에 대응하는 기능이 없어 자체 설계다.** 캡처 점수표(2장)에는 반영하지 않고, 아래 조합 표로만 관리한다(점수 산정 사유 없음).

| 모듈 | 조합 | 채택 분류 | 연결 방식 |
|---|---|---|---|
| S5 우리 콘텐츠 허브 | 보관함 + 토큰 Jaccard 겹침 + 시리즈 + 백로그 | 자체 설계(Motion 그룹화 패턴 참고) | S0 결과는 "참고로 가져오기" 클릭 시 `ModuleLink` |
| S6 성과·예측 | 시계열 + 이동평균 baseline → statsmodels/scikit-learn → LightGBM/DL | 자체 설계(Motion visual-first 리포트 패턴 참고) | "S5 콘텐츠와 연결" 클릭 시 `content_id` 참조 |
| S7 오디언스 세그먼트 | 전처리 + k-평균(k 3~6) + 프로필 | 자체 설계(Motion 그룹화, Snipit 필터 패턴 참고) | "맞춤 콘텐츠" 클릭 시 `segment_id` 참조 |
| 모듈 연결 계약 | `ModuleLink(source, source_id, target, target_id, created_by)` | 자체 설계 | 사용자 클릭만, 자동 동기화 없음 |

> **엉킴 방지**: 위 네 모듈(S0/S5/S6/S7)은 서로 데이터를 복제하지 않고 위 계약으로만 연결된다. 다른 파트의 캡처 패턴을 억지로 섞지 않는다.

### 3-2. 디자인 시스템 조합

| 요소 | 채택 값 | 출처(참고만) |
|---|---|---|
| 기본 폰트 | Pretendard | Snipit `capture.json` |
| 모노 폰트 | JetBrains Mono | Creatify IBM Plex Mono 자리 |
| Primary | `#3159D9` (재정의) | Snipit `#334fff` / MONOV `#7133ea` 참고, 직접 미채택 |
| 배경/서페이스 | `#F7F8FA` / `#FFFFFF` | MONOV `#eaf0f0` 계열 참고 |
| 다크 미리보기 | `#202937` | Foreplay `#020308` / Postiz `#0e0e0e` / Buffer `#213130` 참고 |
| 성공/민트 accent | `#16806A` | Buffer `#b0ec9c` 참고 |
| 라디우스 | 6/10/14/9999 | MONOV 14 / Snipit 8·12 / Creatify 12 참고 |
| 간격 스케일 | 4~64 | Foreplay 8·12 / Creatify 8·12·32 참고 |

> 원본 토큰 값을 그대로 복사하지 않고 **재선언**한다. `#b0ec9c`, `#7133ea`, `#334fff` 등은 브랜드 톤 참고 기록으로만 남긴다.

### 3-3. 기술 조합 (검증된 OSS)

| 계층 | 선택 | 라이선스 | 근거 |
|---|---|---|---|
| UI | shadcn/ui + Tailwind v4 | MIT | 소스 복사, Blocks, Tailwind v4 지원 |
| 테이블/차트 | TanStack Table v9 + Recharts 3.x | MIT | headless 테이블, React 차트 |
| 워크플로(후속) | React Flow | MIT | 노드 캔버스 |
| 백엔드 | FastAPI + Pydantic | MIT | 비동기 API, 스키마 |
| DB | SQLite (WAL) | 퍼블릭 도메인 | 단일 노드 MVP |
| 추론 | Ollama 로컬 `qwen3.8-local` | 로컬 무료 | 설치·검증 완료, OpenAI 호환 |
| 발행(후속) | Postiz/Buffer REST | AGPL/별도 | 포크 금지, 연동만 |
| 수집 — 피드/본문 | feedparser + trafilatura>=1.8 + BeautifulSoup4/lxml | BSD-2 / Apache-2.0 / MIT / BSD-3 | 무료·설치 쉬움, 구버전 trafilatura(GPLv3+) 금지 |
| 수집 — 공식 API | YouTube Data API v3 + 네이버 검색 API | 무료(key) | 심사 불필요, 할당량 명확 |
| 수집 — 뉴스 백업 | GDELT classic DOC API | 데이터 무료 | 출처 명시, 한국어 커버리지 불확실 |
| 수집 — JS 렌더(선택) | Playwright Python | Apache-2.0 | Python만 설치 가능, 전용 워커 권장 |

### 3-4. 제외 조합 (명시적)

| 제외 대상 | 이유 |
|---|---|
| `motionapp-com/capture/**` 전체 | 출처 불일치(Creatify) — 여전히 사용 금지 |
| `creatify-ai/capture/routes/features-agent/**` | 이제는 **Motion 진본으로 재분류**(이전의 "오귀속" 판정 철회). 단, 패턴 참고만, 자산 복제 금지 |
| Creatify `/features/agent` | motionapp 캡처 오귀속 |
| MONOV `app/**`, states | 생성물 58%·snipit 오염·라이선스 미확인 |
| Foreplay `how-it-works.md` | buffer.com 분석 오염 |
| Postiz 코드 포크 | AGPL-3.0 소스공개 리스크 |
| n8n 사용자용 워크플로 빌더 | SUL상 외부 사용자 생성 금지 |
| ComfyUI/Blender MCP 웹 서비스화 | GPL 파생·무가드 코드 실행·데스크톱 전용 |
| 추적 스크립트/원본 CDN 자산 | 오류·프라이버시·저작권 리스크 |
| 390px 가로 스크롤 재현 | 접근성 결함 |
| Firecrawl 코어 self-host | AGPL-3.0 네트워크 카피레프트 |
| yt-dlp / 미디어 재호스팅 | 저작권·플랫폼 ToS 위반 |
| Meta/TikTok/LinkedIn 스크래퍼·캡차/지문/프록시 우회 | 공식 ToS상 자동 수집 명시 금지 |
| Google News RSS | 피드 자체가 개인·비상업용으로 제한 |
| 유료 Apify Actor / 라이선스 없는 GitHub 스크래퍼 | 과금·데이터 권리·라이선스 미확인 |

---

## 4. 단계별 채택 우선순위 (구현 순서와 정합)

1. **1순위 (Day 1 오전)**: Snipit 토큰/IA + Buffer IA → App Shell(5개 라우팅) + **S0 Collector 골격**(4 파트 탭, 수동/RSS 어댑터).
2. **2순위 (Day 1 오후)**: 공식 API 어댑터 1개 → 중복제거·이관 → S1 AI 분석(Snipit 검색/보드 + Foreplay Discovery 패턴).
3. **3순위 (Day 2 오전)**: Snipit 4단계 + MONOV 4장 그리드 + Creatify 프롬프트 → S2 생성·검수.
4. **4순위 (Day 2 오후)**: Buffer PUBLISH/Postiz 캘린더 → S3 발행(Dry-run), Buffer INSIGHTS + Takeaways → S4 Insights + F7 순환.
5. **후속**: Ad Library 공식 심사 후 연동, Postiz/Buffer 실연동, Creatify 영상 생성, 워크플로 빌더.

---

## 5. 민감도·리스크 메모

- 가중치가 **P0 적합성(30%) + MVP 구현(25%) = 55%**를 차지하므로, "F1~F7 직접 기여"와 "즉시 전환 가능성"이 순위를 지배한다. 이 때문에 Snipit·Buffer가 상위, Postiz는 연동 리스크로 하위가 됐다.
- MONOV는 F3 적합성 5점에도 생성 코드 품질/라이선스가 감점 요인(구현 3, 유지보수 3)으로 3위.
- Motion은 재캡처 저널(`motionapp-com/investigation.cany/evidence/ac/...json:608-611`)로 **진본 소스 위치가 확인되어 3.70점으로 재편입**. Motion 캡처는 Creatify 폴더에 잘못 보관된 것일 뿐이며, 캡처 자체는 Motion 진본이다. 1~2일 MVP에는 전체 리포트가 아닌 "그룹화/태깅/모멘텀 카드" 패턴만 반영한다.
- 실제 발행/과금은 후속이며, **수집은 MVP에 포함되되 자체 파이프라인 + 공식/공개 소스에 한정**한다. MVP 점수는 "UI 패턴 재현 + 자체 수집 + 로컬 생성 + Dry-run" 기준이다.
- 7개 서비스 점수는 **캡처 자료의 기여도**만 평가한다. S0 Collector 및 신규 모듈(S5~S7)은 캡처에 근거가 없어 점수에 반영하지 않고 별도 조합 표로 관리한다. **점수 재산정은 Motion 1건뿐**이며, 이는 소스 위치가 뒤바뀐 것을 바로잡은 결과이지 가중치 변경은 아니다.

---

## 6. 이 문서의 수용 기준

- [ ] 가중치 30/25/20/15/10이 명시되고 합계가 맞다.
- [ ] 7개 서비스 점수와 근거가 있다.
- [ ] 조합이 S0 수집 + S5~S7 독립 모듈 + F1~F7 단계별로 매핑된다.
- [ ] 제외 항목이 명시적 이유와 함께 있다.
- [ ] `IMPLEMENTATION-PLAN.md`의 구현 순서와 정합한다.
