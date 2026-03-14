'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { terminalLog, MSG } from '@/lib/terminal-messages'

interface Project {
  num: string
  kpi: string
  kpi_label: string
  title: string
  overview: string
  problem: string
  architecture: string
  result: string
  tags: string[]
}

type Tab = 'problem' | 'architecture' | 'result'

interface ProjectCardProps {
  project: Project
  labels: {
    tab_problem: string
    tab_arch: string
    tab_result: string
    expand: string
    collapse: string
  }
  index: number
}

const TAB_CONTENT_MAP: Record<Tab, keyof Project> = {
  problem: 'problem',
  architecture: 'architecture',
  result: 'result',
}

const TAB_ICONS: Record<Tab, string> = {
  problem: '//  PROBLEM',
  architecture: '//  ARCHITECTURE',
  result: '//  RESULT',
}

export default function ProjectCard({ project, labels, index }: ProjectCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('problem')

  const handleExpand = () => {
    if (!expanded) terminalLog(MSG.projectInspect(project.num), 'cmd')
    setExpanded((v) => !v)
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'problem', label: labels.tab_problem },
    { id: 'architecture', label: labels.tab_arch },
    { id: 'result', label: labels.tab_result },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border border-border bg-surface rounded-sm overflow-hidden group hover:border-border-2 transition-colors duration-300"
    >
      {/* Card header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-4 mb-4">
          <span className="font-mono text-[10px] text-slate-600 tracking-widest uppercase">
            {project.num}
          </span>
          <div className="text-right shrink-0">
            <div className="font-mono text-2xl font-medium text-accent leading-none">
              {project.kpi}
            </div>
            <div className="font-mono text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
              {project.kpi_label}
            </div>
          </div>
        </div>

        <h3 className="text-slate-200 font-medium text-base leading-snug mb-3">
          {project.title}
        </h3>

        <p className="text-slate-500 text-sm leading-relaxed">{project.overview}</p>

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

      {/* Expand toggle */}
      <button
        onClick={handleExpand}
        className="w-full flex items-center justify-between px-6 py-3 border-t border-border font-mono text-[11px] text-slate-500 hover:text-accent hover:bg-accent/5 transition-all duration-200 group/btn"
      >
        <span>{expanded ? labels.collapse : labels.expand}</span>
        <motion.span
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={12} />
        </motion.span>
      </button>

      {/* Expandable detail panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden border-t border-border"
          >
            {/* Tab nav */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 font-mono text-[11px] uppercase tracking-widest transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'text-accent border-b-2 border-accent bg-accent/5'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="p-6"
              >
                <p className="font-mono text-[11px] text-slate-500 mb-3 uppercase tracking-widest">
                  {TAB_ICONS[activeTab]}
                </p>
                <p className="text-slate-300 text-sm leading-relaxed">
                  {project[TAB_CONTENT_MAP[activeTab]] as string}
                </p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
