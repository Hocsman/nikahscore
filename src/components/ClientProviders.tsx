'use client'

import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { I18nProvider } from '@/contexts/I18nContext'
import type { AppLocale } from '@/i18n/config'

export function ClientProviders({
  children,
  initialLocale,
}: {
  children: React.ReactNode
  initialLocale: AppLocale
}) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <CustomThemeProvider>
        <I18nProvider initialLocale={initialLocale}>
          {children}
        </I18nProvider>
      </CustomThemeProvider>
    </NextThemesProvider>
  )
}
