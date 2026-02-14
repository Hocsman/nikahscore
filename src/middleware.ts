import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  
  // Créer le client Supabase pour le middleware
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
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
    if (!session) {
      return NextResponse.redirect(new URL('/auth', req.url))
    }

    // Vérifier le rôle admin via la table admin_roles (RLS: propre ligne uniquement)
    const { data: adminRole } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (!adminRole) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Routes /results protégées par authentification
  if (req.nextUrl.pathname.startsWith('/results') && !session) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  // /questionnaire exact uniquement (les sous-routes shared/invite sont publiques)
  if (req.nextUrl.pathname === '/questionnaire' && !session) {
    return NextResponse.redirect(new URL('/auth', req.url))
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/results/:path*', '/questionnaire']
}
