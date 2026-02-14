import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

// Cache module-level partagé entre tous les composants
// Évite les fetches répétés à chaque render de la Navbar
let adminCache: { userId: string; isAdmin: boolean; expiresAt: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

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

      // Utiliser le cache si valide pour le même user
      if (adminCache && adminCache.userId === user.id && Date.now() < adminCache.expiresAt) {
        setIsAdmin(adminCache.isAdmin)
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/admin/check')
        const data = await response.json()
        const result = data.isAdmin || false

        // Mettre en cache
        adminCache = {
          userId: user.id,
          isAdmin: result,
          expiresAt: Date.now() + CACHE_TTL
        }

        setIsAdmin(result)
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
