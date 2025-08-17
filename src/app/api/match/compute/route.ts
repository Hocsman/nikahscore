import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { supabase } from '@/lib/supabaseClient'
import { calculateCompatibility } from '@/lib/match'

const computeMatchSchema = z.object({
  pairId: z.string().uuid(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { pairId } = computeMatchSchema.parse(body)

    // Récupérer la paire et vérifier qu'elle existe
    const { data: pair, error: pairError } = await supabase
      .from('pairs')
      .select('*')
      .eq('id', pairId)
      .single()

    if (pairError || !pair) {
      return NextResponse.json(
        { error: 'Paire non trouvée' },
        { status: 404 }
      )
    }

    // Vérifier que les deux utilisateurs ont répondu
    const { data: answers, error: answersError } = await supabase
      .from('answers')
      .select(`
        question_id,
        respondent,
        value,
        importance,
        questions:question_id (
          category,
          axis,
          is_dealbreaker,
          weight
        )
      `)
      .eq('pair_id', pairId)

    if (answersError) {
      console.error('Erreur récupération réponses:', answersError)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération des réponses' },
        { status: 500 }
      )
    }

    // Vérifier qu'on a des réponses des deux côtés
    const respondents = new Set(answers?.map(a => a.respondent) || [])
    if (!respondents.has('A') || !respondents.has('B')) {
      return NextResponse.json(
        { error: 'Réponses incomplètes' },
        { status: 400 }
      )
    }

    // Calculer la compatibilité
    const transformedAnswers = answers?.map(answer => ({
      question_id: answer.question_id,
      respondent: answer.respondent,
      value: answer.value,
      importance: answer.importance,
      questions: Array.isArray(answer.questions) ? answer.questions[0] : answer.questions
    })) || []
    
    const matchResult = calculateCompatibility(transformedAnswers)

    // Sauvegarder ou mettre à jour le résultat
    const { error: upsertError } = await supabase
      .from('matches')
      .upsert({
        pair_id: pairId,
        overall_score: matchResult.overallScore,
        axis_scores: matchResult.axisScores,
        dealbreaker_conflicts: matchResult.dealbreakerConflicts,
        strengths: matchResult.strengths,
        frictions: matchResult.frictions,
        recommendations: matchResult.recommendations,
        computed_at: new Date().toISOString(),
      })

    if (upsertError) {
      console.error('Erreur sauvegarde résultat:', upsertError)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde du résultat' },
        { status: 500 }
      )
    }

    // Envoyer les notifications par email
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      
      // Notifier les deux utilisateurs
      const emailPromises = [
        fetch(`${baseUrl}/api/email/send`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'results_ready',
            email: pair.user_a_email,
            resultsUrl: `${baseUrl}/results/${pairId}`,
            pairId,
          }),
        }),
      ]

      if (pair.user_b_email) {
        emailPromises.push(
          fetch(`${baseUrl}/api/email/send`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'results_ready',
              email: pair.user_b_email,
              resultsUrl: `${baseUrl}/results/${pairId}`,
              pairId,
            }),
          })
        )
      }

      await Promise.all(emailPromises)
    } catch (emailError) {
      console.error('Erreur envoi emails résultats:', emailError)
      // Ne pas faire échouer si les emails échouent
    }

    return NextResponse.json({
      success: true,
      overallScore: matchResult.overallScore,
      dealbreakerConflicts: matchResult.dealbreakerConflicts,
      resultsUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/results/${pairId}`,
    })

  } catch (error) {
    console.error('Erreur API compute match:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
