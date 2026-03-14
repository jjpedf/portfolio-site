'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'

export default function Stack() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const logged = useRef(false)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.stack, 'info')
    }
  }, [inView])

  return (
    <section id="stack" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <p className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
          {d.stack.label}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100 leading-tight">
          {d.stack.title[0]}
          <br />
          <em className="not-italic text-slate-400">{d.stack.title[1]}</em>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
        {d.stack.items.map((item, i) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
            className="bg-background p-6 group hover:bg-surface transition-colors duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="font-mono text-sm font-medium text-slate-200">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                  {item.category}
                </span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors duration-200">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
