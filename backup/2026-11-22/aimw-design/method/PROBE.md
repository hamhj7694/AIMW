# PROBE — 도구·폰트·뷰포트 확인 (2단계)

## 도구 목록 (실제 확인 결과)

| 도구 | 사용 가능 | 용도 |
|---|---|---|
| 브라우저 탐색·스크린샷· 콘솔·평가 | 예 | 디자인 보드 렌더·수치 검증 |
| 파일 쓰기 | 예 | HTML/CSS/SVG/MD 산출 |
| Figma MCP | **아니오** | 리소스 0, 템플릿 0, Figma 도구 0 |
| 컴퓨터 유즈 | **아니오** | OS 수준 마우스/키보드 도구 없음 |
| 외부 API 호출·과금 | 하지 않음 | 기획 금지사항 |

→ 실행 모드는 `DESIGN-METHOD-ADAPTED.md` D-02대로 로컬 보드 + SVG 핸드오프.

## 폰트

| 토큰 | 소스 | 확인 |
|---|---|---|
| Pretendard Variable | jsdelivr CDN | computed `font-family`에 적용 확인 |
| JetBrains Mono | Google Fonts | computed `font-family`에 적용 확인 |
| 폴백 | `sans-serif` / `monospace` | CDN 실패 시 자동 |

## 뷰포트

| 폭 | 확인 방법 | 결과 |
|---|---|---|
| 785px (Review pane 실제 폭) | 브라우저 실측 | `scrollWidth === clientWidth` (오버플로 0) |
| 900px 이하 | `@media(max-width:900px)` | 단일 열로 전환, 레일/검상 패널 재배치 |
| 1280px / 1440px | CSS 토큰 검토 (`--gutter` 16/24, `--content.max` 1200) | 구조 고정, 가로 오버플로 유발 요소 없음 |

## 디자인 계획한도

Figma 미연결로 페이지/변수 모드 한도는 해당 없음. 대신 `DESIGN-PLAN-v2.md`에 토큰 10색·타입 6종·간격 7종을 고정.

## 폰트 폴백 결정
CDN 로드 실패 시에도 레이아웃이 깨지지 않도록 `line-height`와 `word-break: keep-all`을 토큰에 고정했다.
