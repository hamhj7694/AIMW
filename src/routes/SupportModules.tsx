import { useState } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, ProgressLine, Sparkline } from '../components/ui'
import { BarChart, DocumentLines, MediaThumb, SegmentBars, ShotFrame } from '../components/Visuals'

type AssetKind = 'video' | 'image' | 'blog'

const libraryAssets: { id: string; kind: AssetKind; title: string; meta: string; series: string }[] = [
  { id: 'a1', kind: 'video', title: '제품 훅 숏폼', meta: '영상 / 00:18', series: '시리즈 A' },
  { id: 'a2', kind: 'image', title: '비교 혜택 배너', meta: '이미지 / 1200×628', series: '시리즈 A' },
  { id: 'a3', kind: 'blog', title: '선택 기준 가이드', meta: '블로그 / 3,200자', series: '시리즈 B' },
  { id: 'a4', kind: 'video', title: '사용 장면 클립', meta: '영상 / 00:42', series: '시리즈 B' },
  { id: 'a5', kind: 'image', title: '카드 뉴스 표지', meta: '이미지 / 1080×1080', series: '아이디어 큐' },
  { id: 'a6', kind: 'blog', title: 'FAQ 정리 초안', meta: '블로그 / 1,800자', series: '아이디어 큐' },
]

export function S5OwnContent() {
  const [filter, setFilter] = useState<'all' | AssetKind>('all')
  const shown = libraryAssets.filter((asset) => filter === 'all' || asset.kind === filter)

  return (
    <>
      <PageHeader
        code="S5"
        eyebrow="콘텐츠 라이브러리"
        title="우리 콘텐츠 허브"
        description="자사 콘텐츠의 겹침, 시리즈, 아이디어를 독립 상태로 관리합니다."
        badges={[
          <Badge key="ind">독립 모듈</Badge>,
          <Badge key="sample" tone="sample">샘플 자산 6개</Badge>,
          <Badge key="dry" tone="dry">복제 없음 / ID 참조만</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="등록 자산" value={libraryAssets.length} detail="샘플 라이브러리" />
        <Kpi label="시리즈" value="2" detail="사람이 묶음 정의" tone="sample" />
        <Kpi label="아이디어 큐" value="2" detail="자동 반영 없음" tone="warn" />
        <Kpi label="자동 동기화" value="0건" detail="클릭 기반 링크만" tone="ok" />
      </div>

      <Panel title="자산 라이브러리" aside={<Badge>{shown.length}개 표시 중</Badge>}>
        <div className="library-toolbar">
          {(['all', 'video', 'image', 'blog'] as const).map((kind) => (
            <button
              key={kind}
              type="button"
              className={filter === kind ? 'is-active' : ''}
              onClick={() => setFilter(kind)}
            >
              {kind === 'all' ? '전체' : kind === 'video' ? '영상' : kind === 'image' ? '이미지' : '블로그'}
            </button>
          ))}
        </div>
        <div className="library-grid">
          {shown.map((asset, index) => (
            <article className="asset-card" key={asset.id}>
              <div className="asset-card__visual">
                {asset.kind === 'blog' ? <DocumentLines rows={4} /> : asset.kind === 'video' ? <ShotFrame index={index} /> : <MediaThumb kind="image" />}
              </div>
              <div className="asset-card__body">
                <strong>{asset.title}</strong>
                <span>{asset.meta}</span>
                <span className="asset-card__series">{asset.series}</span>
              </div>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="시리즈와 아이디어" aside={<Badge tone="sample">샘플 2열</Badge>}>
        <div className="library-summary">
          <article>
            <span className="desk-label">시리즈 A</span>
            <strong>업로드 12건</strong>
            <p className="hint">겹침 후보 3건 / 사람이 확인</p>
          </article>
          <article>
            <span className="desk-label">아이디어 큐</span>
            <strong>검토 대기 5건</strong>
            <p className="hint">자동 반영 없음 / 수동 확정</p>
          </article>
        </div>
      </Panel>

      <Panel title="모듈 연결" aside={<Badge>기본값: 연결 안 함</Badge>}>
        <LinkButton from="s5" to="s8" icon="link">S8 영상 워크벤치에서 참조</LinkButton>
        <p className="hint">S8에 자산을 넘길 때도 ID만 참조하며 원본을 복사하지 않습니다.</p>
        <LinkChips module="s5" />
      </Panel>
    </>
  )
}

export function S6Forecast() {
  return (
    <>
      <PageHeader
        code="S6"
        eyebrow="예측 대시보드"
        title="성과와 예측"
        description="이동평균 기준 예측을 표시합니다. 실제 성과로 오인하지 않습니다."
        badges={[
          <Badge key="forecast" tone="forecast">예측 / 신뢰도 / 모델 / 기간</Badge>,
          <Badge key="sample" tone="sample">샘플 시계열 8주</Badge>,
          <Badge key="actual" tone="warn">실제 계정 데이터 아님</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="예측 플래그" value="true" detail="모든 값에 공통 적용" tone="forecast" />
        <Kpi label="모델" value="이동평균" detail="baseline / 단순 모형" tone="sample" />
        <Kpi label="신뢰도" value="중간" detail="수치 약속 없음" tone="warn" />
        <Kpi label="보유기간" value="90일 / 12개월" detail="Phase A / Phase B" tone="ok" />
      </div>

      <Panel title="시계열과 예측 구간" aside={<Badge tone="forecast">예측 구간은 별도 표기</Badge>}>
        <div className="forecast-chart">
          <div className="forecast-chart__bars">
            <BarChart values={[32, 38, 35, 44, 41, 50, 47, 58]} />
            <span className="forecast-band">이 구간부터 예측</span>
          </div>
          <div className="forecast-chart__line">
            <span className="desk-label">추세</span>
            <Sparkline values={[32, 38, 35, 44, 41, 50, 47, 58]} tone="forecast" />
          </div>
        </div>
        <p className="hint">막대의 마지막 두 값은 이동평균 추정입니다. 과거 실적과 섞어 읽지 마세요.</p>
      </Panel>

      <Panel title="모델 카드" aside={<Badge tone="sample">샘플 모형</Badge>}>
        <div className="model-card">
          <div className="kv">
            <span>model</span><strong>이동평균 baseline</strong>
            <span>input</span><strong>샘플 8주 / 실제 데이터 아님</strong>
            <span>confidence</span><strong>중간</strong>
            <span>is_forecast</span><strong>true</strong>
          </div>
          <ProgressLine label="신뢰도 표현" value={58} />
        </div>
      </Panel>

      <Panel title="모듈 연결" aside={<Badge>기본값: 연결 안 함</Badge>}>
        <p className="hint">S9에서 참조 버튼을 누를 때만 ModuleLink가 생성됩니다. 이 화면은 데이터를 복제하지 않습니다.</p>
        <LinkChips module="s6" />
      </Panel>
    </>
  )
}

const segmentVariables = [
  { id: 'v1', label: '관심 주제', value: '비용 비교', allowed: true },
  { id: 'v2', label: '콘텐츠 형태', value: '숏폼 선호', allowed: true },
  { id: 'v3', label: '유입 경로', value: '검색', allowed: true },
  { id: 'v4', label: '이메일 주소', value: '식별자 / 제외', allowed: false },
]

export function S7Segments() {
  const [included, setIncluded] = useState<string[]>(['v1', 'v2', 'v3'])
  const [label, setLabel] = useState('비용 비교 관심군')

  function toggle(id: string) {
    setIncluded((previous) => previous.includes(id) ? previous.filter((item) => item !== id) : [...previous, id])
  }

  return (
    <>
      <PageHeader
        code="S7"
        eyebrow="세그먼트 빌더"
        title="오디언스 세그먼트"
        description="식별자를 제외한 최소 변수만 사용하며 라벨은 사람이 확정합니다."
        badges={[
          <Badge key="privacy" tone="warn">개인정보 경고 / 식별자 제외</Badge>,
          <Badge key="sample" tone="sample">샘플 변수 4개</Badge>,
          <Badge key="manual" tone="dry">자동 확정 금지</Badge>,
        ]}
      />

      <div className="kpi-grid">
        <Kpi label="선택 변수" value={included.length} detail="최소 변수만 사용" />
        <Kpi label="제외 변수" value="1" detail="이메일 등 식별자" tone="warn" />
        <Kpi label="원본 저장" value="0건" detail="값만 조합 / 원본 미보관" tone="ok" />
        <Kpi label="라벨 확정" value="사람" detail="자동 이름 생성 없음" tone="sample" />
      </div>

      <Panel title="변수 조합" aside={<Badge>{included.length}개 선택</Badge>}>
        <div className="segment-desk">
          <div className="variable-list">
            {segmentVariables.map((variable) => (
              <label className={`variable-row${variable.allowed ? '' : ' variable-row--blocked'}`} key={variable.id}>
                <input
                  type="checkbox"
                  checked={included.includes(variable.id)}
                  disabled={!variable.allowed}
                  onChange={() => toggle(variable.id)}
                />
                <span className="variable-row__label">{variable.label}</span>
                <strong>{variable.value}</strong>
                {!variable.allowed && <Badge tone="warn">사용 금지</Badge>}
              </label>
            ))}
          </div>
          <div className="segment-preview">
            <span className="desk-label">조합 미리보기</span>
            <SegmentBars values={included.includes('v1') ? [74, 52, 38] : [28, 22, 16]} />
            <p className="hint">값의 크기는 샘플 비율입니다. 식별자를 포함하지 않습니다.</p>
          </div>
        </div>
      </Panel>

      <Panel title="라벨 확정" aside={<Badge tone="dry">사람이 직접 입력</Badge>}>
        <div className="label-confirm">
          <label className="field">
            세그먼트 이름
            <input value={label} onChange={(event) => setLabel(event.target.value)} />
          </label>
          <button type="button" className="button button--primary" disabled={!label.trim()}>
            라벨 확정 기록
          </button>
        </div>
        <ul className="plain-list">
          <li>확정 기록은 현재 이름만 남기며 실행이나 전송을 하지 않습니다.</li>
          <li>원본 식별자는 저장하지 않으며 보유기간 안내를 항상 표시합니다.</li>
        </ul>
      </Panel>

      <Panel title="모듈 연결" aside={<Badge>기본값: 연결 안 함</Badge>}>
        <p className="hint">이 모듈은 독립 라우트입니다. 링크는 사용자가 누를 때만 생성됩니다.</p>
        <LinkChips module="s7" />
      </Panel>
    </>
  )
}
