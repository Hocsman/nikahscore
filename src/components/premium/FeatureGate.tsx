'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useFeaturePermission, FeatureCode } from '@/hooks/useFeaturePermission'
import { useSubscription } from '@/hooks/useSubscription'
import UpgradePrompt from './UpgradePrompt'

interface FeatureGateProps {
  /** Code de la feature à vérifier */
  featureCode: FeatureCode
  /** Contenu à afficher si l'utilisateur a accès */
  children: ReactNode
  /** Fallback à afficher si pas d'accès (optionnel, sinon affiche UpgradePrompt) */
  fallback?: ReactNode
  /** Mode silencieux : retourne null au lieu d'afficher le prompt */
  silent?: boolean
  /** Message personnalisé pour le prompt */
  customMessage?: string
}

/**
 * Composant Gate qui contrôle l'accès aux features premium
 * 
 * Utilisation :
 * ```tsx
 * <FeatureGate featureCode="pdf_export">
 *   <button>Exporter en PDF</button>
 * </FeatureGate>
 * ```
 */
export default function FeatureGate({
  featureCode,
  children,
  fallback,
  silent = false,
  customMessage
}: FeatureGateProps) {
  const permission = useFeaturePermission(featureCode)
  const { planName, planCode, isPremium, isConseil } = useSubscription()
  const [showPrompt, setShowPrompt] = useState(false)

  console.log(`🚪 FeatureGate ${featureCode}:`, {
    allowed: permission.allowed,
    blocked: permission.blocked,
    loading: 'loading' in permission ? permission.loading : false
  })

  // Si loading, on affiche le contenu (évite le flash)
  if ('loading' in permission && permission.loading) {
    return <>{children}</>
  }

  // Si l'utilisateur a accès, on affiche le contenu
  if (permission.allowed) {
    return <>{children}</>
  }

  // Si mode silencieux, on retourne null
  if (silent) {
    return null
  }

  // Si fallback personnalisé fourni
  if (fallback) {
    return <>{fallback}</>
  }

  // Sinon, on affiche l'UpgradePrompt
  return (
    <>
      <div 
        onClick={() => setShowPrompt(true)}
        className="cursor-pointer"
      >
        {/* Afficher le contenu mais désactivé visuellement */}
        <div className="relative opacity-60 pointer-events-none">
          {children}
        </div>
        
        {/* Badge "Premium" ou "Conseil" */}
        <div className="absolute -top-2 -right-2 z-10">
          <span className="inline-flex items-center px-2 py-1 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-purple-600 rounded-full shadow-lg">
            {permission.limit && permission.usage !== undefined 
              ? '⚠️ Limite atteinte' 
              : '🔒 Premium'}
          </span>
        </div>
      </div>

      <UpgradePrompt
        isOpen={showPrompt}
        onClose={() => setShowPrompt(false)}
        featureCode={featureCode}
        currentPlan={planCode}
        customMessage={customMessage}
        reason={permission.reason}
        requiredPlan={permission.requiredPlan}
      />
    </>
  )
}

/**
 * Hook utilitaire pour vérifier l'accès dans la logique (sans UI)
 */
export function useFeatureGate(featureCode: FeatureCode) {
  const permission = useFeaturePermission(featureCode)
  
  return {
    isAllowed: permission.allowed,
    isBlocked: permission.blocked,
    remaining: permission.remaining,
    usage: permission.usage,
    limit: permission.limit,
    reason: permission.reason,
    isLoading: 'loading' in permission ? permission.loading : false
  }
}
