import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCountUp } from '../../hooks/useCountUp'

const ringTargets = {
  '#0071e3': 213.628 * 0.05,  // 95%
  '#30d158': 213.628 * 0.20,  // 80%
  '#bf5af2': 0,               // 100%
}

const metrics = [
  { target: 95, color: '#0071e3', label: 'Automation Rate', desc: 'of migration tasks handled without manual intervention' },
  { target: 80, color: '#30d158', label: 'Time Saved', desc: 'compared to traditional manual migration effort' },
  { target: 100, color: '#bf5af2', label: 'Test Coverage', desc: 'across all migrated application paths and endpoints' },
]

function MetricCard({ target, color, label, desc, triggered }) {
  const num = useCountUp(target, 1800, triggered)
  const circleRef = useRef(null)

  useEffect(() => {
    if (!triggered || !circleRef.current) return
    const circle = circleRef.current
    const finalOffset = ringTargets[color] ?? 0
    circle.style.transition = 'none'
    circle.style.strokeDashoffset = '213.628'
    requestAnimationFrame(() => requestAnimationFrame(() => {
      circle.style.transition = 'stroke-dashoffset 1.6s cubic-bezier(0.23,1,0.32,1) 0.2s'
      circle.style.strokeDashoffset = String(finalOffset)
    }))
  }, [triggered, color])

  return (
    <div className="metric-card reveal">
      <div className="metric-ring" aria-hidden="true">
        <svg viewBox="0 0 80 80" width="80" height="80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="#2c2c2e" strokeWidth="6"/>
          <circle ref={circleRef} cx="40" cy="40" r="34" fill="none" stroke={color} strokeWidth="6"
            strokeDasharray="213.6" strokeDashoffset="213.6" strokeLinecap="round" transform="rotate(-90 40 40)"/>
        </svg>
      </div>
      <div>
        <div className="metric-val"><span className="metric-num">{num}</span>%</div>
        <div className="metric-lbl">{label}</div>
        <div className="metric-desc">{desc}</div>
      </div>
    </div>
  )
}

export default function ResultsMetrics() {
  const [triggered, setTriggered] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect() }
    }, { threshold: 0.25 })
    if (sectionRef.current) obs.observe(sectionRef.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="section section-dark" id="results">
      <div className="section-inner results-inner" ref={sectionRef}>
        <div className="results-text">
          <p className="eyebrow eyebrow-light">Proven Results</p>
          <h2 className="section-title section-title-light">Numbers that speak for themselves.</h2>
          <p className="section-sub section-sub-light">Successfully migrated Spring PetClinic from Spring Boot 1.5.4 to Spring Boot 3.2 — zero data loss, full backward compatibility.</p>
          <Link to="/demo" className="btn-blue" style={{marginTop:'32px',display:'inline-flex'}}>See the demo →</Link>
        </div>
        <div className="results-metrics" id="results-metrics">
          {metrics.map(m => <MetricCard key={m.label} {...m} triggered={triggered}/>)}
        </div>
      </div>
    </section>
  )
}
