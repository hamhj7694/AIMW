---
name: aimw-design-review
description: AIMW 프로토타입의 화면을 비평하고 다시 설계할 때 사용한다. Anthropic frontend-design, Microsoft frontend-design-review, canvas-design의 실행 가능한 원칙과 AIMW 금지 규칙을 통합한다.
---

# AIMW 디자인 리뷰

이 스킬은 "예쁘게 꾸미기"가 아니라 **반복해서 같은 AI 디폴트로 돌아가지 않게 만드는 검사 절차**다.

## 1. 절차 (반드시 순서대로)

1. **근거 확인**: 레퍼런스 문서(`aimw-design/reference/`)와 제품 설계 규칙(`DESIGN-PLAN-v2.md`, `method/DESIGN-METHOD-ADAPTED.md`)을 다시 읽는다.
2. **현재 상태비평**: 코드와 계산된 스타일을 근거로 아래 3기둥과 금지 목록을 검사한다. 추측하지 말고 근거를 적는다.
3. **방향 확정**: 화면을 고치기 전에 한 문장으로 "이 화면은 무엇을 위한 문서인가"를 정하고, 그에 맞는 시각 어휘를 고른다.
4. **한 군데만 과감하게**: 기억에 남을 요소는 하나만 둔다. 나머지는 조용히 정리한다.
5. **두 번째 패스**: 추가하지 말고 뺀다. "장식을 더할까?"라는 충동이 들면 "이미 있는 것을 어떻게 더 정확하게 만들까?"로 바꾼다.
6. **재검증**: 빌드·린트·라우트·금지 패턴·대비·오버플로를 다시 측정한다.

## 2. 세 기둥 (microsoft/frontend-design-review)

- **Frictionless**: 화면마다 주 액션이 1개인가? 핵심 작업이 3회 이내 클릭으로 끝나는가?
- **Quality Craft**: 토큰만 쓰는가? 위계가 크기·정렬·여백으로 만들어졌는가? 초점 표시와 반응형이 살아있는가?
- **Trustworthy**: 샘플/예측/시뮬레이션 라벨이 데이터 옆에 있는가? 오류와 경계가 행동 가능한 문장으로 쓰였는가?

이슈는 **블로커 / 메이저 / 마이너**로 등급을 붙이고, 블로커부터 제거한다.

## 3. AI 디폴트 금지 목록 (anthropic/frontend-design + 프로젝트 규칙)

- ALL-CAPS eyebrow, 가운뎃점 메타(`A · B · C`), `WORD — fragment`, 버튼 끝 `→`
- 동일한 둥근 카드 반복, 카드 안 카드, 기반이 없는 그림자
- 그라데이션, 네온, 글래스, 이모지
- 모노 폰트를 사람이 읽는 문장에 남용
- numbered marker를 시퀀스가 아닌 곳에 붙이기
- 헤어라인 + 모노 + 0 radius만으로 "에디토리얼"이라고 부르기 ← **현재까지의 함정**
- 근거 없는 애니메이션, 스크롤 하이재킹, 커스텀 커서

## 4. AIMW 고유 규칙

- 라이트 모드만. hex는 토큰 파일에만.
- 토큰 10색: paper / sheet / frame / ink / ink-2 / muted / rule / rule-strong / mark / amber
- 본문은 Pretendard, 기계 값(ID·타임코드·수치)만 JetBrains Mono
- 텍스트 대비 4.5:1 이상
- 사용자 직접 로그인만. 시스템 프록시·토큰 입력·자동 동기화·중복 생성 금지
- 실제 비용/입찰/예산 변경은 명시 동의, 1만원 초과·월 누적 10만원 초과는 2차 확인, 기본 상한 0원
- S8은 G1~G4만, 권리 플래그 확인 전 변환·합성 비활성
- S9는 `is_forecast=true`, 소유 계정만, 90일/12개월, S6 복제 금지
- 모듈 링크는 클릭 시에만, ID 참조만

## 5. 산출물

리뷰 결과는 `aimw-design/method/` 아래에 날짜와 함께 기록한다.
항목: 발견한 문제 / 근거 / 등급 / 제거한 것 / 재측정 수치 / 남은 한계.

## 출처

- `anthropics/skills` — frontend-design, canvas-design
- `microsoft/skills` — frontend-design-review (3기둥·검사표)
- 자체 조사 — `aimw-design/reference/REFERENCE-RESEARCH-2026-11-22.md`
