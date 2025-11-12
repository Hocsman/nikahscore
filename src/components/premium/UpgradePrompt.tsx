'use client'

import { useEffect } from 'react'
import { X, Crown, Star, ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'
import { FeatureCode } from '@/hooks/useFeaturePermission'

interface UpgradePromptProps {
  isOpen: boolean
  onClose: () => void
  featureCode: FeatureCode
  currentPlan?: string
  customMessage?: string
  reason?: string
  requiredPlan?: string
}

const FEATURE_NAMES: Record<FeatureCode, string> = {
  basic_questionnaire: 'Questionnaire de base',
  unlimited_questionnaires: 'Questionnaires illimités',
  advanced_questions: 'Questions avancées',
  basic_results: 'Résultats de base',
  detailed_analysis: 'Analyse détaillée',
  ai_recommendations: 'Recommandations IA',
  compatibility_trends: 'Tendances de compatibilité',
  pdf_export: 'Export PDF',
  share_results: 'Partage des résultats',
  custom_branding: 'Personnalisation',
  email_support: 'Support email',
  priority_support: 'Support prioritaire',
  dedicated_support: 'Support dédié',
  basic_achievements: 'Badges de base',
  all_achievements: 'Tous les badges',
  leaderboard: 'Classement',
  couple_mode: 'Mode couple',
  couple_insights: 'Analyses couple',
  compatibility_tracking: 'Suivi de compatibilité',
  results_charts: 'Graphiques de compatibilité',
  results_detailed_analysis: 'Analyse détaillée des résultats',
  results_comparison: 'Comparaison avec la communauté',
  results_recommendations: 'Recommandations Premium',
  questionnaire_shareable: 'Questionnaire partageable',
  couple_results_comparison: 'Comparaison résultats couple',
  ai_coach: 'Coach AI Matrimonial'
}

const PLAN_INFO = {
  premium: {
    name: 'Premium',
    icon: <Star className="w-6 h-6" />,
    color: 'from-purple-500 to-purple-600',
    price: '9,99€',
    period: 'par mois',
    features: [
      'Questionnaires illimités',
      'Analyses détaillées',
      'Recommandations IA personnalisées',
      'Export PDF (10/mois)',
      'Support prioritaire'
    ]
  },
  conseil: {
    name: 'Conseil Premium',
    icon: <Crown className="w-6 h-6" />,
    color: 'from-orange-500 to-orange-600',
    price: '49,99€',
    period: 'par mois',
    features: [
      'Tout du plan Premium',
      'Coach matrimonial personnel',
      '2 sessions de conseil/mois',
      'Export PDF illimité',
      'Support dédié immédiat'
    ]
  }
}

export default function UpgradePrompt({
  isOpen,
  onClose,
  featureCode,
  currentPlan = 'free',
  customMessage,
  reason,
  requiredPlan = 'premium'
}: UpgradePromptProps) {
  const featureName = FEATURE_NAMES[featureCode] || 'Cette fonctionnalité'
  const planInfo = PLAN_INFO[requiredPlan as keyof typeof PLAN_INFO] || PLAN_INFO.premium

  // Bloquer le scroll quand la modal est ouverte
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 animate-in zoom-in-95 duration-200">
        <div className="mx-auto max-w-lg w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden m-4">
          {/* Content starts here */}
              {/* Header avec gradient */}
              <div className={`bg-gradient-to-r ${planInfo.color} p-6 text-white relative`}>
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-3 mb-2">
                  {planInfo.icon}
                  <h2 className="text-2xl font-bold">
                    Passez en {planInfo.name}
                  </h2>
                </div>
                
                <p className="text-white/90">
                  {customMessage || reason || `Pour accéder à ${featureName.toLowerCase()}`}
                </p>
              </div>

              {/* Contenu */}
              <div className="p-6">
                {/* Prix */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white">
                    {planInfo.price}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">
                    {planInfo.period}
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                      ✨ Économisez 33% avec le plan annuel
                    </span>
                  </div>
                </div>

                {/* Fonctionnalités */}
                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Ce que vous obtenez :
                  </h4>
                  {planInfo.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Call to Action */}
                <div className="space-y-3">
                  <Link
                    href="/pricing"
                    onClick={onClose}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r ${planInfo.color} text-white font-semibold rounded-xl hover:shadow-lg transition-all`}
                  >
                    Découvrir les offres
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  <button
                    onClick={onClose}
                    className="w-full px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                  >
                    Peut-être plus tard
                  </button>
                </div>

                {/* Garantie */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    🛡️ <strong>Garantie satisfait ou remboursé</strong> 30 jours
                  </p>
                </div>
              </div>
        </div>
      </div>
    </div>
  )
}
