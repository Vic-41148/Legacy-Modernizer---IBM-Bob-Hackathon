import { useEffect, useRef } from 'react'

const phases = [
  { num:'01', name:'Analysis',       tag:'Complete', done:true,  files:'27 files scanned',  desc:'AI scans the full codebase: imports, annotations, dependency graph, security surface.' },
  { num:'02', name:'Configuration',  tag:'Complete', done:true,  files:'3 files updated',   desc:'pom.xml upgraded from 1.5.4 → 3.2, Java 8 → 17, mysql-connector-java → mysql-connector-j.' },
  { num:'03', name:'Model Layer',    tag:'Complete', done:true,  files:'9 files migrated',  desc:'All entity classes converted: javax → jakarta, Date → LocalDate, @NotEmpty → @NotBlank.' },
  { num:'04', name:'Controllers',    tag:'Complete', done:true,  files:'5 files migrated',  desc:'REST controllers updated: javax.validation → jakarta.validation, Spring 3 handler methods.' },
  { num:'05', name:'Tests',          tag:'Complete', done:true,  files:'8 files updated',   desc:'JUnit 4 → JUnit 5 migration, MockMvc updated, test assertions fixed for new API surface.' },
  { num:'06', name:'Validation',     tag:'Complete', done:true,  files:'All 33 files ✓',    desc:'Full compilation verified, all tests passing, performance benchmarks within tolerance.' },
]

export default function PhasesTimeline() {
  const rowsRef = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('phase-visible')
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' })
    rowsRef.current.forEach(r => r && obs.observe(r))
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section section-light" id="phases">
      <div className="section-inner">
        <p className="eyebrow">Migration Execution</p>
        <h2 className="section-title">6 phases. 3 minutes.</h2>
        <p className="section-sub">Bob executes every phase sequentially with real-time progress tracking and auto-rollback on any failure.</p>

        <div className="phases-list">
          {phases.map((p, i) => (
            <div
              key={p.num}
              className={`phase-row`}
              ref={el => rowsRef.current[i] = el}
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className={`phase-badge ${p.done ? 'phase-done' : 'phase-pending'}`}>{p.done ? '✓' : p.num}</div>
              <div>
                <div className="phase-header">
                  <span className="phase-name">{p.name}</span>
                  <span className={`phase-tag ${p.done ? 'phase-tag-done' : 'phase-tag-pending'}`}>{p.tag}</span>
                </div>
                <p className="phase-desc">{p.desc}</p>
              </div>
              <div className="phase-files">{p.files}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
