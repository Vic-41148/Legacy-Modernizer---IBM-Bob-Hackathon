import { useState, useRef, useCallback } from 'react'

const MESSAGES = [
  { type: 'info',    text: '🔍 Initializing Bob AI Analysis Engine...', delay: 500 },
  { type: 'success', text: '✓ Connected to codebase', delay: 800 },
  { type: 'info',    text: '📂 Scanning project structure...', delay: 1200 },
  { type: 'output',  text: '   Found: 27 Java files, 9 test files, 1 pom.xml', delay: 1600 },
  { type: 'info',    text: '🔎 Analyzing dependencies...', delay: 2000 },
  { type: 'warning', text: '⚠️  Detected: Spring Boot 1.5.4 (EOL 2019)', delay: 2400 },
  { type: 'warning', text: '⚠️  Detected: Java 8 (deprecated)', delay: 2600 },
  { type: 'info',    text: '🧬 Scanning for javax.* imports...', delay: 3000 },
  { type: 'error',   text: '❌ Found 23 deprecated javax.* imports', delay: 3400 },
  { type: 'info',    text: '📅 Analyzing Date API usage...', delay: 3800 },
  { type: 'error',   text: '❌ Found 8 java.util.Date instances', delay: 4200 },
  { type: 'info',    text: '🔧 Calculating migration complexity...', delay: 4600 },
  { type: 'output',  text: '   Estimated manual effort: 45 hours', delay: 5000 },
  { type: 'output',  text: '   Estimated cost: $4,500', delay: 5200 },
  { type: 'info',    text: '🤖 Generating automated migration plan...', delay: 5600 },
  { type: 'success', text: '✓ Migration plan ready!', delay: 6000 },
  { type: 'success', text: '✓ 95% automation possible', delay: 6300 },
  { type: 'success', text: '✓ Zero data loss guaranteed', delay: 6500 },
  { type: 'info',    text: '⚡ Bob can complete this in 3 minutes', delay: 6900 },
  { type: 'success', text: '🎉 Analysis complete! Ready to modernize.', delay: 7300 },
]

export default function AnalysisDemo() {
  const [lines, setLines] = useState([])
  const [files, setFiles] = useState(0)
  const [issues, setIssues] = useState(0)
  const [fixes, setFixes] = useState(0)
  const [running, setRunning] = useState(false)
  const [btnText, setBtnText] = useState('▶ Start Analysis')
  const timeouts = useRef([])
  const termRef = useRef(null)

  const clearTimeouts = () => { timeouts.current.forEach(clearTimeout); timeouts.current = [] }

  const runAnalysis = useCallback(() => {
    if (running) return
    setRunning(true)
    setLines([])
    setFiles(0); setIssues(0); setFixes(0)
    setBtnText('⏳ Analyzing...')
    clearTimeouts()

    let fileCount = 0, issueCount = 0, fixCount = 0

    MESSAGES.forEach((msg, i) => {
      const t = setTimeout(() => {
        setLines(prev => [...prev, msg])
        if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight

        if (i < 10) { fileCount = Math.min(fileCount + 3, 33); setFiles(fileCount) }
        if (i >= 7 && i < 12) { issueCount = Math.min(issueCount + 3, 23); setIssues(issueCount) }
        if (i >= 14) { fixCount = Math.min(fixCount + 3, 31); setFixes(fixCount) }

        if (i === MESSAGES.length - 1) {
          setBtnText('✓ Analysis Complete')
          setTimeout(() => { setBtnText('🔄 Run Again'); setRunning(false) }, 2000)
        }
      }, msg.delay)
      timeouts.current.push(t)
    })
  }, [running])

  return (
    <section className="section section-dark" id="analysis">
      <div className="section-inner">
        <div className="section-eyebrow section-eyebrow-light">Watch Bob Work</div>
        <h2 className="section-title section-title-light">
          AI-Powered Analysis in <span className="text-gradient">Real-Time</span>
        </h2>
        <p className="section-sub section-sub-light">See how Bob analyzes your codebase in seconds, not hours.</p>

        <div className="analysis-demo">
          <div className="analysis-terminal">
            <div className="terminal-header">
              <span className="terminal-dot terminal-red"/><span className="terminal-dot terminal-yellow"/><span className="terminal-dot terminal-green"/>
              <span className="terminal-title">Bob AI Analysis Engine</span>
            </div>
            <div className="terminal-body" id="terminal-output" ref={termRef}>
              <div className="terminal-line">
                <span className="terminal-prompt">bob@ai-engine:~$</span>
                <span className="terminal-cmd"> analyze-codebase --project=petclinic</span>
              </div>
              {lines.map((msg, i) => (
                <div key={i} className={`terminal-line terminal-${msg.type}`}>{msg.text}</div>
              ))}
            </div>
          </div>

          <div className="analysis-stats" id="analysis-stats">
            {[['📁', files, 'Files Scanned'],['⚠️', issues, 'Issues Found'],['✅', fixes, 'Auto-Fixes Ready']].map(([icon, val, lbl]) => (
              <div className="analysis-stat" key={lbl}>
                <div className="analysis-stat-icon">{icon}</div>
                <div className="analysis-stat-value">{val}</div>
                <div className="analysis-stat-label">{lbl}</div>
              </div>
            ))}
          </div>

          <button className="btn-blue btn-lg" id="start-analysis" onClick={runAnalysis} style={{marginTop:'32px'}} disabled={running && btnText === '⏳ Analyzing...'}>
            <span>{btnText}</span>
          </button>
        </div>
      </div>
    </section>
  )
}
