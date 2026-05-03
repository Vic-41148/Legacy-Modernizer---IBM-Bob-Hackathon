const groups = [
  { label: 'Source',     chips: ['Spring Boot 3.2', 'Java 17', 'JUnit 5', 'Hibernate 6'] },
  { label: 'Build',      chips: ['Maven 3.9', 'JaCoCo 0.8', 'Docker', 'GitHub Actions'] },
  { label: 'Bob Engine', chips: ['Node.js 20', 'Express 4', 'WebSockets', 'AST Parser'] },
  { label: 'Frontend',   chips: ['React 18', 'Vite 5', 'Monaco Editor', 'Lucide Icons'] },
]

export default function TechStack() {
  return (
    <section className="section section-gray" id="stack">
      <div className="section-inner">
        <p className="eyebrow">Technology</p>
        <h2 className="section-title">Modern stack. Zero compromises.</h2>
        <p className="section-sub">Every tool chosen for reliability, performance, and enterprise compatibility.</p>
        <div className="stack-grid">
          {groups.map(g => (
            <div key={g.label} className="reveal">
              <div className="stack-group-label">{g.label}</div>
              <div className="stack-chips">
                {g.chips.map(c => <span key={c} className="chip">{c}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
