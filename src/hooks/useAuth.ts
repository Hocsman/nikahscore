'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthUser {
  id: string
  email: string
  name?: string
  firstName?: string
  lastName?: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Créer le client Supabase une seule fois avec useMemo
  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    let mounted = true
    
    // Récupérer l'utilisateur authentifié (vérifié côté serveur)
    const fetchUser = async () => {
      try {
        const { data: { user: authUser }, error } = await supabase.auth.getUser()

        if (!mounted) return

        if (error) {
          console.error('❌ useAuth: Erreur getUser:', error)
          setLoading(false)
          return
        }

        if (authUser) {
          const firstName = authUser.user_metadata?.first_name || authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Utilisateur'
          const lastName = authUser.user_metadata?.last_name || null

          setUser({
            id: authUser.id,
            email: authUser.email || '',
            name: firstName,
            firstName: firstName,
            lastName: lastName
          })
        }

        setLoading(false)
      } catch (err) {
        console.error('❌ useAuth: Erreur getUser:', err)
        if (mounted) setLoading(false)
      }
    }

    fetchUser()

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return
        
        // Ignorer INITIAL_SESSION car déjà géré par getSession()
        if (event === 'INITIAL_SESSION') return
        
        if (session?.user) {
          // Récupérer le prénom et nom depuis user_metadata
          const firstName = session.user.user_metadata?.first_name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Utilisateur'
          const lastName = session.user.user_metadata?.last_name || null

          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: firstName, // Pour la rétrocompatibilité
            firstName: firstName,
            lastName: lastName
          })
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // supabase est stable avec useMemo

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    // Nettoyer les données utilisateur du localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nikahscore-responses')
      localStorage.removeItem('nikahscore-paginated-responses')
    }
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}
