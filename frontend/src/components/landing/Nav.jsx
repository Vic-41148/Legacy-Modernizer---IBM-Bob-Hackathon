import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isDemo = location.pathname === '/demo'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav id="nav" className={scrolled ? 'scrolled' : ''}>
        <div className="nav-inner">
          <Link to="/" className="nav-logo" aria-label="Legacy Modernizer home">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect width="20" height="20" rx="5" fill="#0071e3"/>
              <path d="M5 14l4-8 2 4 2-2 2 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Legacy Modernizer
          </Link>

          {!isDemo && (
            <ul className="nav-links" role="list">
              <li><a href="#challenge">Challenge</a></li>
              <li><a href="#solution">Solution</a></li>
              <li><a href="#features">Features</a></li>
              <li><a href="#results">Results</a></li>
              <li><a href="#stack">Stack</a></li>
            </ul>
          )}

          <Link to="/demo" className="nav-cta">
            {isDemo ? '← Back to Home' : '🚀 Try Demo'}
          </Link>

          {!isDemo && (
            <button
              className={`nav-hamburger${menuOpen ? ' open' : ''}`}
              id="hamburger"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(o => !o)}
            >
              <span/><span/><span/>
            </button>
          )}
        </div>
      </nav>

      {!isDemo && (
        <div className={`mobile-menu${menuOpen ? ' open' : ''}`} aria-hidden={!menuOpen}>
          <ul role="list">
            {[['#challenge','Challenge'],['#solution','Solution'],['#features','Features'],['#results','Results'],['#stack','Stack']].map(([href, label]) => (
              <li key={href}><a href={href} className="mm-link" onClick={closeMenu}>{label}</a></li>
            ))}
            <li><Link to="/demo" className="mm-link mm-cta" onClick={closeMenu}>🚀 Try Demo</Link></li>
          </ul>
        </div>
      )}
    </>
  )
}
