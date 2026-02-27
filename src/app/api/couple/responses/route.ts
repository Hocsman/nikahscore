import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { CompatibilityCalculator } from '@/lib/compatibility-algorithm'

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

    const user_id = user.id
    const supabaseAdmin = createAdminClient()
    const { couple_code, responses } = await request.json()

    if (!couple_code || !responses) {
      return NextResponse.json(
        { error: 'Couple code and responses are required' },
        { status: 400 }
      )
    }

    // Vérifier que l'utilisateur fait partie du couple
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from('couples')
      .select('*')
      .eq('couple_code', couple_code)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple questionnaire not found' },
        { status: 404 }
      )
    }

    if (couple.creator_id !== user_id && couple.partner_id !== user_id) {
      return NextResponse.json(
        { error: 'You are not part of this couple questionnaire' },
        { status: 403 }
      )
    }

    // Déterminer le rôle
    const role = couple.creator_id === user_id ? 'creator' : 'partner'

    // Vérifier si l'utilisateur a déjà répondu
    const { data: existing } = await supabaseAdmin
      .from('responses')
      .select('id')
      .eq('couple_id', couple.id)
      .eq('user_id', user_id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'You have already submitted responses for this couple questionnaire' },
        { status: 409 }
      )
    }

    // Sauvegarder les réponses
    const { error: insertError } = await supabaseAdmin
      .from('responses')
      .insert([
        {
          couple_id: couple.id,
          user_id,
          answers: responses,
          is_completed: true,
          completed_at: new Date().toISOString()
        }
      ])

    if (insertError) {
      console.error('Error saving couple responses:', insertError)
      return NextResponse.json(
        { error: 'Failed to save responses' },
        { status: 500 }
      )
    }

    // Vérifier si les deux partenaires ont répondu
    const { data: allResponses } = await supabaseAdmin
      .from('responses')
      .select('user_id')
      .eq('couple_id', couple.id)
      .eq('is_completed', true)

    const bothCompleted = allResponses && allResponses.length === 2

    let compatibilityScore = null
    let compatibilityResult = null

    if (bothCompleted) {
      // Récupérer les réponses complètes des deux partenaires
      const { data: fullResponses } = await supabaseAdmin
        .from('responses')
        .select('user_id, answers')
        .eq('couple_id', couple.id)
        .eq('is_completed', true)

      if (fullResponses && fullResponses.length === 2) {
        const creatorResp = fullResponses.find(r => r.user_id === couple.creator_id)
        const partnerResp = fullResponses.find(r => r.user_id !== couple.creator_id)

        if (creatorResp?.answers && partnerResp?.answers) {
          // Mapper les UUIDs des questions vers les order_index (IDs numériques attendus par l'algorithme)
          const { data: questionMapping } = await supabaseAdmin
            .from('questions')
            .select('id, order_index')

          let mappedCreator = creatorResp.answers
          let mappedPartner = partnerResp.answers

          if (questionMapping && questionMapping.length > 0) {
            const uuidToIndex: Record<string, number> = {}
            questionMapping.forEach((q: { id: string; order_index: number }) => {
              uuidToIndex[q.id] = q.order_index
            })

            // Remapper les réponses: UUID -> order_index
            mappedCreator = {} as Record<number, boolean | number>
            mappedPartner = {} as Record<number, boolean | number>
            for (const [uuid, answer] of Object.entries(creatorResp.answers)) {
              const idx = uuidToIndex[uuid]
              if (idx !== undefined) mappedCreator[idx] = answer
            }
            for (const [uuid, answer] of Object.entries(partnerResp.answers)) {
              const idx = uuidToIndex[uuid]
              if (idx !== undefined) mappedPartner[idx] = answer
            }
          }

          // Calculer la compatibilité avec l'algorithme complet
          compatibilityResult = CompatibilityCalculator.calculateCompatibility(
            mappedCreator,
            mappedPartner
          )
          compatibilityScore = Math.round(compatibilityResult.overall_score * 100)
        }
      }

      // Marquer le questionnaire couple comme terminé avec le score
      await supabaseAdmin
        .from('couples')
        .update({
          completed_at: new Date().toISOString(),
          status: 'completed',
          creator_completed: true,
          partner_completed: true,
          compatibility_score: compatibilityScore
        })
        .eq('couple_code', couple_code)

      // Sauvegarder les résultats détaillés dans compatibility_results
      if (compatibilityResult) {
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
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Responses saved successfully',
      both_completed: bothCompleted,
      compatibility_score: compatibilityScore
    })

  } catch (error) {
    console.error('Error saving couple responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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
    const { searchParams } = new URL(request.url)
    const couple_code = searchParams.get('code')

    if (!couple_code) {
      return NextResponse.json(
        { error: 'Couple code is required' },
        { status: 400 }
      )
    }

    // Récupérer le couple
    const { data: couple, error: coupleError } = await supabaseAdmin
      .from('couples')
      .select('id')
      .eq('couple_code', couple_code)
      .single()

    if (coupleError || !couple) {
      return NextResponse.json(
        { error: 'Couple not found' },
        { status: 404 }
      )
    }

    // Récupérer toutes les réponses du couple
    const { data: responses, error } = await supabaseAdmin
      .from('responses')
      .select('*')
      .eq('couple_id', couple.id)
      .order('completed_at', { ascending: true })

    if (error) {
      console.error('Error fetching couple responses:', error)
      return NextResponse.json(
        { error: 'Failed to fetch responses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      responses: responses || []
    })

  } catch (error) {
    console.error('Error in couple responses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
