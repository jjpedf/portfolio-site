'use client'

import { useLang } from '@/hooks/useLang'

export default function Footer() {
  const { d } = useLang()

  return (
    <footer className="border-t border-border px-6 py-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-mono text-[11px] text-slate-600">{d.footer.copy}</span>
      <div className="flex items-center gap-6">
        <a
          href="https://www.linkedin.com/in/jorge-peduti-b133881a6/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
        >
          LinkedIn
        </a>
        <a
          href="#about"
          className="font-mono text-[11px] text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
        >
          About
        </a>
        <a
          href="#projects"
          className="font-mono text-[11px] text-slate-600 hover:text-slate-400 transition-colors uppercase tracking-widest"
        >
          Projects
        </a>
      </div>
    </footer>
  )
}
