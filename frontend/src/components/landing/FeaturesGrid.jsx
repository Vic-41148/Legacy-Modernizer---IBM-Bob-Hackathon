const feats = [
  { title:'Intelligent Code Analysis', desc:'AI-powered AST analysis detects deprecated APIs, outdated patterns, and breaking changes before a single line is modified.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><circle cx="18" cy="18" r="16" stroke="#0071e3" strokeWidth="1.6"/><path d="M12 18l4 4 8-8" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { title:'Zero-Downtime Migration', desc:'Checkpoint-based rollback at every stage. 95% of tasks handled without manual intervention.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M6 18h24M18 6v24" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round"/></svg> },
  { title:'Auto-Generated Tests', desc:'JUnit 5 test suites generated automatically. 100% coverage of critical paths and CI/CD integration out of the box.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="6" stroke="#0071e3" strokeWidth="1.6"/><path d="M12 18l4 4 8-8" stroke="#0071e3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { title:'Security Hardening', desc:'Automatically applies Spring Security 6 best practices, replacing vulnerable legacy authentication patterns.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 4l14 7v14l-14 7L4 25V11l14-7z" stroke="#0071e3" strokeWidth="1.6" strokeLinejoin="round"/></svg> },
  { title:'Audit Trail Reports', desc:'Detailed before/after comparisons, risk summaries, dependency maps, and performance benchmarks.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="10" width="28" height="20" rx="3" stroke="#0071e3" strokeWidth="1.6"/><path d="M12 10V8a6 6 0 0112 0v2" stroke="#0071e3" strokeWidth="1.6" strokeLinecap="round"/></svg> },
  { title:'Container Ready', desc:'Outputs Docker-compatible, cloud-native Spring Boot 3 apps pre-configured for Kubernetes.', svg:<svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="4" width="28" height="28" rx="6" stroke="#0071e3" strokeWidth="1.6"/><path d="M12 18h12M18 12v12" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round"/></svg> },
]

export default function FeaturesGrid() {
  return (
    <section className="section section-gray" id="features">
      <div className="section-inner">
        <p className="eyebrow">Key Features</p>
        <h2 className="section-title">Built for production.</h2>
        <p className="section-sub">Every capability designed with enterprise reliability, security, and scale in mind.</p>
        <div className="features-grid">
          {feats.map((f, i) => (
            <div key={f.title} className={`feat-card reveal${i%3===1?' reveal-d1':i%3===2?' reveal-d2':''}`}>
              <div className="feat-icon">{f.svg}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
