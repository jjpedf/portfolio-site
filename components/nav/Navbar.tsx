'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'

export default function Navbar() {
  const { lang, setLang, d } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleLang = (l: 'en' | 'pt') => {
    setLang(l)
    terminalLog(MSG.langSwitch(l), 'info')
  }

  const links = [
    { href: '#about', label: d.nav.about },
    { href: '#projects', label: d.nav.projects },
    { href: '#process', label: d.nav.process },
    { href: '#stack', label: 'Stack' },
    { href: '#contact', label: d.nav.contact },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo + status */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="font-mono text-sm font-medium text-slate-200 tracking-widest hover:text-accent transition-colors"
          >
            JP
          </a>
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success cursor-blink" />
            <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
              {d.hero.system_label}
            </span>
          </div>
        </div>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="font-mono text-[11px] text-slate-500 hover:text-slate-200 uppercase tracking-widest transition-colors duration-200"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Lang toggle + mobile menu button */}
        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border rounded-sm overflow-hidden">
            {(['en', 'pt'] as const).map((l) => (
              <button
                key={l}
                onClick={() => handleLang(l)}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest transition-all duration-200 ${
                  lang === l
                    ? 'bg-accent text-white'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span
              className={`w-4 h-px bg-slate-400 transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`}
            />
            <span
              className={`w-4 h-px bg-slate-400 transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`}
            />
            <span
              className={`w-4 h-px bg-slate-400 transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <motion.div
        initial={false}
        animate={{ height: mobileOpen ? 'auto' : 0, opacity: mobileOpen ? 1 : 0 }}
        transition={{ duration: 0.2 }}
        className="md:hidden overflow-hidden border-t border-border bg-surface/95 backdrop-blur-md"
      >
        <ul className="flex flex-col px-6 py-4 gap-4">
          {links.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                onClick={() => setMobileOpen(false)}
                className="font-mono text-xs text-slate-400 hover:text-slate-200 uppercase tracking-widest transition-colors"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </motion.div>
    </header>
  )
}
