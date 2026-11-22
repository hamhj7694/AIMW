# AIMW — AI Marketing AX Workspace

Craft Anything 레퍼런스 7종을 분석해 도출한 **기획·설계 문서 저장소**입니다.
현재 단계는 **분석·설계 완료 / 구현 착수 전**이며, 실제 웹앱 코드는 포함되어 있지 않습니다.

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
| `planning/PRD.md` | 제품 요구사항 (v0.4) |
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
