import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // Utiliser le client admin pour accéder aux questions
    const { data: questions, error } = await supabaseAdmin
      .from('questions')
      .select('id, axis, text, category, weight, is_dealbreaker, order_index')
      .order('order_index', { ascending: true })

    if (error) {
      console.error('Erreur récupération questions:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des questions' },
        { status: 500 }
      )
    }

    // Vérifier qu'on a au moins quelques questions pour les tests
    if (!questions || questions.length === 0) {
      console.error(`Aucune question trouvée`)
      return NextResponse.json(
        { error: 'Aucune question disponible' },
        { status: 500 }
      )
    }

    console.log(`${questions.length} questions chargées depuis la DB`)
    return NextResponse.json({ questions })

  } catch (error) {
    console.error('Erreur API questions:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
