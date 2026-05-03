import { Link } from 'react-router-dom'

const problems = [
  { icon: '💥', title: '23 Deprecated APIs', desc: 'javax.* namespace removed in Java 17. Your code won\'t compile.', label: 'Manual Fix:', value: '18-25 hours' },
  { icon: '🔥', title: 'Runtime Crashes', desc: 'Date API incompatibilities cause silent failures in production.', label: 'Debug Time:', value: '12-15 hours', delay: 'reveal-d1' },
  { icon: '🚨', title: 'Security Vulnerabilities', desc: 'No security patches since 2019. CVEs accumulating daily.', label: 'Audit Cost:', value: '$2,000+', delay: 'reveal-d2' },
  { icon: '⚠️', title: 'Breaking Changes', desc: 'Spring Boot 3.x has 200+ breaking changes. Miss one = production down.', label: 'Testing:', value: '8-12 hours' },
  { icon: '📉', title: 'Technical Debt', desc: 'Every sprint delayed makes migration 15% harder and more expensive.', label: 'Compound Cost:', value: '+$675/month', delay: 'reveal-d1' },
  { icon: '👥', title: 'Team Burnout', desc: 'Manual migration = 45 hours of tedious, error-prone work nobody wants.', label: 'Morale Impact:', value: 'Critical', delay: 'reveal-d2' },
]

export default function ProblemSection() {
  return (
    <section className="section section-problem" id="problem">
      <div className="section-inner">
        <div className="section-eyebrow">The Reality</div>
        <h2 className="section-title">Legacy Code is a <span className="text-danger">Ticking Time Bomb</span></h2>
        <p className="section-sub">Spring Boot 1.5 reached end-of-life in 2019. Every day you wait increases risk.</p>

        <div className="problem-grid">
          {problems.map((p) => (
            <div key={p.title} className={`problem-card reveal${p.delay ? ' ' + p.delay : ''}`}>
              <div className="problem-icon problem-icon-danger">{p.icon}</div>
              <h3 className="problem-title">{p.title}</h3>
              <p className="problem-desc">{p.desc}</p>
              <div className="problem-impact">
                <span className="impact-label">{p.label}</span>
                <span className="impact-value">{p.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="problem-cta">
          <div className="problem-total">
            <div className="problem-total-label">Total Manual Migration Cost</div>
            <div className="problem-total-value">$4,500 + 45 hours</div>
            <div className="problem-total-sub">Plus unknown production risks</div>
          </div>
          <Link to="/demo" className="btn-blue btn-lg">Show me the solution →</Link>
        </div>
      </div>
    </section>
  )
}
