'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'

export default function About() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })
  const logged = useRef(false)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.about, 'info')
    }
  }, [inView])

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const item = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
  }

  return (
    <section id="about" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        animate={inView ? 'show' : 'hidden'}
      >
        {/* Label */}
        <motion.p variants={item} className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
          {d.about.label}
        </motion.p>

        {/* Title */}
        <motion.h2 variants={item} className="text-3xl sm:text-4xl font-semibold text-slate-100 leading-tight mb-12 max-w-xl">
          {d.about.title[0]}
          <br />
          <em className="not-italic text-slate-400">{d.about.title[1]}</em>
        </motion.h2>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Text block */}
          <motion.div variants={item} className="lg:col-span-3 space-y-5">
            {[d.about.p1, d.about.p2, d.about.p3, d.about.p4].map((p, i) => (
              <p
                key={i}
                className={`text-sm leading-relaxed ${
                  i === 3
                    ? 'font-mono text-accent border-l-2 border-accent/40 pl-4 py-1'
                    : 'text-slate-400'
                }`}
              >
                {p}
              </p>
            ))}
          </motion.div>

          {/* Domains */}
          <motion.div variants={item} className="lg:col-span-2">
            <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-4">
              // domain_expertise
            </p>
            <div className="space-y-2">
              {d.about.domains.map((domain, i) => (
                <motion.div
                  key={domain}
                  initial={{ opacity: 0, x: -8 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.4 + i * 0.07, duration: 0.35 }}
                  className="flex items-center gap-3 py-2.5 border-b border-border group"
                >
                  <span className="font-mono text-xs text-accent/60 group-hover:text-accent transition-colors">
                    →
                  </span>
                  <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 transition-colors">
                    {domain}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
