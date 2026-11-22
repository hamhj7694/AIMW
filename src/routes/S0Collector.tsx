import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Badge,
  Kpi,
  LinkButton,
  LinkChips,
  PageHeader,
  Panel,
  ProgressLine,
  Sparkline,
  StateLine,
} from '../components/ui'
import { MediaThumb } from '../components/Visuals'
import { collectedItems, type CollectedItem, type Vertical } from '../data/sample'

const verticals: { id: Vertical; label: string; kind: 'video' | 'image' | 'blog' | 'news' }[] = [
  { id: 'all', label: '전체', kind: 'video' },
  { id: 'video', label: '영상 광고', kind: 'video' },
  { id: 'image', label: '이미지 광고', kind: 'image' },
  { id: 'blog', label: '블로그', kind: 'blog' },
  { id: 'news', label: '뉴스', kind: 'news' },
]

type ViewState = '빈 상태' | '로딩' | '성공' | '실패'

export function S0Collector() {
  const [params, setParams] = useSearchParams()
  const rawVertical = params.get('vertical') as Vertical | null
  const vertical: Vertical = verticals.some((item) => item.id === rawVertical)
    ? (rawVertical as Vertical)
    : 'all'
  const [items, setItems] = useState<CollectedItem[]>(collectedItems)
  const [keywords, setKeywords] = useState<string[]>([])
  const [keyword, setKeyword] = useState('')
  const [selected, setSelected] = useState<string[]>([])
  const [viewState, setViewState] = useState<ViewState>('성공')

  const counts = useMemo(() => {
    const base = { all: items.length, video: 0, image: 0, blog: 0, news: 0 }
    for (const item of items) base[item.vertical] += 1
    return base
  }, [items])

  const shown = vertical === 'all' ? items : items.filter((item) => item.vertical === vertical)
  const manualCount = items.filter((item) => item.method === '수동 입력').length

  function selectVertical(next: Vertical) {
    const updated = new URLSearchParams(params)
    updated.set('vertical', next)
    setParams(updated)
  }

  function addKeyword() {
    const value = keyword.trim()
    if (!value || keywords.includes(value) || keywords.length >= 8) return
    setKeywords((previous) => [...previous, value])
    setKeyword('')
  }

  function collect() {
    const label = keywords[0] ?? '수동 수집'
    const target = vertical === 'all' ? 'blog' : vertical
    setItems((previous) => [
      ...previous,
      {
        id: `col-local-${previous.length + 1}`,
        vertical: target,
        title: `${label} 수동 수집 항목`,
        source: '수동 입력',
        method: '수동 입력',
        publishedAt: '2026-11-22',
        url: 'https://source.example/manual',
        hook: '공개 범위 수동 입력',
      },
    ])
    setViewState('성공')
  }

  function toggle(id: string) {
    setSelected((previous) =>
      previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id],
    )
  }

  return (
    <>
      <PageHeader
        code="S0"
        eyebrow="공개 자료 수집함"
        title="공개 범위 수집"
        description="분야와 키워드를 등록하고 공개 페이지, RSS, 수동 입력으로 자료를 모읍니다. 로그인과 유료벽 우회는 없습니다."
        badges={[
          <Badge key="scope">공개 범위만 / robots.txt ToS 준수</Badge>,
          <Badge key="sample" tone="sample">샘플 데이터</Badge>,
          <StateLine key="state" state={viewState} />,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="전체 수집 항목" value={items.length} detail="공개 범위 소스만 집계" />
        <Kpi label="활성 수집 파트" value="4" detail="영상 / 이미지 / 블로그 / 뉴스" tone="ok" />
        <Kpi label="수동 입력" value={manualCount} detail="사용자가 직접 등록한 항목" tone="sample" />
        <Kpi label="차단 저장 제외" value="0" detail="로그인과 유료벽 영역 제외" tone="warn" />
      </div>

      <Panel title="수집 대상 등록" aside={<Badge tone="ok">수동 입력 / RSS 항상 사용 가능</Badge>}>
        <div className="intake-desk">
          <div className="intake-form">
            <label className="field">
              분야 또는 키워드
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addKeyword()
                  }
                }}
                placeholder="입력 후 Enter"
              />
            </label>
            <label className="field">
              우리 서비스 URL
              <input placeholder="https://" />
            </label>
            <label className="field">
              경쟁사 도메인
              <input placeholder="도메인 입력" />
            </label>
            <div className="intake-actions">
              <button type="button" className="button" onClick={addKeyword}>
                키워드 추가
              </button>
              <button type="button" className="button button--primary" onClick={collect}>
                공개 범위 수집
              </button>
            </div>
            <div className="keyword-tags">
              {keywords.length === 0 ? (
                <span className="hint" style={{ margin: 0 }}>등록된 키워드 없음. 입력을 시작하세요.</span>
              ) : (
                keywords.map((item) => (
                  <span className="keyword-tag" key={item}>
                    {item}
                    <button type="button" onClick={() => setKeywords((prev) => prev.filter((k) => k !== item))} aria-label="키워드 제거">
                      ×
                    </button>
                  </span>
                ))
              )}
            </div>
          </div>
          <div className="intake-sources">
            <span className="desk-label">수집 파트 선택</span>
            <div className="source-grid">
              {verticals.slice(1).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={vertical === item.id}
                  className={`source-choice${vertical === item.id ? ' source-choice--active' : ''}`}
                  onClick={() => selectVertical(item.id)}
                >
                  <MediaThumb kind={item.kind} />
                  <span>{item.label}</span>
                  <strong>{counts[item.id]}</strong>
                </button>
              ))}
            </div>
            <p className="hint">API 키가 없는 소스는 &quot;연동 대기&quot;로 표시하고 실제 호출하지 않습니다.</p>
          </div>
        </div>
      </Panel>

      <section className="section-row">
        <Panel title="수집 추이" aside={<Badge>최근 7일</Badge>}>
          <div className="row row--between">
            <Sparkline values={[3, 5, 4, 7, 6, 9, 11]} />
            <div>
              <strong style={{ fontSize: 22 }}>+18%</strong>
              <p className="hint" style={{ margin: 0 }}>샘플 흐름 / 실제 호출 없음</p>
            </div>
          </div>
        </Panel>
        <Panel title="공개 범위 준수" aside={<Badge tone="ok">정상</Badge>}>
          <ProgressLine label="robots.txt / ToS 확인" value={100} />
          <ProgressLine label="개인정보 필터" value={100} />
        </Panel>
        <Panel title="화면 상태" aside={<StateLine state={viewState} />}>
          <div className="status-switch">
            {(['빈 상태', '로딩', '성공', '실패'] as ViewState[]).map((state) => (
              <button
                key={state}
                type="button"
                className={viewState === state ? 'is-active' : ''}
                onClick={() => setViewState(state)}
              >
                {state}
              </button>
            ))}
          </div>
        </Panel>
      </section>

      <Panel title="수집 큐" aside={<Badge>{shown.length}건 표시 중</Badge>}>
        <div className="vertical-tabs" role="tablist" aria-label="수집 파트">
          {verticals.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={vertical === item.id}
              className={`vertical-tab${vertical === item.id ? ' vertical-tab--active' : ''}`}
              onClick={() => selectVertical(item.id)}
            >
              <span className="vertical-tab__label">{item.label}</span>
              <span className="vertical-tab__count">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        {viewState !== '성공' ? (
          <div className="empty-state">
            <div>
              <strong>{viewState === '빈 상태' ? '수집 결과가 없습니다' : viewState === '로딩' ? '수집 중' : '일부 항목 차단'}</strong>
              <p>
                {viewState === '빈 상태'
                  ? '분야와 키워드를 등록하면 공개 범위 자료가 여기에 표시됩니다.'
                  : viewState === '로딩'
                    ? '중복 skip / 대기 상태를 표시합니다.'
                    : '차단 사유를 명시하고 해당 항목은 저장하지 않습니다.'}
              </p>
            </div>
          </div>
        ) : (
          <div className="collect-queue">
            {shown.map((item) => (
              <article className="queue-row" key={item.id}>
                <MediaThumb kind={item.vertical} />
                <div className="queue-row__main">
                  <strong>{item.title}</strong>
                  <span>{item.source}</span>
                  <span>후킹 후보: {item.hook}</span>
                </div>
                <div className="queue-row__meta">
                  <span>{item.method}</span>
                  <span>{item.publishedAt}</span>
                </div>
                <label className="queue-row__pick">
                  <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)} />
                  S1 이관
                </label>
              </article>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="모듈 연결" aside={<Badge>{selected.length}개 선택</Badge>}>
        <LinkButton from="s0" to="s1">선택 항목을 S1에서 분석</LinkButton>
        <p className="hint">원본 URL과 수집 소스, 수집 시각 메타를 보존하며 클릭 시 링크만 생성합니다.</p>
        <LinkChips module="s0" />
      </Panel>
    </>
  )
}
