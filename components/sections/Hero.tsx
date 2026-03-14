'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink, Database, Cpu, BarChart2 } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import StatBlock from '@/components/ui/StatBlock'

const EASE = [0.4, 0, 0.2, 1] as const

const FADE_UP = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1 + 0.3, duration: 0.55, ease: EASE },
  }),
}

const PIPELINE_NODES = [
  {
    id: 'raw',
    icon: <Database size={14} />,
    colorClass: 'text-slate-400 border-border-2',
    bgClass: 'bg-surface-2',
  },
  {
    id: 'transform',
    icon: <Cpu size={14} />,
    colorClass: 'text-accent border-accent/30',
    bgClass: 'bg-accent/5',
  },
  {
    id: 'impact',
    icon: <BarChart2 size={14} />,
    colorClass: 'text-success border-success/30',
    bgClass: 'bg-success/5',
  },
]

function MiniPipeline({
  raw,
  transform,
  impact,
}: {
  raw: string
  transform: string
  impact: string
}) {
  const labels = [raw, transform, impact]

  return (
    <div className="flex items-center gap-0">
      {PIPELINE_NODES.map((node, i) => (
        <div key={node.id} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-2 border rounded-sm ${node.colorClass} ${node.bgClass}`}
          >
            <span className={node.colorClass}>{node.icon}</span>
            <span className="font-mono text-[10px] uppercase tracking-widest whitespace-nowrap">
              {labels[i]}
            </span>
          </div>
          {i < PIPELINE_NODES.length - 1 && (
            <div className="relative w-8 flex items-center justify-center overflow-hidden">
              <div className="w-full border-t border-dashed border-border-2" />
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  className={`particle w-1 h-1 rounded-full ${i === 0 ? 'bg-accent' : 'bg-success'} top-1/2 -translate-y-1/2`}
                  style={{
                    animationDuration: '2s',
                    animationDelay: `${j * 0.65}s`,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default function Hero() {
  const { d } = useLang()
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setBootDone(true), 900)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    {
      value: 5,
      suffix: '+',
      label: d.hero.stats.years_label,
    },
    {
      value: 4,
      suffix: '',
      label: d.hero.stats.impl_label,
    },
    {
      value: 1,
      suffix: '×',
      label: d.hero.stats.truth_label,
    },
    {
      value: 0,
      suffix: '',
      label: d.hero.stats.dash_label,
    },
  ]

  return (
    <section className="relative min-h-screen flex flex-col justify-center px-6 pt-20 pb-32 max-w-7xl mx-auto">
      {/* System status badge */}
      <motion.div
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex items-center gap-2 mb-10"
      >
        <span className="w-1.5 h-1.5 rounded-full bg-success cursor-blink" />
        <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
          {d.hero.system_label}
        </span>
        {bootDone && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-[10px] text-slate-600"
          >
            — build=stable · v2.0.0
          </motion.span>
        )}
      </motion.div>

      {/* Tag line */}
      <motion.p
        custom={0}
        variants={FADE_UP}
        initial="hidden"
        animate="show"
        className="font-mono text-xs text-accent mb-5 tracking-widest"
      >
        {d.hero.tag}
      </motion.p>

      {/* Main headline */}
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold leading-tight tracking-tight text-slate-100 mb-6 max-w-3xl">
        {d.hero.headline.map((line, i) => (
          <motion.span
            key={i}
            custom={i + 1}
            variants={FADE_UP}
            initial="hidden"
            animate="show"
            className="block"
          >
            {i === d.hero.headline.length - 1 ? (
              <span className="text-slate-400">{line}</span>
            ) : (
              line
            )}
          </motion.span>
        ))}
      </h1>

      {/* Sub text */}
      <motion.p
        custom={5}
        variants={FADE_UP}
        initial="hidden"
        animate="show"
        className="text-slate-500 text-base leading-relaxed max-w-xl mb-8"
      >
        {d.hero.sub}
      </motion.p>

      {/* CTA buttons */}
      <motion.div
        custom={6}
        variants={FADE_UP}
        initial="hidden"
        animate="show"
        className="flex flex-wrap items-center gap-4 mb-14"
      >
        <a
          href="#projects"
          className="flex items-center gap-2 px-5 py-2.5 border border-accent text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-200 rounded-sm"
        >
          {d.hero.cta_projects}
          <ArrowRight size={12} />
        </a>
        <a
          href="https://www.linkedin.com/in/jorge-peduti-b133881a6/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 border border-border text-slate-400 font-mono text-xs uppercase tracking-widest hover:border-border-2 hover:text-slate-200 transition-all duration-200 rounded-sm"
        >
          {d.hero.cta_linkedin}
          <ExternalLink size={12} />
        </a>
      </motion.div>

      {/* Stats row */}
      <motion.div
        custom={7}
        variants={FADE_UP}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-6 pb-10 border-b border-border"
      >
        {stats.map((s, i) => (
          <StatBlock key={i} value={s.value} suffix={s.suffix} label={s.label} />
        ))}
      </motion.div>

      {/* Mini pipeline teaser */}
      <motion.div
        custom={8}
        variants={FADE_UP}
        initial="hidden"
        animate="show"
        className="mt-10 flex flex-col gap-3"
      >
        <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
          // data_flow_preview
        </p>
        <div className="overflow-x-auto">
          <MiniPipeline
            raw={d.hero.pipeline_teaser.raw}
            transform={d.hero.pipeline_teaser.transform}
            impact={d.hero.pipeline_teaser.impact}
          />
        </div>
        <a
          href="#process"
          className="font-mono text-[10px] text-slate-600 hover:text-accent transition-colors uppercase tracking-widest"
        >
          → inspect full pipeline
        </a>
      </motion.div>
    </section>
  )
}
