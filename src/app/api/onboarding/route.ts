import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { age, city, practiceLevel, marriageIntention } = body

    // Validation des données
    if (!age || !city || !practiceLevel || !marriageIntention) {
      return NextResponse.json(
        { error: 'Tous les champs sont requis' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur connecté avec le server client
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Utilisateur non authentifié' },
        { status: 401 }
      )
    }

    // Créer le hash de l'email
    const emailHash = Buffer.from(user.email!).toString('base64')

    // Insérer ou mettre à jour les données utilisateur
    const { error: upsertError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        email_hash: emailHash,
        age: parseInt(age),
        city,
        practice_level: practiceLevel,
        marriage_intention: marriageIntention,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('Erreur lors de la sauvegarde:', upsertError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des données' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Erreur API onboarding:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
