'use client'

import { useContext } from 'react'
import { LangContext } from '@/components/providers/LangProvider'

export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useLang must be used inside LangProvider')
  return ctx
}
