'use client'

import { useEffect, useRef, useState } from 'react'

interface StatBlockProps {
  value: number
  suffix?: string
  label: string
}

function useCountUp(target: number, inView: boolean, duration = 1200) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (target === 0) {
      setCurrent(0)
      return
    }
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
      else setCurrent(target)
    }
    const id = requestAnimationFrame(step)
    return () => cancelAnimationFrame(id)
  }, [inView, target, duration])

  return current
}

export default function StatBlock({ value, suffix = '', label }: StatBlockProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  const count = useCountUp(value, inView)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-1.5">
      <div className="font-mono text-4xl font-medium text-slate-100 tabular-nums leading-none">
        {count}
        <span className="text-accent">{suffix}</span>
      </div>
      <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wide leading-relaxed whitespace-pre-line">
        {label}
      </p>
    </div>
  )
}
