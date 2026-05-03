import { useEffect } from 'react'
import { useRevealAll } from '../hooks/useReveal'
import Nav from '../components/landing/Nav'
import Hero from '../components/landing/Hero'
import ProblemSection from '../components/landing/ProblemSection'
import StatsStrip from '../components/landing/StatsStrip'
import AnalysisDemo from '../components/landing/AnalysisDemo'
import SolutionFlow from '../components/landing/SolutionFlow'
import FeaturesGrid from '../components/landing/FeaturesGrid'
import ResultsMetrics from '../components/landing/ResultsMetrics'
import ROICalculator from '../components/landing/ROICalculator'
import PhasesTimeline from '../components/landing/PhasesTimeline'
import TechStack from '../components/landing/TechStack'
import Footer from '../components/landing/Footer'

export default function LandingPage() {
  // Wire up all scroll reveals
  useRevealAll('.reveal')

  // Scroll progress bar
  useEffect(() => {
    const bar = document.getElementById('scroll-progress')
    if (!bar) return
    const onScroll = () => {
      const pct = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
      bar.style.width = `${Math.round(pct * 100)}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Custom cursor
  useEffect(() => {
    const trail = document.getElementById('cursor-trail')
    const dot   = document.getElementById('cursor-dot')
    if (!trail || !dot) return
    let mx = 0, my = 0, tx = 0, ty = 0
    const onMove = (e) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('mousemove', onMove)
    let raf
    const tick = () => {
      tx += (mx - tx) * 0.12
      ty += (my - ty) * 0.12
      trail.style.transform = `translate(${tx - 18}px,${ty - 18}px)`
      dot.style.transform   = `translate(${mx - 3}px,${my - 3}px)`
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    const onEnter = () => trail.classList.add('hovered')
    const onLeave = () => trail.classList.remove('hovered')
    document.querySelectorAll('a,button,[data-hover]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  // Orb parallax on mousemove
  useEffect(() => {
    const orbs = document.querySelectorAll('.orb')
    if (!orbs.length) return
    const onMove = (e) => {
      const cx = window.innerWidth / 2, cy = window.innerHeight / 2
      const dx = (e.clientX - cx) / cx, dy = (e.clientY - cy) / cy
      orbs.forEach((orb, i) => {
        const depth = 0.012 + i * 0.006
        orb.style.transform += ` translate(${dx * depth * 60}px, ${dy * depth * 60}px)`
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      {/* Ambient background */}
      <div id="orb-canvas" aria-hidden="true">
        <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
        <div className="orb orb-4"/><div className="orb orb-5"/><div className="orb orb-6"/>
      </div>

      {/* Scroll progress */}
      <div id="scroll-progress" aria-hidden="true"/>

      {/* Custom cursor (hidden on touch) */}
      <div id="cursor-trail" aria-hidden="true"/>
      <div id="cursor-dot"   aria-hidden="true"/>

      <Nav />

      <main id="main-content">
        <Hero />
        <StatsStrip />
        <ProblemSection />
        <AnalysisDemo />
        <SolutionFlow />
        <FeaturesGrid />
        <ResultsMetrics />
        <ROICalculator />
        <PhasesTimeline />
        <TechStack />
      </main>

      <Footer />
    </>
  )
}
