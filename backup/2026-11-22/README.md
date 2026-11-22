# 로컬 작업 백업 — 2026-11-22

PC 종료에 대비해 GitHub에 없던 로컬 파일을 저장소에 복사한 스냅샷입니다.

## 포함된 것
- `aimw-design/` — 이전 작업 폴더 전체 (figma, method, reference, skills, 문서, tokens.css)
- `aimw-app/` — 앱 저장소 소스 스냅샷 (`node_modules`, `dist`, `.git` 제외). 원본은 `기본 프로젝트\aimw-app`, branch `design/v2`, 로컬 bare remote `기본 프로젝트\..\AIMW.git`
- `skills/` — 세션에 설치된 서드파티 스킬 (hallmark, impeccable, taste-*, slop-proof-design, ungeneric 등)
- `agents/` — 세션용 8개 전문 에이전트 정의

## 포함되지 않은 것
- `node_modules/`, `dist/`, `.git/` — 재생성 가능
- `design-v3/skills/_downloaded/` — 246MB 서드파티 다운로드 캐시, 출처 URL로 복원 가능 (`.gitignore` 처리됨)

## 복원
이 폴더의 하위 디렉터리를 원하는 위치로 복사하면 됩니다. 스킬은 `.opencode/skills/`, 에이전트는 `.opencode/agents/` 아래에 두면 됩니다.
