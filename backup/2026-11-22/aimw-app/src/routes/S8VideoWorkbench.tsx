import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, ProgressLine } from '../components/ui'
import { ShotFrame, Waveform } from '../components/Visuals'
import { gates, productionModes, sourceModes } from '../data/sample'

type WorkbenchTab = 'analysis' | 'production' | 'revision'
type Scope = 'whole' | 'segment' | 'frame'
type Revision = {
  shotId: string
  timecode: string
  detail: string
  scope: Scope
}

const VIDEO_SECONDS = 10

const modeGateNote: Record<string, string> = {
  live: '샷사이즈 / 3D 조명 스키마 / 저해상도 / 샷 단위 렌더',
  short_form: '9:16 재구도 / 세이프존 / 자막 확인 / 샷 단위 렌더',
  film: '팔레트 / 연속성 / 색 확인 / 샷 단위 렌더',
  video: '인서트 / 레이아웃 / 오버레이 / 샷 단위 렌더',
  animation: '키프레임 / 키프레임 시트 / 타이밍 / 샷 단위 렌더',
  motion: '레이어 / 모션 스펙 / 이징 확인 / 샷 단위 렌더',
}

const timelineTracks = [
  { label: '영상', bars: [{ left: 0, width: 34, tone: 'ink' }, { left: 35, width: 30, tone: 'ink' }] },
  { label: '자막', bars: [{ left: 6, width: 18, tone: 'red' }, { left: 38, width: 22, tone: 'red' }] },
  { label: '오디오', bars: [{ left: 2, width: 62, tone: 'rule' }] },
] as const

const scopeLabels: Record<Scope, string> = {
  whole: '전체 영상',
  segment: '구간 / 씬',
  frame: '프레임 / 콘티',
}

function formatTimecode(value: number) {
  const safe = Math.max(0, Math.min(VIDEO_SECONDS, value))
  const minutes = Math.floor(safe / 60)
  const seconds = Math.floor(safe % 60)
  const millis = Math.round((safe % 1) * 1000)
  const pad = (n: number, width = 2) => String(n).padStart(width, '0')
  return `00:${pad(minutes)}:${pad(seconds)}.${pad(millis, 3)}`
}

function formatRange(start: number, end: number) {
  return `${formatTimecode(start)} ~ ${formatTimecode(end)}`
}

function clamp(value: number, min = 0, max = VIDEO_SECONDS) {
  return Math.max(min, Math.min(max, value))
}

function shotNumber(id: string) {
  const parsed = Number.parseInt(id.replace(/\D/g, ''), 10)
  return Number.isFinite(parsed) ? parsed : 1
}

export function S8VideoWorkbench() {
  const [params] = useSearchParams()
  const requestedTab = params.get('tab')
  const requestedScope = params.get('scope')
  const requestedStart = Number(params.get('start'))
  const requestedEnd = Number(params.get('end'))
  const initialRange = {
    start: clamp(Number.isFinite(requestedStart) && params.get('start') ? requestedStart : 2),
    end: clamp(Number.isFinite(requestedEnd) && params.get('end') ? requestedEnd : 4),
  }

  const [tab, setTab] = useState<WorkbenchTab>(requestedTab === 'revision' || requestedTab === 'analysis' ? requestedTab : 'production')
  const [scope, setScope] = useState<Scope>(
    requestedScope === 'whole' || requestedScope === 'frame' || requestedScope === 'segment' ? requestedScope : 'frame',
  )
  const [mode, setMode] = useState<string | null>(null)
  const [sourceMode, setSourceMode] = useState<string>('generate_new')
  const [rightsDialogOpen, setRightsDialogOpen] = useState(false)
  const [rightsFlag, setRightsFlag] = useState(false)
  const [confirmedBy, setConfirmedBy] = useState('')
  const [operator, setOperator] = useState('')
  const [approvals, setApprovals] = useState<Record<string, string>>({})
  const [range, setRange] = useState(initialRange)
  const [shotId, setShotId] = useState(
    params.get('shot') ?? (requestedScope === 'whole' ? 'ALL' : requestedScope === 'frame' ? 'SH-02' : 'SH-01'),
  )
  const [timecodeText, setTimecodeText] = useState(
    requestedScope === 'whole'
      ? formatRange(0, VIDEO_SECONDS)
      : formatRange(initialRange.start, initialRange.end),
  )
  const [revision, setRevision] = useState(params.get('request') ?? '자막 위치를 상단 세이프존 안쪽으로 8px 이동')
  const [revisions, setRevisions] = useState<Revision[]>([
    {
      shotId: 'SH-01',
      timecode: '00:00:00.000 ~ 00:00:03.000',
      detail: '초기 0.5초 훅 카피 대비 강화 (샘플)',
      scope: 'frame',
    },
  ])
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef<number | null>(null)

  const rightsRequired = sourceMode !== 'generate_new'
  const rightsReady = !rightsRequired || (rightsFlag && confirmedBy.trim().length > 0)
  const modeReady = mode !== null
  const approvedCount = Object.keys(approvals).length
  const currentModeLabel = mode ? productionModes.find((item) => item.id === mode)?.label : null
  const previewIndex = shotId === 'ALL' ? 0 : (shotNumber(shotId) - 1) % 6

  function selectMode(next: string) {
    setMode(next)
    setApprovals({})
  }

  function selectSourceMode(next: string) {
    setSourceMode(next)
    setRightsFlag(false)
    setConfirmedBy('')
    setApprovals({})
    setRightsDialogOpen(false)
  }

  function canApprove(index: number) {
    if (!modeReady || !rightsReady) return false
    if (index === 0) return true
    return Boolean(approvals[gates[index - 1].id])
  }

  function approve(gateId: string) {
    if (!operator.trim()) return
    setApprovals((previous) => ({ ...previous, [gateId]: operator.trim() }))
  }

  function selectScope(next: Scope) {
    setScope(next)
    if (next === 'whole') {
      setShotId('ALL')
      setTimecodeText(formatRange(0, VIDEO_SECONDS))
      return
    }
    if (next === 'frame') {
      if (shotId === 'ALL') setShotId('SH-02')
      setTimecodeText(formatRange(2, 5))
      return
    }
    if (shotId === 'ALL') setShotId('SH-01')
    setTimecodeText(formatRange(range.start, range.end))
  }

  function secondsFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const percent = ((event.clientX - rect.left) / rect.width) * 100
    return clamp((percent / 100) * VIDEO_SECONDS)
  }

  function beginDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (scope !== 'segment') return
    const start = secondsFromPointer(event)
    dragStart.current = start
    setRange({ start, end: start })
    setTimecodeText(formatRange(start, start))
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragging(true)
  }

  function moveDrag(event: ReactPointerEvent<HTMLDivElement>) {
    if (!dragging || dragStart.current === null) return
    const current = secondsFromPointer(event)
    const next = { start: Math.min(dragStart.current, current), end: Math.max(dragStart.current, current) }
    setRange(next)
    setTimecodeText(formatRange(next.start, next.end))
  }

  function endDrag() {
    dragStart.current = null
    setDragging(false)
  }

  function selectFrame(index: number) {
    setScope('frame')
    setShotId(`SH-${String(index + 1).padStart(2, '0')}`)
    const start = index * 1.6
    setRange({ start, end: Math.min(VIDEO_SECONDS, start + 1.6) })
    setTimecodeText(formatRange(start, Math.min(VIDEO_SECONDS, start + 1.6)))
  }

  function addRevision() {
    if (!revision.trim()) return
    setRevisions((previous) => [
      ...previous,
      {
        shotId: scope === 'whole' ? 'ALL' : shotId.trim() || 'SH-01',
        timecode: timecodeText,
        detail: revision.trim(),
        scope,
      },
    ])
    setRevision('')
  }

  const rangeLeft = (range.start / VIDEO_SECONDS) * 100
  const rangeWidth = Math.max(1, ((range.end - range.start) / VIDEO_SECONDS) * 100)

  return (
    <>
      <PageHeader
        code="S8"
        eyebrow="영상 제작 스위트"
        title="영상 워크벤치"
        description="전체 영상, 구간, 프레임 중 원하는 범위를 고르고 수정 요청을 남깁니다. 실제 렌더와 외부 전송은 없습니다."
        badges={[
          <Badge key="dry" tone="dry">DryRender / 외부 렌더 0건</Badge>,
          <Badge key="sample" tone="sample">샘플 시나리오 1개</Badge>,
          rightsReady ? <Badge key="rights" tone="ok">권한 확인 완료</Badge> : <Badge key="rights" tone="warn">권한 확인 필요</Badge>,
          <Badge key="cost" tone="warn">지출 상한 0원 / 과금 없음</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="승인 게이트" value="4" detail="G1~G4만 해당" />
        <Kpi label="통과 단계" value={`${approvedCount} / 4`} detail="순서대로 승인" tone="ok" />
        <Kpi label="제작 유형" value={currentModeLabel ?? '미선택'} detail="자동 추정 없음" tone="sample" />
        <Kpi label="범위 지정 수정" value={revisions.length} detail="전체 재생성 없음" tone="warn" />
      </div>

      <div className="tabs" role="tablist" aria-label="S8 작업 단계">
        {([
          ['analysis', '유형 선택'],
          ['production', '제작 데스크'],
          ['revision', '부분 수정'],
        ] as [WorkbenchTab, string][]).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab${tab === id ? ' tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'analysis' && (
        <>
          <Panel title="제작 포맷 선택" aside={<Badge tone={modeReady ? 'ok' : 'warn'}>기본값: 미선택</Badge>}>
            <p className="hint">포맷을 고르기 전에는 분석과 제작 게이트가 잠깁니다. 자동 추정하지 않습니다.</p>
            <div className="format-grid">
              {productionModes.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mode === item.id}
                  className={`format-card${mode === item.id ? ' format-card--active' : ''}`}
                  onClick={() => selectMode(item.id)}
                >
                  <ShotFrame index={index} active={mode === item.id} />
                  <strong>{item.label}</strong>
                  <small>{modeGateNote[item.id].split(' / ')[0]}</small>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="서드파티 메타데이터" aside={<Badge>원문 링크만 보관</Badge>}>
            <ul className="plain-list">
              <li>원문 URL과 썸네일 URL, 타임코드만 보관합니다.</li>
              <li>프레임 다운로드, 프레임 분석, 미디어 바이트 저장을 하지 않습니다.</li>
              <li>분석 대상은 사용자가 직접 등록한 공개 범위 소스와 자기 콘텐츠입니다.</li>
            </ul>
          </Panel>
        </>
      )}

      {tab === 'production' && (
        <>
          <Panel title="제작 데스크" aside={<Badge tone="dry">{shotId} / 미리보기 이미지</Badge>}>
            <div className="video-desk">
              <div className="video-desk__monitor">
                <div className="monitor-screen">
                  <ShotFrame index={previewIndex} active />
                  <span className="monitor-timecode">{timecodeText}</span>
                </div>
                <Waveform />
                <div className="monitor-foot">
                  <span>현재 범위: {scopeLabels[scope]}</span>
                  <span>{currentModeLabel ?? '포맷 미선택'}</span>
                </div>
              </div>
              <div className="video-desk__shots">
                <div className="desk-label">샷 목록</div>
                <div className="shot-strip">
                  {[0, 1, 2, 3].map((index) => (
                    <button key={index} type="button" className="shot-pick" onClick={() => selectFrame(index)}>
                      <ShotFrame index={index} active={shotId === `SH-${String(index + 1).padStart(2, '0')}`} />
                    </button>
                  ))}
                </div>
                <p className="hint">샷을 누르면 해당 프레임이 부분 수정 대상으로 지정됩니다.</p>
              </div>
            </div>
            <div className="timeline" aria-label="타임라인 샘플">
              <div className="timeline__ruler">
                <span>트랙</span><span>00:00</span><span>00:02</span><span>00:04</span><span>00:06</span>
              </div>
              {timelineTracks.map((track) => (
                <div className="timeline__row" key={track.label}>
                  <span className="timeline__label">{track.label}</span>
                  <div className="timeline__lane">
                    {track.bars.map((bar, i) => (
                      <span key={i} className={`timeline__bar timeline__bar--${bar.tone}`} style={{ left: `${bar.left}%`, width: `${bar.width}%` }} />
                    ))}
                    <span className="timeline__selection" style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="소스 모드" aside={<Badge tone={rightsRequired ? 'warn' : 'neutral'}>3가지 입력 모드</Badge>}>
            <div className="source-modes">
              {sourceModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={sourceMode === item.id}
                  className={`mode-card${sourceMode === item.id ? ' mode-card--active' : ''}`}
                  onClick={() => selectSourceMode(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="hint">변환과 합성 모드는 rights_flag와 rights_confirmed_by가 확인되기 전 실행 버튼이 비활성입니다.</p>
            {rightsRequired && (
              <div className="row">
                <button type="button" className="button" onClick={() => setRightsDialogOpen(true)}>권리 확인 열기</button>
                <LinkButton from="s5" to="s8" icon="link">S5 자산을 소스로 참조</LinkButton>
              </div>
            )}
          </Panel>

          <Panel title="승인 게이트 G1~G4" aside={<Badge tone="dry">PRE-0a/0b 사전 확인 / 게이트 수 미포함</Badge>}>
            <p className="hint">
              선택 포맷: {currentModeLabel ?? '미선택'} /
              {mode ? ` ${modeGateNote[mode]}` : ' 포맷을 먼저 선택하세요.'}
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <label className="field">
                승인자 (approved_by)
                <input value={operator} onChange={(event) => setOperator(event.target.value)} placeholder="이름 입력" />
              </label>
              <Badge tone={rightsReady ? 'ok' : 'warn'}>
                {rightsReady ? '사전 확인 통과' : 'PRE-0b 권한 미확인'}
              </Badge>
            </div>
            <ProgressLine label="게이트 진행률" value={(approvedCount / 4) * 100} />
            <div className="gate-timeline">
              {gates.map((gate, index) => {
                const approvedBy = approvals[gate.id]
                const locked = !canApprove(index)
                return (
                  <div className={`gate-step${approvedBy ? ' gate-step--done' : ''}`} key={gate.id}>
                    <span className="gate-step__num">{approvedBy ? '확인' : gate.id}</span>
                    <div className="gate-step__body">
                      <strong>{gate.id} {gate.label}</strong>
                      <small>
                        {approvedBy ? `approved_by: ${approvedBy}` : locked ? '이전 게이트 승인 또는 사전 확인이 필요합니다.' : '승인 대기'}
                      </small>
                    </div>
                    <button type="button" className="button button--primary" disabled={locked || Boolean(approvedBy)} onClick={() => approve(gate.id)}>
                      {approvedBy ? '완료' : '승인'}
                    </button>
                  </div>
                )
              })}
            </div>
          </Panel>
        </>
      )}

      {tab === 'revision' && (
        <>
          <Panel title="수정할 범위 고르기" aside={<Badge tone="sample">{scopeLabels[scope]}</Badge>}>
            <div className="scope-tabs" role="tablist" aria-label="영상 수정 범위">
              {(['whole', 'segment', 'frame'] as Scope[]).map((item) => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={scope === item}
                  className={scope === item ? 'is-active' : ''}
                  onClick={() => selectScope(item)}
                >
                  {scopeLabels[item]}
                </button>
              ))}
            </div>

            {scope === 'whole' && (
              <div className="scope-note">
                <strong>전체 영상 검토</strong>
                <p className="hint">전체 구간을 검토 대상으로 남깁니다. 자동 재생성은 하지 않습니다.</p>
              </div>
            )}

            {scope === 'segment' && (
              <div className="segment-picker">
                <div className="desk-label">타임라인에서 드래그해 구간을 고르세요</div>
                <div
                  className="drag-lane"
                  onPointerDown={beginDrag}
                  onPointerMove={moveDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                >
                  <span className="drag-lane__selection" style={{ left: `${rangeLeft}%`, width: `${rangeWidth}%` }} />
                  <span className="drag-lane__handle drag-lane__handle--left" style={{ left: `${rangeLeft}%` }} />
                  <span className="drag-lane__handle drag-lane__handle--right" style={{ left: `${rangeLeft + rangeWidth}%` }} />
                </div>
                <div className="row segment-readout">
                  <span>선택 구간</span>
                  <strong>{timecodeText}</strong>
                  <Badge>{dragging ? '드래그 중' : '드래그로 선택'}</Badge>
                </div>
              </div>
            )}

            {scope === 'frame' && (
              <div className="frame-picker">
                <div className="desk-label">프레임 / 콘티 선택</div>
                <div className="frame-grid">
                  {[0, 1, 2, 3, 4, 5].map((index) => {
                    const id = `SH-${String(index + 1).padStart(2, '0')}`
                    return (
                      <button key={id} type="button" className={shotId === id ? 'is-active' : ''} onClick={() => selectFrame(index)}>
                        <ShotFrame index={index} active={shotId === id} />
                        <span>{id}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </Panel>

          <Panel title="범위 지정 수정 요청" aside={<Badge tone="sample">targeted revision</Badge>}>
            <div className="revision-desk">
              <div className="revision-desk__preview"><ShotFrame index={previewIndex} active /></div>
              <div className="revision-desk__form">
                <div className="row">
                  <label className="field">
                    shot_id
                    <input value={shotId} onChange={(event) => setShotId(event.target.value)} />
                  </label>
                  <label className="field">
                    타임코드 구간
                    <input value={timecodeText} onChange={(event) => setTimecodeText(event.target.value)} />
                  </label>
                </div>
                <label className="field field--wide">
                  수정 지시
                  <input value={revision} onChange={(event) => setRevision(event.target.value)} placeholder="예: 자막을 세이프존 안으로 옮겨줘" />
                </label>
                <div className="row" style={{ marginTop: 14 }}>
                  <button type="button" className="button button--primary" onClick={addRevision}>수정 요청 추가</button>
                  <span className="hint">{scope === 'whole' ? '전체 검토 기록 / 자동 재생성 없음' : '선택 범위만 재승인 대상'}</span>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="수정 이력" aside={<Badge>{revisions.length}건</Badge>}>
            <ul className="revision-list">
              {revisions.map((item, index) => (
                <li key={`${item.shotId}-${index}`}>
                  <div className="row row--between">
                    <div className="row">
                      <strong>{item.shotId}</strong>
                      <Badge>{scopeLabels[item.scope]}</Badge>
                      <Badge>{item.timecode}</Badge>
                    </div>
                    <span className="revision-done">기록됨</span>
                  </div>
                  <p className="hint">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}

      <Panel title="모듈 연결" aside={<Badge>기본값: 연결 안 함</Badge>}>
        <p className="hint">S5 자산 참조는 사용자가 버튼을 누를 때만 ModuleLink가 생성됩니다.</p>
        <LinkChips module="s8" />
      </Panel>

      {rightsDialogOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setRightsDialogOpen(false)}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="s8-rights-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2>권리 확인 (PRE-0b)</h2>
            <p>업로드한 사람이 직접 확인합니다. 시스템은 확인 여부만 검증하고 권리를 판정하지 않습니다.</p>
            <label className="dialog__check">
              <input type="checkbox" checked={rightsFlag} onChange={(event) => setRightsFlag(event.target.checked)} />
              rights_flag: 이 소스를 변환과 합성에 사용할 권리가 있음
            </label>
            <label className="field field--wide">
              rights_confirmed_by
              <input value={confirmedBy} onChange={(event) => setConfirmedBy(event.target.value)} placeholder="확인자 이름" />
            </label>
            <div className="row dialog__actions">
              <button type="button" className="button button--primary" disabled={!rightsFlag || !confirmedBy.trim()} onClick={() => setRightsDialogOpen(false)}>
                확인 기록
              </button>
              <button type="button" className="button" onClick={() => setRightsDialogOpen(false)}>취소</button>
            </div>
            <p className="hint">취소해도 소스는 삭제되지 않으며 재확인할 수 있습니다.</p>
          </div>
        </div>
      )}
    </>
  )
}
