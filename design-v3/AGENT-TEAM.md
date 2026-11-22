# AIMW 전문 에이전트 팀

## 목적
한 명의 에이전트가 기획·디자인·구현·검증을 모두 하면서 생기는 편향을 없앤다. 각 역할이 독립적으로 판단하고, 문서로 충돌을 드러내고, 오케스트레이터가 사용자 지적 원문과 제품 불변 규칙을 기준으로 정리한다.

## 현재 작업의 목표 (사용자 정정 반영)
**개발 구현이 아니라 피그마 재디자인이다.** 새 Figma 파일 `AIMW — 재설계 v8`(key `2Eng17cHRagWHT03nxYuiP`) 안의 기존 골격까지 폐기하고 9화면을 처음부터 새로 디자인한다. Code Layer 업로드용 HTML은 그 수단일 뿐이다.

## 에이전트와 산출물

| 에이전트 | 역할 | 산출물 |
|---|---|---|
| `research` | 외부 스킬·레퍼런스 조사, 출처 명시 | `agents-output/RESEARCH-FINDINGS.md` |
| `survey` | 실제 사용자 발화 수집·요구 변환 | `agents-output/SURVEY-FINDINGS.md` |
| `planner` | IA·화면 역할·카피 기준·불변 규칙 | `agents-output/PLANNER-FINDINGS.md` |
| `designer` | 현재 상태 해부 후 Figma Code Layer용 HTML 전면 재설계 | `figma-import/v8/index.html`, `agents-output/DESIGNER-FINDINGS.md` |
| `frontend` | 구조·접근성·상태·일관성 검증/강화 | `agents-output/FRONTEND-FINDINGS.md`, 필요 시 `figma-import/v8-frontend/index.html` |
| `backend` | 제품 불변 규칙 반영 검증 | `agents-output/BACKEND-FINDINGS.md` |
| `gq` | 품질 게이트 실측, 육안 게이트 관리 | `agents-output/GQ-REPORT.md` |
| `orchestrator` | 호출 순서 조율, 충돌 정리, 최종 후보 확정 | 이 문서 갱신 |

## 호출 순서
1. `research`, `survey` 병렬
2. `planner`, `backend` 병렬 (1의 결과 참조)
3. `designer` (1~2의 결과를 입력으로 전면 재설계)
4. `frontend`, `gq` (3의 결과 검증)
5. `orchestrator` 최종 정리

## 공통 금지
- 기존 디자인 재사용
- 임의 수치·가짜 근거·가짜 설문
- 개발자용 연결 상태 문구
- 자동 검사 통과를 최종 합격으로 선언
- 사용자 요청 없는 커밋·푸시·Figma 업로드

## 설치된 디자인 스킬
`tastemaker`(taste-audit/taste-guard 등), `slop-proof-design`, `ungeneric`, `hallmark`, `impeccable`, 기존 `deslop`/`anti-ai-ui`/`anti-slop-design`.
