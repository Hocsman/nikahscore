import { DEFAULT_LOCALE, type AppLocale } from '@/i18n/config'

const messages = {
  fr: {
    common: {
      skipToContent: 'Aller au contenu principal',
    },
    settings: {
      preferences: {
        language: {
          label: 'Langue',
          help: 'Autres langues disponibles progressivement.',
          saved: 'Langue mise a jour',
        },
      },
    },
  },
  en: {
    common: {
      skipToContent: 'Skip to main content',
    },
    settings: {
      preferences: {
        language: {
          label: 'Language',
          help: 'More languages will be added progressively.',
          saved: 'Language updated',
        },
      },
    },
  },
} as const

interface MessageTree {
  [key: string]: string | MessageTree
}

function resolveMessage(tree: MessageTree, key: string): string | undefined {
  const keys = key.split('.')
  let cursor: string | MessageTree | undefined = tree

  for (const part of keys) {
    if (!cursor || typeof cursor === 'string') {
      return undefined
    }

    cursor = cursor[part]
  }

  return typeof cursor === 'string' ? cursor : undefined
}

export function getTranslation(locale: AppLocale, key: string, fallback = key): string {
  const localeMessages = messages[locale] as MessageTree
  const defaultMessages = messages[DEFAULT_LOCALE] as MessageTree

  return resolveMessage(localeMessages, key) ?? resolveMessage(defaultMessages, key) ?? fallback
}
