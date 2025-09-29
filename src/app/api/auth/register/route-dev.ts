import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      )
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'Adresse email invalide' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // EN DÉVELOPPEMENT : Désactiver la confirmation email
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name
        }
        // emailRedirectTo désactivé pour le développement
      }
    })

    if (error) {
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'Cette adresse email est déjà utilisée' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    // Créer le profil utilisateur
    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            name: name,
            email: email,
            created_at: new Date().toISOString()
          }
        ])

      if (profileError) {
        console.error('Erreur création profil:', profileError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Compte créé avec succès !',
      user: {
        id: data.user?.id,
        name: name,
        email: data.user?.email
      }
    })

  } catch (error) {
    console.error('Erreur inscription:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    )
  }
}
