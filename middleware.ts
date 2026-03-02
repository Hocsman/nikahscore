import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE_NAME,
  normalizeLocale,
  type AppLocale,
} from '@/i18n/config'

// Routes qui nécessitent une authentification
const PROTECTED_ROUTES = [
  '/dashboard',
  '/results',
  '/questionnaire',
  '/admin',
]

const ONE_YEAR_IN_SECONDS = 60 * 60 * 24 * 365

function getLocaleFromAcceptLanguage(acceptLanguage: string | null): AppLocale | null {
  if (!acceptLanguage) return null

  const requestedLocales = acceptLanguage
    .split(',')
    .map((entry) => entry.trim().split(';')[0])
    .filter(Boolean)

  for (const requestedLocale of requestedLocales) {
    const normalized = normalizeLocale(requestedLocale)
    if (normalized) {
      return normalized
    }
  }

  return null
}

function resolveRequestLocale(req: NextRequest): AppLocale {
  const localeFromCookie = normalizeLocale(req.cookies.get(LOCALE_COOKIE_NAME)?.value)
  if (localeFromCookie) return localeFromCookie

  return getLocaleFromAcceptLanguage(req.headers.get('accept-language')) ?? DEFAULT_LOCALE
}

function setLocaleCookie(response: NextResponse, locale: AppLocale) {
  response.cookies.set({
    name: LOCALE_COOKIE_NAME,
    value: locale,
    path: '/',
    sameSite: 'lax',
    maxAge: ONE_YEAR_IN_SECONDS,
  })
}

export async function middleware(req: NextRequest) {
  const locale = resolveRequestLocale(req)

  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Actualiser la session et récupérer l'utilisateur
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = req.nextUrl.pathname

  // Vérifier si la route nécessite une authentification
  const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/auth', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    const redirectResponse = NextResponse.redirect(redirectUrl)
    setLocaleCookie(redirectResponse, locale)
    return redirectResponse
  }

  // Protection admin : vérifier le rôle
  if (pathname.startsWith('/admin') && user) {
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (!adminRole) {
      const redirectResponse = NextResponse.redirect(new URL('/', req.url))
      setLocaleCookie(redirectResponse, locale)
      return redirectResponse
    }
  }

  setLocaleCookie(response, locale)
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
