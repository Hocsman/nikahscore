import { describe, it, expect } from 'vitest'
import {
  isValidAnswerChoice,
  isValidQuestionCategory,
  isValidPairStatus,
  isValidUserRole,
  ANSWER_CHOICES,
  QUESTION_CATEGORIES,
  PAIR_STATUSES,
  USER_ROLES,
  NikahScoreError,
  ValidationError,
  AuthenticationError,
  NotFoundError,
  ConflictError,
  RateLimitError,
} from '../types'

// ==================== Type Guards ====================

describe('isValidAnswerChoice', () => {
  it.each(['A', 'B', 'C', 'D'])('accepte "%s"', (choice) => {
    expect(isValidAnswerChoice(choice)).toBe(true)
  })

  it.each(['E', '1', '', 'a', 'AB'])('rejette "%s"', (choice) => {
    expect(isValidAnswerChoice(choice)).toBe(false)
  })
})

describe('isValidQuestionCategory', () => {
  it.each(['faith', 'lifestyle', 'family', 'education', 'social', 'personality'])(
    'accepte "%s"',
    (cat) => {
      expect(isValidQuestionCategory(cat)).toBe(true)
    }
  )

  it.each(['invalid', 'FAITH', '', 'spiritualite'])('rejette "%s"', (cat) => {
    expect(isValidQuestionCategory(cat)).toBe(false)
  })
})

describe('isValidPairStatus', () => {
  it.each(['pending', 'active', 'completed', 'expired'])('accepte "%s"', (status) => {
    expect(isValidPairStatus(status)).toBe(true)
  })

  it.each(['invalid', 'ACTIVE', '', 'cancelled'])('rejette "%s"', (status) => {
    expect(isValidPairStatus(status)).toBe(false)
  })
})

describe('isValidUserRole', () => {
  it.each(['user', 'admin'])('accepte "%s"', (role) => {
    expect(isValidUserRole(role)).toBe(true)
  })

  it.each(['superadmin', 'USER', '', 'moderator'])('rejette "%s"', (role) => {
    expect(isValidUserRole(role)).toBe(false)
  })
})

// ==================== Constants ====================

describe('Constantes', () => {
  it('ANSWER_CHOICES contient 4 choix', () => {
    expect(ANSWER_CHOICES).toEqual(['A', 'B', 'C', 'D'])
  })

  it('QUESTION_CATEGORIES contient 6 catégories', () => {
    expect(QUESTION_CATEGORIES).toHaveLength(6)
  })

  it('PAIR_STATUSES contient 4 statuts', () => {
    expect(PAIR_STATUSES).toHaveLength(4)
  })

  it('USER_ROLES contient 2 rôles', () => {
    expect(USER_ROLES).toEqual(['user', 'admin'])
  })
})

// ==================== Error Classes ====================

describe('NikahScoreError', () => {
  it('contient message, code et statusCode', () => {
    const error = new NikahScoreError('Test error', 'TEST_CODE', 418)
    expect(error.message).toBe('Test error')
    expect(error.code).toBe('TEST_CODE')
    expect(error.statusCode).toBe(418)
    expect(error.name).toBe('NikahScoreError')
  })

  it('a un statusCode par défaut de 500', () => {
    const error = new NikahScoreError('Test', 'CODE')
    expect(error.statusCode).toBe(500)
  })

  it('accepte des details optionnels', () => {
    const details = { field: 'email' }
    const error = new NikahScoreError('Test', 'CODE', 400, details)
    expect(error.details).toEqual(details)
  })

  it('est une instance de Error', () => {
    const error = new NikahScoreError('Test', 'CODE')
    expect(error).toBeInstanceOf(Error)
  })
})

describe('ValidationError', () => {
  it('a statusCode 400 et code VALIDATION_ERROR', () => {
    const error = new ValidationError('Champ invalide')
    expect(error.statusCode).toBe(400)
    expect(error.code).toBe('VALIDATION_ERROR')
    expect(error.name).toBe('ValidationError')
  })

  it('est une instance de NikahScoreError', () => {
    const error = new ValidationError('Test')
    expect(error).toBeInstanceOf(NikahScoreError)
  })
})

describe('AuthenticationError', () => {
  it('a statusCode 401 et message par défaut', () => {
    const error = new AuthenticationError()
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Non autorisé')
    expect(error.code).toBe('AUTHENTICATION_ERROR')
    expect(error.name).toBe('AuthenticationError')
  })

  it('accepte un message personnalisé', () => {
    const error = new AuthenticationError('Session expirée')
    expect(error.message).toBe('Session expirée')
  })
})

describe('NotFoundError', () => {
  it('a statusCode 404 et message par défaut', () => {
    const error = new NotFoundError()
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Ressource non trouvée')
    expect(error.code).toBe('NOT_FOUND_ERROR')
  })
})

describe('ConflictError', () => {
  it('a statusCode 409', () => {
    const error = new ConflictError()
    expect(error.statusCode).toBe(409)
    expect(error.code).toBe('CONFLICT_ERROR')
  })
})

describe('RateLimitError', () => {
  it('a statusCode 429', () => {
    const error = new RateLimitError()
    expect(error.statusCode).toBe(429)
    expect(error.message).toBe('Trop de requêtes')
    expect(error.code).toBe('RATE_LIMIT_ERROR')
  })
})
