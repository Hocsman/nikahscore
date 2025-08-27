import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      )
    }

    const supabase = createClient()

    // Connexion avec Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      )
    }

    if (!data.user) {
      return NextResponse.json(
        { error: 'Erreur de connexion' },
        { status: 401 }
      )
    }

    // Récupérer les métadonnées utilisateur depuis la base
    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', data.user.id)
      .single()

    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      user: {
        id: data.user.id,
        name: profile?.name || data.user.email?.split('@')[0] || 'Utilisateur',
        email: data.user.email
      }
    })

  } catch (error) {
    console.error('Erreur connexion:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la connexion' },
      { status: 500 }
    )
  }
}
