import type { ReactNode } from 'react'
import { Badge, Kpi, LinkButton, LinkChips, PageHeader, Panel } from '../components/ui'
import type { IconName } from '../components/Icon'
import { flowItems } from '../data/sample'

type FlowPageProps = {
  code: string
  eyebrow: string
  title: string
  description: string
  icon: IconName
  itemKey: string
  badges?: ReactNode[]
  next?: { to: string; label: string }
}

function FlowPage({ code, eyebrow, title, description, icon, itemKey, badges = [], next }: FlowPageProps) {
  const items = flowItems[itemKey]

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
        <Kpi label="단계 수" value={items.length} detail="샘플 기준" icon="layers" />
        <Kpi label="샘플 결과" value={items.length} detail="실제 생성 아님" icon="studio" tone="sample" />
        <Kpi label="외부 전송" value="0건" detail="Dry-run 유지" icon="shield" tone="ok" />
        <Kpi label="다음 모듈" value={next ? next.to.toUpperCase() : '없음'} detail="클릭 시에만 링크" icon="link" tone="warn" />
      </div>

      <Panel title="단계별 샘플" icon="studio" aside={<Badge tone="sample">샘플 데이터</Badge>}>
        <div className="grid">
          {items.map((item) => (
            <article className="card" key={item.id}>
              <h3>{item.label}</h3>
              <p>{item.detail}</p>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="모듈 연결" icon="link" aside={<Badge>기본값: 연결 안 함</Badge>}>
        {next ? (
          <LinkButton from={code.toLowerCase()} to={next.to} icon="link">
            {next.label}
          </LinkButton>
        ) : (
          <p className="hint">다음 단계 없음. 독립 라우트로 동작합니다.</p>
        )}
        <LinkChips module={code.toLowerCase()} />
      </Panel>
    </>
  )
}

export function S1References() {
  return (
    <FlowPage
      code="S1"
      eyebrow="레퍼런스 분석"
      icon="reference"
      title="레퍼런스 탐색"
      description="경쟁사 크리에이티브를 그룹화하고 태깅해 반복 패턴을 확인합니다."
      itemKey="s1"
      next={{ to: 's2', label: 'S2에서 F3 브리프 만들기' }}
    />
  )
}

export function S2Studio() {
  return (
    <FlowPage
      code="S2"
      eyebrow="크리에이티브 스튜디오"
      icon="studio"
      title="브리프, 카피, 검수"
      description="F3부터 F5까지 브리프 초안, 카피 변형, 검수 체크리스트를 샘플로 확인합니다."
      itemKey="s2"
      next={{ to: 's3', label: 'S3에서 F6 Dry-run 발행' }}
    />
  )
}

export function S3Publishing() {
  return (
    <FlowPage
      code="S3"
      eyebrow="드라이런 발행"
      icon="publish"
      title="Dry-run 발행"
      description="실제 게시나 외부 전송 없이 예약과 상태만 재현합니다."
      itemKey="s3"
      badges={[<Badge key="dry" tone="dry">Dry-run / 실제 전송 없음</Badge>]}
      next={{ to: 's4', label: 'S4에서 F7 인사이트 보기' }}
    />
  )
}

export function S4Insights() {
  return (
    <FlowPage
      code="S4"
      eyebrow="집계와 개선안"
      icon="insights"
      title="지표와 개선안"
      description="샘플 지표를 집계하고 다음 개선 후보를 제시합니다. 예측값이 아닙니다."
      itemKey="s4"
      next={{ to: 's2', label: 'S2에서 개선 브리프 만들기' }}
    />
  )
}
