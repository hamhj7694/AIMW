import type { ReactNode } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel, Sparkline } from '../components/ui'
import type { IconName } from '../components/Icon'

type Row = { label: string; detail: string }

function SimpleModule({
  code,
  eyebrow,
  title,
  description,
  icon,
  badges,
  rows,
  chart,
  next,
}: {
  code: string
  eyebrow: string
  title: string
  description: string
  icon: IconName
  badges: ReactNode[]
  rows: Row[]
  chart?: boolean
  next?: { to: string; label: string }
}) {
  return (
    <>
      <PageHeader
        code={code}
        eyebrow={eyebrow}
        icon={icon}
        title={title}
        description={description}
        badges={badges}
      />

      <div className="kpi-grid">
        <Kpi label="모듈 상태" value="독립" detail="공유 데이터 없음" icon="layers" />
        <Kpi label="샘플 뷰" value={rows.length} detail="읽기 전용 카드" icon="content" tone="sample" />
        <Kpi label="자동 동기화" value="0건" detail="클릭 기반 링크만" icon="shield" tone="ok" />
        <Kpi label="연결 기본값" value="안 함" detail="사용자 선택 필요" icon="link" tone="warn" />
      </div>

      <Panel
        title="샘플 뷰"
        icon={icon}
        aside={
          chart ? <Sparkline values={[4, 6, 5, 8, 7, 10, 9]} tone="forecast" /> : <Badge tone="sample">샘플 데이터</Badge>
        }
      >
        <div className="grid">
          {rows.map((row) => (
            <article className="card" key={row.label}>
              <h3>{row.label}</h3>
              <p>{row.detail}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="모듈 연결" icon="link" aside={<Badge>기본값: 연결 안 함</Badge>}>
        {next && (
          <LinkButton from={code.toLowerCase()} to={next.to} icon="link">
            {next.label}
          </LinkButton>
        )}
        <p className="hint">링크는 ID 참조만 생성하며 데이터를 복제하지 않습니다.</p>
        <LinkChips module={code.toLowerCase()} />
      </Panel>
    </>
  )
}

export function S5OwnContent() {
  return (
    <SimpleModule
      code="S5"
      eyebrow="우리 콘텐츠 허브"
      icon="content"
      title="우리 콘텐츠 허브"
      description="자사 콘텐츠의 겹침, 시리즈, 아이디어를 독립 상태로 관리합니다."
      badges={[<Badge key="ind">독립 모듈</Badge>, <Badge key="sample" tone="sample">샘플</Badge>]}
      rows={[
        { label: '시리즈 A', detail: '업로드 12건 / 겹침 후보 3건 (샘플)' },
        { label: '아이디어 큐', detail: '검토 대기 5건 / 자동 반영 없음' },
      ]}
      next={{ to: 's8', label: 'S8 영상 워크벤치에서 참조' }}
    />
  )
}

export function S6Forecast() {
  return (
    <SimpleModule
      code="S6"
      eyebrow="성과와 예측"
      icon="forecast"
      title="성과와 예측"
      description="이동평균 기준 예측을 표시합니다. 실제 성과로 오인하지 않습니다."
      badges={[
        <Badge key="f" tone="forecast">예측 / 신뢰도 / 모델</Badge>,
        <Badge key="s" tone="sample">샘플</Badge>,
      ]}
      rows={[
        { label: '유입 예측', detail: '모형: 이동평균 / 신뢰도: 중간 / 기간 미지정' },
        { label: '지표 시계열', detail: '샘플 8주 / 실제 계정 데이터 아님' },
      ]}
      chart
    />
  )
}

export function S7Segments() {
  return (
    <SimpleModule
      code="S7"
      eyebrow="오디언스 세그먼트"
      icon="segment"
      title="오디언스 세그먼트"
      description="식별자를 제외한 최소 변수만 사용하며 라벨은 사람이 확정합니다."
      badges={[
        <Badge key="p" tone="warn">개인정보 경고 / 식별자 제외</Badge>,
        <Badge key="s" tone="sample">샘플</Badge>,
      ]}
      rows={[
        { label: '신규', detail: '변수 3개 / 원본 미저장 / 보유기간 안내' },
        { label: '관심', detail: '사람이 이름 편집 / 자동 확정 금지' },
      ]}
    />
  )
}
