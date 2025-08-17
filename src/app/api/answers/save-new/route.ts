import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

// Schéma de validation pour les réponses
const SaveAnswerSchema = z.object({
  pair_id: z.string().uuid(),
  question_id: z.string().uuid(),
  respondent: z.enum(['A', 'B']),
  value: z.union([
    z.number().int().min(1).max(5), // Pour les questions scale
    z.boolean() // Pour les questions bool
  ]),
  importance: z.number().int().min(1).max(3).optional()
})

const SaveAnswersSchema = z.object({
  answers: z.array(SaveAnswerSchema)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Valider les données
    const validatedData = SaveAnswersSchema.parse(body)
    const { answers } = validatedData

    if (!answers || answers.length === 0) {
      return NextResponse.json(
        { error: 'Aucune réponse à sauvegarder' },
        { status: 400 }
      )
    }

    // Utiliser le client admin pour sauvegarder les réponses
    const supabase = createClient()

    // Convertir les valeurs boolean en entiers (1 pour true, 0 pour false)
    const processedAnswers = answers.map(answer => ({
      ...answer,
      value: typeof answer.value === 'boolean' ? (answer.value ? 1 : 0) : answer.value,
      importance: answer.importance || 1 // Importance par défaut
    }))

    // Utiliser upsert pour insérer ou mettre à jour les réponses
    const { data, error } = await supabase
      .from('answers')
      .upsert(processedAnswers, {
        onConflict: 'pair_id,question_id,respondent'
      })
      .select()

    if (error) {
      console.error('Erreur sauvegarde réponses:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la sauvegarde des réponses' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${processedAnswers.length} réponse(s) sauvegardée(s)`,
      saved_count: processedAnswers.length
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Erreur validation:', error.errors)
      return NextResponse.json(
        { error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Erreur API sauvegarde réponses:', error)
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    )
  }
}
