'use client'

import { motion } from 'framer-motion'
import { Lock, ExternalLink, ArrowRight } from 'lucide-react'
import { terminalLog, MSG } from '@/lib/terminal-messages'

export interface Project {
  num: string
  type: 'bi' | 'featured'
  kpi: string
  kpi_label: string
  title: string
  overview: string
  problem: string
  architecture: string
  result: string
  data_sources: string[]
  tags: string[]
  images: string[]
  featured_badge?: string
}

interface ProjectCardProps {
  project: Project
  labels: {
    expand: string
    featured_label: string
    featured_cta: string
    modal_private: string
  }
  index: number
  onOpenModal?: (project: Project) => void
}

export default function ProjectCard({ project, labels, index, onOpenModal }: ProjectCardProps) {
  const isFeatured = project.type === 'featured'

  const handleOpen = () => {
    terminalLog(MSG.projectInspect(project.num), 'cmd')
    onOpenModal?.(project)
  }

  if (isFeatured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.5, delay: index * 0.08 }}
        className="relative border border-accent/40 bg-surface rounded-sm overflow-hidden group hover:border-accent/70 transition-colors duration-300"
      >
        {/* Featured accent bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-accent/0 via-accent to-accent/0" />

        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
            {/* Left: label + badge */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                {labels.featured_label}
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] px-2 py-0.5 bg-accent/10 border border-accent/30 text-accent rounded-sm uppercase tracking-wider">
                <Lock size={8} />
                {labels.modal_private.split('·')[1]?.trim() ?? 'Private Repo'}
              </span>
            </div>

            {/* Right: KPI */}
            <div className="text-right shrink-0">
              <div className="font-mono text-3xl font-semibold text-accent leading-none">
                {project.kpi}
              </div>
              <div className="font-mono text-[10px] text-slate-400 mt-0.5 uppercase tracking-wide">
                {project.kpi_label}
              </div>
            </div>
          </div>

          <div className="sm:flex sm:gap-8 sm:items-start">
            {/* Text block */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-100 font-semibold text-lg sm:text-xl leading-snug mb-3">
                {project.title}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-5">
                {project.overview}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-[10px] px-2 py-0.5 border border-accent/25 text-accent/70 rounded-sm uppercase tracking-wide bg-accent/5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA panel */}
            <div className="mt-6 sm:mt-0 sm:shrink-0 sm:w-48 flex flex-col items-start sm:items-end gap-3">
              <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest leading-relaxed sm:text-right">
                Repository private.<br />Case study available<br />on request.
              </p>
              <span className="inline-flex items-center gap-2 font-mono text-[11px] text-accent border border-accent/30 px-3 py-1.5 rounded-sm bg-accent/5 cursor-default">
                <ExternalLink size={10} />
                {labels.featured_cta}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // Standard BI project card
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="border border-border bg-surface rounded-sm overflow-hidden group hover:border-border-2 transition-colors duration-300 flex flex-col"
    >
      {/* Card header */}
      <div className="p-6 pb-4 flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="font-mono text-[10px] text-slate-500 tracking-widest uppercase">
            {project.num}
          </span>
          <div className="text-right shrink-0">
            <div className="font-mono text-2xl font-semibold text-accent leading-none">
              {project.kpi}
            </div>
            <div className="font-mono text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
              {project.kpi_label}
            </div>
          </div>
        </div>

        <h3 className="text-slate-200 font-semibold text-base leading-snug mb-3">
          {project.title}
        </h3>

        <p className="text-slate-400 text-sm leading-relaxed">{project.overview}</p>

        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] px-2 py-0.5 border border-border text-slate-500 rounded-sm uppercase tracking-wide"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Open case study */}
      <button
        onClick={handleOpen}
        className="w-full flex items-center justify-between px-6 py-3 border-t border-border font-mono text-[11px] text-slate-500 hover:text-accent hover:bg-accent/5 transition-all duration-200 group/btn"
      >
        <span>{labels.expand}</span>
        <motion.span
          className="group-hover/btn:translate-x-1 transition-transform duration-200"
        >
          <ArrowRight size={12} />
        </motion.span>
      </button>
    </motion.div>
  )
}
