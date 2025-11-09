import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

export function useAdmin() {
  const { user, loading: authLoading } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false)
        setLoading(false)
        return
      }

      try {
        // Vérifier via l'API si l'utilisateur est admin
        const response = await fetch('/api/admin/check')
        const data = await response.json()
        
        setIsAdmin(data.isAdmin || false)
      } catch (error) {
        console.error('Erreur vérification admin:', error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    if (!authLoading) {
      checkAdminStatus()
    }
  }, [user, authLoading])

  return {
    isAdmin,
    loading: authLoading || loading
  }
}
