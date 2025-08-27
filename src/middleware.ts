import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  
  // Créer le client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          response.cookies.set({ name, value: '', ...options })
        }
      }
    }
  )
  
  const { data: { session } } = await supabase.auth.getSession()
  
  // Vérifier l'authentification pour les routes admin
  if (req.nextUrl.pathname.startsWith('/admin')) {
    // Pour le développement, permettre l'accès temporairement
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.next()
    }
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // Vérifier le rôle admin
    const isAdmin = session.user.user_metadata?.role === 'admin' || 
                   session.user.email === 'admin@nikahscore.fr' // Email admin par défaut

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Routes qui nécessitent une authentification utilisateur
  const protectedRoutes = ['/results', '/questionnaire']
  const isProtectedRoute = protectedRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*']
}
