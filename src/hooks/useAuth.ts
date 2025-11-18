'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

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
    
    // Récupérer la session actuelle
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return
        
        if (error) {
          console.error('❌ useAuth: Erreur session:', error)
          setLoading(false)
          return
        }
        
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
        }
        
        setLoading(false)
      } catch (err) {
        console.error('❌ useAuth: Erreur getSession:', err)
        if (mounted) setLoading(false)
      }
    }

    getSession()

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
  }

  return {
    user,
    loading,
    signOut,
    isAuthenticated: !!user
  }
}
