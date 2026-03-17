'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
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

export default function Hero() {
  const { d } = useLang()

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
    </section>
  )
}
