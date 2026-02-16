import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

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
    const { share_code, responses, role } = await request.json()
    const email = user.email

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

    // Vérifier l'expiration (30 jours)
    const createdAt = new Date(shared.created_at)
    const expiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
    if (expiresAt < new Date()) {
      await supabaseAdmin
        .from('shared_questionnaires')
        .update({ status: 'expired' })
        .eq('share_code', share_code)

      return NextResponse.json(
        { error: 'Ce questionnaire a expiré (validité : 30 jours)', expired: true },
        { status: 410 }
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
          { error: 'Vous avez déjà répondu à ce questionnaire' },
          { status: 400 }
        )
      }
      
      updateData.creator_email = email
      updateData.creator_responses = responses
      updateData.creator_completed_at = new Date().toISOString()
      
    } else if (role === 'participant') {
      // Vérifier que ce n'est pas déjà complété
      if (shared.partner_completed_at) {
        return NextResponse.json(
          { error: 'Vous avez déjà répondu à ce questionnaire' },
          { status: 400 }
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

    // 🆕 ENVOYER EMAIL DE NOTIFICATION si le partenaire vient de compléter
    if (role === 'participant' && updated.partner_completed_at && !updated.notification_sent) {
      try {
        // Appeler l'API de notification en arrière-plan (ne pas attendre)
        fetch(`${new URL(request.url).origin}/api/questionnaire/notify-completion`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ shareCode: share_code }),
        }).catch(err => {
          console.error('Erreur envoi notification email:', err)
        })
      } catch (error) {
        console.error('Erreur déclenchement notification:', error)
        // Ne pas bloquer la réponse si l'email échoue
      }
    }


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
