import { useState } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, ProgressLine } from '../components/ui'
import { Icon, type IconName } from '../components/Icon'
import { gates, productionModes, sourceModes } from '../data/sample'

type WorkbenchTab = 'analysis' | 'production' | 'revision'

type Revision = {
  shotId: string
  timecode: string
  detail: string
}

const modeIcons: Record<string, IconName> = {
  live: 'target',
  short_form: 'video',
  film: 'studio',
  video: 'video',
  animation: 'layers',
  motion: 'bolt',
}

const sourceIcons: Record<string, IconName> = {
  generate_new: 'plus',
  transform_source: 'layers',
  composite: 'link',
}

const modeGateNote: Record<string, string> = {
  live: '샷사이즈 / 3D 조명 스키마 / 저해상도 / 샷 단위 렌더',
  short_form: '9:16 재구도 / 세이프존 / 자막 확인 / 샷 단위 렌더',
  film: '팔레트 / 연속성 / 색 확인 / 샷 단위 렌더',
  video: '인서트 / 레이아웃 / 오버레이 / 샷 단위 렌더',
  animation: '키프레임 / 키프레임 시트 / 타이밍 / 샷 단위 렌더',
  motion: '레이어 / 모션 스펙 / 이징 확인 / 샷 단위 렌더',
}

export function S8VideoWorkbench() {
  const [tab, setTab] = useState<WorkbenchTab>('production')
  const [mode, setMode] = useState<string | null>(null)
  const [sourceMode, setSourceMode] = useState<string>('generate_new')
  const [rightsDialogOpen, setRightsDialogOpen] = useState(false)
  const [rightsFlag, setRightsFlag] = useState(false)
  const [confirmedBy, setConfirmedBy] = useState('')
  const [operator, setOperator] = useState('')
  const [approvals, setApprovals] = useState<Record<string, string>>({})
  const [shotId, setShotId] = useState('SH-01')
  const [timecode, setTimecode] = useState('00:00:00.000 ~ 00:00:03.000')
  const [revision, setRevision] = useState('자막 위치를 상단 세이프존 안쪽으로 8px 이동')
  const [revisions, setRevisions] = useState<Revision[]>([
    {
      shotId: 'SH-01',
      timecode: '00:00:00.000 ~ 00:00:03.000',
      detail: '초기 0.5초 훅 카피 대비 강화 (샘플)',
    },
  ])

  const rightsRequired = sourceMode !== 'generate_new'
  const rightsReady = !rightsRequired || (rightsFlag && confirmedBy.trim().length > 0)
  const modeReady = mode !== null
  const approvedCount = Object.keys(approvals).length
  const currentModeLabel = mode ? productionModes.find((item) => item.id === mode)?.label : null

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

  function addRevision() {
    if (!revision.trim() || !shotId.trim() || !timecode.trim()) return
    setRevisions((previous) => [
      ...previous,
      { shotId: shotId.trim(), timecode: timecode.trim(), detail: revision.trim() },
    ])
    setRevision('')
  }

  return (
    <>
      <PageHeader
        code="S8"
        eyebrow="영상 제작"
        icon="video"
        title="영상 워크벤치"
        description="유형을 먼저 선택하고 4개 승인 게이트를 순서대로 통과합니다. 실제 렌더와 외부 전송은 없습니다."
        badges={[
          <Badge key="dry" tone="dry">DryRender / 외부 렌더 0건</Badge>,
          <Badge key="sample" tone="sample">샘플 시나리오 1개</Badge>,
          rightsReady ? (
            <Badge key="rights" tone="ok">권한 확인 완료</Badge>
          ) : (
            <Badge key="rights" tone="warn">권한 확인 필요</Badge>
          ),
          <Badge key="cost" tone="warn">지출 상한 0원 / 과금 없음</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="승인 게이트" value="4" detail="G1~G4만 해당" icon="check" />
        <Kpi label="통과 단계" value={`${approvedCount} / 4`} detail="순서대로 승인" icon="layers" tone="ok" />
        <Kpi label="제작 유형" value={currentModeLabel ?? '미선택'} detail="자동 추정 없음" icon="target" tone="sample" />
        <Kpi label="샷 단위 수정" value={revisions.length} detail="전체 재생성 없음" icon="bolt" tone="warn" />
      </div>

      <div className="tabs" role="tablist" aria-label="S8 작업 단계">
        {([
          ['analysis', '분석', 'reference'],
          ['production', '제작', 'video'],
          ['revision', '수정', 'bolt'],
        ] as [WorkbenchTab, string, IconName][]).map(([id, label, icon]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={`tab${tab === id ? ' tab--active' : ''}`}
            onClick={() => setTab(id)}
          >
            <Icon name={icon} size={13} /> {label}
          </button>
        ))}
      </div>

      {tab === 'analysis' && (
        <>
          <Panel
            title="제작 유형 선택"
            icon="target"
            aside={<Badge tone={modeReady ? 'ok' : 'warn'}>기본값: 미선택</Badge>}
          >
            <p className="hint">유형을 고르기 전에는 분석과 제작 게이트가 잠깁니다. 자동 추정하지 않습니다.</p>
            <div className="mode-grid">
              {productionModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={mode === item.id}
                  className={`mode-card${mode === item.id ? ' mode-card--active' : ''}`}
                  onClick={() => selectMode(item.id)}
                >
                  <span className="mode-card__icon">
                    <Icon name={modeIcons[item.id]} size={16} />
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="서드파티 레퍼런스" icon="shield" aside={<Badge>메타데이터 전용</Badge>}>
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
          <Panel title="소스 모드" icon="layers" aside={<Badge tone={rightsRequired ? 'warn' : 'neutral'}>3가지 입력 모드</Badge>}>
            <div className="mode-grid">
              {sourceModes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={sourceMode === item.id}
                  className={`mode-card${sourceMode === item.id ? ' mode-card--active' : ''}`}
                  onClick={() => selectSourceMode(item.id)}
                >
                  <span className="mode-card__icon">
                    <Icon name={sourceIcons[item.id]} size={16} />
                  </span>
                  {item.label}
                </button>
              ))}
            </div>
            <p className="hint">
              변환과 합성 모드는 rights_flag와 rights_confirmed_by가 확인되기 전 실행 버튼이 비활성입니다.
            </p>
            {rightsRequired && (
              <div className="row">
                <button type="button" className="button" onClick={() => setRightsDialogOpen(true)}>
                  <Icon name="shield" size={14} /> 권리 확인 열기
                </button>
                <LinkButton from="s5" to="s8" icon="link">S5 자산을 소스로 참조</LinkButton>
              </div>
            )}
          </Panel>

          <Panel
            title="승인 게이트 G1~G4"
            icon="check"
            aside={<Badge tone="dry">PRE-0a/0b 사전 확인 / 게이트 수 미포함</Badge>}
          >
            <p className="hint">
              선택 유형: {currentModeLabel ?? '미선택'} /
              {mode ? ` ${modeGateNote[mode]}` : ' 유형을 먼저 선택하세요.'}
            </p>
            <div className="row" style={{ marginTop: 12 }}>
              <label className="field">
                승인자 (approved_by)
                <input
                  value={operator}
                  onChange={(event) => setOperator(event.target.value)}
                  placeholder="이름 입력"
                />
              </label>
              <Badge tone={rightsReady ? 'ok' : 'warn'}>
                <Icon name={rightsReady ? 'check' : 'shield'} size={12} />
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
                    <span className="gate-step__num">
                      {approvedBy ? '확인' : gate.id}
                    </span>
                    <div className="gate-step__body">
                      <strong>{gate.id} {gate.label}</strong>
                      <small>
                        {approvedBy
                          ? `approved_by: ${approvedBy}`
                          : locked
                            ? '이전 게이트 승인 또는 사전 확인이 필요합니다.'
                            : '승인 대기'}
                      </small>
                    </div>
                    <button
                      type="button"
                      className="button button--primary"
                      disabled={locked || Boolean(approvedBy)}
                      onClick={() => approve(gate.id)}
                    >
                      {approvedBy ? '완료' : '승인'}
                    </button>
                  </div>
                )
              })}
            </div>
            <p className="hint">
              승인자 기록이 없으면 다음 단계를 생성하지 않습니다. 변환 결과는 Shot으로, 합성 레이어는
              Composition3D 스키마로 동일 게이트를 통과합니다.
            </p>
          </Panel>

          <Panel title="DryRender 미리보기" icon="video" aside={<Badge tone="dry">샘플 1개 / SH-01</Badge>}>
            <p className="hint">현재는 플레이스홀더입니다. 렌더 API 호출, 파일 생성, 과금은 0건입니다.</p>
            <div className="kv">
              <span>샷 ID</span><strong>{shotId}</strong>
              <span>타임코드</span><strong>{timecode}</strong>
              <span>게이트 통과</span><strong>{approvedCount} / 4</strong>
            </div>
            <ProgressLine label="DryRender 준비도" value={(approvedCount / 4) * 100} />
          </Panel>
        </>
      )}

      {tab === 'revision' && (
        <>
          <Panel title="샷 단위 수정 요청" icon="bolt" aside={<Badge tone="sample">targeted revision</Badge>}>
            <div className="row">
              <label className="field">
                shot_id
                <input value={shotId} onChange={(event) => setShotId(event.target.value)} />
              </label>
              <label className="field">
                타임코드 구간
                <input value={timecode} onChange={(event) => setTimecode(event.target.value)} />
              </label>
            </div>
            <label className="field field--wide">
              수정 지시
              <input value={revision} onChange={(event) => setRevision(event.target.value)} />
            </label>
            <div className="row" style={{ marginTop: 14 }}>
              <button type="button" className="button button--primary" onClick={addRevision}>
                <Icon name="plus" size={14} /> 수정 요청 추가
              </button>
              <span className="hint">전체 영상 자동 재생성 없음. 해당 샷만 재승인 대상</span>
            </div>
          </Panel>
          <Panel title="수정 이력" icon="clock" aside={<Badge>{revisions.length}건</Badge>}>
            <ul className="revision-list">
              {revisions.map((item, index) => (
                <li key={`${item.shotId}-${index}`}>
                  <div className="row row--between">
                    <div className="row">
                      <strong>{item.shotId}</strong>
                      <Badge>{item.timecode}</Badge>
                    </div>
                    <Icon name="check" size={15} />
                  </div>
                  <p className="hint">{item.detail}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </>
      )}

      <Panel title="모듈 연결" icon="link" aside={<Badge>기본값: 연결 안 함</Badge>}>
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
            <h2>
              <Icon name="shield" size={18} /> 권리 확인 (PRE-0b)
            </h2>
            <p>업로드한 사람이 직접 확인합니다. 시스템은 확인 여부만 검증하고 권리를 판정하지 않습니다.</p>
            <label className="dialog__check">
              <input
                type="checkbox"
                checked={rightsFlag}
                onChange={(event) => setRightsFlag(event.target.checked)}
              />
              rights_flag: 이 소스를 변환과 합성에 사용할 권리가 있음
            </label>
            <label className="field field--wide">
              rights_confirmed_by
              <input
                value={confirmedBy}
                onChange={(event) => setConfirmedBy(event.target.value)}
                placeholder="확인자 이름"
              />
            </label>
            <div className="row dialog__actions">
              <button
                type="button"
                className="button button--primary"
                disabled={!rightsFlag || !confirmedBy.trim()}
                onClick={() => setRightsDialogOpen(false)}
              >
                <Icon name="check" size={14} /> 확인 기록
              </button>
              <button type="button" className="button" onClick={() => setRightsDialogOpen(false)}>
                취소
              </button>
            </div>
            <p className="hint">취소해도 소스는 삭제되지 않으며 재확인할 수 있습니다.</p>
          </div>
        </div>
      )}
    </>
  )
}
