import { useEffect, useRef, useState } from 'react'
import { useSlotCounter } from '../../hooks/useCountUp'

const stats = [
  { target: 95, suffix: '%', label: 'Migration Automated' },
  { target: 80, suffix: '%', label: 'Dev Time Saved' },
  { target: 33, suffix: '', label: 'Files Migrated' },
  { target: 0,  suffix: '', label: 'Data Loss' },
]

function StatItem({ target, suffix, label }) {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef(null)
  const display = useSlotCounter(target, 1800, triggered)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setTriggered(true); obs.disconnect() }
    }, { threshold: 0.4 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div className="stat-item" ref={ref}>
      <div>
        <span className="stat-num">{display}</span>
        <span className="stat-suf">{suffix}</span>
      </div>
      <span className="stat-lbl">{label}</span>
    </div>
  )
}

export default function StatsStrip() {
  return (
    <div className="stats-strip" id="stats-strip">
      <div className="stats-inner">
        {stats.map((s, i) => (
          <>
            <StatItem key={s.label} {...s} />
            {i < stats.length - 1 && <div className="stat-divider" aria-hidden="true" key={`d${i}`}/>}
          </>
        ))}
      </div>
    </div>
  )
}
