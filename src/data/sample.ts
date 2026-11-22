export type Vertical = 'all' | 'video' | 'image' | 'blog' | 'news'

export type CollectedItem = {
  id: string
  vertical: Exclude<Vertical, 'all'>
  title: string
  source: string
  method: '공개 페이지' | 'RSS' | '수동 입력'
  publishedAt: string
  url: string
  hook: string
}

export const collectedItems: CollectedItem[] = [
  {
    id: 'col-001',
    vertical: 'video',
    title: '프로모션 훅 숏폼 A',
    source: '공개 영상 페이지',
    method: '공개 페이지',
    publishedAt: '2026-11-20',
    url: 'https://source.example/video/001',
    hook: '첫 3초 후킹',
  },
  {
    id: 'col-002',
    vertical: 'image',
    title: '비교 혜택 배너',
    source: '공개 광고 페이지',
    method: '공개 페이지',
    publishedAt: '2026-11-19',
    url: 'https://source.example/image/002',
    hook: '혜택 강조',
  },
  {
    id: 'col-003',
    vertical: 'blog',
    title: '선택 기준 비교 콘텐츠',
    source: '공개 블로그 RSS',
    method: 'RSS',
    publishedAt: '2026-11-18',
    url: 'https://source.example/blog/003',
    hook: '선택 기준 정리',
  },
  {
    id: 'col-004',
    vertical: 'news',
    title: '시장 동향 기사',
    source: '공개 뉴스 피드',
    method: 'RSS',
    publishedAt: '2026-11-17',
    url: 'https://source.example/news/004',
    hook: '흐름 요약',
  },
]

export const flowItems: Record<string, { id: string; label: string; detail: string }[]> = {
  s1: [
    { id: 'ref-1', label: '경쟁사 그룹 A', detail: '훅과 자막 패턴 12건 / 유사도 0.82' },
    { id: 'ref-2', label: '경쟁사 그룹 B', detail: '가격 강조 카피 8건 / 유사도 0.76' },
  ],
  s2: [
    { id: 'brief-1', label: 'F3 브리프 초안', detail: '타깃과 메시지, 금지표현 포함 (샘플)' },
    { id: 'copy-1', label: 'F4 카피 변형 3종', detail: '룰 기반 변형 / 실제 생성 없음' },
    { id: 'review-1', label: 'F5 검수 체크리스트', detail: '근거와 권리, 표현 점수 항목' },
  ],
  s3: [{ id: 'pub-1', label: 'Dry-run 발행 큐', detail: '예약과 상태만 재현 / 외부 전송 0건' }],
  s4: [{ id: 'ins-1', label: 'F7 다음 제안', detail: '샘플 지표 기반 개선 후보 / 예측 아님' }],
}

export const productionModes = [
  { id: 'live', label: '실사' },
  { id: 'short_form', label: '숏폼' },
  { id: 'film', label: '영화' },
  { id: 'video', label: '영상' },
  { id: 'animation', label: '애니메이션' },
  { id: 'motion', label: '모션그래픽' },
] as const

export const sourceModes = [
  { id: 'generate_new', label: '신규 생성' },
  { id: 'transform_source', label: '기존 미디어 변환·수정' },
  { id: 'composite', label: '여러 소스 합성' },
] as const

export const gates = [
  { id: 'G1', label: '콘티' },
  { id: 'G2', label: '구도 스키마' },
  { id: 'G3', label: '애니매틱' },
  { id: 'G4', label: '단계별 렌더' },
] as const
