import { useState, useEffect, useCallback } from 'react'
import { useUser } from './useUser'
import { createClient } from '@/lib/supabase/client'

interface SubscriptionPlan {
  id: string
  name: string
  display_name: string
  description: string | null
  price_monthly: number
  price_yearly: number | null
}

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  status: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing'
  billing_cycle: 'monthly' | 'yearly'
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

interface FeatureAccess {
  has_access: boolean
  limit_value: number | null
  current_usage: number
  remaining: number | null
}

export function useSubscription() {
  const { user, loading: userLoading } = useUser()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (userLoading) return

    if (!user) {
      setSubscription(null)
      setLoading(false)
      return
    }

    const fetchSubscription = async () => {
      try {
        const supabase = createClient()
        
        // IMPORTANT: Lire depuis la table profiles (colonnes: subscription_plan, subscription_status)
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('subscription_plan, subscription_status, subscription_start, subscription_end')
          .eq('id', user.id)
          .single()

        if (userError) {
          console.error('❌ Erreur récupération utilisateur:', userError)
          throw userError
        }

        const planName = userData?.subscription_plan || 'free'
        const planStatus = userData?.subscription_status || 'inactive'


        // Si pas de plan ou plan gratuit
        if (planName === 'free' || planStatus !== 'active') {
          setSubscription(null)
        } else {
          // Récupérer les détails du plan depuis subscription_plans
          const { data: planData, error: planError } = await supabase
            .from('subscription_plans')
            .select('*')
            .eq('name', planName)
            .single()

          if (planError) {
            console.error('❌ Erreur récupération plan:', planError)
            throw planError
          }

          // Créer un objet subscription compatible
          const subscriptionData = {
            id: user.id,
            user_id: user.id,
            plan_id: planData.id,
            stripe_customer_id: null,
            stripe_subscription_id: null,
            status: planStatus as 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing',
            billing_cycle: 'monthly' as 'monthly' | 'yearly',
            current_period_start: userData.subscription_start || null,
            current_period_end: userData.subscription_end || null,
            cancel_at_period_end: false,
            created_at: userData.subscription_start || new Date().toISOString(),
            updated_at: new Date().toISOString(),
            plan: planData
          }
          
          setSubscription(subscriptionData as Subscription)
        }
      } catch (err) {
        console.error('Erreur lors de la récupération de l\'abonnement:', err)
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [user, userLoading])

  // Fonctions utilitaires - déclarées avant checkFeatureAccess pour pouvoir les utiliser
  const isPremiumPlan = subscription?.plan?.name === 'premium'
  const isConseilPlan = subscription?.plan?.name === 'conseil'
  const isFreePlan = !subscription || subscription?.plan?.name === 'free'
  const isActivePlan = subscription?.status === 'active'

  // Liste des features par plan
  const premiumFeatures = [
    'unlimited_questionnaires',
    'advanced_questions',
    'detailed_analysis',
    'ai_recommendations',
    'compatibility_trends',
    'pdf_export',
    'share_results',
    'custom_branding',
    'priority_support',
    'results_charts',
    'results_detailed_analysis',
    'results_comparison',
    'results_recommendations',
    'questionnaire_shareable',
    'couple_results_comparison',
    'all_achievements',
    'leaderboard',
    'couple_mode',
    'couple_insights',
    'compatibility_tracking',
    'budget_sessions',
    'shared_todos'
  ]

  const conseilFeatures = [
    ...premiumFeatures,
    'ai_coach',
    'dedicated_support'
  ]

  // Vérifier l'accès à une feature
  const checkFeatureAccess = useCallback(async (featureCode: string): Promise<FeatureAccess> => {
    if (!user) {
      return {
        has_access: false,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    }

    // Vérification locale basée sur le plan (prioritaire et plus fiable)
    if (isConseilPlan && isActivePlan) {
      // Plan Conseil a accès à tout
      return {
        has_access: true,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    }

    if (isPremiumPlan && isActivePlan && premiumFeatures.includes(featureCode)) {
      // Plan Premium a accès aux features premium
      return {
        has_access: true,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    }

    // Features gratuites de base
    const freeFeatures = ['basic_questionnaire', 'basic_results', 'basic_achievements', 'email_support']
    if (freeFeatures.includes(featureCode)) {
      return {
        has_access: true,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    }

    // Essayer la RPC Supabase en fallback
    try {
      const supabase = createClient()
      const { data, error: rpcError } = await supabase
        .rpc('check_feature_access', {
          p_user_id: user.id,
          p_feature_code: featureCode
        })

      if (rpcError) throw rpcError

      if (data && data.length > 0) {
        return data[0]
      }

      return {
        has_access: false,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    } catch (err) {
      console.error(`❌ Erreur vérification feature ${featureCode}:`, err)
      return {
        has_access: false,
        limit_value: null,
        current_usage: 0,
        remaining: null
      }
    }
  }, [user, isConseilPlan, isPremiumPlan, isActivePlan])

  const planName = subscription?.plan?.display_name || 'Gratuit'
  const planCode = subscription?.plan?.name || 'free'

  return {
    subscription,
    loading,
    error,
    isPremium: isPremiumPlan,
    isConseil: isConseilPlan,
    isFree: isFreePlan,
    isActive: isActivePlan,
    planName,
    planCode,
    checkFeatureAccess,
    plan: subscription?.plan?.name || 'free'
  }
}
