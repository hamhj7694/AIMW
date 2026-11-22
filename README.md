# AIMW — AI Marketing AX Workspace

Craft Anything 레퍼런스 7종을 분석해 도출한 **기획·설계 문서 저장소**입니다.
현재 단계는 **기획 확정(2026-11-22) / 구현 착수 전**이며, 실제 웹앱 코드는 포함되어 있지 않습니다. 미확정 정책 29건은 `planning/DECISION-LOG.md` J장에서 최종 확정됐고, 계정 소유·API 키 발급 같은 외부 사실 확인만 실행 전에 남아 있습니다.

## 포함 범위

- `planning/` — 연구(research), 디자인(design), PRD, 아키텍처, 구현 계획, 의사결정 로그
- 로컬 전용 참고 캡처 자료는 **저장소에 포함하지 않습니다.** 타사 서비스 자료(라이선스 미확인)이므로 로컬에서만 참고용으로 보관하며, 모든 문서는 그 경로에 의존하지 않습니다.

## 문서 목록

| 경로 | 내용 |
|---|---|
| `planning/research/SOURCE-INVENTORY.md` | 참고 자산 규모·구성 요약(555개, 경로 의존 없음) |
| `planning/research/REFERENCE-AUDIT.md` | 서비스별 출처·등급 감사 |
| `planning/research/FEATURE-MATRIX.md` | 기능 채택 매트릭스 |
| `planning/research/COMPOSITION-PLAN.md` | 점수·조합 계획 |
| `planning/design/DESIGN-PLAN.md` | 디자인 시스템·IA |
| `planning/design/SCREEN-SPECS.md` | 화면 명세 |
| `planning/COMPONENT-SPECS.md` | 컴포넌트 명세 |
| `planning/PRD.md` | 제품 요구사항 (v0.5) |
| `planning/ARCHITECTURE.md` | 아키텍처 |
| `planning/IMPLEMENTATION-PLAN.md` | 1~2일 MVP 실행 계획 |
| `planning/DECISION-LOG.md` | 의사결정 로그 |
| `planning/design/PRODUCTION-MODE-SPECS.md` | 제작 유형 6종(실사/숏폼/영화/영상/애니메이션/모션그래픽) 명세 |
| `planning/design/SEO-GROWTH-SPECS.md` | S9 SEO 화면·컴포넌트·상태·수용 기준 |
| `planning/research/UIUX-RULES-FROM-REFERENCES.md` | 공개 서비스 관찰을 자체 원칙으로 재서술한 UI/UX 규칙 |
| `planning/design/DESIGN-GOVERNANCE.md` | 규칙 우선순위·문서 소유·변경 게이트·구현 전 체크리스트 |
| `planning/knowledge/` | 전문가 지식 베이스(출처·등급·RAG 규칙). 로컬 캡처와 무관한 자체 저작 |

## 핵심 원칙

- 캡처 자산은 **참고용**이며 코드·마크업을 복제하지 않습니다(직접 코드 재사용 0건).
- 모듈(S0/S5/S6/S7/S8/S9)은 독립 라우트·독립 데이터를 가지며, 연결은 사용자 명시적 클릭으로만 생성됩니다.
- 다른 작업 환경에서도 문서가 성립하도록 로컬 전용 파일 경로·파일명·링크는 기획 문서에 적지 않습니다.
- 발행·과금·실제 영상 렌더는 MVP에서 Dry-run/스텁이며, 외부 API를 실행하지 않습니다.
- 계정 연동은 **사용자가 직접 로그인/OAuth**로 합니다. 실제 비용·비딩은 **매번 사람의 동의** 후에만 실행되고, 단일 10,000원·월 누적 100,000원 초과 시 2차 확인 팝업이 뜹니다.
