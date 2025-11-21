'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface Achievement {
  id: string
  code: string
  title: string
  description: string
  icon: string
  category: string
  requirement_type: string
  requirement_value: number | null
  points: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export interface UserAchievement {
  id: string
  user_id: string
  achievement_id: string
  unlocked_at: string
  progress: number
  notified: boolean
  achievement?: Achievement
}

export function useAchievements() {
  const { user } = useAuth()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [unlockedCount, setUnlockedCount] = useState(0)
  const [totalPoints, setTotalPoints] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    loadAchievements()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const loadAchievements = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()

      // Charger tous les achievements disponibles
      const { data: allAchievements, error: achievementsError } = await supabase
        .from('achievements')
        .select('*')
        .order('points', { ascending: true })

      if (achievementsError) throw achievementsError

      // Charger les achievements de l'utilisateur
      const { data: userAchievementsData, error: userError } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(*)
        `)
        .eq('user_id', user.id)

      if (userError) throw userError

      setAchievements(allAchievements || [])
      setUserAchievements(userAchievementsData || [])
      setUnlockedCount(userAchievementsData?.length || 0)
      
      // Calculer les points totaux
      const points = userAchievementsData?.reduce((sum, ua) => {
        const achievement = ua.achievement as Achievement
        return sum + (achievement?.points || 0)
      }, 0) || 0
      setTotalPoints(points)

      setError(null)
    } catch (err: any) {
      console.error('Erreur chargement achievements:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const isUnlocked = (achievementCode: string): boolean => {
    return userAchievements.some(ua => {
      const achievement = ua.achievement as Achievement
      return achievement?.code === achievementCode
    })
  }

  const getProgress = (achievementCode: string): number => {
    const userAchievement = userAchievements.find(ua => {
      const achievement = ua.achievement as Achievement
      return achievement?.code === achievementCode
    })
    return userAchievement?.progress || 0
  }

  const unlockAchievement = async (achievementCode: string) => {
    if (!user?.id) return

    try {
      const supabase = createClient()

      // Trouver l'achievement
      const achievement = achievements.find(a => a.code === achievementCode)
      if (!achievement) {
        console.warn('Achievement not found:', achievementCode)
        return
      }

      // Vérifier si déjà débloqué
      if (isUnlocked(achievementCode)) {
        return
      }

      // Créer l'entrée user_achievement
      const { error: insertError } = await supabase
        .from('user_achievements')
        .insert({
          user_id: user.id,
          achievement_id: achievement.id,
          progress: 100,
          notified: false
        })

      if (insertError) {
        // Ignorer si déjà existe (race condition)
        if (insertError.code !== '23505') {
          throw insertError
        }
        return
      }

      // Créer une notification
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'achievement',
        title: `🏆 Badge débloqué : ${achievement.title}`,
        message: `Félicitations ! Vous avez obtenu "${achievement.title}". +${achievement.points} points.`,
        read: false,
        data: { achievement_code: achievementCode }
      })

      // Recharger
      await loadAchievements()

      return achievement
    } catch (err: any) {
      console.error('Erreur unlock achievement:', err)
    }
  }

  const updateProgress = async (achievementCode: string, progress: number) => {
    if (!user?.id) return

    try {
      const supabase = createClient()

      const achievement = achievements.find(a => a.code === achievementCode)
      if (!achievement) return

      // Vérifier si déjà débloqué
      if (isUnlocked(achievementCode)) return

      // Upsert progress
      const { error } = await supabase
        .from('user_achievements')
        .upsert({
          user_id: user.id,
          achievement_id: achievement.id,
          progress: Math.min(100, progress)
        }, {
          onConflict: 'user_id,achievement_id'
        })

      if (error) throw error

      // Si 100%, unlock
      if (progress >= 100) {
        await unlockAchievement(achievementCode)
      }
    } catch (err: any) {
      console.error('Erreur update progress:', err)
    }
  }

  const checkAchievements = async () => {
    if (!user?.id) return

    try {
      const supabase = createClient()

      // Compter les questionnaires complétés
      const { count: questionnaireCount } = await supabase
        .from('couples')
        .select('*', { count: 'exact', head: true })
        .or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`)
        .eq('status', 'completed')

      // Vérifier first_questionnaire
      if (questionnaireCount && questionnaireCount >= 1 && !isUnlocked('first_questionnaire')) {
        await unlockAchievement('first_questionnaire')
      }

      // Vérifier five_questionnaires
      if (questionnaireCount && questionnaireCount >= 5 && !isUnlocked('five_questionnaires')) {
        await unlockAchievement('five_questionnaires')
      }

      // Vérifier ten_questionnaires
      if (questionnaireCount && questionnaireCount >= 10 && !isUnlocked('ten_questionnaires')) {
        await unlockAchievement('ten_questionnaires')
      }

      // Vérifier les scores - Faire deux requêtes séparées pour éviter les problèmes de RLS
      const [creatorCouples, partnerCouples] = await Promise.all([
        supabase
          .from('couples')
          .select('compatibility_score, status')
          .eq('creator_id', user.id),
        supabase
          .from('couples')
          .select('compatibility_score, status')
          .eq('partner_id', user.id)
      ])

      // Combiner et filtrer les résultats
      const allCouples = [
        ...(creatorCouples.data || []),
        ...(partnerCouples.data || [])
      ]

      const couples = allCouples.filter(c =>
        c.status === 'completed' &&
        c.compatibility_score !== null &&
        c.compatibility_score !== undefined
      )

      if (couples.length > 0) {
        const maxScore = Math.max(...couples.map(c => c.compatibility_score || 0))
        
        if (maxScore >= 90 && !isUnlocked('perfect_match')) {
          await unlockAchievement('perfect_match')
        } else if (maxScore >= 80 && !isUnlocked('good_match')) {
          await unlockAchievement('good_match')
        }
      }

      // Vérifier profil complet (basé sur le hook useUserStats)
      // On peut vérifier first_name, last_name, email_verified, etc.
      
    } catch (err: any) {
      console.error('Erreur check achievements:', err)
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 bg-gray-100'
      case 'rare': return 'text-blue-600 bg-blue-100'
      case 'epic': return 'text-purple-600 bg-purple-100'
      case 'legendary': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Commun'
      case 'rare': return 'Rare'
      case 'epic': return 'Épique'
      case 'legendary': return 'Légendaire'
      default: return 'Commun'
    }
  }

  return {
    achievements,
    userAchievements,
    unlockedCount,
    totalPoints,
    loading,
    error,
    isUnlocked,
    getProgress,
    unlockAchievement,
    updateProgress,
    checkAchievements,
    getRarityColor,
    getRarityLabel,
    refresh: loadAchievements
  }
}
