import type { ReactNode } from 'react'

type VisualProps = { className?: string }

function Frame({ children, className = '', viewBox = '0 0 120 72' }: VisualProps & { children: ReactNode; viewBox?: string }) {
  return (
    <svg className={`visual ${className}`} viewBox={viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {children}
    </svg>
  )
}

const mediaScene: Record<string, ReactNode> = {
  video: (
    <>
      <rect className="v-bg" x="0" y="0" width="120" height="72" />
      <path className="v-hill" d="M0 54 30 32 54 54 78 24 120 58V72H0Z" />
      <path className="v-play" d="M52 26 74 36 52 46Z" />
      <rect className="v-bar" x="8" y="8" width="22" height="4" />
      <rect className="v-bar v-bar--red" x="96" y="8" width="16" height="4" />
    </>
  ),
  image: (
    <>
      <rect className="v-bg" x="0" y="0" width="120" height="72" />
      <circle className="v-sun" cx="84" cy="22" r="9" />
      <path className="v-hill" d="M0 60 38 24 66 54 90 36 120 60V72H0Z" />
      <rect className="v-bar" x="8" y="8" width="30" height="4" />
    </>
  ),
  blog: (
    <>
      <rect className="v-bg" x="0" y="0" width="120" height="72" />
      <rect className="v-bar v-bar--red" x="12" y="10" width="26" height="5" />
      <rect className="v-line" x="12" y="24" width="96" height="3" />
      <rect className="v-line" x="12" y="33" width="88" height="3" />
      <rect className="v-line" x="12" y="42" width="94" height="3" />
      <rect className="v-line" x="12" y="51" width="62" height="3" />
    </>
  ),
  news: (
    <>
      <rect className="v-bg" x="0" y="0" width="120" height="72" />
      <rect className="v-bar" x="10" y="10" width="100" height="8" />
      <rect className="v-line" x="10" y="26" width="52" height="3" />
      <rect className="v-line" x="10" y="35" width="52" height="3" />
      <rect className="v-line" x="10" y="44" width="52" height="3" />
      <rect className="v-line" x="68" y="26" width="42" height="3" />
      <rect className="v-line" x="68" y="35" width="42" height="3" />
      <rect className="v-line" x="68" y="44" width="42" height="3" />
    </>
  ),
}

const toolGlyphs: Record<string, ReactNode> = {
  s0: <><rect className="v-bar" x="8" y="10" width="32" height="4" /><rect className="v-line" x="8" y="22" width="40" height="3" /><rect className="v-line" x="8" y="32" width="32" height="3" /><rect className="v-cell v-cell--red" x="8" y="44" width="40" height="6" /></>,
  s1: <><rect className="v-cell" x="8" y="10" width="18" height="18" /><rect className="v-cell v-cell--red" x="30" y="10" width="18" height="18" /><rect className="v-cell" x="8" y="32" width="18" height="18" /><rect className="v-cell" x="30" y="32" width="18" height="18" /></>,
  s2: <><rect className="v-line" x="8" y="12" width="40" height="4" /><rect className="v-line" x="8" y="24" width="34" height="3" /><rect className="v-line" x="8" y="34" width="40" height="3" /><rect className="v-cell v-cell--red" x="8" y="46" width="22" height="5" /></>,
  s3: <><rect className="v-cell" x="8" y="12" width="12" height="12" /><rect className="v-cell v-cell--red" x="24" y="12" width="12" height="12" /><rect className="v-cell" x="40" y="12" width="12" height="12" /><rect className="v-line" x="8" y="34" width="44" height="3" /><rect className="v-line" x="8" y="44" width="30" height="3" /></>,
  s4: <><path className="v-line-stroke" d="M8 48V12M8 48h44" /><path className="v-line-stroke" d="m14 38 10-12 8 6 14-18" /></>,
  s5: <><rect className="v-cell" x="8" y="10" width="16" height="22" /><rect className="v-cell v-cell--red" x="28" y="10" width="16" height="22" /><rect className="v-cell" x="8" y="38" width="36" height="12" /></>,
  s6: <><path className="v-line-stroke" d="M8 46 18 34 28 38 40 20 52 26" /><path className="v-bar v-bar--red" d="M40 20h12v6H40z" /></>,
  s7: <><rect className="v-line" x="8" y="14" width="40" height="4" /><rect className="v-bar" x="8" y="14" width="26" height="4" /><rect className="v-line" x="8" y="28" width="40" height="4" /><rect className="v-bar" x="8" y="28" width="16" height="4" /><rect className="v-line" x="8" y="42" width="40" height="4" /><rect className="v-bar v-bar--red" x="8" y="42" width="32" height="4" /></>,
  s8: <><rect className="v-cell" x="8" y="10" width="18" height="14" /><rect className="v-cell" x="30" y="10" width="18" height="14" /><rect className="v-cell v-cell--red" x="8" y="28" width="18" height="14" /><rect className="v-cell" x="30" y="28" width="18" height="14" /><rect className="v-line" x="8" y="48" width="40" height="3" /></>,
  s9: <><circle className="v-circle" cx="24" cy="24" r="12" /><path className="v-line-stroke" d="m33 33 10 10" /><rect className="v-bar v-bar--red" x="10" y="48" width="28" height="4" /></>,
}

export function ToolGlyph({ code }: { code: string }) {
  return <Frame className="tool-glyph" viewBox="0 0 56 56">{toolGlyphs[code.toLowerCase()] ?? toolGlyphs.s0}</Frame>
}

export function MediaThumb({ kind }: { kind: 'video' | 'image' | 'blog' | 'news' }) {
  return (
    <span className={`media-thumb media-thumb--${kind}`}>
      <Frame>{mediaScene[kind]}</Frame>
    </span>
  )
}

export function ShotFrame({ index, active = false }: { index: number; active?: boolean }) {
  const scene = index % 3
  return (
    <span className={`shot-frame${active ? ' shot-frame--active' : ''}`}>
      <Frame viewBox="0 0 120 68">
        <rect className="v-bg" x="0" y="0" width="120" height="68" />
        {scene === 0 && <path className="v-hill" d="M0 52 34 26 62 52 88 30 120 54V68H0Z" />}
        {scene === 1 && (
          <>
            <rect className="v-grid" x="14" y="12" width="92" height="44" />
            <path className="v-line-stroke" d="M14 34h92M60 12v44" />
          </>
        )}
        {scene === 2 && (
          <>
            <circle className="v-sun" cx="40" cy="30" r="12" />
            <path className="v-hill" d="M0 60 48 28 120 62V68H0Z" />
          </>
        )}
        <rect className="v-bar v-bar--red" x="6" y="6" width="18" height="3" />
        <rect className="v-bar" x="88" y="58" width="26" height="3" />
      </Frame>
      <span className="shot-frame__label">SH-{String(index + 1).padStart(2, '0')}</span>
    </span>
  )
}

export function Waveform({ bars = 28 }: { bars?: number }) {
  const heights = Array.from({ length: bars }, (_, i) => 8 + ((i * 7) % 19) + (i % 4) * 3)
  return (
    <Frame className="waveform" viewBox={`0 0 ${bars * 5} 40`}>
      {heights.map((h, i) => (
        <rect key={i} className={i % 5 === 0 ? 'v-bar v-bar--red' : 'v-bar'} x={i * 5} y={40 - h} width="3" height={h} />
      ))}
    </Frame>
  )
}

export function BarChart({ values }: { values: number[] }) {
  const max = Math.max(...values, 1)
  return (
    <Frame className="bar-chart" viewBox="0 0 160 60">
      <path className="v-line-stroke" d="M0 58H160" />
      {values.map((v, i) => {
        const h = Math.round((v / max) * 46)
        return <rect key={i} className={i === values.length - 1 ? 'v-bar v-bar--red' : 'v-bar'} x={i * (160 / values.length) + 4} y={58 - h} width={160 / values.length - 9} height={h} />
      })}
    </Frame>
  )
}

export function DocumentLines({ rows = 6 }: { rows?: number }) {
  return (
    <Frame className="doc-lines" viewBox="0 0 120 72">
      <rect className="v-bar v-bar--red" x="10" y="10" width="34" height="5" />
      {Array.from({ length: rows }, (_, i) => (
        <rect key={i} className="v-line" x="10" y={24 + i * 7} width={i % 3 === 2 ? 68 : 100} height="3" />
      ))}
    </Frame>
  )
}

export function CalendarStrip({ marked = [2, 5, 8] }: { marked?: number[] }) {
  return (
    <Frame className="calendar-strip" viewBox="0 0 140 40">
      {Array.from({ length: 10 }, (_, i) => (
        <rect key={i} className={marked.includes(i) ? 'v-cell v-cell--red' : 'v-cell'} x={i * 14} y="4" width="12" height="32" />
      ))}
    </Frame>
  )
}

export function SegmentBars({ values }: { values: number[] }) {
  return (
    <Frame className="segment-bars" viewBox="0 0 120 60">
      {values.map((v, i) => (
        <g key={i}>
          <rect className="v-line" x="0" y={i * 18 + 4} width="120" height="4" />
          <rect className="v-bar" x="0" y={i * 18 + 4} width={Math.max(8, v)} height="4" />
        </g>
      ))}
    </Frame>
  )
}

export function SerpPreview({ query, portal = 'Google' }: { query: string; portal?: 'Google' | '네이버' }) {
  return (
    <div className={`serp-preview serp-preview--${portal === 'Google' ? 'google' : 'naver'}`}>
      <div className="serp-preview__bar">
        <span className="serp-preview__portal">{portal}</span>
        <span className="serp-preview__query">{query}</span>
      </div>
      <ol className="serp-preview__results">
        <li>
          <span className="serp-preview__url">example.com / service／가격</span>
          <strong>서비스 비용 비교와 선택 기준</strong>
          <span className="serp-preview__snippet">공개 범위 예시 문장. 실제 검색 결과가 아닙니다.</span>
        </li>
        <li>
          <span className="serp-preview__url">blog.example / review</span>
          <strong>실사용 후기와 체크리스트</strong>
          <span className="serp-preview__snippet">샘플 스니펫 / 순위를 약속하지 않습니다.</span>
        </li>
      </ol>
    </div>
  )
}
