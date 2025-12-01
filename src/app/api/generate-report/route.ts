import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { CompatibilityCalculator, type CompatibilityAnalysis } from '@/lib/compatibility-algorithm'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function POST(request: NextRequest) {
  try {
    const { pairId } = await request.json()
    
    if (!pairId) {
      return NextResponse.json(
        { error: 'ID de couple requis' },
        { status: 400 }
      )
    }
    
    
    // 1. Récupérer les informations du couple
    const { data: coupleData, error: coupleError } = await supabase
      .from('couples')
      .select('*')
      .eq('couple_code', pairId)
      .single()
    
    if (coupleError || !coupleData) {
      console.error('❌ Couple non trouvé:', coupleError)
      return NextResponse.json(
        { error: 'Couple non trouvé' },
        { status: 404 }
      )
    }
    
    // 2. Récupérer les réponses des deux partenaires
    const { data: responsesData, error: responsesError } = await supabase
      .from('responses')
      .select('*')
      .eq('couple_id', coupleData.id)
      .eq('is_completed', true)
    
    if (responsesError || !responsesData || responsesData.length < 2) {
      console.error('❌ Réponses incomplètes:', responsesError)
      return NextResponse.json(
        { error: 'Réponses incomplètes pour ce couple' },
        { status: 400 }
      )
    }
    
    // 3. Organiser les réponses par utilisateur
    const user1Responses: { [key: number]: boolean | number } = {}
    const user2Responses: { [key: number]: boolean | number } = {}
    
    let user1Name = 'Utilisateur 1'
    let user2Name = 'Utilisateur 2'
    
    responsesData.forEach(response => {
      const responses = typeof response.responses === 'string' 
        ? JSON.parse(response.responses) 
        : response.responses
      
      if (response.user_type === 'creator') {
        Object.assign(user1Responses, responses)
        user1Name = response.user_name || 'Créateur'
      } else {
        Object.assign(user2Responses, responses)
        user2Name = response.user_name || 'Partenaire'
      }
    })
    
    
    // 4. Calculer la compatibilité avec le nouvel algorithme
    const compatibilityAnalysis = CompatibilityCalculator.calculateCompatibility(
      user1Responses,
      user2Responses
    )
    
    
    // 5. Sauvegarder les résultats
    const resultData = {
      couple_code: pairId,
      user1_name: user1Name,
      user2_name: user2Name,
      overall_score: compatibilityAnalysis.overall_score,
      compatibility_level: compatibilityAnalysis.compatibility_level,
      dimension_scores: compatibilityAnalysis.dimension_scores,
      dealbreaker_conflicts: compatibilityAnalysis.dealbreaker_conflicts,
      detailed_analysis: compatibilityAnalysis.detailed_analysis,
      question_matches: compatibilityAnalysis.question_matches,
      generated_at: new Date().toISOString(),
      algorithm_version: 'v2.0-personality'
    }
    
    // Insérer ou mettre à jour les résultats
    const { data: savedResult, error: saveError } = await supabase
      .from('compatibility_results')
      .upsert(resultData, {
        onConflict: 'couple_code'
      })
      .select()
      .single()
    
    if (saveError) {
      console.error('❌ Erreur sauvegarde:', saveError)
      // Continuer même si la sauvegarde échoue
    }
    
    // 6. Retourner les résultats formatés
    const response = {
      pairId,
      user1_name: user1Name,
      user2_name: user2Name,
      overall_score: compatibilityAnalysis.overall_score,
      compatibility_level: compatibilityAnalysis.compatibility_level,
      dimension_breakdown: Object.entries(compatibilityAnalysis.dimension_scores).map(
        ([dimension, data]: [string, any]) => ({
          dimension,
          score: Math.round(data.score * 100),
          weight: data.weight,
          questions_count: data.questions_count,
          strengths: data.strengths,
          concerns: data.concerns
        })
      ),
      dealbreaker_conflicts: compatibilityAnalysis.dealbreaker_conflicts,
      question_matches: compatibilityAnalysis.question_matches,
      detailed_analysis: compatibilityAnalysis.detailed_analysis,
      generated_at: new Date().toISOString(),
      algorithm_info: {
        version: 'v2.0-personality',
        total_questions: 100,
        dimensions: 6,
        description: 'Algorithme avancé basé sur 100 questions de personnalité'
      }
    }
    
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error('❌ Erreur génération rapport:', error)
    
    return NextResponse.json(
      { 
        error: 'Erreur interne lors de la génération du rapport',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

// API pour récupérer un rapport existant
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const pairId = url.searchParams.get('pairId')
    
    if (!pairId) {
      return NextResponse.json(
        { error: 'ID de couple requis' },
        { status: 400 }
      )
    }
    
    // Récupérer le rapport existant
    const { data: resultData, error } = await supabase
      .from('compatibility_results')
      .select('*')
      .eq('couple_code', pairId)
      .single()
    
    if (error || !resultData) {
      return NextResponse.json(
        { error: 'Rapport non trouvé' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(resultData, { status: 200 })
    
  } catch (error) {
    console.error('❌ Erreur récupération rapport:', error)
    
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du rapport' },
      { status: 500 }
    )
  }
}