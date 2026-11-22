# RAG 사용 규칙 (Retrieval & Prompt Grounding)

이 문서는 `planning/knowledge/**`를 AI가 읽는 방식의 계약이다. 실제 구현 코드는 없고, 설계 규약만 정의한다.

## 1. 청크 분할

- **청크 단위 = `### KB-...` 한 항목.** 항목 안의 5줄(정의/효과/적용/주의/근거)은 쪼개지 않는다.
- 각 청크 메타데이터:

```text
chunk_id: KB-CAM-002
domain: camera_movement | composition | lighting | editing | production_design
        | ad_structure | term_mapping | short_form | motion | animation | reference_search
        | seo_growth
production_mode: any | live_action | short_form | film | general_video | animation | motion_graphics
service_module: s8 | s9   # seo_growth 청크는 s9에서만 검색
source_ids: [S01]
evidence_tier: A | B | C
updated: 2026-11-22
path: planning/knowledge/01-camera-movement.md
```

- 한 청크의 길이는 대략 150~350어절. 길어지면 항목을 분리하고 새 ID를 부여한다(기존 ID 재사용 금지).

## 2. 인덱싱 단계

| 단계 | 범위 | 방식 |
|---|---|---|
| Phase A | 마크다운 전문 + `KB-` 앵커 | 로컬 키워드 검색(정확 일치 + 동의어 사전 `07-term-mapping-ko`) |
| Phase B | 동일 청크에 로컬 임베딩 추가 | 임베딩 라이브러리 **라이선스 재확인 후** 도입. 외부 임베딩 API 미사용. |
| Phase C | 재랭킹 + 개인화(사용자 승인 용어 사전 가중치) | 프라이버시 게이트 후에만 |

> 저장소에 포함되지 않는 로컬 캡처 자료는 인덱싱하지 않는다. 라이선스 미확인 + 경로 의존 배제. 인덱싱 대상은 `planning/knowledge/**`의 자체 저작 문서뿐이다.

## 3. 검색 파이프라인

```text
사용자 입력
  → (1) 제작 유형 확인 (미선택이면 먼저 선택 요청)
  → (2) 자연어 정규화 (07-term-mapping-ko로 표준어 확장)
  → (3) 도메인/유형 필터 (production_mode ∈ {any, 현재 유형})
  → (4) 근거 등급 필터 (C는 경고와 함께만 포함)
  → (5) top-k 검색
  → (6) 프롬프트 조립 (아래 템플릿)
  → (7) 사용자 확인 게이트
  → (8) VideoIntent / Storyboard 반영
```

- `TermMapping.confidence < 0.5`이면 검색 결과와 무관하게 되묻기를 먼저 출력한다.
- 등급 C만으로는 `VideoIntent`를 확정할 수 없다.

## 4. 프롬프트 조립 템플릿

```text
[시스템]
너는 아래 [근거]에만 기반해 답한다.
- 근거에 없는 내용은 "미확인"이라고 쓴다.
- 근거 문장을 2문장 이상 연속으로 그대로 재현하지 않는다. 표·도식도 복제하지 않는다.
- 모든 주장 뒤에 [KB-ID / Sxx / 등급]을 붙인다.
- 등급 C는 "비공식 추정, 확인 필요"를 함께 붙인다.
- 영상 렌더·외부 전송·모듈 간 데이터 복사는 실행하지 않는다. 제안만 한다.

[근거]
- KB-CAM-002 / S01 / A / planning/knowledge/01-camera-movement.md
  정의: ... 적용: ... 주의: ...
- KB-AD-005 / S10 / A / planning/knowledge/06-ad-structure-and-platform-specs.md
  정의: ... 적용: ... 주의: ...

[사용자 입력]
원문: "..."
제작 유형: short_form
매핑 후보: 원문 → 표준용어 (신뢰도 ...)

[요청 출력]
1) 매핑표(원문/표준어/근거/신뢰도)
2) 되묻기 질문(필요 시)
3) 콘티 초안(게이트 1만)
```

## 5. 근거 표시 규칙

- UI의 모든 분석 카드에 `출처 ID + 등급`을 노출한다.
- 등급 A/B: 일반 서술 가능. 등급 C: 반드시 "검증 필요" 배지.
- 사용자가 근거를 클릭하면 `planning/knowledge/<파일>`의 해당 `KB-` 항목으로 이동(로컬 문서 링크).
- `rationale`에 "KB-ID 조합"을 남겨 감사 로그로 쓴다.

## 6. 금지 사항

- 원문 복제·번역·각색. 특히 S04는 서면 허가 필요 문서.
- 캡처 자산을 근거로 쓰기.
- 근거 없이 장비·가격·플랫폼 수치를 단정하기.
- 매핑 미확정 상태에서 콘티/렌더 진행.
- 자동 전체 렌더, 자동 모듈 동기화.

## 7. 품질 검증

- 유형별 3개씩(6유형 × 3 = 18) + 매핑 되묻기 2개 = **20개 QA 세트**를 만든다.
- 각 답변에 대해 (a) 근거 ID 존재, (b) 등급 표기, (c) 미확인 처리, (d) 원문 연속 인용 없음, (e) 게이트 준수를 검사.
- 플랫폼 스펙(C등급 수치)은 분기별 재확인 시 QA 세트도 갱신.

## 8. S8 서비스 매핑

| 서비스 | 사용 KB | 목적 |
|---|---|---|
| `VideoAnalysisService` | 01~06, 10~12 | 내용/기술 2계층 분석 구조화 |
| `VideoTermService` | 07, 01~06, 10~11 | 자연어→전문용어 + 되묻기 |
| `StoryboardService` | 01~06, 10~11 | 샷 필드(카메라·조명·전환·구도) 채움 |
| `ShotRenderService` | 10~11 | 유형별 게이트/프리셋 검증 |
| `RevisionService` | 04, 07, 12 | 수정 의도 해석 + 영향 범위 |
| `ReferenceSearchService` | 12 | 검색 축·스키마·게이트 |
