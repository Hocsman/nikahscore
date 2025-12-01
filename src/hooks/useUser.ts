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
  // Champs Stripe pour compatibilité
  subscription_plan?: string
  subscription_status?: string
  subscription_start?: string
  subscription_end?: string
  stripe_customer_id?: string
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
          // Récupérer les informations du profil avec abonnement (gestion des colonnes manquantes)
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authUser.id)
            .single()


          const extendedUser: ExtendedUser = {
            ...authUser,
            subscription: profile ? {
              plan: (profile as any).subscription_plan || 'gratuit',
              status: (profile as any).subscription_status || 'inactive',
              expiresAt: (profile as any).subscription_end ? new Date((profile as any).subscription_end) : undefined
            } : {
              plan: 'gratuit',
              status: 'inactive'
            },
            // Ajouter les champs Stripe pour compatibilité
            subscription_plan: (profile as any)?.subscription_plan || 'gratuit',
            subscription_status: (profile as any)?.subscription_status || 'inactive',
            subscription_start: (profile as any)?.subscription_start,
            subscription_end: (profile as any)?.subscription_end,
            stripe_customer_id: (profile as any)?.stripe_customer_id
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
