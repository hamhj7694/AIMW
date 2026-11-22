# Figma 핸드오프 — 라이트테이블 v2 (역사 기록)

> **현재 상태**: 이 문서의 색상·타입·레이아웃은 v2 라이트테이블 당시 값입니다.
> 최신 시각 토큰은 `../DESIGN-PLAN-v4.md`, 현재 화면 구조는 `../DESIGN-V2.md`,
> 사용성 기획은 `../DESIGN-PLAN-v5-EASE.md`, 문서 상태 지도는 `../CURRENT-STATUS.md`를 참고하세요.
> 이 문서는 수동 이관 방법의 기록으로만 남겨 둡니다.
>
> 이 세션에는 Figma 쓰기 연결(MCP/플러그인)이 없습니다. 아래 구조를 그대로 따라 만들면 됩니다.
> import용 벡터: `figma/components.svg` (Figma로 드래그 → Frame으로 변환)
> 당시 단일 진실: `../DESIGN-PLAN-v2.md` (현재는 위 최신 문서를 우선 적용)

---

## 1. 파일/페이지 구조

```
AIMW / 라이트테이블 v2
├── 00 Cover            — 이름, 한 줄 포지셔닝, 상태
├── 01 Brand            — 브랜드 마크, 성격, 목소리, 금지 어휘
├── 02 Color            — 9개 토큰 스와치
├── 03 Type             — 6개 type scale
├── 04 Components       — 핵심 10개 (전체 인벤토리는 COMPONENT-SPECS.md)
├── 05 States           — 대기/진행/완료/실패 + 명시적 링크 플로우
├── 06 S0 Collector     — 핵심 화면 1
├── 07 S8 Workbench     — 핵심 화면 2
└── 08 S9 SEO Growth    — 핵심 화면 3
```

## 2. Figma 변수(Variables)

| Collection | Variable | Value |
|---|---|---|
| `Color` | `paper` | `#EFF0F2` |
| `Color` | `sheet` | `#F8F8F7` |
| `Color` | `ink` | `#14171C` |
| `Color` | `ink-2` | `#3A4048` |
| `Color` | `muted` | `#646C77` |
| `Color` | `rule` | `#D3D6DB` |
| `Color` | `rule-strong` | `#A8AEB7` |
| `Color` | `mark` | `#BC3B2B` |
| `Color` | `amber` | `#A9761B` |
| `Radius` | `none` | `0` |
| `Space` | `xs / s / m / l / xl` | `4 / 8 / 16 / 24 / 40` |

Radius는 전역 0. 예외: Selection mark의 타원만 `ellipse` 도구로 그림.

## 3. 텍스트 스타일

| Style | Font | Size / Weight | Tracking |
|---|---|---|---|
| `Display/600` | Pretendard | 46 / 600 | -4% |
| `Heading/600` | Pretendard | 24 / 600 | -3% |
| `Title/600` | Pretendard | 19 / 600 | -2.5% |
| `Body/400` | Pretendard | 16 / 400 | -1% |
| `Sub/400` | Pretendard | 13 / 400 | -1% |
| `Meta/400` | JetBrains Mono | 11 / 400 | 0 |

굵기 700 이상 없음. line-height는 Body 175%, 나머지 140%.

## 4. 컴포넌트 10개 (이름 고정)

| Figma 컴포넌트명 | 구조 | 속성(Variant) |
|---|---|---|
| `Frame` | 1px rule-strong 사각 + 코너 F-XXX + 썸네일 영역 | `state=default/selected` |
| `Selection mark` | mark색 2px 타원, 회전 -4° | 없음 (오버레이) |
| `Status stamp` | 1.5px 사각 + 텍스트 | `status=초안/검수/승인/보류/샘플/발행`, `emphasis=red/solid` |
| `Gate step` | 사각 + 상단 스텝 ID + 라벨 | `state=done/now/locked` |
| `Job ticket` | 가로 라벨:값 스트립 | item 개수 |
| `Inspect panel` | 세로 key/value 행 + 도장 슬롯 | row 개수 |
| `Ruled tab` | 밑줄 탭 | `active=index` |
| `Ink button` | 검정 사각 / 빨간 밑줄 / 고스트 | `style=ink/red/ghost` |
| `Field` | 하단 1px 선 입력칸 | `state=empty/filled` |
| `Empty frame` | 점선 사각 + 안내 문구 | 없음 |

## 5. 핵심 화면 레이아웃 (Auto layout)

```
Frame: 1440 × 900, fill=paper
├─ Job ticket        H 46, fill=sheet, border-bottom=rule-strong
└─ Body              layout: horizontal, gap 0
   ├─ Code rail      W 52, fill=sheet, border-right=rule
   ├─ Main           flex 1, padding 20/22, fill=paper
   │  ├─ 제목 + 설명
   │  ├─ Ruled tab
   │  ├─ Frame grid  columns 4, gap 9
   │  └─ 상태풋터     border-top=rule
   └─ Inspect panel  W 250, border-left=rule, padding 18/16
```

S8은 Main 영역 안에 `Gate step` 4개를 상단에, `샷 트랙`을 하단에 배치. 우측 Inspect panel에 `rights_flag` 행과 `권리 확인 필요` 도장.
S9은 같은 셸에서 4개 밑줄 탭(진단 / 키워드·콘텐츠 / 예산·예측 / 취합·개선)과 예측 배지 5개를 배치. 실제 집행 없음 문구 상시.

## 6. 금지 (Figma에서도 동일)

- 그라데이션 · 네온 · 글래스 · 보라/청록 · 코너 라운드 · 그림자 · 카드 호버
- ALL CAPS 라벨 · 가운뎃점 메타 · `WORD — fragment` · 버튼 끝 `→`
- 같은 모양 카드 반복, KPI 4개 + 스파크라인

## 7. Figma 연결 방법 (선택)

공식 Figma MCP는 쓰기 권한을 지원하지만 OAuth 인증이 필요합니다.
연결되면 이 문서의 프레임/컴포넌트 이름을 기준으로 실제 Figma 파일에 생성할 수 있습니다.
연결 전에는 `components.svg`를 Figma 캔버스에 드래그해 벡터로 확인할 수 있습니다.

## 8. 구현 매핑 (React / CSS 변수)

| 디자인 토큰 | CSS 변수 (`tokens.css`) | React 사용처 |
|---|---|---|
| paper / sheet / frame | `--paper` / `--sheet` / `--frame` | `AppShell` 배경 / 패널 / 프레임 |
| ink / ink-2 / muted | `--ink` / `--ink-2` / `--muted` | 제목 / 보조 / 메타 |
| rule / rule-strong | `--rule` / `--rule-strong` | 구분선 / 외곽선 |
| mark / amber | `--mark` / `--amber` | 선택·승인 / 비용·권리 경고 |
| spacing 4~64 | `--space.1` ~ `--space.7` | padding / gap |
| radius 0 | `--radius` | 전역 (타원만 50%) |
| rail / inspect | `--rail.w` / `--inspect.w` | 코드 레일 / 검상 패널 |

구현 시 주의:
- `aimw-app`의 기존 CSS와 토큰을 섞지 않는다. 새 화면은 `tokens.css`만 참조한다.
- 색을 하드코딩하지 않고 위 변수만 쓴다 (검증 기준 hex 0).
- 프레임 선택 상태는 `Frame/Selected` variant로 표현하고 `Selection mark`를 오버레이한다.

## 9. 열린 이슈

1. **Figma 파일 미연결** — MCP OAuth 연결 후 프레임 자동 생성 가능. 현재는 SVG 임포트 경로만 제공.
2. **기획 문서 동기화** — `DESIGN-PLAN-v2.md`가 시각 토큰의 단일 진실. 기존 기획 저장소의 DESIGN-PLAN §3은 변경하지 않음. 기획 측 승인이 필요하면 G4/G5 재심의.
3. **도메인 예시 잔존** — 기획 문서 6건에 `장기렌트` 예시가 남아 있음. 기획 동결 상태라 수정하지 않았고, 화면 카피에는 사용하지 않음.
4. **전체 컴포넌트 Expansion** — 핵심 10개만 구현. 나머지는 `COMPONENT-SPECS.md` 인벤토리에 등록만 된 상태.
