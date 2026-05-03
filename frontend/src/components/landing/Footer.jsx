import { Link } from 'react-router-dom'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <>
      {/* CTA Section */}
      <section className="section cta-section" id="cta">
        <div className="section-inner cta-inner">
          <p className="eyebrow eyebrow-light">Ready?</p>
          <h2 className="section-title section-title-light">Stop doing this by hand.</h2>
          <p className="section-sub section-sub-light" style={{marginBottom:'40px'}}>
            The demo runs the full PetClinic migration live. Watch 33 files transform in real-time.
          </p>
          <div className="cta-actions">
            <Link to="/demo" className="btn-blue btn-lg">🚀 Launch Migration Tool</Link>
            <a
              href="https://github.com"
              target="_blank" rel="noreferrer"
              className="btn-ghost-light btn-lg"
            >⭐ View on GitHub</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect width="20" height="20" rx="5" fill="#0071e3"/>
              <path d="M5 14l4-8 2 4 2-2 2 6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Legacy Modernizer
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <a href="#problem">Challenge</a>
            <a href="#solution">Solution</a>
            <a href="#features">Features</a>
            <a href="#results">Results</a>
            <Link to="/demo">Demo</Link>
          </nav>
          <p className="footer-copy">© {year} IBM Hackathon · Built with Bob AI · Spring PetClinic Migration Demo</p>
        </div>
      </footer>
    </>
  )
}
