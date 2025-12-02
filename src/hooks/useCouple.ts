'use client'

import { useState, useEffect } from 'react'
import { useAuth } from './useAuth'

interface CoupleData {
  id: string
  couple_code: string
  creator_id: string
  partner_id: string | null
  status: string
  created_at: string
  partner_joined_at: string | null
  completed_at: string | null
  user_role: 'creator' | 'partner' | 'guest'
  creator?: { name: string; email: string }
  partner?: { name: string; email: string }
}

interface CoupleResponse {
  id: string
  couple_code: string
  user_id: string
  responses: any
  role: 'creator' | 'partner'
  submitted_at: string
  user?: { name: string; email: string }
}

export function useCouple() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Créer un nouveau questionnaire couple
  const createCouple = async (): Promise<{ success: boolean; couple_code?: string; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/couple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, couple_code: data.couple_code }
      } else {
        setError(data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la création du questionnaire couple'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Récupérer les détails d'un questionnaire couple
  const getCouple = async (couple_code: string): Promise<{ success: boolean; couple?: CoupleData; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/couple?code=${couple_code}&user_id=${user?.id || ''}`)
      const data = await response.json()

      if (data.success) {
        return { success: true, couple: data.couple }
      } else {
        setError(data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la récupération du questionnaire couple'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Rejoindre un questionnaire couple
  const joinCouple = async (couple_code: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/couple/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couple_code, partner_id: user.id })
      })

      const data = await response.json()

      if (data.success) {
        return { success: true }
      } else {
        setError(data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la jonction au questionnaire couple'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Soumettre les réponses d'un questionnaire couple
  const submitCoupleResponses = async (
    couple_code: string,
    responses: any
  ): Promise<{ success: boolean; both_completed?: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Vous devez être connecté' }
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/couple/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ couple_code, user_id: user.id, responses })
      })

      const data = await response.json()

      if (data.success) {
        return { success: true, both_completed: data.both_completed }
      } else {
        setError(data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la sauvegarde des réponses'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Récupérer toutes les réponses d'un couple
  const getCoupleResponses = async (couple_code: string): Promise<{ success: boolean; responses?: CoupleResponse[]; error?: string }> => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/couple/responses?code=${couple_code}`)
      const data = await response.json()

      if (data.success) {
        return { success: true, responses: data.responses }
      } else {
        setError(data.error)
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Erreur lors de la récupération des réponses'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Générer une URL de partage
  const getShareUrl = (couple_code: string): string => {
    return `${window.location.origin}/questionnaire/shared/${couple_code}`
  }

  // Calculer le score de compatibilité (algorithme simple)
  const calculateCompatibility = (responses1: any, responses2: any): number => {
    if (!responses1 || !responses2) return 0

    let totalQuestions = 0
    let matches = 0

    // Parcourir toutes les questions et comparer les réponses
    for (const questionId in responses1) {
      if (responses2[questionId] !== undefined) {
        totalQuestions++

        const answer1 = responses1[questionId]
        const answer2 = responses2[questionId]

        // Logique de comparaison selon le type de réponse
        if (typeof answer1 === 'string' && typeof answer2 === 'string') {
          if (answer1.toLowerCase() === answer2.toLowerCase()) {
            matches++
          }
        } else if (Array.isArray(answer1) && Array.isArray(answer2)) {
          // Pour les réponses multiples, calculer le pourcentage de correspondance
          const commonItems = answer1.filter(item => answer2.includes(item))
          const totalItems = [...new Set([...answer1, ...answer2])].length
          if (totalItems > 0) {
            matches += commonItems.length / totalItems
          }
        } else if (answer1 === answer2) {
          matches++
        }
      }
    }

    return totalQuestions > 0 ? Math.round((matches / totalQuestions) * 100) : 0
  }

  // Récupérer le couple_code de l'utilisateur courant
  const getUserCoupleCode = async (): Promise<{ couple_code: string | null; error?: string }> => {
    if (!user) {
      return { couple_code: null, error: 'Utilisateur non connecté' }
    }

    try {
      const response = await fetch(`/api/couple/check?user_id=${user.id}`)
      const data = await response.json()

      if (data.success && data.hasCouple) {
        return { couple_code: data.couple_code }
      } else {
        return { couple_code: null, error: 'Aucun couple trouvé' }
      }
    } catch (err) {
      return {
        couple_code: null,
        error: err instanceof Error ? err.message : 'Erreur inconnue'
      }
    }
  }

  return {
    loading,
    error,
    createCouple,
    getCouple,
    joinCouple,
    submitCoupleResponses,
    getCoupleResponses,
    getShareUrl,
    calculateCompatibility,
    getUserCoupleCode,
    clearError: () => setError(null)
  }
}
