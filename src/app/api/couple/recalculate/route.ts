import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { CompatibilityCalculator } from '@/lib/compatibility-algorithm'

// Endpoint temporaire pour recalculer les scores des couples complétés sans résultats
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const supabaseAdmin = createAdminClient()

    // Trouver les couples complétés où l'utilisateur est impliqué
    const { data: couples, error: couplesError } = await supabaseAdmin
      .from('couples')
      .select('*')
      .in('status', ['completed', 'both_completed'])
      .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)

    if (couplesError || !couples || couples.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucun couple complété trouvé',
        recalculated: 0
      })
    }

    let recalculated = 0
    const results: any[] = []

    for (const couple of couples) {
      // Vérifier si un résultat existe déjà
      const { data: existingResult } = await supabaseAdmin
        .from('compatibility_results')
        .select('id')
        .eq('couple_id', couple.id)
        .single()

      if (existingResult) {
        continue // Score déjà calculé
      }

      // Récupérer les réponses des deux partenaires
      const { data: responses } = await supabaseAdmin
        .from('responses')
        .select('user_id, answers')
        .eq('couple_id', couple.id)
        .eq('is_completed', true)

      if (!responses || responses.length !== 2) {
        continue // Pas deux réponses complètes
      }

      const creatorResp = responses.find(r => r.user_id === couple.creator_id)
      const partnerResp = responses.find(r => r.user_id !== couple.creator_id)

      if (!creatorResp?.answers || !partnerResp?.answers) {
        continue
      }

      // Calculer la compatibilité
      const compatibilityResult = CompatibilityCalculator.calculateCompatibility(
        creatorResp.answers,
        partnerResp.answers
      )
      const compatibilityScore = Math.round(compatibilityResult.overall_score)

      // Mettre à jour le score sur le couple
      await supabaseAdmin
        .from('couples')
        .update({ compatibility_score: compatibilityScore })
        .eq('id', couple.id)

      // Insérer les résultats détaillés
      await supabaseAdmin
        .from('compatibility_results')
        .insert({
          couple_id: couple.id,
          overall_score: compatibilityScore,
          spirituality_score: Math.round((compatibilityResult.dimension_scores['Spiritualité']?.score || 0) * 100),
          family_score: Math.round((compatibilityResult.dimension_scores['Famille']?.score || 0) * 100),
          communication_score: Math.round((compatibilityResult.dimension_scores['Communication']?.score || 0) * 100),
          values_score: Math.round((compatibilityResult.dimension_scores['Personnalité']?.score || 0) * 100),
          finance_score: Math.round((compatibilityResult.dimension_scores['Finances']?.score || 0) * 100),
          intimacy_score: Math.round((compatibilityResult.dimension_scores['Vie conjugale']?.score || 0) * 100),
          strengths: compatibilityResult.detailed_analysis.strengths,
          improvements: compatibilityResult.detailed_analysis.areas_to_discuss,
          recommendations: compatibilityResult.detailed_analysis.recommendations
        })

      recalculated++
      results.push({
        couple_code: couple.couple_code,
        score: compatibilityScore,
        level: compatibilityResult.compatibility_level
      })
    }

    return NextResponse.json({
      success: true,
      message: `${recalculated} couple(s) recalculé(s)`,
      recalculated,
      results
    })

  } catch (error) {
    console.error('Error recalculating compatibility:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
