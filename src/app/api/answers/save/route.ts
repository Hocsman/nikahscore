import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pairId, respondent, answers } = body

    if (!pairId || !respondent || !answers) {
      return NextResponse.json({ 
        error: 'Données manquantes' 
      }, { status: 400 })
    }

    // Sauvegarde des réponses
    const insertData = answers.map((answer: any) => ({
      pair_id: pairId,
      question_id: answer.questionId,
      respondent: respondent,
      value: answer.value,
      importance: answer.importance || 1,
      created_at: new Date().toISOString()
    }))

    // Supprimer les anciennes réponses du même répondant
    await supabaseAdmin
      .from('responses')
      .delete()
      .eq('pair_id', pairId)
      .eq('respondent', respondent)

    // Insérer les nouvelles réponses
    const { data, error } = await supabaseAdmin
      .from('responses')
      .insert(insertData)

    if (error) {
      console.error('Erreur Supabase:', error)
      return NextResponse.json({ 
        error: 'Erreur de sauvegarde' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      saved: answers.length 
    })

  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json({ 
      error: 'Erreur serveur' 
    }, { status: 500 })
  }
}
