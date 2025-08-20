'use client'

import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface UserSubscription {
  plan: string
  status: 'active' | 'inactive' | 'cancelled'
  expiresAt?: Date
}

interface ExtendedUser extends User {
  subscription?: UserSubscription
}

interface UseUserReturn {
  user: ExtendedUser | null
  loading: boolean
  error: Error | null
}

export function useUser(): UseUserReturn {
  const [user, setUser] = useState<ExtendedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
        
        if (authError) {
          throw authError
        }

        if (authUser && mounted) {
          // Récupérer les informations d'abonnement
          const { data: subscription, error: subError } = await supabase
            .from('user_subscriptions')
            .select('plan, status, expires_at')
            .eq('user_id', authUser.id)
            .single()

          const extendedUser: ExtendedUser = {
            ...authUser,
            subscription: subscription ? {
              plan: subscription.plan || 'free',
              status: subscription.status || 'inactive',
              expiresAt: subscription.expires_at ? new Date(subscription.expires_at) : undefined
            } : {
              plan: 'free',
              status: 'inactive'
            }
          }

          setUser(extendedUser)
        } else if (mounted) {
          setUser(null)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Erreur inconnue'))
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        getUser()
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
      }
    })

    getUser()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase])

  return { user, loading, error }
}
