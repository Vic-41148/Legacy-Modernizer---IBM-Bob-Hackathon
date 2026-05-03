import { useEffect, useRef } from 'react'

export function useReveal(threshold = 0.08, rootMargin = '0px 0px -32px 0px') {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('visible')
          obs.unobserve(el)
        }
      },
      { threshold, rootMargin }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold, rootMargin])
  return ref
}

export function useRevealAll(selector = '.reveal') {
  useEffect(() => {
    const elements = document.querySelectorAll(selector)
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible')
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    )
    elements.forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [selector])
}
