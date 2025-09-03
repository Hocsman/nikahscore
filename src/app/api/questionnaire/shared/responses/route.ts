import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { share_code, email, responses, role } = await request.json()

    if (!share_code || !responses || !role) {
      return NextResponse.json(
        { error: 'Code de partage, réponses et rôle requis' },
        { status: 400 }
      )
    }

    // Récupérer le questionnaire partagé
    const { data: shared, error: fetchError } = await supabaseAdmin
      .from('shared_questionnaires')
      .select('*')
      .eq('share_code', share_code)
      .single()

    if (fetchError || !shared) {
      return NextResponse.json(
        { error: 'Questionnaire partagé introuvable' },
        { status: 404 }
      )
    }

    // Déterminer les champs à mettre à jour selon le rôle
    let updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (role === 'creator') {
      // Vérifier que ce n'est pas déjà complété
      if (shared.creator_completed_at) {
        return NextResponse.json(
          { error: 'Le créateur a déjà terminé ce questionnaire' },
          { status: 409 }
        )
      }
      
      updateData.creator_email = email
      updateData.creator_responses = responses
      updateData.creator_completed_at = new Date().toISOString()
    } else if (role === 'partner') {
      // Vérifier que ce n'est pas déjà complété
      if (shared.partner_completed_at) {
        return NextResponse.json(
          { error: 'Le partenaire a déjà terminé ce questionnaire' },
          { status: 409 }
        )
      }
      
      updateData.partner_email = email
      updateData.partner_responses = responses
      updateData.partner_completed_at = new Date().toISOString()
    } else {
      return NextResponse.json(
        { error: 'Rôle invalide' },
        { status: 400 }
      )
    }

    // Mettre à jour le questionnaire partagé
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('shared_questionnaires')
      .update(updateData)
      .eq('share_code', share_code)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating shared questionnaire:', updateError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des réponses' },
        { status: 500 }
      )
    }

    // Vérifier si les deux ont terminé pour calculer la compatibilité
    const bothCompleted = updated.creator_completed_at && updated.partner_completed_at
    
    let compatibilityScore = null
    if (bothCompleted && updated.creator_responses && updated.partner_responses) {
      // Calculer le score de compatibilité
      compatibilityScore = calculateCompatibility(
        updated.creator_responses, 
        updated.partner_responses
      )

      // Sauvegarder le score
      await supabaseAdmin
        .from('shared_questionnaires')
        .update({
          compatibility_score: compatibilityScore,
          updated_at: new Date().toISOString()
        })
        .eq('share_code', share_code)
    }

    console.log('✅ Réponses sauvegardées:', role, share_code)

    return NextResponse.json({
      success: true,
      both_completed: bothCompleted,
      compatibility_score: compatibilityScore
    })

  } catch (error) {
    console.error('Error saving shared questionnaire responses:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// Algorithme simple de calcul de compatibilité
function calculateCompatibility(responses1: any, responses2: any): number {
  let totalQuestions = 0
  let matches = 0

  // Parcourir toutes les questions et comparer les réponses
  for (const questionId in responses1) {
    if (responses2[questionId] !== undefined) {
      totalQuestions++
      
      const answer1 = responses1[questionId]
      const answer2 = responses2[questionId]
      
      // Logique de comparaison selon le type de réponse
      if (typeof answer1 === 'boolean' && typeof answer2 === 'boolean') {
        if (answer1 === answer2) matches++
      } else if (typeof answer1 === 'number' && typeof answer2 === 'number') {
        // Pour les échelles (1-5), plus la différence est petite, mieux c'est
        const diff = Math.abs(answer1 - answer2)
        if (diff === 0) matches += 1
        else if (diff === 1) matches += 0.7
        else if (diff === 2) matches += 0.4
        else matches += 0.1
      }
    }
  }

  const score = totalQuestions > 0 ? Math.round((matches / totalQuestions) * 100) : 0
  return Math.max(0, Math.min(100, score)) // S'assurer que le score est entre 0 et 100
}
