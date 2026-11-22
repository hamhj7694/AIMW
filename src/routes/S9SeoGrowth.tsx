import { useState } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, ProgressLine, Sparkline } from '../components/ui'
import { Icon, type IconName } from '../components/Icon'

type SeoTab = 'diagnosis' | 'keyword' | 'budget' | 'roundup'

const tabs: { id: SeoTab; label: string; icon: IconName; sub?: string }[] = [
  { id: 'diagnosis', label: '진단', icon: 'search' },
  { id: 'keyword', label: '키워드·콘텐츠', icon: 'content' },
  { id: 'budget', label: '예산·예측', icon: 'sliders', sub: '시뮬레이션, 실제 집행 없음' },
  { id: 'roundup', label: '취합·개선', icon: 'forecast' },
]

export function S9SeoGrowth() {
  const [tab, setTab] = useState<SeoTab>('diagnosis')
  const [simulatedBudget, setSimulatedBudget] = useState(50000)
  const [spendCap, setSpendCap] = useState(0)
  const [consent, setConsent] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [simulated, setSimulated] = useState(false)

  const overCap = simulatedBudget > spendCap
  const needsSecondConfirm = simulatedBudget >= 100000
  const canSimulate = consent && !overCap

  function runSimulation() {
    if (!canSimulate) return
    if (needsSecondConfirm && !simulated) {
      setConfirmOpen(true)
      return
    }
    setSimulated(true)
    setConfirmOpen(false)
  }

  return (
    <>
      <PageHeader
        code="S9"
        eyebrow="네 개의 탭"
        icon="target"
        title="검색 성장"
        description="소유 계정의 공개 범위 데이터만 다룹니다. 모든 수치는 추정이며 특정 결과를 약속하지 않습니다."
        badges={[
          <Badge key="forecast" tone="forecast">예측 / 신뢰도 / 모델 / 기간</Badge>,
          <Badge key="sample" tone="sample">샘플</Badge>,
          <Badge key="dry" tone="dry">시뮬레이션 / 실제 집행 없음</Badge>,
          <Badge key="cap" tone="warn">지출 상한 0원 / 자동 집행 없음</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="탭 구성" value="4" detail="진단부터 개선까지" icon="layers" />
        <Kpi label="예측 플래그" value="true" detail="모든 추정값 공통" icon="forecast" tone="forecast" />
        <Kpi label="지출 상한" value="0원" detail="기본값 / 하드 스톱" icon="shield" tone="warn" />
        <Kpi label="보유기간" value="90일 / 12개월" detail="Phase A / Phase B" icon="clock" tone="ok" />
      </div>

      <div className="tabs" role="tablist" aria-label="S9 탭">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`tab${tab === item.id ? ' tab--active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            <Icon name={item.icon} size={13} /> {item.label}
            {item.sub && <small>{item.sub}</small>}
          </button>
        ))}
      </div>

      {tab === 'diagnosis' && (
        <>
          <Panel title="진단 샘플" icon="search" aside={<Badge tone="sample">샘플 1건</Badge>}>
            <div className="kv">
              <span>category</span><strong>메타디스크립션 중복</strong>
              <span>severity</span><strong>보통</strong>
              <span>source_id</span><strong>KB-SEO-004</strong>
              <span>observation</span><strong>유사 문구가 다수 URL에서 반복됨</strong>
              <span>suggestion</span><strong>페이지별 가치 제안을 직접 작성</strong>
            </div>
            <ProgressLine label="진단 신뢰도" value={62} />
            <p className="hint">로그인과 유료벽 구역은 진단 불가로 표시하고 항목에서 제외합니다.</p>
          </Panel>
          <Panel title="포털 우선순위" icon="target" aside={<Badge>공개 범위 기준</Badge>}>
            <ul className="plain-list">
              <li>Google 1순위 / 네이버 2순위 / 그 외 Phase C.</li>
              <li>연동은 사용자가 직접 로그인/OAuth로 연결한 소유 계정만 사용합니다.</li>
            </ul>
          </Panel>
        </>
      )}

      {tab === 'keyword' && (
        <Panel title="키워드 갭 샘플" icon="content" aside={<Badge tone="sample">샘플 1행</Badge>}>
          <table className="data-table">
            <thead>
              <tr>
                <th>keyword</th><th>current</th><th>target</th><th>intent</th><th>confidence</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>서비스 비용 비교</td><td>확인 대기</td><td>정보형 콘텐츠 보강</td><td>정보</td><td>중간</td>
              </tr>
            </tbody>
          </table>
          <p className="hint">숫자 우선순위가 아닙니다. 정렬은 가독성을 위한 것이며 결과를 예약하지 않습니다.</p>
        </Panel>
      )}

      {tab === 'budget' && (
        <>
          <Panel title="예산 시뮬레이터" icon="sliders" aside={<Badge tone="forecast">is_forecast=true</Badge>}>
            <div className="row row--form">
              <label className="field">
                시뮬레이션 예산 (원)
                <input
                  type="number"
                  min="0"
                  value={simulatedBudget}
                  onChange={(event) => setSimulatedBudget(Math.max(0, Number(event.target.value) || 0))}
                />
              </label>
              <label className="field">
                지출 상한 (원)
                <input
                  type="number"
                  min="0"
                  value={spendCap}
                  onChange={(event) => setSpendCap(Math.max(0, Number(event.target.value) || 0))}
                />
              </label>
              <label className="field">
                기간 (horizon)
                <select defaultValue="4w">
                  <option value="4w">4주</option>
                  <option value="8w">8주</option>
                </select>
              </label>
            </div>
            <label className="field field--wide">
              예산 슬라이더
              <input
                type="range"
                min="0"
                max="200000"
                step="10000"
                value={Math.min(simulatedBudget, 200000)}
                onChange={(event) => setSimulatedBudget(Number(event.target.value))}
              />
            </label>
            <label className="dialog__check">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
              />
              시뮬레이션 실행에 동의합니다 (실제 집행과 과금 없음)
            </label>
            <div className="row">
              <button type="button" className="button button--primary" disabled={!canSimulate} onClick={runSimulation}>
                <Icon name="bolt" size={14} /> 시뮬레이션 실행
              </button>
              {overCap && <Badge tone="warn">지출 상한 초과 / 실행 불가</Badge>}
              {needsSecondConfirm && <Badge tone="warn">10만원 이상 / 2차 확인 대상</Badge>}
            </div>
          </Panel>

          <Panel title="예측 결과 샘플" icon="forecast" aside={<Badge tone="forecast">예측 / 신뢰도 / 모델 / 기간</Badge>}>
            <div className="row row--between">
              <div className="kv" style={{ flex: 1 }}>
                <span>model</span><strong>이동평균 baseline</strong>
                <span>confidence</span><strong>중간</strong>
                <span>horizon</span><strong>4주</strong>
                <span>is_forecast</span><strong>true</strong>
                <span>추정 유입</span><strong>{simulated ? '시뮬레이션 완료 (샘플)' : '실행 전'}</strong>
              </div>
              <Sparkline values={[4, 5, 4, 7, 8, 7, 10]} tone="forecast" />
            </div>
            <ProgressLine label="신뢰도" value={58} />
            <p className="hint">
              과거 실적과 예측은 성격이 다릅니다. 모든 값은 추정이며 특정 결과를 약속하지 않습니다.
            </p>
          </Panel>
        </>
      )}

      {tab === 'roundup' && (
        <>
          <Panel title="라운드 취합 샘플" icon="forecast" aside={<Badge tone="sample">샘플 1건</Badge>}>
            <ol className="plain-list">
              <li>진단 / 예측 / 외부 집행 / 실제 입력 / 차이 분석 / 개선안</li>
              <li>개선안은 사람이 확정하며 자동 반영하지 않습니다.</li>
              <li>S4 Insights와 S6 Forecast 데이터를 복제하지 않습니다.</li>
            </ol>
          </Panel>
          <Panel title="보유기간과 경계" icon="shield" aside={<Badge tone="forecast">Phase A / B</Badge>}>
            <ul className="plain-list">
              <li>Phase A: 입력과 결과 90일 보유.</li>
              <li>Phase B: 예측과 실적 12개월 보유 / 식별정보 미저장 / 즉시 삭제 요청 항상 허용.</li>
              <li>S6 참조는 사용자가 버튼을 누를 때만 생성되는 ModuleLink로 제한합니다.</li>
            </ul>
          </Panel>
        </>
      )}

      <Panel title="모듈 연결" icon="link" aside={<Badge>기본값: 연결 안 함</Badge>}>
        <LinkButton from="s9" to="s6" icon="link">S6 성과 지표 참조</LinkButton>
        <p className="hint">지표 복제 0건 / 자동 동기화 없음 / ID 참조만 생성합니다.</p>
        <LinkChips module="s9" />
      </Panel>

      {confirmOpen && (
        <div className="dialog-backdrop" role="presentation" onMouseDown={() => setConfirmOpen(false)}>
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="s9-confirm-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <h2>
              <Icon name="shield" size={18} /> 2차 확인
            </h2>
            <p>시뮬레이션 예산이 10만원 이상입니다. 실제 집행이나 과금은 발생하지 않습니다.</p>
            <div className="row dialog__actions">
              <button
                type="button"
                className="button button--primary"
                onClick={() => { setSimulated(true); setConfirmOpen(false) }}
              >
                <Icon name="check" size={14} /> 시뮬레이션 값 확정
              </button>
              <button type="button" className="button" onClick={() => setConfirmOpen(false)}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
