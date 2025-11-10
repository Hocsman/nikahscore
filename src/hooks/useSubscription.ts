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
        
        const { data, error: fetchError } = await supabase
          .from('user_subscriptions')
          .select(`
            *,
            plan:subscription_plans(*)
          `)
          .eq('user_id', user.id)
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Pas de subscription trouvée - utilisateur free
            console.log('ℹ️ Pas d\'abonnement trouvé, utilisateur sur plan gratuit')
            setSubscription(null)
          } else {
            throw fetchError
          }
        } else {
          setSubscription(data as Subscription)
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
  }, [user])

  // Fonctions utilitaires
  const isPremium = subscription?.plan?.name === 'premium'
  const isConseil = subscription?.plan?.name === 'conseil'
  const isFree = !subscription || subscription?.plan?.name === 'free'
  const isActive = subscription?.status === 'active'
  const planName = subscription?.plan?.display_name || 'Gratuit'
  const planCode = subscription?.plan?.name || 'free'

  return {
    subscription,
    loading,
    error,
    isPremium,
    isConseil,
    isFree,
    isActive,
    planName,
    planCode,
    checkFeatureAccess,
    plan: subscription?.plan?.name || 'free'
  }
}
