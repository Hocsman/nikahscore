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
    
    // Récupérer l'utilisateur authentifié (validation JWT côté serveur)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ isAdmin: false })
    }

    // Vérifier le rôle admin via la table admin_roles (RLS: propre ligne uniquement)
    const { data: adminRole, error: adminError } = await supabase
      .from('admin_roles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle()

    if (adminError) {
      console.error('Erreur vérification admin_roles:', adminError)
      return NextResponse.json({ isAdmin: false })
    }

    const isAdmin = !!adminRole

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
