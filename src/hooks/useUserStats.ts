'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface DashboardStats {
  profileCompletion: number
  questionnairesCompleted: number
  couplesCreated: number
  averageCompatibilityScore: number | null
  lastActivity: string
  hasActiveCouples: boolean
}

export interface QuestionnaireHistory {
  id: string
  couple_code: string
  created_at: string
  status: 'pending' | 'both_completed' | 'expired'
  partner_email: string | null
  compatibility_score: number | null
  user_role: 'user_a' | 'user_b'
}

export function useUserStats() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [questionnaires, setQuestionnaires] = useState<QuestionnaireHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchUserStats = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Récupérer tous les questionnaires de l'utilisateur (couples)
      const { data: couplesData, error: couplesError } = await supabase
        .from('couples')
        .select('*')
        .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (couplesError) {
        console.error('Erreur récupération couples:', couplesError)
        throw couplesError
      }

      console.log('📊 Couples trouvés:', couplesData?.length || 0)

      // 2. Transformer les données pour l'historique
      const history: QuestionnaireHistory[] = (couplesData || []).map(couple => {
        const isCreator = couple.creator_id === user.id
        const partnerEmail = null // TODO: récupérer l'email du partenaire depuis auth.users

        return {
          id: couple.id,
          couple_code: couple.couple_code,
          created_at: couple.created_at,
          status: couple.status,
          partner_email: partnerEmail,
          compatibility_score: couple.compatibility_score,
          user_role: isCreator ? 'user_a' : 'user_b'
        }
      })

      setQuestionnaires(history)

      // 3. Calculer les statistiques
      const completedQuestionnaires = history.filter(q => q.status === 'both_completed')
      const questionnairesCompleted = completedQuestionnaires.length
      const couplesCreated = history.length

      // 4. Calculer le score moyen de compatibilité
      const scoresWithValues = completedQuestionnaires
        .map(q => q.compatibility_score)
        .filter((score): score is number => score !== null && score !== undefined)

      const averageCompatibilityScore = scoresWithValues.length > 0
        ? Math.round(scoresWithValues.reduce((sum, score) => sum + score, 0) / scoresWithValues.length)
        : null

      // 5. Calculer la complétude du profil
      const profileCompletion = calculateProfileCompletion({
        hasFirstName: !!user.firstName,
        hasLastName: !!user.lastName,
        hasEmail: !!user.email,
        emailVerified: true, // Supabase Auth vérifie l'email
        questionnairesCompleted,
        hasActiveCouples: history.some(q => q.status === 'both_completed'),
      })

      // 6. Déterminer la dernière activité
      const lastActivity = getLastActivity(history)

      // 7. Vérifier s'il y a des couples actifs
      const hasActiveCouples = history.some(q => q.status === 'both_completed')

      const calculatedStats: DashboardStats = {
        profileCompletion,
        questionnairesCompleted,
        couplesCreated,
        averageCompatibilityScore,
        lastActivity,
        hasActiveCouples
      }

      console.log('📊 Stats calculées:', calculatedStats)
      setStats(calculatedStats)

    } catch (err: any) {
      console.error('❌ Erreur fetchUserStats:', err)
      setError(err.message || 'Erreur lors du chargement des statistiques')
      
      // Stats par défaut en cas d'erreur
      setStats({
        profileCompletion: 40,
        questionnairesCompleted: 0,
        couplesCreated: 0,
        averageCompatibilityScore: null,
        lastActivity: 'Jamais',
        hasActiveCouples: false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserStats()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return {
    stats,
    questionnaires,
    loading,
    error,
    refetch: fetchUserStats
  }
}

/**
 * Calcule la complétude du profil utilisateur (0-100%)
 */
function calculateProfileCompletion(data: {
  hasFirstName: boolean
  hasLastName: boolean
  hasEmail: boolean
  emailVerified: boolean
  questionnairesCompleted: number
  hasActiveCouples: boolean
}): number {
  let score = 0

  // Email vérifié : 20 points (essentiel)
  if (data.hasEmail && data.emailVerified) score += 20

  // Prénom : 15 points (important)
  if (data.hasFirstName) score += 15

  // Nom : 5 points (optionnel mais recommandé)
  if (data.hasLastName) score += 5

  // Au moins 1 questionnaire complété : 40 points (objectif principal)
  if (data.questionnairesCompleted > 0) score += 40

  // Couple actif : 20 points (engagement)
  if (data.hasActiveCouples) score += 20

  return Math.min(score, 100)
}

/**
 * Détermine la dernière activité de l'utilisateur
 */
function getLastActivity(questionnaires: QuestionnaireHistory[]): string {
  if (questionnaires.length === 0) return 'Jamais'

  const latestQuestionnaire = questionnaires[0] // Déjà trié par created_at desc
  const lastDate = new Date(latestQuestionnaire.created_at)
  const now = new Date()
  const diffInMs = now.getTime() - lastDate.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInMinutes < 1) return 'À l\'instant'
  if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`
  if (diffInHours < 24) return `Il y a ${diffInHours}h`
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
  return `Il y a ${Math.floor(diffInDays / 30)} mois`
}
