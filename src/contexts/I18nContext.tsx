'use client'

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  LOCALE_COOKIE_NAME,
  LOCALE_STORAGE_KEY,
  resolveLocale,
  type AppLocale,
} from '@/i18n/config'
import { getTranslation } from '@/i18n/messages'

interface I18nContextValue {
  locale: AppLocale
  setLocale: (locale: AppLocale) => void
  t: (key: string, fallback?: string) => string
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined)

const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export function I18nProvider({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: AppLocale
}) {
  const [locale, setLocale] = useState<AppLocale>(resolveLocale(initialLocale))

  useEffect(() => {
    document.documentElement.lang = locale
    document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${LOCALE_COOKIE_MAX_AGE};SameSite=Lax`
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale)
  }, [locale])

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t: (key: string, fallback?: string) => getTranslation(locale, key, fallback),
    }),
    [locale]
  )

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)

  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }

  return context
}
