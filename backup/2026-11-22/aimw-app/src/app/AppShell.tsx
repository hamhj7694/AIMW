import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { CommandDock } from '../components/CommandDock'
import { useModuleLinks } from './useModuleLinks'

const modules = [
  { to: '/s0', code: 'S0', label: '수집' },
  { to: '/s1', code: 'S1', label: '레퍼런스' },
  { to: '/s2', code: 'S2', label: '글쓰기' },
  { to: '/s3', code: 'S3', label: '발행' },
  { to: '/s4', code: 'S4', label: '인사이트' },
  { to: '/s5', code: 'S5', label: '콘텐츠' },
  { to: '/s6', code: 'S6', label: '성과' },
  { to: '/s7', code: 'S7', label: '세그먼트' },
  { to: '/s8', code: 'S8', label: '영상' },
  { to: '/s9', code: 'S9', label: '검색' },
]

export function AppShell() {
  const { links, disconnect } = useModuleLinks()
  const location = useLocation()
  const current = location.pathname.split('/')[1] || 's0'

  return (
    <div className={`shell shell--${current}`}>
      <header className="site-head">
        <div className="site-head__brand">
          <strong>AIMW</strong>
          <span>작업기록장</span>
        </div>
        <div className="site-head__meta">
          <span>제공자 <b>Ollama (로컬)</b></span>
          <span>예상비용 <b>0원</b></span>
          <span>모듈 링크 <b>{links.length}건</b></span>
          <span>지출 상한 <b>0원</b></span>
        </div>
      </header>

      <CommandDock />

      <nav className="module-band" aria-label="모듈 선택">
        {modules.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `module-link${isActive ? ' module-link--active' : ''}`}
          >
            <span className="module-link__code">{item.code}</span>
            <span className="module-link__label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="main-column">
        <Outlet />
      </main>

      <aside className="inspect-panel" aria-label="검상 기록">
        <div className="inspect-title">검상 기록</div>
        <p className="inspect-lead">현재 작업의 연결과 경계를 남깁니다.</p>

        <dl className="inspect-facts">
          <div><dt>모듈 구조</dt><dd>독립 라우트</dd></div>
          <div><dt>자동 동기화</dt><dd>0건</dd></div>
          <div><dt>데이터 복제</dt><dd>0건</dd></div>
          <div><dt>연결 기본값</dt><dd>연결 안 함</dd></div>
          <div><dt>모듈 링크</dt><dd className="is-mark">{links.length}건</dd></div>
        </dl>

        <div className="inspect-subtitle">연결 목록</div>
        {links.length === 0 ? (
          <div className="inspect-empty">
            <strong>연결 안 함</strong>
            <p>버튼을 누를 때만 링크가 생성됩니다.</p>
          </div>
        ) : (
          <ul className="inspect-links">
            {links.map((link) => (
              <li key={link.id}>
                <span>{link.from} / {link.to}</span>
                <button type="button" onClick={() => disconnect(link.id)} aria-label="연결 해제">해제</button>
              </li>
            ))}
          </ul>
        )}

        <div className="inspect-stamp">기본값 유지</div>
        <p className="inspect-foot">ID 참조만 생성하며 원본 데이터는 복사하지 않습니다.</p>
      </aside>
    </div>
  )
}
