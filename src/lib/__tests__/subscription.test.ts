import { describe, it, expect } from 'vitest'
import {
  getUserSubscription,
  hasFeature,
  getPlanLimitations,
  checkPermission,
  checkPermissionSimple,
  PLAN_FEATURES,
} from '../subscription'

describe('getUserSubscription', () => {
  it('retourne le plan gratuit par défaut pour un email inconnu', () => {
    const sub = getUserSubscription('unknown@test.com')
    expect(sub.plan).toBe('gratuit')
    expect(sub.isActive).toBe(true)
    expect(sub.features).toEqual(PLAN_FEATURES.gratuit)
  })

  it('retourne le plan configuré pour test@nikahscore.com', () => {
    const sub = getUserSubscription('test@nikahscore.com')
    expect(sub.plan).toBe('gratuit')
    expect(sub.isActive).toBe(true)
  })
})

describe('hasFeature', () => {
  it('retourne true pour basic_questionnaire (plan gratuit)', () => {
    expect(hasFeature('unknown@test.com', 'basic_questionnaire')).toBe(true)
  })

  it('retourne true pour basic_results (plan gratuit)', () => {
    expect(hasFeature('unknown@test.com', 'basic_results')).toBe(true)
  })

  it('retourne false pour pdf_report (plan gratuit)', () => {
    expect(hasFeature('unknown@test.com', 'pdf_report')).toBe(false)
  })

  it('retourne false pour expert_consultation (plan gratuit)', () => {
    expect(hasFeature('unknown@test.com', 'expert_consultation')).toBe(false)
  })
})

describe('PLAN_FEATURES', () => {
  it('premium inclut toutes les fonctionnalités du plan gratuit', () => {
    for (const feature of PLAN_FEATURES.gratuit) {
      expect(PLAN_FEATURES.premium).toContain(feature)
    }
  })

  it('conseil inclut toutes les fonctionnalités du plan premium', () => {
    for (const feature of PLAN_FEATURES.premium) {
      expect(PLAN_FEATURES.conseil).toContain(feature)
    }
  })

  it('conseil a des fonctionnalités exclusives', () => {
    expect(PLAN_FEATURES.conseil).toContain('expert_consultation')
    expect(PLAN_FEATURES.conseil).toContain('priority_support')
    expect(PLAN_FEATURES.conseil).toContain('custom_questions')
  })

  it('gratuit a 3 fonctionnalités', () => {
    expect(PLAN_FEATURES.gratuit).toHaveLength(3)
  })
})

describe('getPlanLimitations', () => {
  it('gratuit: 1 profil, 1 questionnaire/mois, pas de PDF', () => {
    const limits = getPlanLimitations('gratuit')
    expect(limits.maxProfiles).toBe(1)
    expect(limits.questionnairesPerMonth).toBe(1)
    expect(limits.canDownloadPDF).toBe(false)
    expect(limits.canEmailResults).toBe(false)
    expect(limits.hasAdvancedAnalytics).toBe(false)
  })

  it('premium: 1 profil, 5 questionnaires/mois, PDF disponible', () => {
    const limits = getPlanLimitations('premium')
    expect(limits.maxProfiles).toBe(1)
    expect(limits.questionnairesPerMonth).toBe(5)
    expect(limits.canDownloadPDF).toBe(true)
    expect(limits.canEmailResults).toBe(true)
    expect(limits.hasAdvancedAnalytics).toBe(true)
  })

  it('conseil: 5 profils, questionnaires illimités (-1)', () => {
    const limits = getPlanLimitations('conseil')
    expect(limits.maxProfiles).toBe(5)
    expect(limits.questionnairesPerMonth).toBe(-1)
    expect(limits.canDownloadPDF).toBe(true)
    expect(limits.canEmailResults).toBe(true)
    expect(limits.hasAdvancedAnalytics).toBe(true)
  })
})

describe('checkPermission', () => {
  it('autorise une fonctionnalité du plan gratuit', () => {
    const result = checkPermission('unknown@test.com', 'basic_questionnaire')
    expect(result.allowed).toBe(true)
    expect(result.message).toBeUndefined()
  })

  it('refuse pdf_report pour plan gratuit avec upgradeRequired', () => {
    const result = checkPermission('unknown@test.com', 'pdf_report')
    expect(result.allowed).toBe(false)
    expect(result.upgradeRequired).toBe('premium')
    expect(result.message).toBeDefined()
  })

  it('refuse expert_consultation avec upgradeRequired conseil', () => {
    const result = checkPermission('unknown@test.com', 'expert_consultation')
    expect(result.allowed).toBe(false)
    expect(result.upgradeRequired).toBe('conseil')
  })
})

describe('checkPermissionSimple', () => {
  it('retourne true pour une feature incluse dans le plan', () => {
    expect(checkPermissionSimple('gratuit', 'basic_questionnaire')).toBe(true)
  })

  it('retourne false pour une feature non incluse', () => {
    expect(checkPermissionSimple('gratuit', 'pdf_report')).toBe(false)
  })

  it('retourne true pour premium + pdf_report', () => {
    expect(checkPermissionSimple('premium', 'pdf_report')).toBe(true)
  })
})
