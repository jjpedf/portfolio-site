'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, Terminal } from 'lucide-react'
import type { TerminalMsgType } from '@/lib/terminal-messages'

interface LogMessage {
  id: number
  text: string
  type: TerminalMsgType
  time: string
}

const MAX = 6

function now() {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export default function TerminalLog() {
  const [messages, setMessages] = useState<LogMessage[]>([])
  const [open, setOpen] = useState(true)
  const idRef = useRef(0)
  const endRef = useRef<HTMLDivElement>(null)

  const push = (text: string, type: TerminalMsgType = 'info') => {
    const entry: LogMessage = { id: ++idRef.current, text, type, time: now() }
    setMessages((prev) => {
      const next = [...prev, entry]
      return next.length > MAX ? next.slice(next.length - MAX) : next
    })
  }

  useEffect(() => {
    const boot: Array<{ text: string; type: TerminalMsgType; delay: number }> =
      [
        {
          text: '[sys] initializing portfolio v2.0...',
          type: 'info',
          delay: 600,
        },
        {
          text: '[sys] loading analytics_engineer profile... done',
          type: 'success',
          delay: 1400,
        },
        {
          text: '[data] 3 projects indexed · 6 process steps mapped',
          type: 'info',
          delay: 2200,
        },
        {
          text: '[sys] build=stable · lang=EN · ready',
          type: 'success',
          delay: 3000,
        },
      ]

    boot.forEach(({ text, type, delay }) =>
      setTimeout(() => push(text, type), delay)
    )

    const handler = (e: Event) => {
      const { text, type } = (e as CustomEvent<{ text: string; type: TerminalMsgType }>).detail
      push(text, type)
    }
    window.addEventListener('terminal:log', handler)
    return () => window.removeEventListener('terminal:log', handler)
  }, [])

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, open])

  const color: Record<TerminalMsgType, string> = {
    info: 'text-slate-400',
    success: 'text-success',
    warn: 'text-warning',
    cmd: 'text-accent',
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface/95 backdrop-blur-md">
      {/* Header bar */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-8 border-b border-border/40">
          <div className="flex items-center gap-2">
            <Terminal size={11} className="text-slate-500" />
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
              terminal
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-success cursor-blink" />
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-1 font-mono text-[10px] text-slate-600 hover:text-slate-400 transition-colors"
          >
            {open ? (
              <>
                minimize <ChevronDown size={10} />
              </>
            ) : (
              <>
                expand <ChevronUp size={10} />
              </>
            )}
          </button>
        </div>

        {/* Messages */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="log"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="py-2 space-y-0.5 max-h-24 overflow-y-auto">
                {messages.map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-slate-600 shrink-0 pt-px tabular-nums">
                      {msg.time}
                    </span>
                    <span className={`font-mono text-[11px] leading-relaxed ${color[msg.type]}`}>
                      {msg.text}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-1.5 pt-0.5" ref={endRef}>
                  <span className="font-mono text-[11px] text-slate-600">$</span>
                  <span className="inline-block w-1.5 h-3 bg-slate-600 cursor-blink" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
