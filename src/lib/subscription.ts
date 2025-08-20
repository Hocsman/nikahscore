import { NextRequest, NextResponse } from 'next/server'

// Types des plans d'abonnement
export type PlanType = 'free' | 'premium' | 'family' | 'conseil'

// Type pour les fonctionnalités disponibles
export type Feature = 
  | 'basic_questionnaire'
  | 'basic_results'
  | 'basic_compatibility_score'
  | 'detailed_analysis'
  | 'pdf_report'
  | 'email_results'
  | 'advanced_charts'
  | 'recommendations'
  | 'family_comparison'
  | 'multiple_profiles'
  | 'expert_consultation'
  | 'priority_support'
  | 'custom_questions'

export interface UserSubscription {
  plan: PlanType
  isActive: boolean
  expiresAt?: Date
  features: Feature[]
}

// Configuration des fonctionnalités par plan
export const PLAN_FEATURES: Record<PlanType, Feature[]> = {
  free: [
    'basic_questionnaire',
    'basic_results',
    'basic_compatibility_score'
  ],
  premium: [
    'basic_questionnaire',
    'basic_results',
    'basic_compatibility_score',
    'detailed_analysis',
    'pdf_report',
    'email_results',
    'advanced_charts',
    'recommendations'
  ],
  family: [
    'basic_questionnaire',
    'basic_results',
    'basic_compatibility_score',
    'detailed_analysis',
    'pdf_report',
    'email_results',
    'advanced_charts',
    'recommendations',
    'family_comparison',
    'multiple_profiles'
  ],
  conseil: [
    'basic_questionnaire',
    'basic_results',
    'basic_compatibility_score',
    'detailed_analysis',
    'pdf_report',
    'email_results',
    'advanced_charts',
    'recommendations',
    'family_comparison',
    'multiple_profiles',
    'expert_consultation',
    'priority_support',
    'custom_questions'
  ]
}

// Simuler une base d'utilisateurs avec abonnements
const userSubscriptions = new Map<string, UserSubscription>()

// Utilisateur test avec plan gratuit
userSubscriptions.set('test@nikahscore.com', {
  plan: 'free',
  isActive: true,
  features: PLAN_FEATURES.free
})

export function getUserSubscription(email: string): UserSubscription {
  return userSubscriptions.get(email) || {
    plan: 'free',
    isActive: true,
    features: PLAN_FEATURES.free
  }
}

export function hasFeature(userEmail: string, feature: Feature): boolean {
  const subscription = getUserSubscription(userEmail)
  return subscription.isActive && subscription.features.includes(feature)
}

export function getPlanLimitations(plan: PlanType): {
  maxProfiles: number
  questionnairesPerMonth: number
  canDownloadPDF: boolean
  canEmailResults: boolean
  hasAdvancedAnalytics: boolean
} {
  switch (plan) {
    case 'free':
      return {
        maxProfiles: 1,
        questionnairesPerMonth: 1,
        canDownloadPDF: false,
        canEmailResults: false,
        hasAdvancedAnalytics: false
      }
    case 'premium':
      return {
        maxProfiles: 1,
        questionnairesPerMonth: 5,
        canDownloadPDF: true,
        canEmailResults: true,
        hasAdvancedAnalytics: true
      }
    case 'family':
      return {
        maxProfiles: 5,
        questionnairesPerMonth: 20,
        canDownloadPDF: true,
        canEmailResults: true,
        hasAdvancedAnalytics: true
      }
    case 'conseil':
      return {
        maxProfiles: 999,
        questionnairesPerMonth: 999,
        canDownloadPDF: true,
        canEmailResults: true,
        hasAdvancedAnalytics: true
      }
  }
}

// Middleware pour vérifier les permissions
export function checkPermission(
  userEmail: string, 
  feature: Feature
): { allowed: boolean; message?: string; upgradeRequired?: PlanType } {
  const subscription = getUserSubscription(userEmail)
  
  if (!subscription.isActive) {
    return {
      allowed: false,
      message: 'Votre abonnement a expiré',
      upgradeRequired: 'premium'
    }
  }

  if (!hasFeature(userEmail, feature)) {
    let requiredPlan: PlanType = 'premium'
    
    // Déterminer le plan minimum requis
    if (PLAN_FEATURES.premium.includes(feature)) {
      requiredPlan = 'premium'
    } else if (PLAN_FEATURES.family.includes(feature)) {
      requiredPlan = 'family'
    } else if (PLAN_FEATURES.conseil.includes(feature)) {
      requiredPlan = 'conseil'
    }

    return {
      allowed: false,
      message: `Cette fonctionnalité nécessite un abonnement ${requiredPlan.toUpperCase()}`,
      upgradeRequired: requiredPlan
    }
  }

  return { allowed: true }
}

// Version simplifiée pour les hooks
export function checkPermissionSimple(plan: PlanType, feature: Feature): boolean {
  const features = PLAN_FEATURES[plan]
  return features.includes(feature)
}
