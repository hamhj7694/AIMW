# RESEARCH-FINDINGS — 안티-AI 슬롭 디자인 레퍼런스 조사

> 대상: AIMW v8 전면 재설계 (운영 콘솔 / 앱 화면 중심)
> 작성 에이전트: research (검색·레퍼런스 조사)
> 작성일: 2026-11-22
> 원문 보관 위치: `design-v3/skills/_downloaded/`
> 산출물 성격: **판단 규칙·출처·라이선스·실행 지시만 추출**. 코드·마크업은 재사용하지 않음.

---

## 0. 조사 방법 및 사용 범위 원칙

- 웹 검색 결과(요약·블로그·2차 인용)를 그대로 신뢰하지 않고, 아래 지정된 **원문 저장소의 `SKILL.md` 및 참조 파일을 직접 읽어** 규칙을 확인했다.
- 각 규칙은 **출처 파일 + 줄 번호 + 저장소 URL + 라이선스**를 함께 기록했다(§5 표).
- **코드·CSS·마크업·스캐너 스크립트는 복사하지 않았다.** 가져온 것은 "무엇을 금지/확인할지"라는 판단 기준과 임계값뿐이다.
- 임계값 숫자(4.5:1, 3:1, 44px, 1280×800 등)는 **원문 스킬이 명시한 기준값**으로만 인용하며, AIMW 자체 실측값이 아니다. 실측은 디자이너/게이트 단계에서 별도 측정해야 한다.
- **AIMW 관련 근거 없는 수치·고객·인용·로고는 모두 "없음"으로 처리했다**(§7). 원문에 등장하는 제3자 통계(예: "83.9% of top home pages")는 AIMW 사실이 아니라 해당 스킬이 인용한 외부 근거이므로 이 문서의 판단 규칙에 반영하지 않았다.

---

## 1. 핵심 결론 (디자이너가 먼저 읽을 요약)

1. **AIMW 운영 콘솔은 "마케팅 랜딩"이 아니라 Impeccable의 `Operate` 세계관으로 분류한다.** Operate의 실패 모드는 "평면성"이 아니라 "목적 없는 낯섦"이다. 친숙한 표준 컴포넌트가 곧 기능이며, 창의성은 `type · palette · density · signature move` 네 축에만 쓴다. → §2.2
2. **세 스킬의 대비 기준은 수치가 일치한다.** 본문 ≥4.5:1 / 대형·아이콘·focus ring·입력 경계 ≥3:1 (Taste는 WCAG 2.2 AA, Hallmark는 APCA Lc60/Lc45 병기). 이 수치는 "문제 제기"가 아니라 **차단 게이트**다. → §2.1/2.3/2.4
3. **슬롭 판정은 ID로 보고한다.** Hallmark 게이트 번호(2a, 54, 67, 70…), Taste 카탈로그 ID(V07, U10, C03…), slop-proof ID(X1, C1, M7, U3…), ungeneric 체크 ID(`purple-gradient`, `dead-link`…)를 혼용하지 말고, **보고 시 어느 체계인지 접두로 명시**한다. → §4
4. **"수정"의 깊이를 먼저 정한다.** Hallmark redesign는 `full / restyle / polish` 3단계이며 섞지 않는다. 사용자가 이번 작업에서 Hallmark를 직접 지목했으므로 redesign 게이트가 적용 가능하나, **이 조사 에이전트는 HTML을 수정하지 않는다**(실행은 디자이너/프론트엔드 에이전트 몫). → §2.1.3
5. **근거 없는 proof는 전부 금지다.** Hallmark 46a, Taste C03, slop-proof X1/X2, Impeccable craft-floor의 "invented metric" 금지가 같은 규칙을 네 번 반복한다. AIMW의 수치·고객·인용·로고는 **없음**이므로 슬롯으로만 표현한다. → §7

---

## 2. 스킬별 적용 규칙

### 2.1 Hallmark (v2.0.0) — Floor + redesign 게이트

출처: `hallmark/hallmark-main/skills/hallmark/SKILL.md`, `references/gates.md`, `references/redesign.md`

#### 2.1.1 The Floor — 16개, "면제 불가" (SKILL.md 16~35행)

모든 결과물에 적용. 디자이너에게 전달할 판단 규칙(원문 요약):

| # | 규칙(판단용) | 근거 ID |
|---|---|---|
| 1 | 색·폰트는 `:root`(또는 선언된 테마 블록)의 토큰만 경유. 토큰 블록 바깥에 리터럴 색/`font-family` 금지 | 48 |
| 2 | `transition: all` 금지. `width/height/top/left` 애니메이션 금지 | 10a |
| 3 | 로마자(headline) 안에 이탤릭 단어 하나만 넣기 금지 | 38i |
| 4 | 가로 스크롤 금지. `html`/`body`에 `overflow-x: clip` (hidden·100vw 아님) | 34 |
| 5 | 이미지 그리드 트랙은 `minmax(0,1fr)`, display head는 `overflow-wrap: break-word; min-width:0` | 50 |
| 6 | 모든 인터랙티브 요소에 즉시 나타나는 `:focus-visible` | 26a,15 |
| 7 | 모든 애니메이션에 `prefers-reduced-motion: reduce` 대체. 스크립트 꺼도 콘텐츠 보임 | 27,62 |
| 8 | **만든 지표·추천사·로고 월·케이스 스터디 개수 금지** | 46a |
| 9 | **eyebrow 금지**, tracked caps/ small caps 라벨 금지 — 라벨·캡션·테이블 헤드·태그·내비는 본문 face, 한 단계 작게, 문장/소문자, 자간 없이 | 54,67 |
| 10 | 중점(middle dot) 연결 메타 문자열, 링크 텍스트에 붙은 화살표, 장식적 상태 점 금지 | 63 |
| 11 | 퍼플→블루 그라디언트, 카드인카드, 이모지 아이콘, 손으로 그린 브라우저/OS 창 금지 | 2a,4,30a,47a |
| 12 | 히어로 헤드라인·한 문장·주 액션이 1280×800 스크롤 없이 보임 | 44b |
| 13 | 한 화면 약 80어. 히어로는 헤드라인+한 문장+액션뿐 | 58 |
| 14 | 컨테이너 상한+중앙 정렬. 1920에서 거터만 커지고 measure/grid는 그대로 | 44d |
| 15 | CSS 첫 비어있지 않은 줄에 Hallmark stamp, 그 다음 critique 줄, 그 다음 waivers | 20 |
| 16 | Node 있으면 `sloplint --render` 실행. FAIL 전부 수정, REFLEX 수정 또는 기록상 waive | — |

#### 2.1.2 게이트 티어와 차단 규칙 (gates.md §1, 243행)

- **Floor**: 면제 불가. House rule은 54(eyebrow), 58(화면 예산), 63(템플릿 문장부호), 67(tracked caps) **뿐**.
- **Reflex**: 실제 이유를 기록하면 waive 가능. 3회 초과 waive는 house style → `design.md`로 옮겨야 함.
- **Finish (F-checks)**: 보고하고 답변만. **차단하지 않음**.
- **Ledger**: 반복 기록. `NOTE`로만 보고, 판정에 포함 안 함.
- 판정 어휘: `FAIL`(Floor, 출시 불가) / `REFLEX`(미답변, 수정 또는 waive) / `WAIVED` / `WARN`(확인 후Dismiss) / `ANSWERED`(Finish) / `NOTE`.
- **"열린 FAIL 또는 열린 REFLEX가 있으면 출시 불가"** (gates.md 243행).
- 사전 비판(pre-emit critique): 6축(P Philosophy, H Hierarchy, E Execution, S Specificity, R Restraint, V Variety) 1~5점. **3 미만이면 재설계 후 빌드** (gates.md 34~47행).

#### 2.1.3 대비 기준 (gates.md 40, 41행) — 차단 게이트

| 항목 | 기준 |
|---|---|
| 본문 텍스트 | **4.5:1 이상** 또는 **APCA Lc 60 이상** |
| 대형 텍스트 / 아이콘 / focus ring / 입력 필드 경계 | **3:1 이상** 또는 **APCA Lc 45 이상** |
| 버튼 텍스트 | 배경과 L 5% 이내 & chroma 0.05 이내면 FAIL. `--color-accent-ink` 누락, 다크 패널의 텍스트 미교체, 컬러_surface 위 회색 텍스트 FAIL (게이트 41) |

> 실무 지시: APCA만으로 "통과" 주장 금지. **WCAG 2.2 비율(4.5/3:1)을 함께 제시**할 것(slop-proof C7과 동일 취지).

#### 2.1.4 redesign 모드 게이트 (redesign.md)

- **적용 조건**: 사용자가 Hallmark를 명시했을 때만 `redesign`/`audit` 동사 사용. 이번 작업은 사용자가 Hallmark를 직접 지목했으므로 적용 대상이나, **조사 에이전트는 실행하지 않음**.
- **keep 원칙**: 내용(사실·가격·날짜·인용) / 배선(링크·폼·필드·핸들러·라우트·id·테스트 훅) / 파일(삭제·라우트 제거·컴포넌트 트리 교체는 파일 단위 계획 승인 필요) / 브랜드(프로젝트 파일에서 읽은 값, 기억으로 재구성 금지) / 문구(카피 게이트에 걸린 것만 최소 수정, 약관·동의 문구는 절대 리워드 금지).
- **깊이 3단계 (섞지 않음)**:

| 깊이 | 유지 | 변경 | 요청 조건 |
|---|---|---|---|
| `full` | 내용+배선 | 시스템+컴포지션(형태·히어로·섹션·크롬) | 기본( 동사 기본값 ) |
| `restyle` | 레이아웃 | 색·타입·radius·shadow·motion·컨트롤 | "keep the layout", "restyle" 등 명시 시 |
| `polish` | 시스템+레이아웃 | 게이트가 지목한 것만(tell·대비·상태·모션·토큰) | "polish", "우리 룩 유지", "생성처럼 보이는 것만" |

- **앱 화면 full depth**: 셸 안에서 각 화면을 재구성(무엇이 리드하고 figures/tables/forms가 어떻게 배치되는가). 라우트·목적지·컴포넌트 로직 유지. **히어로 스테이지/히어로 리뷰 없음** → AIMW 운영 콘솔에 그대로 적용되는 조항.
- **Before/After 스캔**: `sloplint --render --before`로 변경 전 기록, 이후 `--kept`로 누락된 링크·폼·필드·핸들러·훅을 `FAIL kept`로 검출. `compare.html` 생성.
- **audit `<target>`**는 여기서 멈추고 판정만 보고, **프로젝트 파일을 변경하지 않음**.

#### 2.1.5 리뷰 게이트 (gates.md §6, review-*.md)

- 히어로 리뷰(히어로만 먼저 만든 뒤)와 finish 리뷰(스윕 후)는 **신규 컨텍스트(서브에이전트)**로 실행. 빌드 스레드가 자기 자신을 리뷰하면 가장 약한 리뷰어가 된다.
- 리뷰어의 **첫 단어**에 행동: `recapture`(스크린샷 잘못 → 재촬영, 라운드 소모 안 함) / `rebuild` / `fix` / `ship`.
- 파인딩 개수 상한: finish 리뷰 최대 8개, 히어로 리뷰 최대 5개. 각 파인딩은 `resolved / partial / unresolved`로 자체 채점.
- 서브에이전트가 없을 때만 in-thread로 읽고 `in-thread`로 기록.

---

### 2.2 Impeccable (v4.10.0) — Operate 모드 critique / audit

출처: `impeccable/impeccable-main/plugin/skills/impeccable/SKILL.md`, `reference/mode-operate.md`, `reference/operate.md`, `reference/critique.md`, `reference/critique-rubric.md`, `reference/craft-floor.md`, `reference/audit.md`

#### 2.2.1 Operate 세계관 (mode-operate.md, operate.md 7~9행)

- **분류 근거**: AIMW는 "사람이 일하는 화면(운영 콘솔/대시보드/관리)" → Operate.
- **핵심 명제**: "친숙함이 곧 기능(familiarity is function)". 실패 모드는 평면성이 아니라 **목적 없는 낯섦(novelty for its own sake)**.
-창의성 허용 범위는 **오직 4개**: `type`, `palette`, `density`, `signature move`. 레이아웃·내비게이션·컨트롤은 **표준 컴포넌트**를 쓴다.
- 상태 어휘 10종, 컴포넌트 7상태, 모션 150~250ms, rem 스케일 1.125~1.2 등 operate.md의 수치는 "제품 제약(permissions)"으로 명시된 것만 사용. **근거 없는 커스텀 수치 금지**.

#### 2.2.2 Craft floor — Verify / Refuse (craft-floor.md)

**Verify (빌드 결과를 하나의 렌더로 묶어 확인, 의도가 아님)**:

| 항목 | 판단 기준 |
|---|---|
| Contrast | 본문·placeholder ≥4.5:1, 대형 ≥3:1. 컬러 surface 위 2차 텍스트는 **그 hue 또는 foreground에서 틴트**, 절대 회색 금지 |
| Depth | 그림자는 offset + soft blur. offset 0의 컬러 헤일로는 장식일 뿐 |
| Spacing | 그룹은 타이트, 그룹 간은 관대. 제목 위 간격이 아래보다 큼. computed value로 읽을 것 |
| Type | 본문 measure 65–75ch, display 최대 6rem, tracking 하한 -0.04em, balance heading, 명확한 스케일/웨이트 단계. 모든 breakpoint에서 실제 카피로 overflow 확인 |
| Motion | 작성된 모멘트 **하나**. 모든 섹션에 같은 entrance 금지. exponential ease-out, 기본은 already-visible. transform/opacity 외에 blur·backdrop-filter·clip-path·mask·shadow도 팔레트에 속하면 허용 |
| States | hover, disabled, loading, error, empty + 실제 콘텐츠·동작 컨트롤·반응형·키보드 focus |
| Browser surfaces | `::selection`, caret, scrollbar, focus ring, underline offset, tabular numerals — 브라우저 기본값을 방치하지 말고 팔레트로 테마화. **가장 싸고 가장 자주 빠지는 신호** |
| Copy | 제품 자체 언어. 컨트롤은 행동을, 에러는 문제와 복구를 이름 붙일 것 |
| Coverage | 브리프 요구사항 전부가 몇 초 안에 발견 가능 |

**Refuse (카테고리 기본값, banned 항목은 예외)**:

- 같은 크기의 icon+heading+text 카드가 페이지 구조인 경우. **중첩 카드는 항상 틀림**.
- hero-metric 템플릿(큰 숫자+작은 라벨+보조 통계+accent).
- **kicker/eyebrow는 "ban" — 어떤 브리프도 되살릴 수 없음.** 헤딩이 스스로 무게를 갖게 하고 라벨을 삭제.
- 섹션 번호(01/02/03) — 순서 자체가 정보를 전달하지 않으면.
- interruption/focus 보호가 필요 없는 작업에 모달(modal)을 쓰지 않는다.
- gradient text, 장식용 glass/blur, 라운드 박스 한쪽 면 bar(단일 border/inset shadow/pseudo), 네오브루탈리즘이 아닌 세계의 `4px 4px 0` 하드 섀도, 콘텐츠 대신 sparkline/progress ring, "technical" 코스튬으로서의 mono, 시스템 display face(Impact/Arial Black), 이모지/유니코드 글리프 아이콘, 기하 마스크로 사물 윤곽 흉내, **카테고리로 light/dark 고르기(사용 장면·주변 광량으로 선택)**.

#### 2.2.3 Critique 기준 (critique.md, critique-rubric.md)

- **구조**: Assessment A(디자인 리뷰)와 Assessment B(-detector/브라우저 증거)는 **서로 독립**이어야 하며, 서브에이전트가 있으면 반드시 2개로 분리 실행. 한 컨텍스트에서 축소 실행 시 보고서 첫 줄에 `⚠️ DEGRADED: single-context (<reason>)` 배너 필수(critique.md 5~9행). A가 먼저 끝나야 B 파인딩이 합성 컨텍스트에 들어감.
- **보고서 순서**: Overall impression → What's working(2~3) → **Priority issues 3~5개** → Persona red flags(2~3 페르소나로 실제 액션을 걸어 구체적으로) → Minor observations → Questions.
- **이슈 태그 형식**: `[P?] What` / `Why it matters` / `Fix` / `Suggested command`.
- **심각도 (critique.md 318~329행)**:

| 등급 | 이름 | 정의 | 조치 |
|---|---|---|---|
| **P0** | Blocking | 작업 완료 자체를 막음 | 즉시 수정(showstopper) |
| **P1** | Major | 중대한 difficulty/confusion 유발 | **릴리스 전 수정** |
| **P2** | Minor | 짜증나지만 우회로 있음 | 다음 패스 |
| **P3** | Polish | 실사용 영향 없음 | 시간 될 때 |

> 판정 팁: "사용자가 지원에 문의할까?" → 예면 최소 P1(critique.md 329행).

- **점수**: 10개 heuristic × 최대 4 = 40점 만점. 밴드: 36–40 Excellent / 28–35 Good / 20–27 Acceptable / 12–19 Poor / 0–11 Critical. `n/a`가 있으면 최대값을 낮추고 **비율**로 밴드 읽기(90%+ Excellent, 70%+ Good, 50%+ Acceptable, 30%+ Poor) (critique.md 300~314행).
- **인지 부하 3종** (critique-rubric.md): Intrinsic(과제 고유 — 구조화·단계 분리·프로그레시브 디스클로저) / **Extraneous(나쁜 디자인 — 가차 없이 제거, 순수 낭비)** / Germane(이해에 쓰이는 생산적 노력).

#### 2.2.4 Audit 기준 (audit.md)

- 성격: **기술적 코드 레벨 감사. 수정하지 않고 문서화만**. 디자인 critique와 별개. Web 전용(native는 별도 파일).
- **5개 차원을 0~4점으로 채점**:
  1. **Accessibility**: 대비 <4.5:1 / 대형 <3:1 (AAA 7:1), `prefers-reduced-motion`의 의도적 대체(전역 0.01ms kill은 실패), ARIA 역할·라벨, 포커스 순서.
  2. (이하 나머지 차원은 원문 `audit.md` 7~157행에 명시 — 디자이너/프론트엔드 에이전트가 실행 시 **원문을 직접 재독**하여 채점할 것.)
- 보고 시 "무엇이 측정 가능하고 검증 가능한가"만 적고, 추측을 섞지 않는다.

---

### 2.3 Tastemaker / Taste Audit + Taste Guard — P0/P1, 상태 매트릭스, 대비

출처: `tastemaker/tastemaker-main/skills/taste-audit/SKILL.md`, `taste-guard/SKILL.md`, `skills/tastemaker/references/slop-catalog.md`, `skills/tastemaker/references/definition-of-done.md`

#### 2.3.1 우선순위 분류 (taste-audit 26~29행)

| 등급 | 정의 |
|---|---|
| **P0** | 사용을 막거나 사용자를 배제(접근성 오류, 깨진 상태) |
| **P1** | 신뢰를 갉아먹음(slop, 불일치) |
| **P2** | 폴리싱 |

- 적용 순서: **P0 → P1**, 최소 diff, 재스캔, before/after 점수 보고.
- 이미 잘 동작하는 것을 리스타일하지 말 것. 레이아웃은 좋은데 카피가 slop이면 **카피만 고친다**.
- 스크린샷 감사에서는 "픽셀로 검증 불가능한 것(키보드, 스크린리더 이름, 보이지 않는 상태)"을 명시한다.
- 근거 없는 analytics/user research로 파인딩을 정당화하지 말고, 휴리스틱에서 추론했다고 말한다.

#### 2.3.2 Taste Guard 4 패스 (taste-guard 10~40행)

1. **Slop scan (자동)** — `error` 전부 수정, `warn`은 수정 또는 `taste-ignore <ID> <reason>`으로 사용자에게 보이는 이유를 남겨 유지, `info`는 선택.
2. **State matrix (리뷰)** — 각 view와 async organism마다: loading(최종 크기 skeleton), empty(다음 행동을 가르침), filtered-empty, error(원인+재시도+입력 유지), success, permission-denied. 각 컨트롤마다 hover, focus-visible, active, disabled, loading. **누락 = U10 error.**
3. **Accessibility trace** —critical flow의 키보드 경로(Tab 순서, Enter/Space, Esc 포커스 복귀), landmark/heading 순서, 모든 컨트롤의 이름, error association, **새 색 조합은 반드시 계측**(눈으로 추정 금지), reduced motion, 320px reflow, 색상만으로 의미 전달(U15).
4. **Compile trace** — import/props/handler 배선, 미사용 코드, 안정 key. 도구가 있으면 typecheck/lint/build 실제 출력 확인.

- 픽스 루프: `scan → fix errors → re-scan`. **연속 2패스 0 error 또는 3사이클**에서 중단. 3사이클 후 남은 파인딩은 ID와 함께 정직하게 보고, "clean"이라 주장 금지.
- 원인을 고친다: V08 raw hex는 컴포넌트 안 변수로 옮기는 것이 아니라 **토큰을 추가/사용**한다.

#### 2.3.3 대비 및 상태 (definition-of-done 18~28행)

- **WCAG 2.2 AA**: 텍스트 4.5:1, 대형 텍스트·UI 경계 3:1 — `taste-tokens/scripts/contrast.mjs`로 토큰 쌍 검증.
- 전체 키보드 경로, sticky bar에 가려지지 않는 focus, trap 없음, 논리 순서.
- landmark, heading 순서, 라벨링된 컨트롤, `aria-describedby`로 error 연결, status message 낭독.
- `prefers-reduced-motion` 준수, **400% zoom에서 reflow**.
- 반응형 320 / 768 / 1280 / 1536, 가로 스크롤 없음, 터치 44px.
- 라이트/다크 컴포넌트별 검증, 테마 플래시 없음.

#### 2.3.4 카탈로그 ID 중 AIMW에 적용할 항목 (slop-catalog.md)

| ID | 패턴 | 심각도 | 적용 메모 |
|---|---|---|---|
| V01/V02 | AI 그라디언트 / gradient-clipped heading | warn | Operate의 palette 축에서 단일 accent surface로 대체 |
| V03/V04 | resting surface의 glass / floating blob | warn | 콘솔 카드에 backdrop-blur 남용 금지 |
| V07 | 이모지 아이콘 | **error** | 아이콘 시스템 하나 + `aria-hidden` + 텍스트 라벨 |
| V08 | 컴포넌트의 raw hex/rgb | **error** | 시맨틱 토큰 클래스로. 변수로 옮기는 것만으로는 미해결 |
| V15 | 동일 3개 feature 카드(아이콘 인 서클) | warn (Review) | 운영 콘솔의 KPI 카드 행에 자주 나타남 → `/impeccable Operate` 원칙과 충돌 |
| V17 | 도메인 무관 "4 KPI + area chart + table" 대시보드 | warn (Review) | **사용자의 상위 3개 질문에서 레이아웃을 도출** — AIMW 핵심 지시 |
| V18 | `dark:` overriding이 흩뿌려진 다크모드 | warn | 시맨틱 토큰으로 테마화 |
| C01 | hype words (unlock, supercharge, seamless…) | warn | 구체적 결과(명사/숫자)로 |
| C02 | placeholder 콘텐츠 (lorem, Jane Doe…) | **error** | 도메인 실제 이름/데이터 |
| C03 | invented social proof | warn | **근거 없으면 섹션 자체 제거** (AIMW: 없음) |
| C04 | generic CTA (Get Started, Learn More) | warn | 동사+목적어 |
| C07 | 경쟁사가 그대로 쓸 수 있는 헤드라인 | warn (Review) | audience·number·mechanism 추가 |
| U01 | 이름 없는 아이콘 버튼 | **error** | `aria-label` + 툴팁 |
| U03 | `outline-none`에 focus-visible 대체 없음 | **error** | 링/오프셋 복원 |
| U04 | placeholder만 라벨 | warn | 보이는 `<Label>` 필수 |
| U08 | `<img>` alt 누락 | **error** | 의미적 alt 또는 `alt=""` |
| **U10** | loading/empty/error/permission 상태 누락 | **error** (Review) | 상태 매트릭스 채우기 (§2.3.2) |
| U11 | 12px 미만 텍스트 | warn | meta 최소 12, 본문 14–16 |
| U13 | 양의 `tabIndex` | **error** | DOM 순서, 0 또는 -1만 |
| U15 | 색상만으로 상태 전달 | **error** (Review) | 색+아이콘+텍스트 |
| E01/E02 | TODO/FIXME, 빈 핸들러, `href="#"` | **error** | 구현하거나 범위를 줄이고 명시 |
| E08 | placeholder 이미지 서비스 | **error** | 로컬 자산 또는 중립 skeleton |

> 카탈로그 심각도 어휘: **error = 배포 차단**, **warn = 유지하려면 이유 필요**, **info = 취향 권고**. 억제는 반드시 `// taste-ignore <ID> <reason>` 같은 줄에 기록.

---

### 2.4 slop-proof-design — 위반 ID (출처 기반, 스타일 설정 안 함)

출처: `slop-proof/slop-proof-main/slop-proof-design/SKILL.md`, `SOURCES.md`
라이선스: MIT (Beau Dean). 저장소: `https://github.com/itsbeaudean/slop-proof` (README에서 확인).

- 성격: **무엇을 만들지 말지만 말하며, 디자인하지도 스타일을 정하지도 않음.** 태그: `Floor`(접근성·가독성·정직성, 항상 hit) / `Rule`(근거 있는 사용성 실패, 브리프가 의도적으로 깨지지 않으면 hit) / `Tell`(AI-made 기본값, 브리프가 선택하면 1개는 OK, **6~8개가 동시에 나타나면 generated로 읽힘** — SKILL.md 15행 [1]).
- 리뷰 절차: 1280px와 375px로 렌더 → 해당 영역만 스캔 → `id: where: what` 형식으로 기록 → **가장 작은 수정 제안(Floor 우선)** → 재디자인·다른 기본값으로 스왑(X7)·실제 콘텐츠 삭제 금지 → 없는 것은 `[product photo]` 같은 슬롯으로 표시.

요청받은 주요 ID의 원문 정의(해당되는 것만 발췌):

| ID | 태그 | 규칙(판단용) | AIMW 적용 |
|---|---|---|---|
| **X1** | Floor | **만든 사실 금지** — 브리프에 없는 숫자·고객·인용·기능·데이터(목업에도). 모든 주장을 소스로 역추적 | AIMW 해당 수치/고객/인용 **없음** → 슬롯 |
| **X2** | Tell (Floor if invented) | 가짜 proof 가구 — 둥근 통계 배너, 별점, "Trusted by" 로고 바, placeholder 추천사 | 없음 → 섹션 제거/슬롯 |
| **X4** | Tell | 경쟁사 로고만 바꿔도 되는 디자인 — 이 대상만의 디테일 없음 | Operate의 signature move로 해소 |
| **X5** | Tell | 첫 출력 그대로 배포 — critique 패스 없음 | 필수 게이트로 처리 |
| **X7** | Tell | **기본값 하나를 다른 기본값으로 스왑** — 퍼플→크림+세리프+테라코타, 근블랙+애시드 그린, Inter→Space Grotesk. "수정이 목록의 다른 항목과 닮았다"면 실패 | 스킬마다 권장하는 대체 팔레트를 기계적으로 채택하지 말 것 |
| **X8** | Tell | 손대지 않은 빌더 킷 — 기본 shadcn 회색, 모든 카드 Lucide, Inter/Geist, pill 버튼, 전부 라운드 | 컴포넌트 라이브러리 기본값을 그대로 쓰는 것도 슬롭 |
| **L1** | Rule | 스케일 바깥 간격 — 13/18/22/30/44px 패턴 없음, 같은 작업에 24/28/32 혼용. 스텝은 최소 25% 간격 | 8dp 기준 짧은 스케일(원문 [25][26]) |
| **L4** | Rule | 경쟁 focal point — 스쿼트 테스트로 첫 시선이 하나가 아니면 실패 | Operate "한 화면에 하나의 주 액션"과 동일 |
| **L6** | Floor | 소스/tab 순서가 시각 순서와 다름 | 키보드 경로 게이트와 동일 |
| **L9 / L10 / L11** | Tell | 동일 3카드 / 섹션 킷(통계·1-2-3·FAQ·로고바·가격 3단계·4단 풋터) / 모든 것을 카드로 | Hallmark 게이트 3, 85와 중복 |
| **M1 / M2** | Floor | 5초 넘게 멈출 수 없는 모션 / reduced motion 무시 | Hallmark 18, 27와 동일 |
| **M3 / M5 / M7 / M8** | Tell | 모든 것에 모션 / 기본 glassmorphism / **accent stripe(카드 상·좌 컬러 보더)** / glow·sparkle·shimmer | **M7 = Impeccable craft-floor의 "rounded box 한쪽 bar"와 동일 금지** |
| **U1 / U2** | Floor | focus 숨김(2px 미만 또는 3:1 미만) / 작은 타깃(24×24 CSS px 미만, Apple 44×44pt 미만) | 대비·44px 게이트와 연결 |
| **U3** | Floor | **placeholder를 라벨로만 사용** — 입력 시 힌트 사라짐, 기억 부담, 저대비 | Taste U04와 동일. 모든 필드에 보이는 라벨 |
| **U4 / U10 / U11** | Floor | 이름 없는 컨트롤 / **happy path만 존재(loading·empty·error 없음, "보냄"이라고만 뜨는 폼)** / 320px·400% zoom에서 깨짐 | Taste U10, Hallmark 70과 동일 |
| **W2** | Floor | "Click here", "more", "learn more" 등 문맥 없는 링크 텍스트 | C04와 동일 |
| **Y1 / Y2 / Y3** | Rule / Rule / Floor | 본문 <16px / 줄 길이 45~75자 밖 / **행간 120~145% 밖, 고정 높이 텍스트 박스**. 사용자가 line-height 1.5·letter-spacing 0.12 등을 overriding해도 겹치지 않아야 함 | Y3은 반드시 오버라이드 테스트로 확인 |
| **Y10 / Y11 / Y12** | Tell | 기본 폰트+액센트 단어 / **eyebrow + 가짜 번호(01/02/03)** / middle-dot 메타, 모든 링크 화살표, em dash | Hallmark 54, 67, 63과 1:1 대응 |
| **C1 / C2** | **Floor** | **텍스트 4.5:1 미만(대형 24px 또는 18.5px bold는 3:1 미만)** — 4.49:1도 실패 / **입력 경계·아이콘·focus ring·차트 마크 3:1 미만**(비활성 컨트롤 예외, 라벨이 통과하면 경계 3:1 불요) | §2.1.3과 동일 수치 |
| **C3 / C4** | Floor | 이미지·그라디언트·투명 패널 위 텍스트가 어디서든 4.5:1 미만(최악 픽셀 측정) / 색상만으로 의미 전달 | 흑백 뷰로 확인 |
| **C7** | Rule | **APCA/WCAG 3 점수를 "통과"로 취급 금지** — WCAG 3은 초안, APCA는 권고. WCAG 2 비율을 함께 제시 | §2.1.3 실무 지시와 동일 |
| **C8 / C9** | Tell | 퍼플-블루 그라디언트 / 회색 텍스트 다크모드 | Hallmark 2a, 74와 연결 |

> SOURCES.md는 each 항목의 근거를 Research / Industry research / Standard / Practitioner / Journalism으로 분류하고 **모든 URL을 2026년 10월에 확인**했다고 명시(3행). 이 문서는 해당 외부 통계를 AIMW 근거로 차용하지 않았다.

---

### 2.5 ungeneric (v0.36.0) — 32개 체크 중 적용 가능 항목

출처: `ungeneric/ungeneric-main/skill/ungeneric/SKILL.md`, `engine.js` (체크 정의는 `engine.js` 69~184행의 `add(id, label, why, count, weight)` 호출에서 직접 확인)
라이선스: MIT (Saladi Siddharth). 저장소 URL: **없음** (패키지 메타데이터·README에 repository 미기재).

- 성격: 결정론적 로컬 도구. HTML을 32개 슬롭 체크로 감사 → 16개 실제 디자인 시스템 중 하나로 rebuild 또는 polish → 재감사로 개선 입증. **API 키·모델 호출 없음.**
- 점수 밴드(engine.js 47~49행): `>= 50` Heavy slop(전체 restyle 권장) / `>= 22` Light slop(polish mode) / 그 외 "already designed".
- **판단 규칙만 추출** — 이하 ID는 감사 항목이지 코드 템플릿이 아니다.

| 체크 ID | 라벨(판단용) | 가중치 | AIMW 관점 |
|---|---|---|---|
| `purple-gradient` | 퍼플/바이올렛 그라디언트 | 9 | 최고 가중치 tell |
| `gradient-text` | 그라디언트 헤드라인 텍스트 | 8 | Hallmark 2b / Taste V02 |
| `default-font` | Inter/Robot/system 기본 폰트 | 7 | Operate의 `type` 축에서 의도적으로 선택해야 함 |
| `color-soup` | 팔레트 없는 다색(8개 초과 hex) | 6 | 토큰 시스템으로 해소 |
| `generic-hero` | 큰 H1 + 서브 + 두 버튼 | 6 | 콘솔에서는 해당 없음(앱 화면) |
| `template-leak` | lorem/your text here/`{{var}}`/TODO/FIXME 잔존 | 6 | Taste E01과 동일 |
| `any-gradient` | 장식 그라디언트 배경 | 3 | — |
| `glow` | 컬러 glow shadow (≥30px blur) | 5 | Impeccable "offset 0 halo는 장식"과 동일 |
| `emoji` | 이모지 아이콘/장식 | 4 | Taste V07 error |
| `stock-copy` | supercharge/unlock/seamless 카피 | 4 | Taste C01 / Hallmark 19 |
| `card-grid` | 동일 라운드 카드 3개+ | 3 | V15 / L9 |
| `caps` | 외침 ALL-CAPS 카피 | 2 | Hallmark 67 |
| `pill-radius` | 모든 버튼 999px radius | 4 | 반지름은 방향에 맞춰 의도적으로 |
| `no-alt` | alt 없는 이미지 | 3 | Taste U08 / slop-proof P14 |
| `loop-motion` | 무한 pulse/ping/bounce/spin | 5 | 5초 이상 정지 불가 모션 |
| `transition-all` | catch-all transition | 3 | Hallmark 10a |
| `hover-scale` | 카드 hover scale | 3 | Impeccable "same lift/scale on every card" |
| `tracked-caps` | 대문자+넓은 자간 라벨 | 3 | Hallmark 67 house rule |
| `dead-link` | `href="#"` | 2 | Taste E02 / Hallmark 70 |
| `odd-spacing` | 4px 리듬 바깥(=2 초과이고 4로 나누어지지 않는) 여백 | 2 | slop-proof L1 |
| `no-reduced-motion` | 대체 경로 없는 모션 | 3 | Hallmark 27 |
| `focus-removed` | `outline:none`에 focus-visible 대체 없음 | 3 | Taste U03 error |
| `glass` | backdrop-blur 표면 남용 | 3 | Taste V03 |
| `tailwind-violet` | Tailwind violet/indigo/fuchsia 팔레트 | 5 | Hallmark 74 stock swatch |
| `meta-strings` | middle-dot 메타 문자열(3개 이상) | 2 | Hallmark 63 house rule |
| `invented-proof` | 검증 불가 통계/"trusted by"/★4.x | 3 | AIMW **없음** → 슬롯 |
| `nested-cards` | 카드인카드 | 3 | Hallmark 4 Floor / Impeccable "nested cards always wrong" |
| `fake-chrome` | traffic-light 3점으로 가짜 창 프레임 | 2 | Hallmark 47a Floor |

> 주의: ungeneric은 "16개 디자인 시스템으로 rebuild"하라고 권하지만, **AIMW는 기존 제품 브랜드/와이어링을 유지해야 하므로 rebuild 모드를 쓰지 않는다.** 감사 체크리스트로만 사용하고, 수정은 Hallmark redesign keep 원칙(§2.1.4) 아래에서 최소 diff로 처리한다.

---

## 3. 스킬 간 규칙 대합표 (중복/충돌 정리)

| 판단 축 | Hallmark | Impeccable (Operate) | Taste | slop-proof | ungeneric |
|---|---|---|---|---|---|
| 본문 대비 | 40: 4.5:1 / Lc60 | craft-floor: 4.5:1 | DoD: 4.5:1 (WCAG2.2 AA) | C1: 4.5:1 (4.49도 실패) | — |
| 대형/경계/아이콘 | 40: 3:1 / Lc45 | 3:1 | 3:1 | C2: 3:1 | — |
| eyebrow | 54 **Floor house rule** | craft-floor **ban** | (카탈로그에 명시 ID 없음) | Y11 Tell | `tracked-caps` |
| 카드인카드 | 4 **Floor** | "항상 틀림" | V15(동일 3카드) | L11 Tell | `nested-cards` |
| 이모지 아이콘 | 30a **Floor** | Refuse | V07 **error** | U13 Tell | `emoji` |
| `transition: all` | 10a **Floor** | — | — | (M 계열) | `transition-all` |
| 상태 누락 | 62 / 70(happy path) | craft-floor States | **U10 error** | **U10 Floor** | `dead-link` |
| 만든 수치/proof | 46a **Floor** | craft-floor | C03 warn | X1/X2 **Floor** | `invented-proof` |
| purple→blue | 2a **Floor** | Refuse gradient text | V01 warn | C8 Tell | `purple-gradient` (9점) |
| 포커스 링 | 26a 3:1 즉시 | Browser surfaces | U03 **error** | U1 Floor | `focus-removed` |

**충돌 시 우선순위**: ①Floor/house rule(Hallmark) → ②ban(Impeccable craft-floor) → ③error(Taste) → ④Floor(slop-proof) → ⑤Tell/Tip. 단, **AIMW의 기존 브랜드·와이어링 보존(redesign keep)은 이들보다 앞선다** — 게이트가 내용·배선 변경을 요구하면 임의로 바꾸지 말고 기록(handoff)한다.

---

## 4. 보고 형식 지시 (디자이너/게이트 에이전트 공통)

- 파인딩은 반드시 `체계 ID — 위치 — 무엇 — 최소 수정` 4요소로 쓴다.
  - 예: `Hallmark 54 — .section-label — eyebrow 성격 — 라벨 삭제 후 헤딩이 의미를 갖게 함`
  - 예: `Taste U10 — /runs 화면 — error 상태 없음 — 원인+재시도+입력 유지 상태 추가`
  - 예: `slop-proof C1 — .sub on hero — 3.2:1 — foreground 틴트로 4.5:1 이상`
- 서로 다른 체계의 같은 규칙은 **중복 보고하지 말고** "대응 ID"로 묶는다(§3 표 참조).
- `warn` / `Tell`을 유지할 때는 **이유를 기록**해야 한다(Hallmark waive 3필드, Taste `taste-ignore`, slop-proof "의도적으로 남김" 보고).
- `FAIL`/`error`/`Floor`가 하나라도 열려 있으면 "완료"로 보고하지 않는다.

---

## 5. 출처 · URL · 라이선스 표

| 스킬 | 버전 | 직접 읽은 원문 파일 | 저장소 URL | 라이선스 |
|---|---|---|---|---|
| Hallmark | 2.0.0 | `skills/hallmark/SKILL.md`, `references/gates.md`, `references/redesign.md`, `references/review-finish.md`, `references/review-hero.md` | `https://github.com/Nutlope/hallmark` (홈페이지 `https://www.usehallmark.com`) | **MIT** — `LICENSE` "Copyright (c) 2026 Hallmark contributors", `plugin.json` license: MIT |
| Impeccable | 4.10.0 | `plugin/skills/impeccable/SKILL.md`, `reference/mode-operate.md`, `reference/operate.md`, `reference/critique.md`, `reference/critique-rubric.md`, `reference/craft-floor.md`, `reference/audit.md` | `https://github.com/pbakaus/impeccable` (문서 `https://impeccable.style`) | **Apache 2.0** — `LICENSE`, `SKILL.md` 메타데이터, README. Anthropic frontend-design에서 시작 |
| Tastemaker (taste-audit / taste-guard) | 1.0.0 | `skills/taste-audit/SKILL.md`, `skills/taste-guard/SKILL.md`, `skills/tastemaker/references/slop-catalog.md`, `skills/tastemaker/references/definition-of-done.md` | `https://github.com/Harrypatria/tastemaker` | **MIT** — `LICENSE` "Copyright (c) 2026 Harry", `plugin.json` license: MIT |
| slop-proof-design | 없음 (버전 표기 없음) | `slop-proof-design/SKILL.md`, `slop-proof-design/SOURCES.md` | `https://github.com/itsbeaudean/slop-proof` (README에서 확인) | **MIT** — `LICENSE` "Copyright (c) 2026 Beau Dean" |
| ungeneric | 0.36.0 | `skill/ungeneric/SKILL.md`, `engine.js` (체크 정의 69~184행) | **없음** (package.json·README에 repository 미기재) | **MIT** — `LICENSE` "Copyright (c) 2026 Saladi Siddharth", `SKILL.md` frontmatter `license: MIT` |

> 모든 파일의 절대 경로 접두: `C:\Users\Administrator\Documents\Craft Anything\AIMW\design-v3\skills\_downloaded\`
> 라이선스 준수: 판단 규칙만 자문으로 차용했으며, 원문 코드·SVG·카피·스크리프트·디자인 시스템 정의는 이 문서와 AIMW 산출물에 포함하지 않았다. 각 스킬의 저작권 고지와 라이선스 전문은 위 원문에 그대로 남아 있다.

---

## 6. 디자이너에게 전달할 실행 지시 (우선순위 순)

1. **분류 확정**: AIMW 운영 콘솔을 `Operate`로 선언한다. 창의성은 `type · palette · density · signature move` 4개에만 쓰고, 레이아웃·내비·컨트롤은 표준으로 둔다. (§2.2.1)
2. **깊이 확정**: 이번 재설계의 깊이를 `full`(앱 화면 재구성)로 가정하되, 사용자가 "레이아웃 유지"라고 하면 `restyle`, "룩 유지+틀만"이면 `polish`로 전환하고 **섞지 않는다**. 깊이를 Picks/핸드오프 첫 줄에 명시한다. (§2.1.4)
3. **Before 기록**: HTML 수정 전에 현재 화면을 스캔/캡처해 게이트 파인딩을 먼저 적는다. (redesign `Before`, §2.1.4)
4. **keep 목록 작성**: 링크·폼·필드·핸들러·라우트·id·테스트 훅·브랜드 토큰·약관 문구를 먼저 나열하고, 하나도 삭제하지 않는다. (§2.1.4)
5. **상태 매트릭스 채우기**: 화면마다 loading/empty/filtered-empty/error/retry/success/permission-denied, 컨트롤마다 hover/focus-visible/active/disabled/loading. 미비 = U10 error. (§2.3.2)
6. **대비 계측**: 새 색 조합은 눈으로 보지 말고 계측한다. 본문 4.5:1, 대형/경계/아이콘/focus 3:1. APCA만으로 통과 주장 금지. (§2.1.3, §2.4 C7)
7. **Operate craft-floor 적용**: 중첩 카드, hero-metric, eyebrow/kicker, 섹션 번호, gradient text, 한쪽 bar, 하드 offset shadow, mono 코스튬, 시스템 display face, 이모지 아이콘, 장식용 glass를 전부 제거/회피. 그림자는 offset+blur, 모션은 한 개, `::selection`/caret/scrollbar/focus ring/tabular numerals까지 테마화. (§2.2.2)
8. **카피 정리**: 제품 언어로, 컨트롤=행동, 에러=문제+복구, CTA=동사+목적어. hype/placeholder/generic CTA 금지. (§2.3.4 C01/C02/C04)
9. **증거 처리**: AIMW의 수치·고객·인용·로고는 **없음**이므로 만들지 말고 `[slot]`으로 표시하거나 섹션을 제거한다. (§7)
10. **스윕/리뷰**: FAIL·error 0이 될 때까지 수정-재스캔(최대 3사이클). 이후 신규 컨텍스트 finish 리뷰의 첫 단어에 따라 행동하고, 파인딩을 resolved/partial/unresolved로 채점. (§2.1.2, §2.1.5, §2.3.2)
11. **보고**: §4 형식으로 ID 기반 보고. 열린 FAIL/error가 있으면 "완료" 아님.

> 조사 에이전트 경계 재확인: **이 문서를 쓴 에이전트는 어떤 디자인 HTML도 수정하지 않았고, 커밋·푸시·Figma 업로드를 하지 않았다.**

---

## 7. 근거 없는 수치 · 고객 · 인용 · 로고 (없음 명시)

원문 스킬들이 공통으로 금지하는 항목이며, 현재 AIMW 조사 범위에서 제공된 근거가 없다. 아래는 모두 **없음**으로 기록한다.

| 항목 | 상태 | 근거 규칙 |
|---|---|---|
| AIMW 고객 수 / 사용자 수 / 성장률 | **없음** | Hallmark 46a, Taste C03, slop-proof X1, ungeneric `invented-proof` |
| AIMW uptime / 성능 수치 (예: 99.9%) | **없음** | 동일 |
| 고객 인용·추천사(이름 포함) | **없음** | Hallmark 46a, slop-proof X2 |
| 사용 가능한 고객 로고 / 로고 월 | **없음** | Hallmark 46a, slop-proof X2 |
| 케이스 스터디 개수 | **없음** | Hallmark 46a |
| 제공된 브랜드 팩 / 승인된 악센트 컬러 / 지정 폰트 | **없음** (원문에 미기재) | redesign "brand is chosen" 조건 미충족 → 프레임워크 기본값으로 취급하여 재설계 가능 |
| 외부 조사 통계를 AIMW 근거로 쓴 사례 | **없음** (의도적으로 미차용) | slop-proof SOURCES.md의 제3자 통계는 AIMW 사실이 아님 |

> 위 항목이 나중에 제공되면 그때 처음으로 슬롯을 실제 값으로 교체하고, 출처(파일:줄 또는 URL)를 함께 기록한다. 제공되지 않는 한 어떤 숫자·이름·인용도 생성하지 않는다.

---

## 8. 미확인 / 후속 조치 (정직한 한계 기록)

- Impeccable `audit.md`의 5개 차원 중 **Accessibility(1) 외 2~5차원의 상세 채점 기준은 이 조사에서 끝까지 읽지 못했다.** 감사를 실행할 에이전트는 원문 `audit.md` 7~157행을 직접 재독해 채점할 것. (추측으로 채우지 않음)
- Hallmark `gates.md` 179행의 Finish 목록(F25 이후)은 원문 출력이 2000자로 잘려 **F25~F26 이후 항목 전문을 확인하지 못했다.** Finish는 차단 게이트가 아니므로 보고 시 해당 원문을 재독한다.
- 각 스킬의 실행 스크립트(`sloplint.mjs`, `slop-scan.mjs`, `impeccable`, `engine.js`의 rebuild 로직)는 **읽지 않았고 실행하지 않았다.** 이 문서는 규칙 추출용이며 도구 실행 결과를 포함하지 않는다.
- 웹 검색으로 확인한 2차 요약은 일체 규칙 근거로 사용하지 않았다. 모든 규칙은 §5의 로컬 원문에서 직접 확인했다.
