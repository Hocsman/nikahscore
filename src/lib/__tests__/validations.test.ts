import { describe, it, expect } from 'vitest'
import {
  validateEmail,
  validateUUID,
  validateAge,
  onboardingSchema,
  answerSchema,
  saveAnswersSchema,
  questionSchema,
  createPairSchema,
  feedbackSchema,
  searchParamsSchema,
} from '../validations'

describe('validateEmail', () => {
  it('accepte un email valide', () => {
    expect(validateEmail('user@test.com')).toBe(true)
  })

  it('accepte un email avec sous-domaine', () => {
    expect(validateEmail('user@mail.test.com')).toBe(true)
  })

  it('rejette une string sans @', () => {
    expect(validateEmail('not-email')).toBe(false)
  })

  it('rejette un email mal formé', () => {
    expect(validateEmail('@.com')).toBe(false)
  })

  it('rejette une string vide', () => {
    expect(validateEmail('')).toBe(false)
  })
})

describe('validateUUID', () => {
  it('accepte un UUID v4 valide', () => {
    expect(validateUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true)
  })

  it('rejette une string aléatoire', () => {
    expect(validateUUID('not-a-uuid')).toBe(false)
  })

  it('rejette une string vide', () => {
    expect(validateUUID('')).toBe(false)
  })
})

describe('validateAge', () => {
  it('accepte 18 (minimum)', () => {
    expect(validateAge(18)).toBe(true)
  })

  it('accepte 100 (maximum)', () => {
    expect(validateAge(100)).toBe(true)
  })

  it('rejette 17 (trop jeune)', () => {
    expect(validateAge(17)).toBe(false)
  })

  it('rejette 101 (trop vieux)', () => {
    expect(validateAge(101)).toBe(false)
  })

  it('accepte un âge intermédiaire', () => {
    expect(validateAge(30)).toBe(true)
  })
})

describe('onboardingSchema', () => {
  const validData = {
    age: 25,
    city: 'Paris',
    practiceLevel: 'pratiquant' as const,
    marriageIntention: 'dans_annee' as const,
  }

  it('accepte des données valides', () => {
    const result = onboardingSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejette un âge < 18', () => {
    const result = onboardingSchema.safeParse({ ...validData, age: 16 })
    expect(result.success).toBe(false)
  })

  it('rejette un practiceLevel invalide', () => {
    const result = onboardingSchema.safeParse({ ...validData, practiceLevel: 'invalid' })
    expect(result.success).toBe(false)
  })

  it('rejette une ville trop courte', () => {
    const result = onboardingSchema.safeParse({ ...validData, city: 'A' })
    expect(result.success).toBe(false)
  })

  it('rejette un marriageIntention invalide', () => {
    const result = onboardingSchema.safeParse({ ...validData, marriageIntention: 'invalid' })
    expect(result.success).toBe(false)
  })
})

describe('answerSchema', () => {
  it('accepte une réponse valide', () => {
    const result = answerSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      value: 3,
      importance: 2,
    })
    expect(result.success).toBe(true)
  })

  it('rejette une valeur à 0', () => {
    const result = answerSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      value: 0,
      importance: 2,
    })
    expect(result.success).toBe(false)
  })

  it('rejette une valeur à 6', () => {
    const result = answerSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      value: 6,
      importance: 2,
    })
    expect(result.success).toBe(false)
  })

  it('rejette une importance à 0', () => {
    const result = answerSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      value: 3,
      importance: 0,
    })
    expect(result.success).toBe(false)
  })

  it('rejette une importance à 4', () => {
    const result = answerSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      value: 3,
      importance: 4,
    })
    expect(result.success).toBe(false)
  })

  it('rejette un questionId non-UUID', () => {
    const result = answerSchema.safeParse({
      questionId: 'not-uuid',
      value: 3,
      importance: 2,
    })
    expect(result.success).toBe(false)
  })
})

describe('saveAnswersSchema', () => {
  it('accepte des données valides', () => {
    const result = saveAnswersSchema.safeParse({
      pairId: '550e8400-e29b-41d4-a716-446655440000',
      respondent: 'A',
      answers: [
        { questionId: '550e8400-e29b-41d4-a716-446655440000', value: 3, importance: 2 },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejette un array de réponses vide', () => {
    const result = saveAnswersSchema.safeParse({
      pairId: '550e8400-e29b-41d4-a716-446655440000',
      respondent: 'A',
      answers: [],
    })
    expect(result.success).toBe(false)
  })

  it('rejette un pairId non-UUID', () => {
    const result = saveAnswersSchema.safeParse({
      pairId: 'not-uuid',
      respondent: 'A',
      answers: [
        { questionId: '550e8400-e29b-41d4-a716-446655440000', value: 3, importance: 2 },
      ],
    })
    expect(result.success).toBe(false)
  })
})

describe('createPairSchema', () => {
  it('accepte des emails valides', () => {
    const result = createPairSchema.safeParse({
      userAEmail: 'a@test.com',
      userBEmail: 'b@test.com',
    })
    expect(result.success).toBe(true)
  })

  it('accepte sans userBEmail (optionnel)', () => {
    const result = createPairSchema.safeParse({
      userAEmail: 'a@test.com',
    })
    expect(result.success).toBe(true)
  })

  it('rejette un email invalide', () => {
    const result = createPairSchema.safeParse({
      userAEmail: 'not-email',
    })
    expect(result.success).toBe(false)
  })
})

describe('questionSchema', () => {
  it('rejette un texte trop court (< 10 chars)', () => {
    const result = questionSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      text: 'Court',
      category: 'famille',
      axis: 'spiritualite',
      orderIndex: 1,
    })
    expect(result.success).toBe(false)
  })

  it('rejette une catégorie invalide', () => {
    const result = questionSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      text: 'Ceci est une question assez longue',
      category: 'invalid_category',
      axis: 'spiritualite',
      orderIndex: 1,
    })
    expect(result.success).toBe(false)
  })

  it('accepte une question valide', () => {
    const result = questionSchema.safeParse({
      id: '550e8400-e29b-41d4-a716-446655440000',
      text: 'Quelle est votre vision de la pratique religieuse ?',
      category: 'valeurs_religieuses',
      axis: 'spiritualite',
      orderIndex: 1,
      weight: 1.0,
      isDealbreaker: false,
    })
    expect(result.success).toBe(true)
  })
})

describe('searchParamsSchema', () => {
  it('utilise les valeurs par défaut', () => {
    const result = searchParamsSchema.safeParse({})
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.page).toBe(1)
      expect(result.data.limit).toBe(20)
      expect(result.data.sort).toBe('created_at')
      expect(result.data.order).toBe('desc')
    }
  })

  it('rejette une limit > 100', () => {
    const result = searchParamsSchema.safeParse({ limit: 200 })
    expect(result.success).toBe(false)
  })
})
