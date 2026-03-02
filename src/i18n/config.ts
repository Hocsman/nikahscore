export const SUPPORTED_LOCALES = ['fr', 'en'] as const

export type AppLocale = (typeof SUPPORTED_LOCALES)[number]

export const DEFAULT_LOCALE: AppLocale = 'fr'

export const LOCALE_COOKIE_NAME = 'nikahscore_locale'
export const LOCALE_STORAGE_KEY = 'nikahscore.locale'

export const LOCALE_LABELS: Record<AppLocale, string> = {
  fr: 'Francais',
  en: 'English',
}

export function isSupportedLocale(value: string): value is AppLocale {
  return SUPPORTED_LOCALES.includes(value as AppLocale)
}

export function normalizeLocale(value?: string | null): AppLocale | null {
  if (!value) return null

  const baseLocale = value.toLowerCase().split('-')[0]
  return isSupportedLocale(baseLocale) ? baseLocale : null
}

export function resolveLocale(value?: string | null): AppLocale {
  return normalizeLocale(value) ?? DEFAULT_LOCALE
}
