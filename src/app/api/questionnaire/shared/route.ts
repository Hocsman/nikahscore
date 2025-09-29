import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Récupérer un questionnaire partagé
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const share_code = searchParams.get('code')

    console.log('🔍 GET shared questionnaire - Code:', share_code)

    if (!share_code) {
      console.log('❌ Aucun code fourni')
      return NextResponse.json(
        { error: 'Code de partage requis' },
        { status: 400 }
      )
    }

    // Récupérer le questionnaire partagé
    console.log('🔍 Recherche du questionnaire avec code:', share_code)
    const { data: shared, error } = await supabaseAdmin
      .from('shared_questionnaires')
      .select('*')
      .eq('share_code', share_code)
      .single()

    console.log('📋 Résultat shared:', { shared, error })

    if (error || !shared) {
      console.log('❌ Questionnaire introuvable:', error)
      return NextResponse.json(
        { error: 'Questionnaire partagé introuvable' },
        { status: 404 }
      )
    }

    // Récupérer toutes les questions
    console.log('🔍 Chargement des questions...')
    const { data: questions, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id, label, type')
      .order('id')

    console.log('📋 Résultat questions:', { questionsCount: questions?.length, error: questionsError })

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError)
      return NextResponse.json(
        { error: 'Erreur lors du chargement des questions' },
        { status: 500 }
      )
    }

    // Calculer le statut
    let status = 'waiting'
    if (shared.creator_completed_at && shared.partner_completed_at) {
      status = 'completed'
    } else if (shared.creator_completed_at || shared.partner_completed_at) {
      status = 'partial'
    }

    console.log('✅ Retour API réussi:', { 
      questionsCount: questions?.length, 
      status,
      shareCode: share_code 
    })

    return NextResponse.json({
      success: true,
      questions: questions || [],
      shared: {
        ...shared,
        status
      }
    })

  } catch (error) {
    console.error('❌ Erreur API shared questionnaire:', error)
    return NextResponse.json(
      { 
        error: 'Erreur serveur', 
        details: error instanceof Error ? error.message : 'Erreur inconnue' 
      },
      { status: 500 }
    )
  }
}
