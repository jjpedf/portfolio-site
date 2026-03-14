'use client'

import { useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'
import ProjectCard from '@/components/ui/ProjectCard'

export default function Projects() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.15 })
  const logged = useRef(false)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.projects, 'cmd')
    }
  }, [inView])

  const cardLabels = {
    tab_problem: d.projects.tab_problem,
    tab_arch: d.projects.tab_arch,
    tab_result: d.projects.tab_result,
    expand: d.projects.expand,
    collapse: d.projects.collapse,
  }

  return (
    <section id="projects" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <p className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
          {d.projects.label}
        </p>
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100 leading-tight mb-12">
          {d.projects.title[0]}
          <br />
          <em className="not-italic text-slate-400">{d.projects.title[1]}</em>
        </h2>
      </motion.div>

      {/* Project cards grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {d.projects.items.map((project, i) => (
          <ProjectCard key={project.num} project={project} labels={cardLabels} index={i} />
        ))}
      </div>
    </section>
  )
}
