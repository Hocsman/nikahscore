'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Trophy, Lock } from 'lucide-react'
import { useAchievements } from '@/hooks/useAchievements'
import { motion } from 'framer-motion'

export function AchievementsDisplay() {
  const { 
    achievements, 
    userAchievements,
    unlockedCount, 
    totalPoints, 
    loading,
    isUnlocked,
    getRarityColor,
    getRarityLabel
  } = useAchievements()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
        </CardContent>
      </Card>
    )
  }

  const completionPercentage = achievements.length > 0 
    ? Math.round((unlockedCount / achievements.length) * 100)
    : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            Badges & Achievements
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-normal text-gray-600">
              {unlockedCount}/{achievements.length} débloqués
            </span>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
              {totalPoints} points
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Barre de progression globale */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progression globale
            </span>
            <span className="text-sm text-gray-600">
              {completionPercentage}%
            </span>
          </div>
          <Progress value={completionPercentage} className="h-3" />
        </div>

        {/* Grille des achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const unlocked = isUnlocked(achievement.code)
            const userAchievement = userAchievements.find(ua => {
              const ach = ua.achievement as any
              return ach?.code === achievement.code
            })

            return (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  unlocked
                    ? 'bg-gradient-to-br from-white to-purple-50 border-purple-300 shadow-md'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Icône */}
                  <div className={`text-4xl flex-shrink-0 ${
                    unlocked ? 'grayscale-0' : 'grayscale opacity-50'
                  }`}>
                    {unlocked ? achievement.icon : <Lock className="w-8 h-8 text-gray-400" />}
                  </div>

                  {/* Contenu */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className={`font-semibold text-sm ${
                        unlocked ? 'text-gray-900' : 'text-gray-500'
                      }`}>
                        {unlocked ? achievement.title : '???'}
                      </h4>
                      <Badge 
                        variant="outline"
                        className={`text-xs ${getRarityColor(achievement.rarity)}`}
                      >
                        {getRarityLabel(achievement.rarity)}
                      </Badge>
                    </div>
                    
                    <p className={`text-xs mb-2 line-clamp-2 ${
                      unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {unlocked ? achievement.description : 'Badge verrouillé. Continuez à utiliser l\'application pour le débloquer.'}
                    </p>

                    {/* Points */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-purple-600 font-medium">
                        +{achievement.points} pts
                      </span>
                      {unlocked && userAchievement && (
                        <span className="text-xs text-gray-500">
                          Obtenu le {new Date(userAchievement.unlocked_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      )}
                    </div>

                    {/* Barre de progression si non débloqué */}
                    {!unlocked && userAchievement && userAchievement.progress > 0 && (
                      <div className="mt-2">
                        <Progress value={userAchievement.progress} className="h-1.5" />
                        <span className="text-xs text-gray-500 mt-1">
                          {userAchievement.progress}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Message d'encouragement */}
        {unlockedCount === 0 && (
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg text-center">
            <p className="text-sm text-gray-700">
              🎯 <strong>Débloquezvotre premier badge !</strong><br/>
              Complétez un questionnaire pour commencer votre collection.
            </p>
          </div>
        )}

        {unlockedCount === achievements.length && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-lg text-center border-2 border-yellow-300"
          >
            <div className="text-5xl mb-2">🏆</div>
            <h3 className="font-bold text-lg text-gray-900 mb-1">
              Félicitations, Maître NikahScore !
            </h3>
            <p className="text-sm text-gray-700">
              Vous avez débloqué tous les badges ! Vous êtes un véritable expert.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
