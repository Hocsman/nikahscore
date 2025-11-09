import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/check
 * Vérifie si l'utilisateur connecté a le rôle admin
 */
export async function GET() {
  try {
    const supabase = await createClient()
    
    // Récupérer la session utilisateur
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError || !session) {
      return NextResponse.json({ isAdmin: false })
    }

    const user = session.user

    // Vérifier le rôle admin via user_metadata ou email
    const isAdmin = 
      user.user_metadata?.role === 'admin' || 
      user.email === 'admin@nikahscore.fr' ||
      user.email === 'hocsman@gmail.com' // Email admin du propriétaire

    return NextResponse.json({ 
      isAdmin,
      user: {
        id: user.id,
        email: user.email
      }
    })

  } catch (error) {
    console.error('Erreur vérification admin:', error)
    return NextResponse.json(
      { isAdmin: false, error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
