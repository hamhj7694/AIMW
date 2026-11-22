# 12. 제작 전 레퍼런스 서치 플레이북 (Reference Search)

영상 제작 전에 **자동(사용자 트리거) + 수동(사용자 입력)** 두 경로로 레퍼런스를 찾고, 출처·타임코드·권리 상태를 보존해 분석 근거로 쓰는 절차.

## 1. 원칙

1. **자동 ≠ 자동 동기화.** "자동"은 사용자가 검색 버튼을 누른 뒤 공개 소스에서 결과를 가져오는 것을 뜻한다. 모듈 진입 시 백그라운드로 남의 데이터를 끌어오지 않는다.
2. **공개 범위만.** 공식 API, 공개 피드, 공개 메타데이터, 사용자 수동 입력. 로그인 필요 영역·유료벽 우회·캡차/지문 우회·불법 스크래핑은 제외.
3. **메타만 저장.** 원문 영상/이미지 바이트는 저장하지 않는다. `source_url`, `thumbnail_url`, `title`, `author`, `published_at`, `timecode`, 스냅샷 URL만 보관.
4. **참고용.** 레퍼런스의 화면·문구·음악을 복제하지 않는다. 분석 결과는 `VideoAnalysis.findings[]`에 개념으로만 기록.
5. **명시적 연결.** S0 Collector 항목을 가져올 때만 `ModuleLink(s0→s8)`를 만든다. `created_by` 필수.

## 2. 두 경로

### KB-REF-001 자동 검색 (사용자 트리거)
정의: 사용자가 키워드·분야·플랫폼·제작 유형을 입력하고 검색을 누르면 어댑터가 공개 소스를 조회해 후보를 만든다.
효과: 수동으로 일일이 찾는 시간을 줄이되, 실행 주체는 사용자다.
적용: `ReferenceSearchService.search(query, mode, platform, limit)`. 1차 어댑터: YouTube Data API v3(`search.list`, 일일 쿼터 주의), 네이버 검색 API(일 25,000건), RSS/Sitemap(`feedparser`), GDELT DOC API, 수동 입력. 광고 라이브러리는 "연동 대기" 스텁.
주의: 쿼터 소진·결과 없음·중복은 빈 상태가 아니라 명시적 상태로 표시한다. 실제 외부 호출은 Phase B, Phase A는 샘플/스텁.
근거: 자체 설계 + 기존 Collector 정책

### KB-REF-002 수동 입력
정의: 사용자가 URL, 메모, 제목, 플랫폼, 타임코드를 직접 입력해 레퍼런스를 추가한다.
효과: 공개 API로 찾지 못한 자료나 사내 자료를 근거로 등록할 수 있다.
적용: 필드 = `source_url`, `title`, `author`, `platform`, `timecode_in/out`, `note`, `rights_note`, `confidence`.
주의: 사용자가 직접 넣은 URL이라도 저작권·ToS 판단은 사용자 책임임을 UI에 안내.
근거: 자체 설계

## 3. 제작 유형별 검색 축

| 유형 | 주요 검색 축 | 수집 시 강조 필드 |
|---|---|---|
| 실사 | 카메라 무빙, 조명 세팅, 렌즈, 구도 | `craft_tags`, `camera`, `lighting`, `shot_size` |
| 숏폼 | 훅 유형, 9:16 구성, 자막 위치, 길이 | `hook_type`, `timecode`, `safe_zone_preset`, `duration` |
| 영화 | 구도, 조명, 색 팔레트, 연속성, 전환 | `composition`, `palette`, `transition`, `continuity` |
| 영상(일반) | 메시지 구조, 인서트, 그래픽 오버레이, 가독성 | `message`, `insert`, `overlay`, `legibility` |
| 애니메이션 | 타이밍, 스쿼시&스트레치, 실루엣, 오버래핑 | `keyframe`, `deform`, `silhouette`, `timing` |
| 모션그래픽 | 이징, 지속시간, 타이포, 레이어, 루프 | `easing`, `duration`, `typography`, `layers` |

## 4. 레퍼런스 카드 최소 스키마

```text
reference_id, source_url, thumbnail_url, platform, title, author,
published_at, timecode_in/out, search_mode(auto/manual),
content_tags[], craft_tags[], production_mode,
evidence_tier(A/B/C), rights_flag(public/manual_unverified),
confidence, kb_refs[], created_by, created_at
```

- `evidence_tier`는 출처 신뢰도, `rights_flag`는 재사용 가능 여부(항상 참고용).
- 중복 제거 키: 정규화 URL + external_id + 콘텐츠 해시(기존 Collector 정책 재사용).
- 미디어 바이트 미저장, 원문 재호스팅 금지.

## 5. 분석으로 넘기는 게이트

1. 레퍼런스 선택(사용자 클릭) → S8 분석 탭에 `VideoAnalysis` 생성.
2. 내용 분석과 기술 분석을 **분리**해 표시. 기술 분석은 유형별 축(위 표)을 따른다.
3. 타사 영상은 메타·스냅샷 URL·타임코드까지만 입력. **프레임 분석은 사용자가 업로드한 자기 콘텐츠에 한정**(Phase B).
4. 분석 카드마다 출처·신뢰도 배지. 신뢰도 낮으면 되묻기.
5. 확정된 분석만 `VideoIntent` 후보가 될 수 있다. 자동으로 콘티를 만들지 않는다.

## 6. 실패·예외 상태

| 상황 | UI 처리 |
|---|---|
| 검색 결과 없음 | "결과 없음" + 키워드/플랫폼 수정 제안 |
| 쿼터 소진 | 남은 호출 수 표시 + 수동 입력 안내 |
| 중복 항목 | "이미 저장됨" 배지 + 기존 카드로 이동 |
| 신뢰도 낮음 | 되묻기 카드, 확정 버튼 비활성 |
| 권리 미확인 | `rights_flag=manual_unverified` 배지, 참고용임을 명시 |
| 외부 API 실패 | 스텁/샘플 결과로 대체하고 "실제 호출 아님" 배지 |

## 7. 수용 기준

- 사용자가 검색을 누르지 않았는데 외부 호출이나 모듈 간 데이터 복사가 발생하면 실패.
- 모든 카드에 출처 URL과 자동/수동 구분이 보이지 않으면 실패.
- 저장된 레퍼런스에서 미디어 바이트가 발견되면 실패.
- 레퍼런스 분석 결과가 사용자 확인 없이 콘티로 넘어가면 실패.
