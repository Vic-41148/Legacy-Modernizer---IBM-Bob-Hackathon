import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'

const BEFORE_CODE = `<span class="c-kw">import</span> <span class="c-ns">javax.persistence</span>.*;
<span class="c-kw">import</span> <span class="c-ns">javax.validation.Valid</span>;
<span class="c-kw">import</span> <span class="c-ns">org.hibernate.validator.constraints.NotEmpty</span>;
<span class="c-kw">import</span> <span class="c-ns">java.util.Date</span>;

<span class="c-an">@Entity</span>
<span class="c-kw">public class</span> <span class="c-cl">Pet</span> <span class="c-kw">extends</span> <span class="c-cl">NamedEntity</span> {
    <span class="c-an">@Column</span>(name = <span class="c-st">"birth_date"</span>)
    <span class="c-an">@Temporal</span>(<span class="c-cl">TemporalType</span>.DATE)
    <span class="c-kw">private</span> <span class="c-cl">Date</span> birthDate;
    <span class="c-an">@NotEmpty</span>
    <span class="c-kw">private</span> <span class="c-cl">String</span> name;
}`

const AFTER_CODE = `<span class="c-kw">import</span> <span class="c-ns">jakarta.persistence</span>.*;
<span class="c-kw">import</span> <span class="c-ns">jakarta.validation.Valid</span>;
<span class="c-kw">import</span> <span class="c-ns">jakarta.validation.constraints.NotBlank</span>;
<span class="c-kw">import</span> <span class="c-ns">java.time.LocalDate</span>;

<span class="c-an">@Entity</span>
<span class="c-kw">public class</span> <span class="c-cl">Pet</span> <span class="c-kw">extends</span> <span class="c-cl">NamedEntity</span> {
    <span class="c-an">@Column</span>(name = <span class="c-st">"birth_date"</span>)
    <span class="c-kw">private</span> <span class="c-cl">LocalDate</span> birthDate; <span class="c-cm">// ✓ immutable, thread-safe</span>
    <span class="c-an">@NotBlank</span>
    <span class="c-kw">private</span> <span class="c-cl">String</span> name; <span class="c-cm">// ✓ checks whitespace too</span>
}`

export default function Hero() {
  const [activePane, setActivePane] = useState('before')
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActivePane(p => p === 'before' ? 'after' : 'before')
    }, 4200)
    return () => clearInterval(intervalRef.current)
  }, [])

  // spawn particles
  useEffect(() => {
    const hero = document.querySelector('.hero')
    if (!hero) return
    const colors = ['#a8c8ff','#c4b5fd','#b9f0e8','#fbc8e8','#fde68a','#a7f3d0']
    const particles = []
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div')
      p.className = 'hero-particle'
      const size = 4 + Math.random() * 8
      p.style.cssText = [
        `width:${size}px`,`height:${size}px`,
        `left:${Math.random()*100}%`,`top:${Math.random()*100}%`,
        `background:${colors[i % colors.length]}`,
        `animation-duration:${6 + Math.random()*10}s`,
        `animation-delay:${Math.random()*6}s`,
        `opacity:${0.4 + Math.random()*0.4}`,
      ].join(';')
      hero.appendChild(p)
      particles.push(p)
    }
    return () => particles.forEach(p => p.remove())
  }, [])

  return (
    <section className="hero" id="hero">
      <div className="hero-content-glass">
        <div className="hero-eyebrow">IBM Hackathon 2024</div>
        <h1 className="hero-title">
          Modernize.<br/>
          <span className="hero-gradient">Automatically.</span>
        </h1>
        <p className="hero-sub">
          AI-powered migration from Spring Boot 1.5 to Spring Boot 3.2.<br className="br-desk"/>
          Zero downtime. Zero data loss. 95% automated.
        </p>

        <div className="cost-comparison">
          <div className="cost-col cost-without">
            <div className="cost-label">WITHOUT BOB</div>
            <div className="cost-item"><span className="cost-icon">⏱️</span><span className="cost-value">45 hours</span></div>
            <div className="cost-item"><span className="cost-icon">💰</span><span className="cost-value">$4,500</span></div>
            <div className="cost-item"><span className="cost-icon">⚠️</span><span className="cost-value">23 risks</span></div>
          </div>
          <div className="cost-arrow">→</div>
          <div className="cost-col cost-with">
            <div className="cost-label">WITH BOB</div>
            <div className="cost-item"><span className="cost-icon">⏱️</span><span className="cost-value">3 minutes</span></div>
            <div className="cost-item"><span className="cost-icon">💰</span><span className="cost-value">$50</span></div>
            <div className="cost-item"><span className="cost-icon">✅</span><span className="cost-value">0 errors</span></div>
          </div>
        </div>

        <div className="cost-savings">
          <strong>Save $4,450</strong> and <strong>44 hours</strong>
        </div>

        <div className="hero-actions">
          <Link to="/demo" className="btn-blue">🚀 Try Live Demo →</Link>
          <a href="#problem" className="btn-ghost">See the problem ↓</a>
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="code-window">
          <div className="cw-bar">
            <span className="cw-dot cw-red"/><span className="cw-dot cw-yellow"/><span className="cw-dot cw-green"/>
            <div className="cw-tabs">
              <button className={`cw-tab${activePane==='before'?' active':''}`} onClick={() => setActivePane('before')}>Spring 1.5 — Before</button>
              <span className="cw-sep">→</span>
              <button className={`cw-tab${activePane==='after'?' active':''}`} onClick={() => setActivePane('after')}>Spring Boot 3.2 — After</button>
            </div>
          </div>
          <div className="cw-body">
            <div className={`cw-pane${activePane==='before'?' active':''}`} id="pane-before">
              <span className="badge badge-warn">Legacy · Spring Boot 1.5.4 · Java 8</span>
              <pre><code dangerouslySetInnerHTML={{__html: BEFORE_CODE}}/></pre>
            </div>
            <div className={`cw-pane${activePane==='after'?' active':''}`} id="pane-after">
              <span className="badge badge-ok">Modern · Spring Boot 3.2 · Java 17</span>
              <pre><code dangerouslySetInnerHTML={{__html: AFTER_CODE}}/></pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
