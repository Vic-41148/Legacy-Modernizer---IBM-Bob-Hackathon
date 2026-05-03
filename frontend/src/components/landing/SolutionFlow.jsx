export default function SolutionFlow() {
  return (
    <section className="section section-dark" id="solution">
      <div className="section-inner">
        <p className="eyebrow eyebrow-light">Our Approach</p>
        <h2 className="section-title section-title-light">Three steps. Fully automated.</h2>
        <p className="section-sub section-sub-light">Our AI pipeline handles the complete migration lifecycle — from analysis to verified, production-ready code.</p>
        <div className="flow-grid">
          <div className="flow-step reveal">
            <div className="flow-num">01</div>
            <div className="flow-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><circle cx="16" cy="16" r="14" stroke="#0071e3" strokeWidth="1.6"/><path d="M10 16l4 4 8-8" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Analyze</h3>
            <p>AI scans the codebase at AST level — mapping deprecated APIs, outdated patterns, and transitive dependency graphs.</p>
            <ul className="flow-list">
              <li>33 files identified automatically</li>
              <li>100+ import statements mapped</li>
              <li>Dependency graph visualized</li>
            </ul>
          </div>
          <div className="flow-connector" aria-hidden="true">
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="#3a3a3c" strokeWidth="1.5" strokeDasharray="4 3"/></svg>
          </div>
          <div className="flow-step reveal reveal-d1">
            <div className="flow-num">02</div>
            <div className="flow-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><rect x="4" y="8" width="24" height="16" rx="3" stroke="#0071e3" strokeWidth="1.6"/><path d="M10 16h12M16 12v8" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </div>
            <h3>Migrate</h3>
            <p>Automated refactoring engine transforms Spring 1.5 constructs to idiomatic Spring Boot 3.2 with rollback checkpoints.</p>
            <ul className="flow-list">
              <li>javax → jakarta namespace</li>
              <li>Date → java.time API</li>
              <li>JUnit 4 → JUnit 5</li>
            </ul>
          </div>
          <div className="flow-connector" aria-hidden="true">
            <svg width="40" height="2" viewBox="0 0 40 2"><line x1="0" y1="1" x2="40" y2="1" stroke="#3a3a3c" strokeWidth="1.5" strokeDasharray="4 3"/></svg>
          </div>
          <div className="flow-step reveal reveal-d2">
            <div className="flow-num">03</div>
            <div className="flow-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none"><path d="M6 16l6 6 14-14" stroke="#0071e3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3>Verify</h3>
            <p>Auto-generated JUnit 5 test suites validate correctness and performance. Full CI/CD integration with GitHub Actions.</p>
            <ul className="flow-list">
              <li>100% critical path coverage</li>
              <li>Performance benchmarked</li>
              <li>CI/CD pipeline included</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
