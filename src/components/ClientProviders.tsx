'use client'

import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext'
import { ThemeProvider as NextThemesProvider } from 'next-themes'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light" enableSystem>
      <CustomThemeProvider>
        {children}
      </CustomThemeProvider>
    </NextThemesProvider>
  )
}
