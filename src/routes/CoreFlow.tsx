import { useState } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, ProgressLine } from '../components/ui'
import { BarChart, CalendarStrip, DocumentLines, MediaThumb, ShotFrame } from '../components/Visuals'
import { flowItems } from '../data/sample'

type NextLink = { to: string; label: string }

function FlowKpis({ count, next }: { count: number; next?: NextLink }) {
  return (
    <div className="kpi-grid">
      <Kpi label="단계 수" value={count} detail="샘플 기준" />
      <Kpi label="샘플 결과" value={count} detail="실제 생성 아님" tone="sample" />
      <Kpi label="외부 전송" value="0건" detail="Dry-run 유지" tone="ok" />
      <Kpi label="다음 모듈" value={next ? next.to.toUpperCase() : '없음'} detail="클릭 시에만 링크" tone="warn" />
    </div>
  )
}

function FlowLinkPanel({ code, next }: { code: string; next?: NextLink }) {
  return (
    <Panel title="모듈 연결" aside={<Badge>기본값: 연결 안 함</Badge>}>
      {next ? (
        <LinkButton from={code.toLowerCase()} to={next.to}>
          {next.label}
        </LinkButton>
      ) : (
        <p className="hint">다음 단계 없음. 독립 라우트로 동작합니다.</p>
      )}
      <p className="hint">링크는 ID 참조만 생성하며 원본 데이터를 복사하지 않습니다.</p>
      <LinkChips module={code.toLowerCase()} />
    </Panel>
  )
}

const referenceTiles = [
  { id: 'r1', group: 'A', kind: 'video', label: '숏폼 훅', tag: '첫 3초', score: 82, scene: 0 },
  { id: 'r2', group: 'A', kind: 'video', label: '자막 리듬', tag: '2줄 자막', score: 78, scene: 1 },
  { id: 'r3', group: 'A', kind: 'blog', label: '비교 표', tag: '선택 기준', score: 74, scene: 2 },
  { id: 'r4', group: 'B', kind: 'image', label: '혜택 배너', tag: '가격 강조', score: 76, scene: 0 },
  { id: 'r5', group: 'B', kind: 'news', label: '시장 요약', tag: '수치 강조', score: 69, scene: 1 },
  { id: 'r6', group: 'B', kind: 'image', label: '카드 형식', tag: '반복 패턴', score: 71, scene: 2 },
] as const

export function S1References() {
  const [group, setGroup] = useState<'all' | 'A' | 'B'>('all')
  const shown = referenceTiles.filter((tile) => group === 'all' || tile.group === group)
  const groups = flowItems.s1

  return (
    <>
      <PageHeader
        code="S1"
        eyebrow="레퍼런스 보드"
        title="레퍼런스 탐색"
        description="경쟁사 크리에이티브를 그룹화하고 태깅해 반복 패턴을 확인합니다."
        badges={[
          <Badge key="sample" tone="sample">샘플 참고 자료</Badge>,
          <Badge key="scope">공개 범위 / 원문 링크만 보관</Badge>,
          <Badge key="dry" tone="dry">프레임 다운로드 없음</Badge>,
        ]}
      />
      <FlowKpis count={groups.length} next={{ to: 's2', label: 'S2에서 F3 브리프 만들기' }} />

      <Panel title="콘택트 시트" aside={<Badge>{shown.length}개 참고 자료</Badge>}>
        <div className="board-toolbar">
          <span className="desk-label">그룹 필터</span>
          {(['all', 'A', 'B'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className={group === id ? 'is-active' : ''}
              onClick={() => setGroup(id)}
            >
              {id === 'all' ? '전체' : `그룹 ${id}`}
            </button>
          ))}
        </div>
        <div className="reference-board">
          {shown.map((tile) => (
            <article className="ref-tile" key={tile.id}>
              <div className="ref-tile__visual">
                {tile.kind === 'video' ? (
                  <ShotFrame index={tile.scene} />
                ) : (
                  <MediaThumb kind={tile.kind} />
                )}
              </div>
              <div className="ref-tile__body">
                <strong>{tile.label}</strong>
                <span>그룹 {tile.group} / {tile.tag}</span>
                <span>유사도 {tile.score}%</span>
              </div>
            </article>
          ))}
        </div>
        <p className="hint">이미지와 영상은 원문 메타만 참조합니다. 프레임 분석이나 미디어 저장을 하지 않습니다.</p>
      </Panel>

      <Panel title="반복 패턴 메모" aside={<Badge tone="sample">샘플 그룹 2개</Badge>}>
        <div className="pattern-grid">
          {groups.map((item) => (
            <article className="pattern-card" key={item.id}>
              <strong>{item.label}</strong>
              <p>{item.detail}</p>
              <ProgressLine label="패턴 유사도" value={item.id === 'ref-1' ? 82 : 76} />
            </article>
          ))}
        </div>
      </Panel>
      <FlowLinkPanel code="S1" next={{ to: 's2', label: 'S2에서 F3 브리프 만들기' }} />
    </>
  )
}

const draftSections = {
  F3: {
    label: 'F3 브리프 초안',
    text: '타깃: 서비스 비용을 비교하는 사람\n핵심 메시지: 선택 기준을 먼저 제시한다\n금지 표현: 최저가, 보장, 1등',
  },
  F4: {
    label: 'F4 카피 변형',
    text: '변형 A: 비용보다 먼저 확인할 3가지\n변형 B: 비교표로 끝내는 선택 기준\n변형 C: 실제 후기에서 찾은 공통 질문',
  },
  F5: {
    label: 'F5 검수 체크리스트',
    text: '근거: 공개 범위 출처가 있는가\n권리: 이미지와 문구 출처를 확인했는가\n표현: 예측을 단정하지 않았는가',
  },
} as const

const copyVariants = [
  { id: 'A', title: '비용 비교형', body: '가격보다 먼저 볼 기준 3가지' },
  { id: 'B', title: '선택 기준형', body: '비교표로 정리하는 서비스 선택' },
  { id: 'C', title: '후기 요약형', body: '실사용자가 반복해서 묻는 질문' },
]

export function S2Studio() {
  const [section, setSection] = useState<keyof typeof draftSections>('F3')
  const [draft, setDraft] = useState<string>(draftSections.F3.text)
  const [checks, setChecks] = useState([true, false, false])

  function selectSection(next: keyof typeof draftSections) {
    setSection(next)
    setDraft(draftSections[next].text)
  }

  return (
    <>
      <PageHeader
        code="S2"
        eyebrow="글쓰기 데스크"
        title="브리프, 카피, 검수"
        description="F3부터 F5까지 브리프 초안, 카피 변형, 검수 체크리스트를 한 문서에서 다룹니다."
        badges={[
          <Badge key="sample" tone="sample">룰 기반 샘플</Badge>,
          <Badge key="dry" tone="dry">자동 생성 없음 / 저장 없음</Badge>,
        ]}
      />
      <FlowKpis count={3} next={{ to: 's3', label: 'S3에서 F6 Dry-run 발행' }} />

      <Panel title="문서 작업대" aside={<Badge tone="sample">{draftSections[section].label}</Badge>}>
        <div className="writing-desk">
          <div className="writing-outline">
            <span className="desk-label">문서 목차</span>
            {(Object.keys(draftSections) as (keyof typeof draftSections)[]).map((id) => (
              <button
                key={id}
                type="button"
                className={section === id ? 'is-active' : ''}
                onClick={() => selectSection(id)}
              >
                <span>{id}</span>
                <strong>{draftSections[id].label}</strong>
              </button>
            ))}
          </div>
          <div className="writing-canvas">
            <div className="writing-canvas__head">
              <DocumentLines rows={2} />
              <div>
                <strong>{draftSections[section].label}</strong>
                <span>공백 포함 {draft.length}자 / 편집만 가능</span>
              </div>
            </div>
            <textarea
              className="manuscript"
              aria-label={`${draftSections[section].label} 본문`}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
            <p className="hint">입력은 현재 화면에만 유지되며 서버 저장이나 외부 전송을 하지 않습니다.</p>
          </div>
          <div className="writing-review">
            <span className="desk-label">검수 항목</span>
            {['근거 확인', '권리 확인', '표현 점검'].map((label, index) => (
              <label className="review-check" key={label}>
                <input
                  type="checkbox"
                  checked={checks[index]}
                  onChange={() => setChecks((prev) => prev.map((v, i) => (i === index ? !v : v)))}
                />
                <span>{label}</span>
              </label>
            ))}
            <div className="review-stamp">F5 검수 대기</div>
          </div>
        </div>
      </Panel>

      <Panel title="카피 변형 후보" aside={<Badge tone="dry">룰 기반 / 실제 생성 아님</Badge>}>
        <div className="copy-grid">
          {copyVariants.map((variant) => (
            <article className="copy-variant" key={variant.id}>
              <span className="copy-variant__id">변형 {variant.id}</span>
              <strong>{variant.title}</strong>
              <p>{variant.body}</p>
            </article>
          ))}
        </div>
      </Panel>
      <FlowLinkPanel code="S2" next={{ to: 's3', label: 'S3에서 F6 Dry-run 발행' }} />
    </>
  )
}

const publishSlots = [
  { day: '11.24', title: '블로그 콘텐츠', status: '예약 대기' },
  { day: '11.26', title: '숏폼 카피', status: '상태 재현' },
  { day: '11.28', title: '뉴스레터 초안', status: '검수 대기' },
]

export function S3Publishing() {
  const [selected, setSelected] = useState(0)

  return (
    <>
      <PageHeader
        code="S3"
        eyebrow="발행 스케줄러"
        title="Dry-run 발행"
        description="실제 게시나 외부 전송 없이 예약과 상태만 재현합니다."
        badges={[
          <Badge key="dry" tone="dry">Dry-run / 실제 전송 없음</Badge>,
          <Badge key="sample" tone="sample">샘플 큐 3건</Badge>,
        ]}
      />
      <FlowKpis count={flowItems.s3.length} next={{ to: 's4', label: 'S4에서 F7 인사이트 보기' }} />

      <Panel title="발행 달력" aside={<Badge>2026년 11월 / 샘플</Badge>}>
        <div className="calendar-desk">
          <div className="calendar-desk__strip">
            <CalendarStrip marked={[1, 3, 5]} />
            <p className="hint">표시된 날짜는 Dry-run 예약 후보입니다.</p>
          </div>
          <div className="calendar-slots">
            {publishSlots.map((slot, index) => (
              <button
                key={slot.day}
                type="button"
                className={`calendar-slot${selected === index ? ' calendar-slot--active' : ''}`}
                onClick={() => setSelected(index)}
              >
                <span>{slot.day}</span>
                <strong>{slot.title}</strong>
                <small>{slot.status}</small>
              </button>
            ))}
          </div>
        </div>
      </Panel>

      <Panel title="선택된 Dry-run 항목" aside={<Badge tone="dry">{publishSlots[selected].status}</Badge>}>
        <div className="publish-detail">
          <div className="publish-detail__doc"><DocumentLines rows={5} /></div>
          <div className="publish-detail__meta">
            <strong>{publishSlots[selected].title}</strong>
            <p className="hint">{flowItems.s3[0].detail}</p>
            <ol className="publish-steps">
              <li><span>01</span>예약 값 확인</li>
              <li><span>02</span>상태 재현</li>
              <li><span>03</span>외부 전송 0건</li>
            </ol>
          </div>
        </div>
      </Panel>
      <FlowLinkPanel code="S3" next={{ to: 's4', label: 'S4에서 F7 인사이트 보기' }} />
    </>
  )
}

export function S4Insights() {
  const suggestion = flowItems.s4[0]

  return (
    <>
      <PageHeader
        code="S4"
        eyebrow="성과 리포트"
        title="지표와 개선안"
        description="샘플 지표를 집계하고 다음 개선 후보를 제시합니다. 예측값이 아닙니다."
        badges={[
          <Badge key="sample" tone="sample">샘플 지표</Badge>,
          <Badge key="actual" tone="warn">예측 아님 / 실제 계정 아님</Badge>,
        ]}
      />
      <FlowKpis count={1} next={{ to: 's2', label: 'S2에서 개선 브리프 만들기' }} />

      <Panel title="지표 추이" aside={<Badge>샘플 8주</Badge>}>
        <div className="report-chart">
          <BarChart values={[38, 45, 41, 52, 49, 61, 58, 72]} />
          <div className="report-chart__summary">
            <strong>+34%</strong>
            <span>샘플 기준 변화 / 예측 아님</span>
          </div>
        </div>
      </Panel>

      <Panel title="개선 후보" aside={<Badge tone="sample">샘플 1건</Badge>}>
        <article className="insight-row">
          <span className="insight-row__mark">F7</span>
          <div>
            <strong>{suggestion.label}</strong>
            <p className="hint">{suggestion.detail}</p>
          </div>
          <ProgressLine label="근거 명확성" value={72} />
        </article>
      </Panel>
      <FlowLinkPanel code="S4" next={{ to: 's2', label: 'S2에서 개선 브리프 만들기' }} />
    </>
  )
}
