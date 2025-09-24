'use client'

import { useUser } from '@/hooks/useUser'
import { checkPermissionSimple, PlanType, Feature } from '@/lib/subscription'
import { useCallback, useMemo } from 'react'

export interface UsePermissionReturn {
  hasPermission: (feature: Feature) => boolean
  userPlan: PlanType
  isLoading: boolean
  requiresUpgrade: (feature: Feature) => boolean
  getRequiredPlan: (feature: Feature) => PlanType | null
}

export function usePermission(): UsePermissionReturn {
  const { user, loading } = useUser()
  
  const userPlan: PlanType = useMemo(() => {
    if (!user?.subscription) return 'gratuit'
    return user.subscription.plan as PlanType
  }, [user?.subscription])

  const hasPermission = useCallback((feature: Feature): boolean => {
    if (loading) return false
    return checkPermissionSimple(userPlan, feature)
  }, [userPlan, loading])

  const requiresUpgrade = useCallback((feature: Feature): boolean => {
    return !hasPermission(feature) && userPlan === 'gratuit'
  }, [hasPermission, userPlan])

  const getRequiredPlan = useCallback((feature: Feature): PlanType | null => {
    // Ordre de priorité des plans
    const planPriority: PlanType[] = ['premium', 'conseil']
    
    for (const plan of planPriority) {
      if (checkPermissionSimple(plan, feature)) {
        return plan
      }
    }
    return null
  }, [])

  return {
    hasPermission,
    userPlan,
    isLoading: loading,
    requiresUpgrade,
    getRequiredPlan
  }
}

// Hook spécialisé pour les composants qui ont besoin d'une fonctionnalité spécifique
export function useFeaturePermission(feature: Feature) {
  const { hasPermission, userPlan, isLoading, requiresUpgrade, getRequiredPlan } = usePermission()
  
  return {
    allowed: hasPermission(feature),
    blocked: !hasPermission(feature),
    userPlan,
    isLoading,
    requiresUpgrade: requiresUpgrade(feature),
    requiredPlan: getRequiredPlan(feature)
  }
}

// Hook pour vérifier plusieurs fonctionnalités à la fois
export function useMultiplePermissions(features: Feature[]) {
  const { hasPermission, userPlan, isLoading } = usePermission()
  
  const permissions = useMemo(() => {
    return features.reduce((acc, feature) => {
      acc[feature] = hasPermission(feature)
      return acc
    }, {} as Record<Feature, boolean>)
  }, [features, hasPermission])

  const allAllowed = useMemo(() => {
    return features.every(feature => permissions[feature])
  }, [features, permissions])

  const anyAllowed = useMemo(() => {
    return features.some(feature => permissions[feature])
  }, [features, permissions])

  return {
    permissions,
    allAllowed,
    anyAllowed,
    userPlan,
    isLoading
  }
}
