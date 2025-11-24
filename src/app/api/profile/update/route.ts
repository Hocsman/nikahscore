import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName } = await request.json()

    if (!firstName) {
      return NextResponse.json(
        { error: 'Le prénom est requis' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Récupérer l'utilisateur connecté
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Mettre à jour les user_metadata dans Supabase Auth
    const { error: updateAuthError } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName || null
      }
    })

    if (updateAuthError) {
      console.error('Erreur mise à jour auth metadata:', updateAuthError)
      throw updateAuthError
    }

    // Mettre à jour la table profiles
    const { error: updateUserError } = await supabase
      .from('profiles')
      .update({
        name: `${firstName} ${lastName || ''}`.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateUserError) {
      console.warn('Erreur mise à jour table profiles:', updateUserError)
    }

    return NextResponse.json({
      success: true,
      message: 'Profil mis à jour avec succès',
      user: {
        firstName,
        lastName
      }
    })

  } catch (error: any) {
    console.error('Erreur /api/profile/update:', error)
    return NextResponse.json(
      { error: error.message || 'Erreur serveur' },
      { status: 500 }
    )
  }
}
