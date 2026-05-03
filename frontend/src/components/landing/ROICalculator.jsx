import { useState } from 'react'

export default function ROICalculator() {
  const [devs, setDevs] = useState(3)
  const [rate, setRate] = useState(100)
  const [files, setFiles] = useState(30)

  const manualHours = Math.round(files * 1.5)
  const manualCost  = Math.round(devs * manualHours * rate)
  const manualRisk  = Math.round(manualHours * 0.4)
  const bobHours    = Math.max(0.05, files * 0.005)
  const bobCost     = Math.round(50 + files * 0.8)
  const savedCost   = Math.max(0, manualCost - bobCost)
  const savedHours  = Math.max(0, manualHours - Math.ceil(bobHours * 60) / 60)

  const fmt = (n) => n >= 1000 ? `$${(n/1000).toFixed(1)}k` : `$${n}`
  const fmtH = (h) => h >= 1 ? `${Math.round(h)}h` : `${Math.round(h*60)}m`

  return (
    <section className="section section-gradient" id="roi">
      <div className="section-inner">
        <p className="eyebrow">ROI Calculator</p>
        <h2 className="section-title text-blue">What's your migration worth?</h2>
        <p className="section-sub">Drag the sliders to calculate your exact cost and time savings.</p>

        <div className="calculator-container">
          <div className="calculator-inputs">
            {[
              { label:'Developers', val:devs, set:setDevs, min:1, max:20, step:1, fmt:(v)=>`${v} devs` },
              { label:'Hourly Rate (USD)', val:rate, set:setRate, min:25, max:500, step:25, fmt:(v)=>`$${v}/hr` },
              { label:'Java Files to Migrate', val:files, set:setFiles, min:5, max:500, step:5, fmt:(v)=>`${v} files` },
            ].map(({ label, val, set, min, max, step, fmt:f }) => (
              <div className="calc-input-group" key={label}>
                <div className="calc-label">
                  <span className="calc-label-text">{label}</span>
                  <span className="calc-value">{f(val)}</span>
                </div>
                <input type="range" className="calc-slider" min={min} max={max} step={step} value={val}
                  onChange={e => set(Number(e.target.value))}/>
                <div className="calc-range"><span>{f(min)}</span><span>{f(max)}</span></div>
              </div>
            ))}
          </div>

          <div className="calculator-results">
            <div className="calc-result-card calc-manual">
              <div className="calc-result-label">Manual Migration</div>
              <div className="calc-result-time">
                <span className="calc-result-icon">⏱️</span>
                <span className="calc-result-value">{manualHours}</span>
                <span className="calc-result-unit">hours</span>
              </div>
              <div className="calc-result-cost">{fmt(manualCost)}</div>
              <div className="calc-result-risk">⚠️ ~{manualRisk} error-prone hours</div>
            </div>
            <div className="calc-arrow">→</div>
            <div className="calc-result-card calc-bob">
              <div className="calc-result-label">With Bob AI</div>
              <div className="calc-result-time">
                <span className="calc-result-icon">⚡</span>
                <span className="calc-result-value">{fmtH(bobHours)}</span>
                <span className="calc-result-unit">runtime</span>
              </div>
              <div className="calc-result-cost">{fmt(bobCost)}</div>
              <div className="calc-result-risk">✅ 0 manual errors</div>
            </div>
          </div>

          <div className="calculator-savings">
            <div className="calc-savings-label">Your Savings</div>
            <div className="calc-savings-value">
              <span className="calc-savings-money">{fmt(savedCost)}</span>
              <span className="calc-savings-time">+ {Math.round(savedHours)} hours</span>
            </div>
            <p className="calc-savings-sub">
              <span>{Math.round((savedCost / (manualCost||1)) * 100)}% cost reduction</span> — Bob pays for itself in minutes.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
