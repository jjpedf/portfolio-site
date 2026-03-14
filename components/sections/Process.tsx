'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'
import DataPipeline from '@/components/ui/DataPipeline'

export default function Process() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const logged = useRef(false)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.process, 'info')
    }
  }, [inView])

  return (
    <section id="process" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
          {d.process.label}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100 leading-tight mb-3">
          {d.process.title[0]}
          <br />
          <em className="not-italic text-slate-400">{d.process.title[1]}</em>
        </h2>
        <p className="font-mono text-xs text-slate-500 tracking-wide">
          {d.process.subtitle}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <DataPipeline nodes={d.process.nodes} />
      </motion.div>
    </section>
  )
}
