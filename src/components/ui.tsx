import type { ReactNode } from 'react'
import { useModuleLinks } from '../app/useModuleLinks'
import type { IconName } from './Icon'

type Tone = 'neutral' | 'sample' | 'dry' | 'forecast' | 'warn' | 'ok' | 'info'

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}

export function PageHeader({
  code,
  title,
  description,
  badges = [],
  eyebrow,
}: {
  code: string
  title: string
  description: string
  badges?: ReactNode[]
  icon?: IconName
  eyebrow?: string
}) {
  return (
    <header className="page-head">
      <div className="page-head__kicker">
        <span className="module-tag">{code}</span>
        {eyebrow && <span className="page-head__eyebrow">{eyebrow}</span>}
      </div>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="badge-row">{badges}</div>
    </header>
  )
}

export function Panel({
  title,
  children,
  aside,
}: {
  title: string
  children: ReactNode
  aside?: ReactNode
  icon?: IconName
}) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2>{title}</h2>
        {aside && <div className="panel__aside">{aside}</div>}
      </div>
      <div className="panel__body">{children}</div>
    </section>
  )
}

export function Kpi({
  label,
  value,
  detail,
  tone = 'info',
}: {
  label: string
  value: ReactNode
  detail?: string
  icon?: IconName
  tone?: Tone
}) {
  return (
    <div className={`kpi kpi--${tone}`}>
      <span className="kpi__label">{label}</span>
      <strong>{value}</strong>
      {detail && <small>{detail}</small>}
    </div>
  )
}

export function Sparkline({ values, tone = 'info' }: { values: number[]; tone?: Tone }) {
  const min = Math.min(...values)
  const max = Math.max(...values)
  const span = max - min || 1
  const points = values
    .map((value, index) => {
      const x = (index / Math.max(values.length - 1, 1)) * 120
      const y = 32 - ((value - min) / span) * 26
      return `${x.toFixed(1)},${y.toFixed(1)}`
    })
    .join(' ')
  const area = `0,36 ${points} 120,36`
  return (
    <svg className={`sparkline sparkline--${tone}`} viewBox="0 0 120 36" preserveAspectRatio="none" aria-hidden="true">
      <polygon className="sparkline__area" points={area} />
      <polyline className="sparkline__line" points={points} />
    </svg>
  )
}

export function ProgressLine({ label, value }: { label: string; value: number }) {
  return (
    <div className="progress">
      <div className="progress__meta">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="progress__track">
        <div className="progress__fill" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
    </div>
  )
}

export function LinkButton({
  from,
  to,
  children,
}: {
  from: string
  to: string
  children: ReactNode
  icon?: IconName
}) {
  const { connect } = useModuleLinks()
  return (
    <button type="button" className="button button--link" onClick={() => connect(from, to)}>
      {children}
    </button>
  )
}

export function LinkChips({ module }: { module: string }) {
  const { links, disconnect } = useModuleLinks()
  const related = links.filter((link) => link.from === module || link.to === module)

  if (related.length === 0) {
    return (
      <div className="link-empty">
        <strong>연결 안 함</strong>
        <p>버튼을 누를 때만 모듈 링크가 생성됩니다.</p>
      </div>
    )
  }

  return (
    <ul className="link-list">
      {related.map((link) => (
        <li key={link.id}>
          <span>{link.from} / {link.to}</span>
          <button type="button" onClick={() => disconnect(link.id)} aria-label="연결 해제">해제</button>
        </li>
      ))}
    </ul>
  )
}

export function StateLine({ state }: { state: '빈 상태' | '로딩' | '성공' | '실패' }) {
  const tone: Tone = state === '성공' ? 'ok' : state === '실패' ? 'warn' : state === '로딩' ? 'info' : 'neutral'
  return <Badge tone={tone}>{state}</Badge>
}
