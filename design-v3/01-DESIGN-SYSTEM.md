# 01 — 디자인 시스템 v3.1

> 이 문서의 값은 `figma-plugin/code.js` 상수와 `preview/index.html`의 CSS 변수와 동일합니다. 하나를 바꾸면 셋 다 바꿉니다.

---

## 1. 색상 토큰

### 1-1. Primitives (Figma 컬렉션 `Primitives`)

| 변수 | 값 | 성격 |
|---|---|---|
| `paper` | `#E8E9E2` | 메인 60%. 차가운 복사지 |
| `ink` | `#202722` | 서브 30%. 먹 잉크 |
| `signal` | `#B8371B` | 포인트 10%. 확인 도장 |
| `ink/70` | `#59625B` | 잉크의 밝기 파생 |
| `ink/20` | `#C9CCC3` | 잉크의 밝기 파생, 규칙선 |
| `signal/soft` | `#EFD9D2` | 신호의 밝기 파생 |
| `paper/alt` | `#DCDDD5` | 종이의 밝기 파생 |

> 파생 4개는 **명도만** 다른 같은 색입니다. 별도 색상으로 세지 않습니다.

### 1-2. Semantic (Figma 컬렉션 `Color Light` — Primitives 별칭)

| 토큰 | Primitive | CSS 변수 |
|---|---|---|
| `bg/base` | paper | `--color-paper` |
| `bg/recess` | paper/alt | `--color-paper-alt` |
| `border/rule` | ink/20 | `--color-rule` |
| `text/primary` | ink | `--color-ink` |
| `text/secondary` | ink/70 | `--color-ink-70` |
| `text/on-signal` | paper | `--color-on-signal` |
| `signal/action` | signal | `--color-signal` |
| `signal/soft` | signal/soft | `--color-signal-soft` |

Figma Starter 제약 대응: 모드 2개 대신 `Primitives` / `Color Light` 두 컬렉션을 씁니다. 어두운 미리보기 면은 `ink` 배경 + `paper` 글자 조합으로 표현합니다.

---

## 2. 타이포 스타일 (Figma Text Styles 6종)

| 스타일 | 폰트 | Size / Line | Weight |
|---|---|---|---|
| `Display` | Sans | 32 / 40 | 700 |
| `H1` | Sans | 26 / 34 | 700 |
| `H2` | Sans | 19 / 28 | 600 |
| `Body` | Sans | 14 / 22 | 400 |
| `Caption` | Sans | 12 / 18 | 400 |
| `Stamp` | Serif | 40 / 44 | 700 |

- Sans 우선순위: `Pretendard` → `Noto Sans KR` → `Apple SD Gothic Neo` → `Malgun Gothic`
- Serif 우선순위: `Nanum Myeongjo` → `Noto Serif KR` → `Batang`
- `Stamp`는 숫자와 도장 라벨에만 사용합니다. 제목에 쓰지 않습니다.
- 모노 글꼴 없음. 플러그인은 런타임에 실제 설치된 폰트를 프로브해 보고합니다.

---

## 3. 간격·반경·구조

### Spacing 컬렉션 (`FLOAT`)

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64`

### Radius 컬렉션 (`FLOAT`)

| 토큰 | 값 |
|---|---|
| `none` | 0 |
| `tight` | 2 |

### 구조 그리드

| 항목 | 값 |
|---|---|
| 좌측 목록 | 208px |
| 우측 열 | 280px |
| 상단 바 | 56px |
| 하단 상태 | 28px |
| 캔버스 여백 | 28px |
| 작업 행 높이 | 64px |
| 화면 간격(Figma) | 120px |

 elevation은 없습니다. 그림자 토큰을 만들지 않습니다.

---

## 4. 컴포넌트 인벤토리 (16종)

| ID | 이름 | 상태 | 구현 매핑 |
|---|---|---|---|
| C01 | `Button/Action` | default·focus·disabled | shadcn `Button` |
| C02 | `Button/Quiet` | default·focus | `Button variant="ghost"` |
| C03 | `Input/Line` | default·focus·error | `Input` (밑줄만) |
| C04 | `Textarea/Line` | default·focus | `Textarea` (밑줄만) |
| C05 | `Select/Line` | default·focus | `Select` |
| C06 | `Row/Task` | 기본·현재 | custom |
| C07 | `Row/Result` | 기본·저장됨 | custom |
| C08 | `Row/Setting` | 기본·주의 | custom |
| C09 | `Stamp/Status` | 완료·검증 필요·실패·대기 | custom |
| C10 | `Gate/Step` | 완료·현재·대기 | custom |
| C11 | `Progress/Inline` | 숫자 + 2px 선 | custom |
| C12 | `Tab/Text` | 활성·비활성 | `Tabs` |
| C13 | `Dock/Next` | 기본·비용 있음 | custom |
| C14 | `Notice/Line` | 안내·주의 | custom |
| C15 | `Dialog/Confirm` | 기본·비용 | `Dialog` / `AlertDialog` |
| C16 | `Switch` | on·off | `Switch` |

### 컴포넌트 규칙

- 카드 컴포넌트를 만들지 않습니다. 필요한 정보는 `Row/*`와 `Notice/Line`로 표현합니다.
- 알약 배지를 만들지 않습니다. `Stamp/Status`는 텍스트 + 왼쪽 2px 선입니다.
- 최소 클릭 영역 40×40px(데스크톱), 44×44px(모바일).
- 버튼 상태는 default, focus-visible, disabled 3종만 정의합니다. hover는 색이 아니라 밑줄 또는 1px 선으로 표현.
- focus-visible은 2px `signal` 링 + 2px 오프셋.
- Auto Layout 필수. 이름은 `Button/Action`처럼 계층형. `Frame 123` 금지.
- 인스턴스화: 같은 버튼을 화면마다 다시 만들지 않습니다.

---

## 5. 접근성 기준

- 본문 대비 ≥ 4.5:1. `ink` 12.50:1, `ink/70` 5.17:1, `signal` 4.77:1.
- 키보드만으로 홈 → 수집 → 브리프 → 승인 → 발행(시연) 완주.
- 모든 상태는 텍스트로 읽힙니다. 색만으로 전달하지 않습니다.
- `prefers-reduced-motion` 존중.
- 가로 스크롤 0, 390px 폭에서 세로 스택.

---

## 6. 수치 검증 규칙 (플러그인이 자동 수행)

생성 후 각 화면에 대해:

1. 프레임 경계와 직계 자식의 절대 경계 비교 → 넘침 0.
2. 텍스트 노드의 fontName이 로드된 폰트와 일치.
3. 색상 fill 중 변수에 바인딩되지 않은 것 → 0.
4. 화면별 주 액션 버튼 개수 = 1.
5. 하드코딩 hex 문자열이 Figma 노드 이름/텍스트에 남아 있지 않은지 확인(토큰 보드의 스와치 라벨은 제외).

결과는 플러그인 UI에 표로 보고하고, 실패 항목은 이름을 적어 표시합니다. 숫자 통과는 시각 합격이 아닙니다.
