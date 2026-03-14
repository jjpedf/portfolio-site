'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ExternalLink, Mail } from 'lucide-react'
import { useLang } from '@/hooks/useLang'
import { terminalLog, MSG } from '@/lib/terminal-messages'

export default function Contact() {
  const { d } = useLang()
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.2 })
  const logged = useRef(false)

  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (inView && !logged.current) {
      logged.current = true
      terminalLog(MSG.contact, 'info')
    }
  }, [inView])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    await new Promise((r) => setTimeout(r, 1200))
    setSending(false)
    setSubmitted(true)
    terminalLog(MSG.formSent, 'success')
  }

  const inputClass =
    'w-full bg-surface border border-border rounded-sm px-4 py-2.5 font-mono text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-accent/50 focus:bg-surface-2 transition-all duration-200'

  return (
    <section id="contact" ref={ref} className="py-24 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2 flex flex-col"
        >
          <p className="font-mono text-xs text-accent mb-4 tracking-widest uppercase">
            {d.contact.label}
          </p>
          <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100 leading-snug mb-5">
            <em className="not-italic text-slate-300">{d.contact.title}</em>
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed mb-8">{d.contact.sub}</p>

          <div className="space-y-3 mt-auto">
            <a
              href="https://www.linkedin.com/in/jorge-peduti-b133881a6/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 border border-border rounded-sm hover:border-border-2 hover:bg-surface transition-all duration-200 group"
            >
              <span className="font-mono text-xs font-medium text-slate-500 w-5 text-center">
                in
              </span>
              <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex-1">
                {d.contact.linkedin}
              </span>
              <ExternalLink size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </a>

            <a
              href="mailto:jorge@email.com"
              className="flex items-center gap-3 p-3 border border-border rounded-sm hover:border-border-2 hover:bg-surface transition-all duration-200 group"
            >
              <Mail size={13} className="text-slate-500" />
              <span className="font-mono text-xs text-slate-400 group-hover:text-slate-200 transition-colors flex-1">
                {d.contact.email_label}
              </span>
              <ExternalLink size={11} className="text-slate-600 group-hover:text-slate-400 transition-colors" />
            </a>
          </div>
        </motion.div>

        {/* Right — form */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="lg:col-span-3"
        >
          <div className="border border-border rounded-sm p-6 bg-surface">
            <p className="font-mono text-[10px] text-slate-600 uppercase tracking-widest mb-5">
              // new_message.init()
            </p>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-start gap-3 py-8"
              >
                <span className="w-2 h-2 rounded-full bg-success" />
                <p className="font-mono text-sm text-success">{d.contact.form_success}</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5">
                      {d.contact.form_name}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={d.contact.form_name_placeholder}
                      value={formState.name}
                      onChange={(e) => setFormState((p) => ({ ...p, name: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      placeholder={d.contact.form_email_placeholder}
                      value={formState.email}
                      onChange={(e) => setFormState((p) => ({ ...p, email: e.target.value }))}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5">
                    {d.contact.form_subject}
                  </label>
                  <select
                    required
                    value={formState.subject}
                    onChange={(e) => setFormState((p) => ({ ...p, subject: e.target.value }))}
                    className={`${inputClass} appearance-none cursor-pointer`}
                  >
                    <option value="" disabled>
                      {d.contact.options.placeholder}
                    </option>
                    <option value="fulltime">{d.contact.options.fulltime}</option>
                    <option value="freelance">{d.contact.options.freelance}</option>
                    <option value="collab">{d.contact.options.collab}</option>
                    <option value="other">{d.contact.options.other}</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-[10px] text-slate-500 uppercase tracking-widest block mb-1.5">
                    {d.contact.form_message}
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={d.contact.form_message_placeholder}
                    value={formState.message}
                    onChange={(e) => setFormState((p) => ({ ...p, message: e.target.value }))}
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-2.5 border border-accent bg-accent/10 text-accent font-mono text-xs uppercase tracking-widest hover:bg-accent hover:text-white transition-all duration-200 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sending ? '[sending...]' : d.contact.form_submit}
                </button>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
