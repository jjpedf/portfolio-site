'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'
import ProjectCard, { type Project } from '@/components/ui/ProjectCard'
import BIDashboardModal from '@/components/ProjectModal/BIDashboardModal'

export default function Projects() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.1 })
  const logged = useRef(false)
  const [activeProject, setActiveProject] = useState<Project | null>(null)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.projects, 'cmd')
    }
  }, [inView])

  const items = d.projects.items as unknown as Project[]
  const biProjects = items.filter((p) => p.type === 'bi')
  const featuredProject = items.find((p) => p.type === 'featured')

  const labels = d.projects as typeof d.projects & {
    expand: string
    featured_label: string
    featured_cta: string
    modal_private: string
    modal_close: string
    modal_gallery: string
    modal_overview: string
    modal_arch: string
    modal_impact: string
    modal_datasources: string
    modal_no_images: string
  }

  const cardLabels = {
    expand: labels.expand,
    featured_label: labels.featured_label,
    featured_cta: labels.featured_cta,
    modal_private: labels.modal_private,
  }

  return (
    <>
      <section id="projects" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
            {d.projects.label}
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-slate-100 leading-tight">
            {d.projects.title[0]}
            <br />
            <em className="not-italic text-slate-400">{d.projects.title[1]}</em>
          </h2>
        </motion.div>

        {/* Featured project — full width */}
        {featuredProject && (
          <div className="mb-6">
            <ProjectCard
              project={featuredProject}
              labels={cardLabels}
              index={0}
            />
          </div>
        )}

        {/* BI project cards — 2-col → 3-col grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {biProjects.map((project, i) => (
            <ProjectCard
              key={project.num}
              project={project}
              labels={cardLabels}
              index={i + 1}
              onOpenModal={setActiveProject}
            />
          ))}
        </div>
      </section>

      {/* Modal — rendered outside section to avoid overflow clipping */}
      <BIDashboardModal
        project={activeProject}
        onClose={() => setActiveProject(null)}
      />
    </>
  )
}
