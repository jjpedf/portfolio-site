'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Database, BarChart3, TrendingUp, Images, ChevronLeft, ChevronRight } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import type { Project } from '@/components/ui/ProjectCard'

type Tab = 'overview' | 'gallery' | 'architecture' | 'impact'

interface BIDashboardModalProps {
  project: Project | null
  onClose: () => void
}

const TAB_ICONS: Record<Tab, typeof BarChart3> = {
  overview: BarChart3,
  gallery: Images,
  architecture: Database,
  impact: TrendingUp,
}

export default function BIDashboardModal({ project, onClose }: BIDashboardModalProps) {
  const { d } = useLang()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)

  // Reset tab when a new project opens
  useEffect(() => {
    if (project) setActiveTab('overview')
  }, [project?.num])

  // Escape key closes modal / lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (lightboxIdx !== null) setLightboxIdx(null)
        else onClose()
      }
      if (lightboxIdx !== null && project) {
        if (e.key === 'ArrowRight')
          setLightboxIdx((i) => (i! + 1) % project.images.length)
        if (e.key === 'ArrowLeft')
          setLightboxIdx((i) => (i! - 1 + project.images.length) % project.images.length)
      }
    },
    [lightboxIdx, onClose, project],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  // Lock body scroll while open
  useEffect(() => {
    document.body.style.overflow = project ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [project])

  const labels = d.projects as typeof d.projects & {
    modal_close: string
    modal_gallery: string
    modal_overview: string
    modal_arch: string
    modal_impact: string
    modal_datasources: string
    modal_no_images: string
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'overview',     label: labels.modal_overview },
    { id: 'gallery',      label: labels.modal_gallery },
    { id: 'architecture', label: labels.modal_arch },
    { id: 'impact',       label: labels.modal_impact },
  ]

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          />

          {/* Modal panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-x-4 top-[5vh] bottom-[5vh] z-50 flex flex-col
                       max-w-5xl mx-auto bg-surface border border-border rounded-sm overflow-hidden
                       shadow-2xl shadow-black/60"
          >
            {/* ── Header ─────────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border shrink-0">
              <div className="min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-[10px] text-accent tracking-widest uppercase">
                    {project.num}
                  </span>
                  <span className="font-mono text-[10px] text-slate-600 tracking-widest">
                    ·
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                    Case Study
                  </span>
                </div>
                <h2 className="text-slate-100 font-semibold text-base sm:text-lg leading-snug truncate pr-4">
                  {project.title}
                </h2>
              </div>

              {/* KPI + close */}
              <div className="flex items-start gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="font-mono text-2xl font-semibold text-accent leading-none">
                    {project.kpi}
                  </div>
                  <div className="font-mono text-[10px] text-slate-500 mt-0.5 uppercase tracking-wide">
                    {project.kpi_label}
                  </div>
                </div>
                <button
                  onClick={onClose}
                  aria-label={labels.modal_close}
                  className="p-1.5 text-slate-500 hover:text-slate-200 hover:bg-surface-2 rounded-sm transition-colors duration-150"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* ── Tab nav ─────────────────────────────────────────────────── */}
            <div className="flex border-b border-border shrink-0 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = TAB_ICONS[tab.id]
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 sm:px-6 py-3 font-mono text-[11px] uppercase tracking-widest whitespace-nowrap transition-all duration-200 border-b-2 ${
                      activeTab === tab.id
                        ? 'text-accent border-accent bg-accent/5'
                        : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-surface-2'
                    }`}
                  >
                    <Icon size={11} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* ── Tab content ─────────────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.18 }}
                  className="p-6 sm:p-8"
                >
                  {/* OVERVIEW */}
                  {activeTab === 'overview' && (
                    <div className="grid sm:grid-cols-3 gap-8">
                      <div className="sm:col-span-2 space-y-6">
                        <Section label="// CONTEXT">
                          <p className="text-slate-300 text-sm leading-relaxed">{project.overview}</p>
                        </Section>
                        <Section label="// PROBLEM">
                          <p className="text-slate-300 text-sm leading-relaxed">{project.problem}</p>
                        </Section>
                      </div>

                      {/* Sidebar */}
                      <div className="space-y-5">
                        <Section label={`// ${labels.modal_datasources.toUpperCase()}`}>
                          <ul className="space-y-1.5">
                            {project.data_sources.map((src) => (
                              <li key={src} className="flex items-center gap-2 text-slate-400 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                                {src}
                              </li>
                            ))}
                          </ul>
                        </Section>

                        <Section label="// STACK">
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className="font-mono text-[10px] px-2 py-0.5 border border-accent/25 text-accent/80 rounded-sm uppercase tracking-wide bg-accent/5"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </Section>
                      </div>
                    </div>
                  )}

                  {/* GALLERY */}
                  {activeTab === 'gallery' && (
                    <>
                      {project.images.length === 0 ? (
                        <EmptyGallery message={labels.modal_no_images} />
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {project.images.map((src, i) => (
                            <GalleryThumb
                              key={src}
                              src={src}
                              alt={`${project.title} — screenshot ${i + 1}`}
                              onClick={() => setLightboxIdx(i)}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  {/* ARCHITECTURE */}
                  {activeTab === 'architecture' && (
                    <div className="grid sm:grid-cols-3 gap-8">
                      <div className="sm:col-span-2">
                        <Section label="// TECHNICAL DESIGN">
                          <p className="text-slate-300 text-sm leading-relaxed">{project.architecture}</p>
                        </Section>

                        {/* Data flow diagram */}
                        <div className="mt-6">
                          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-4">// DATA FLOW</p>
                          <DataFlow sources={project.data_sources} tags={project.tags} />
                        </div>
                      </div>

                      <div>
                        <Section label={`// ${labels.modal_datasources.toUpperCase()}`}>
                          <ul className="space-y-2">
                            {project.data_sources.map((src) => (
                              <li key={src} className="flex items-start gap-2 text-slate-400 text-sm">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                                {src}
                              </li>
                            ))}
                          </ul>
                        </Section>
                      </div>
                    </div>
                  )}

                  {/* IMPACT */}
                  {activeTab === 'impact' && (
                    <div className="space-y-6">
                      <Section label="// OUTCOME">
                        <p className="text-slate-300 text-sm leading-relaxed">{project.result}</p>
                      </Section>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <ImpactCard kpi={project.kpi} label={project.kpi_label} />
                        {project.data_sources.map((src) => (
                          <div
                            key={src}
                            className="border border-border rounded-sm p-4 bg-surface-2"
                          >
                            <p className="font-mono text-[10px] text-accent uppercase tracking-widest mb-1">
                              // SOURCE INTEGRATED
                            </p>
                            <p className="text-slate-300 text-sm">{src}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* ── Lightbox ──────────────────────────────────────────────────── */}
          <AnimatePresence>
            {lightboxIdx !== null && project.images.length > 0 && (
              <motion.div
                key="lightbox"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/90 backdrop-blur flex items-center justify-center p-4"
                onClick={() => setLightboxIdx(null)}
              >
                <button
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                  onClick={() => setLightboxIdx(null)}
                >
                  <X size={20} />
                </button>

                {project.images.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 text-white/60 hover:text-white transition-colors p-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxIdx((i) => (i! - 1 + project.images.length) % project.images.length)
                      }}
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="absolute right-4 text-white/60 hover:text-white transition-colors p-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        setLightboxIdx((i) => (i! + 1) % project.images.length)
                      }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                <div
                  className="relative max-w-4xl max-h-[80vh] w-full h-full flex items-center justify-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={project.images[lightboxIdx]}
                    alt={`${project.title} — screenshot ${lightboxIdx + 1}`}
                    className="max-w-full max-h-[80vh] object-contain"
                  />
                </div>

                {project.images.length > 1 && (
                  <div className="absolute bottom-4 flex gap-1.5">
                    {project.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation()
                          setLightboxIdx(i)
                        }}
                        className={`w-1.5 h-1.5 rounded-full transition-colors duration-200 ${
                          i === lightboxIdx ? 'bg-accent' : 'bg-white/30'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-3">{label}</p>
      {children}
    </div>
  )
}

function ImpactCard({ kpi, label }: { kpi: string; label: string }) {
  return (
    <div className="border border-accent/30 rounded-sm p-5 bg-accent/5 flex flex-col gap-1">
      <p className="font-mono text-[10px] text-accent uppercase tracking-widest">// PRIMARY KPI</p>
      <p className="font-mono text-4xl font-semibold text-accent leading-none mt-2">{kpi}</p>
      <p className="font-mono text-[11px] text-slate-400 uppercase tracking-wide mt-1">{label}</p>
    </div>
  )
}

function DataFlow({ sources, tags }: { sources: string[]; tags: string[] }) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
      {/* Raw */}
      <div className="flex-1 border border-border rounded-sm p-3 bg-surface-2">
        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2">Raw Sources</p>
        <div className="space-y-1">
          {sources.slice(0, 3).map((s) => (
            <p key={s} className="font-mono text-[10px] text-slate-400">{s}</p>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center shrink-0">
        <div className="hidden sm:flex flex-col items-center gap-1">
          <div className="w-8 h-px bg-accent/40" />
          <span className="font-mono text-[8px] text-accent/60 uppercase">transform</span>
        </div>
        <div className="sm:hidden w-px h-6 bg-accent/40 mx-auto" />
      </div>

      {/* Transform */}
      <div className="flex-1 border border-accent/20 rounded-sm p-3 bg-accent/5">
        <p className="font-mono text-[9px] text-accent uppercase tracking-widest mb-2">Stack</p>
        <div className="flex flex-wrap gap-1">
          {tags.slice(0, 4).map((t) => (
            <span key={t} className="font-mono text-[9px] text-accent/70">{t}</span>
          ))}
        </div>
      </div>

      {/* Arrow */}
      <div className="flex items-center justify-center shrink-0">
        <div className="hidden sm:flex flex-col items-center gap-1">
          <div className="w-8 h-px bg-accent/40" />
          <span className="font-mono text-[8px] text-accent/60 uppercase">deliver</span>
        </div>
        <div className="sm:hidden w-px h-6 bg-accent/40 mx-auto" />
      </div>

      {/* Output */}
      <div className="flex-1 border border-border rounded-sm p-3 bg-surface-2">
        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2">Output</p>
        <p className="font-mono text-[10px] text-slate-400">Power BI Dashboard</p>
        <p className="font-mono text-[10px] text-slate-400">Live · Governed · Adopted</p>
      </div>
    </div>
  )
}

function GalleryThumb({
  src,
  alt,
  onClick,
}: {
  src: string
  alt: string
  onClick: () => void
}) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div className="aspect-video bg-surface-2 rounded-sm border border-border flex flex-col items-center justify-center gap-2">
        <Images size={20} className="text-slate-600" />
        <span className="font-mono text-[9px] text-slate-600 uppercase tracking-widest">
          Image pending
        </span>
      </div>
    )
  }

  return (
    <button
      onClick={onClick}
      className="relative aspect-video bg-surface-2 rounded-sm overflow-hidden border border-border hover:border-accent/40 transition-colors duration-200 group"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute inset-0 bg-background/0 group-hover:bg-background/20 transition-colors duration-200 flex items-center justify-center">
        <span className="font-mono text-[10px] text-white/0 group-hover:text-white/80 uppercase tracking-widest transition-colors duration-200">
          Expand
        </span>
      </div>
    </button>
  )
}

function EmptyGallery({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center mb-4">
        <Images size={20} className="text-slate-600" />
      </div>
      <p className="font-mono text-[11px] text-slate-500 uppercase tracking-widest mb-2">
        // NO IMAGES YET
      </p>
      <p className="text-slate-500 text-sm max-w-sm leading-relaxed">{message}</p>
      <p className="font-mono text-[10px] text-slate-600 mt-3 uppercase tracking-widest">
        Run: powershell .\scripts\extract-pptx-images.ps1
      </p>
    </div>
  )
}
