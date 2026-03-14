'use client'

import { createContext, useState, useCallback, ReactNode } from 'react'
import en from '@/lib/i18n/en.json'
import pt from '@/lib/i18n/pt.json'

export type Lang = 'en' | 'pt'
export type Dict = typeof en

interface LangContextType {
  lang: Lang
  setLang: (lang: Lang) => void
  d: Dict
}

export const LangContext = createContext<LangContextType | null>(null)

export default function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('en')

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLang
    }
  }, [])

  const d = (lang === 'en' ? en : pt) as Dict

  return (
    <LangContext.Provider value={{ lang, setLang, d }}>
      {children}
    </LangContext.Provider>
  )
}
