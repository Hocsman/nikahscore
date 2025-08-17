import { z } from 'zod'

// Schéma de validation pour l'onboarding
export const onboardingSchema = z.object({
  age: z.number().min(18, 'Vous devez avoir au moins 18 ans').max(100, 'Âge invalide'),
  city: z.string().min(2, 'Ville requise').max(100, 'Nom de ville trop long'),
  practiceLevel: z.enum(['debutant', 'pratiquant', 'tres_pratiquant'], {
    required_error: 'Niveau de pratique requis'
  }),
  marriageIntention: z.enum(['dans_annee', 'dans_2_ans', 'pas_presse'], {
    required_error: 'Intention de mariage requise'
  })
})

// Schéma de validation pour la création d'une paire
export const createPairSchema = z.object({
  userAEmail: z.string().email('Email invalide'),
  userBEmail: z.string().email('Email invalide').optional()
})

// Schéma de validation pour une réponse au questionnaire
export const answerSchema = z.object({
  questionId: z.string().uuid('ID de question invalide'),
  value: z.number().min(1, 'Valeur minimale: 1').max(5, 'Valeur maximale: 5'),
  importance: z.number().min(1, 'Importance minimale: 1').max(3, 'Importance maximale: 3')
})

// Schéma de validation pour sauvegarder les réponses
export const saveAnswersSchema = z.object({
  pairId: z.string().uuid('ID de paire invalide'),
  respondent: z.enum(['A', 'B'], {
    required_error: 'Répondant requis'
  }),
  answers: z.array(answerSchema).min(1, 'Au moins une réponse requise')
})

// Schéma de validation pour l'email
export const emailSchema = z.object({
  type: z.enum(['invite', 'results_ready', 'reminder'], {
    required_error: 'Type d\'email requis'
  }),
  email: z.string().email('Email invalide'),
  pairId: z.string().uuid('ID de paire invalide'),
  inviteUrl: z.string().url('URL d\'invitation invalide').optional(),
  resultsUrl: z.string().url('URL de résultats invalide').optional()
})

// Schéma de validation pour le feedback
export const feedbackSchema = z.object({
  pairId: z.string().uuid('ID de paire invalide'),
  respondent: z.enum(['A', 'B'], {
    required_error: 'Répondant requis'
  }),
  rating: z.number().min(1, 'Note minimale: 1').max(5, 'Note maximale: 5'),
  comment: z.string().max(1000, 'Commentaire trop long').optional(),
  isAccurate: z.boolean().optional(),
  suggestions: z.string().max(1000, 'Suggestions trop longues').optional()
})

// Schéma de validation pour les paramètres de recherche
export const searchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
  sort: z.enum(['created_at', 'updated_at', 'score']).default('created_at'),
  order: z.enum(['asc', 'desc']).default('desc')
})

// Types dérivés des schémas
export type OnboardingData = z.infer<typeof onboardingSchema>
export type CreatePairData = z.infer<typeof createPairSchema>
export type AnswerData = z.infer<typeof answerSchema>
export type SaveAnswersData = z.infer<typeof saveAnswersSchema>
export type EmailData = z.infer<typeof emailSchema>
export type FeedbackData = z.infer<typeof feedbackSchema>
export type SearchParams = z.infer<typeof searchParamsSchema>

// Fonctions utilitaires de validation
export function validateEmail(email: string): boolean {
  try {
    z.string().email().parse(email)
    return true
  } catch {
    return false
  }
}

export function validateUUID(uuid: string): boolean {
  try {
    z.string().uuid().parse(uuid)
    return true
  } catch {
    return false
  }
}

export function validateAge(age: number): boolean {
  try {
    z.number().min(18).max(100).parse(age)
    return true
  } catch {
    return false
  }
}

// Schéma pour valider les questions du questionnaire
export const questionSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(10, 'Question trop courte').max(500, 'Question trop longue'),
  category: z.enum([
    'valeurs_religieuses',
    'mode_de_vie', 
    'famille',
    'finances',
    'intimite',
    'projets_avenir'
  ]),
  axis: z.enum([
    'spiritualite',
    'tradition',
    'ouverture',
    'ambition',
    'stabilite',
    'compatibilite'
  ]),
  isDealbreaker: z.boolean().default(false),
  orderIndex: z.number().min(1),
  weight: z.number().min(0.5).max(2.0).default(1.0)
})

export type QuestionData = z.infer<typeof questionSchema>

// Validation des scores de compatibilité
export const compatibilityScoreSchema = z.object({
  overallScore: z.number().min(0).max(100),
  axisScores: z.record(z.string(), z.number().min(0).max(100)),
  dealbreakerConflicts: z.number().min(0),
  strengths: z.array(z.string()),
  frictions: z.array(z.string()),
  recommendations: z.array(z.string())
})

export type CompatibilityScore = z.infer<typeof compatibilityScoreSchema>

// Schéma pour calculer la compatibilité
export const computeMatchSchema = z.object({
  pairId: z.string().uuid('ID de paire invalide'),
  forceRecalculate: z.boolean().default(false)
})

// Schéma pour envoyer un email
export const sendEmailSchema = z.object({
  to: z.string().email('Email destinataire invalide'),
  subject: z.string().min(1, 'Sujet requis'),
  template: z.enum(['invitation', 'results', 'reminder']),
  data: z.record(z.any()).optional()
})

export type ComputeMatchData = z.infer<typeof computeMatchSchema>
export type SendEmailData = z.infer<typeof sendEmailSchema>
