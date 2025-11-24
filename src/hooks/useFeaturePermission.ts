'use client'

import { useState, useEffect } from 'react'
import { useSubscription } from './useSubscription'

export interface FeaturePermission {
  allowed: boolean
  blocked: boolean
  reason?: string
  requiredPlan?: string
  limit?: number
  remaining?: number
  usage?: number
}

// Liste des features disponibles
export type FeatureCode =
  | 'basic_questionnaire'
  | 'unlimited_questionnaires'
  | 'advanced_questions'
  | 'basic_results'
  | 'detailed_analysis'
  | 'ai_recommendations'
  | 'compatibility_trends'
  | 'pdf_export'
  | 'share_results'
  | 'custom_branding'
  | 'email_support'
  | 'priority_support'
  | 'dedicated_support'
  | 'results_charts'
  | 'results_detailed_analysis'
  | 'results_comparison'
  | 'results_recommendations'
  | 'questionnaire_shareable'
  | 'couple_results_comparison'
  | 'ai_coach'
  | 'basic_achievements'
  | 'all_achievements'
  | 'leaderboard'
  | 'couple_mode'
  | 'couple_insights'
  | 'compatibility_tracking'

export function useFeaturePermission(featureCode: FeatureCode): FeaturePermission {
  const { checkFeatureAccess, loading: subLoading } = useSubscription()
  const [permission, setPermission] = useState<FeaturePermission>({
    allowed: false,
    blocked: true,
    reason: 'Chargement...'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkPermission = async () => {
      if (subLoading) return

      try {
        const access = await checkFeatureAccess(featureCode)
        console.log(`🔐 Feature ${featureCode} access:`, access)

        if (access.has_access) {
          setPermission({
            allowed: true,
            blocked: false,
            limit: access.limit_value ?? undefined,
            remaining: access.remaining ?? undefined,
            usage: access.current_usage
          })
        } else {
          // Déterminer quel plan est requis
          const requiredPlan = getRequiredPlanForFeature(featureCode)
          
          setPermission({
            allowed: false,
            blocked: true,
            reason: access.limit_value !== null 
              ? `Limite de ${access.limit_value} atteinte. Passez à ${requiredPlan} pour continuer.`
              : `Cette fonctionnalité nécessite le plan ${requiredPlan}.`,
            requiredPlan,
            limit: access.limit_value ?? undefined,
            usage: access.current_usage
          })
        }
      } catch (err) {
        console.error(`Erreur vérification permission ${featureCode}:`, err)
        setPermission({
          allowed: false,
          blocked: true,
          reason: 'Erreur lors de la vérification des permissions'
        })
      } finally {
        setLoading(false)
      }
    }

    checkPermission()
  }, [featureCode, checkFeatureAccess, subLoading])

  return { ...permission, loading } as FeaturePermission & { loading: boolean }
}

// Fonction utilitaire pour déterminer le plan minimum requis
function getRequiredPlanForFeature(featureCode: FeatureCode): string {
  // Features Conseil uniquement (exclusives)
  const conseilFeatures: FeatureCode[] = [
    'ai_coach'
  ]

  // Features Premium uniquement
  const premiumFeatures: FeatureCode[] = [
    'compatibility_trends',
    'custom_branding',
    'leaderboard',
    'compatibility_tracking',
    'dedicated_support',
    'unlimited_questionnaires',
    'advanced_questions',
    'detailed_analysis',
    'ai_recommendations',
    'pdf_export',
    'all_achievements',
    'couple_insights',
    'priority_support'
  ]

  if (conseilFeatures.includes(featureCode)) {
    return 'Conseil'
  }

  if (premiumFeatures.includes(featureCode)) {
    return 'Premium'
  }

  return 'Gratuit'
}

// Hook simplifié pour vérifier rapidement l'accès
export function useHasFeature(featureCode: FeatureCode): boolean {
  const permission = useFeaturePermission(featureCode)
  return permission.allowed
}
