'use client'

import { useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAchievements } from '@/hooks/useAchievements'

/**
 * Composant qui vérifie automatiquement les achievements en arrière-plan
 * À ajouter une seule fois dans le layout ou dashboard principal
 */
export function AchievementsChecker() {
  const { user } = useAuth()
  const { checkAchievements } = useAchievements()

  useEffect(() => {
    if (!user) return

    // Vérifier immédiatement
    checkAchievements()

    // Vérifier toutes les 5 minutes
    const interval = setInterval(() => {
      checkAchievements()
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [user, checkAchievements])

  // Ce composant ne rend rien
  return null
}
