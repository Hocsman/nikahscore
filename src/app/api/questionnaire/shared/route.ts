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

    // Récupérer toutes les questions (mapping compatible)
    console.log('🔍 Chargement des questions...')
    const { data: questionsRaw, error: questionsError } = await supabaseAdmin
      .from('questions')
      .select('id, text, category')
      .order('order_index')

    // Mapping pour compatibilité avec le front (label/type)
    let questions: any[] = []
    if (questionsRaw && Array.isArray(questionsRaw)) {
      questions = questionsRaw.map(q => ({
        id: q.id,
        label: q.text || '',
        type: q.category || '',
      }))
    }
    console.log('📋 Résultat questions:', { questionsCount: questions?.length, error: questionsError })

    if (questionsError) {
      console.error('❌ Error fetching questions:', questionsError)
      
      // Fallback: utiliser des questions statiques si la table n'existe pas
      console.log('⚠️ Utilisation de questions statiques de fallback')
      const fallbackQuestions = [
        { id: '1', label: 'Partagez-vous les mêmes valeurs religieuses fondamentales ?', type: 'bool' },
        { id: '2', label: 'Êtes-vous d\'accord sur l\'importance de la prière quotidienne ?', type: 'bool' },
        { id: '3', label: 'Avez-vous une vision similaire du rôle de la famille ?', type: 'bool' },
        { id: '4', label: 'Partagez-vous les mêmes objectifs de vie ?', type: 'bool' },
        { id: '5', label: 'Êtes-vous compatibles sur le plan de la communication ?', type: 'scale' }
      ]
      
      console.log('✅ Questions de fallback préparées:', fallbackQuestions.length)
      
      // Calculer le statut basé sur la structure shared_questionnaires
      let status = 'waiting'
      if (shared.creator_completed_at && shared.partner_completed_at) {
        status = 'completed'
      } else if (shared.creator_completed_at || shared.partner_completed_at) {
        status = 'partial'
      }
      
      const adaptedShared = {
        ...shared,
        status
      }

      return NextResponse.json({
        success: true,
        questions: fallbackQuestions,
        shared: adaptedShared
      })
    }

    // Calculer le statut basé sur la structure shared_questionnaires
    let status = 'waiting'
    if (shared.creator_completed_at && shared.partner_completed_at) {
      status = 'completed'
    } else if (shared.creator_completed_at || shared.partner_completed_at) {
      status = 'partial'
    }
    
    const adaptedShared = {
      ...shared,
      status
    }

    console.log('✅ Retour API réussi:', { 
      questionsCount: questions?.length, 
      status,
      shareCode: share_code 
    })

    return NextResponse.json({
      success: true,
      questions: questions || [],
      shared: adaptedShared
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
