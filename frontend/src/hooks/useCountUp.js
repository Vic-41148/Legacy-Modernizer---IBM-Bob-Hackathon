import { useState, useEffect, useRef } from 'react'

const easeOutQuart = t => 1 - Math.pow(1 - t, 4)

export function useCountUp(target, duration = 1800, trigger = true) {
  const [value, setValue] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!trigger) return
    if (target === 0) { setValue(0); return }
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      setValue(Math.round(easeOutQuart(p) * target))
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, trigger])

  return value
}

export function useSlotCounter(target, duration = 1800, trigger = true) {
  const [display, setDisplay] = useState('0')
  const rafRef = useRef(null)
  const chars = '0123456789'

  useEffect(() => {
    if (!trigger) return
    if (target === 0) { setDisplay('0'); return }
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      if (p < 0.65) {
        setDisplay(chars[Math.floor(Math.random() * 10)])
      } else {
        setDisplay(String(Math.round(easeOutQuart((p - 0.65) / 0.35) * target)))
      }
      if (p < 1) rafRef.current = requestAnimationFrame(tick)
      else setDisplay(String(target))
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, trigger])

  return display
}
