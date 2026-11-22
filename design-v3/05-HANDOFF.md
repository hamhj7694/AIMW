# 05 — Handoff (구현 이관) v3.1

## 1. 토큰 → CSS 변수

`figma-plugin/code.js`의 값을 그대로 사용합니다.

```css
:root{
  --color-paper:#E8E9E2;        /* 메인 60% */
  --color-ink:#202722;          /* 서브 30% */
  --color-signal:#B8371B;       /* 포인트 10% */

  --color-ink-70:#59625B;
  --color-rule:#C9CCC3;
  --color-signal-soft:#EFD9D2;
  --color-paper-alt:#DCDDD5;

  --space-1:4px;  --space-2:8px;  --space-3:12px; --space-4:16px;
  --space-5:24px; --space-6:32px; --space-7:48px; --space-8:64px;

  --radius-none:0px; --radius-tight:2px;

  --font-sans:'Pretendard','Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;
  --font-stamp:'Nanum Myeongjo','Noto Serif KR','Batang',serif;
}
```

`box-shadow`, `linear-gradient`, `border-radius` 8px 이상을 새로 추가하지 않습니다.

## 2. 컴포넌트 → shadcn/ui

| Figma | 구현 |
|---|---|
| `Button/Action` | `<Button>` 기본, 배경 `signal` |
| `Button/Quiet` | `<Button variant="ghost">`, 밑줄만 |
| `Input/Line`, `Textarea/Line`, `Select/Line` | 각 shadcn 컴포넌트에 밑줄 스타일 적용 |
| `Tab/Text` | `Tabs`의 텍스트 트리거 |
| `Stamp/Status`, `Gate/Step`, `Progress/Inline`, `Dock/Next` | 프로젝트 공통 컴포넌트로 신규 작성 |
| `Row/Task`, `Row/Result`, `Row/Setting`, `Notice/Line` | 카드 대신 사용하는 행 컴포넌트 |
| `Dialog/Confirm` | `Dialog` / `AlertDialog` |
| `Switch` | `Switch` |
| `Toast` | 별도 토큰 없이 `Notice/Line` 재사용 |

## 3. 화면 → 라우트

| Figma 프레임 | 앱 라우트 | 비고 |
|---|---|---|
| S0 홈 | `/` | 다음 수령 1개 |
| S1 살펴보기 | `/collect`, `/references`, `/own` | 텍스트 탭 |
| S2 스튜디오 | `/studio` | 3게이트 |
| S3 영상 워크벤치 | `/video` | S2 서브탭 아님, 독립 라우트 |
| S4 발행 | `/publish` | 시연 상태 문구 상시 |
| S5 성과 | `/insights`, `/forecast`, `/segments` | 3개 독립 라우트 |
| S6 성장 | `/seo?tab=...` | 4탭 |
| S7 설정 | `/settings` | 연결, 비용, 모듈 링크 |

## 4. 구현 시 반드시 지킬 것

- 화면마다 **주 액션 버튼 1개**. 보조 액션은 `Button/Quiet`.
- 상태는 `Empty / Loading / Partial / Error / Success` 문구를 그대로 사용.
- 로딩은 스피너 대신 숫자와 2px 선.
- `transition: all`, 너비/높이 애니메이션 금지. `opacity`와 색만 120ms.
- 알약 배지 대신 `Stamp/Status`(텍스트 + 왼쪽 2px 선). 화면당 최대 2개.
- 가운데점 메타 문자열 금지. 문장으로 쓰거나 줄을 바꿉니다.
- 외부 전송, 과금, 렌더가 없는 동작에는 `시연` 상태 문구를 붙입니다.
- 매칭 실패나 낮은 신뢰도에는 `검증 필요`와 되묻기를 표시합니다.
- 세리프 글꼴은 숫자 도장에만 사용합니다.

## 5. 최종 체크리스트

- [ ] `design-v3/01` 토큰 = `code.js` 상수 = `preview/index.html` CSS 변수
- [ ] Figma 플러그인 수치 검증: 넘침 0, 미바인딩 fill 0, 주 액션 1
- [ ] 키보드만으로 홈 → 수집 → 브리프 → 승인 → 발행(시연) 완주
- [ ] 대비 4.5:1, focus-visible 2px, 최소 클릭 40×40
- [ ] 390px 폭에서 가로 스크롤 0
- [ ] 카드 0개, 그림자 0개, 그라데이션 0개
- [ ] 사람이 실제 화면을 보고 **시각 합격** 선언

## 6. 열린 이슈

1. Pretendard/나눔명조 미설치 환경 폰트 폴백 (플러그인이 보고).
2. 썸네일 실 미디어는 저장소에 없어 텍스트 플레이스홀더 사용.
3. Figma Starter 페이지 3개 한도. 추가 보드는 기존 보드에 섹션 추가.
4. 인터랙션과 프로토타입 링크는 사람이 연결.
5. 숫자 검증 통과와 별개로 **육안 게이트가 최종**.

## 7. 보고 형식 (매 단계)

```text
만든 것: …
검증 숫자: …
다음: …
```

마지막 단계에서는 멈추고 사람의 확인을 기다립니다.
