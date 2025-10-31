'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

interface AuthUser {
  id: string
  email: string
  name?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Créer le client Supabase une seule fois avec useMemo
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        console.log('🔍 useAuth: Récupération de la session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('❌ useAuth: Erreur session:', error)
          setLoading(false)
          return
        }
        
        if (session?.user) {
          console.log('✅ useAuth: Session trouvée:', session.user.email)
          
          // Récupérer le nom depuis user_metadata (pas de requête DB)
          const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Utilisateur'

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: userName
          })
        } else {
          console.log('ℹ️ useAuth: Pas de session active')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('❌ useAuth: Erreur getSession:', err)
        setLoading(false)
      }
    }

    getSession()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔔 useAuth: Auth state change:', event, session?.user?.email)
        
        if (session?.user) {
          // Récupérer le nom depuis user_metadata (pas de requête DB)
          const userName = session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Utilisateur'

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: userName
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // supabase est stable avec useMemo

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}
