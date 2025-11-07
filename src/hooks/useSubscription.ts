import { useState, useEffect } from 'react'
import { useUser } from './useUser'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  plan: 'free' | 'premium' | 'family' | 'conseil'
  status: string
  current_period_start: string | null
  current_period_end: string | null
  canceled_at: string | null
  created_at: string
  updated_at: string
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
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single()

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // Pas de subscription trouvée - utilisateur free
            setSubscription(null)
          } else {
            throw fetchError
          }
        } else {
          setSubscription(data)
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

  // Fonctions utilitaires
  const isPremium = subscription?.plan === 'premium' || subscription?.plan === 'conseil'
  const isConseil = subscription?.plan === 'conseil'
  const isFree = !subscription || subscription?.plan === 'free'
  const isActive = subscription?.status === 'active'

  return {
    subscription,
    loading,
    error,
    isPremium,
    isConseil,
    isFree,
    isActive,
    plan: subscription?.plan || 'free'
  }
}
