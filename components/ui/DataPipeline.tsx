'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Database, Cpu, BarChart2, ChevronDown } from 'lucide-react'
import { terminalLog, MSG } from '@/lib/terminal-messages'

type NodeId = 'raw' | 'transform' | 'impact'

interface NodeData {
  id: NodeId
  icon: React.ReactNode
  accentClass: string
  borderClass: string
  bgClass: string
}

const NODES: NodeData[] = [
  {
    id: 'raw',
    icon: <Database size={18} />,
    accentClass: 'text-slate-400',
    borderClass: 'border-border-2',
    bgClass: 'bg-surface-2',
  },
  {
    id: 'transform',
    icon: <Cpu size={18} />,
    accentClass: 'text-warning',
    borderClass: 'border-warning/40',
    bgClass: 'bg-warning/5',
  },
  {
    id: 'impact',
    icon: <BarChart2 size={18} />,
    accentClass: 'text-success',
    borderClass: 'border-success/40',
    bgClass: 'bg-success/5',
  },
]

const PARTICLES = [0, 1, 2, 3]

interface PipelineNodeData {
  title: string
  badge: string
  desc: string
  items: string[]
}

interface DataPipelineProps {
  nodes: {
    raw: PipelineNodeData
    transform: PipelineNodeData
    impact: PipelineNodeData
  }
}

function Pipe({ color }: { color: 'warning' | 'success' }) {
  const dotClass = color === 'warning' ? 'bg-warning' : 'bg-success'
  const lineClass = color === 'warning' ? 'border-warning/30' : 'border-success/30'

  return (
    <div className="hidden md:flex items-center flex-1 max-w-20 relative mx-2">
      <div className={`w-full border-t border-dashed ${lineClass}`} />
      {PARTICLES.map((i) => (
        <span
          key={i}
          className={`particle w-1.5 h-1.5 rounded-full ${dotClass} top-1/2 -translate-y-1/2`}
          style={{
            animationDuration: '2.4s',
            animationDelay: `${i * 0.6}s`,
          }}
        />
      ))}
      <svg
        className={`absolute right-0 top-1/2 -translate-y-1/2 ${color === 'warning' ? 'text-warning/40' : 'text-success/40'}`}
        width="6"
        height="8"
        viewBox="0 0 6 8"
        fill="currentColor"
      >
        <path d="M0 0l6 4-6 4V0z" />
      </svg>
    </div>
  )
}

export default function DataPipeline({ nodes }: DataPipelineProps) {
  const [active, setActive] = useState<NodeId | null>(null)

  const handleNodeClick = (id: NodeId) => {
    if (active === id) {
      setActive(null)
    } else {
      setActive(id)
      const logMap: Record<NodeId, string> = {
        raw: MSG.pipelineRaw,
        transform: MSG.pipelineTransform,
        impact: MSG.pipelineImpact,
      }
      terminalLog(logMap[id], id === 'impact' ? 'success' : id === 'transform' ? 'cmd' : 'warn')
    }
  }

  const nodeData: Record<NodeId, PipelineNodeData> = {
    raw: nodes.raw,
    transform: nodes.transform,
    impact: nodes.impact,
  }

  const activeNode = active ? { data: nodeData[active], meta: NODES.find((n) => n.id === active)! } : null

  return (
    <div className="w-full">
      {/* Pipeline row */}
      <div className="flex items-stretch gap-0 md:gap-0">
        {NODES.map((node, i) => {
          const data = nodeData[node.id]
          const isActive = active === node.id

          return (
            <div key={node.id} className="flex items-center flex-1 min-w-0">
              <button
                onClick={() => handleNodeClick(node.id)}
                className={`w-full text-left border rounded-sm p-4 transition-all duration-300 ${node.borderClass} ${node.bgClass} ${
                  isActive
                    ? 'ring-1 ring-offset-0 ' +
                      (node.id === 'raw'
                        ? 'ring-slate-500'
                        : node.id === 'transform'
                        ? 'ring-warning/60'
                        : 'ring-success/60')
                    : 'hover:opacity-80'
                }`}
              >
                {/* Node header */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`${node.accentClass}`}>{node.icon}</span>
                  <motion.span
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-slate-600"
                  >
                    <ChevronDown size={12} />
                  </motion.span>
                </div>

                <p className={`font-mono text-xs font-medium uppercase tracking-widest mb-1 ${node.accentClass}`}>
                  {data.title}
                </p>

                <p className="font-mono text-[9px] text-slate-600 uppercase tracking-wide leading-relaxed">
                  {data.badge}
                </p>
              </button>

              {/* Pipe connector */}
              {i < NODES.length - 1 && (
                <Pipe color={i === 0 ? 'warning' : 'success'} />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile stacking separators */}
      <div className="md:hidden flex flex-col gap-2 mt-2">
        {NODES.slice(0, -1).map((_, i) => (
          <div key={i} className="flex flex-col items-center">
            <div className="w-px h-6 border-l border-dashed border-border-2" />
            <svg className="text-border-2" width="6" height="6" viewBox="0 0 6 8" fill="currentColor">
              <path d="M0 0l6 4-6 4V0z" style={{ transform: 'rotate(90deg)', transformOrigin: 'center' }} />
            </svg>
          </div>
        ))}
      </div>

      {/* Expanded detail panel */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            key={active}
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div
              className={`border rounded-sm p-6 ${activeNode.meta.borderClass} ${activeNode.meta.bgClass}`}
            >
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3">
                // {activeNode.data.title} — detail view
              </p>
              <p className={`font-mono text-sm mb-4 ${activeNode.meta.accentClass}`}>
                {activeNode.data.desc}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {activeNode.data.items.map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className={`font-mono text-xs mt-0.5 ${activeNode.meta.accentClass}`}>
                      →
                    </span>
                    <span className="font-mono text-xs text-slate-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
