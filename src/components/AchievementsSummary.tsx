'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Trophy, ChevronRight } from 'lucide-react'
import { useAchievements } from '@/hooks/useAchievements'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function AchievementsSummary() {
  const { 
    achievements,
    unlockedCount, 
    totalPoints, 
    loading,
    userAchievements
  } = useAchievements()

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Derniers achievements débloqués (3 plus récents)
  const recentAchievements = [...userAchievements]
    .sort((a, b) => new Date(b.unlocked_at).getTime() - new Date(a.unlocked_at).getTime())
    .slice(0, 3)

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Trophy className="w-5 h-5 text-yellow-600" />
            </div>
            <span>Achievements</span>
          </div>
          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            {totalPoints} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {unlockedCount}/{achievements.length}
              </div>
              <div className="text-xs text-gray-600">
                Badges débloqués
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-orange-600">
                {achievements.length > 0 
                  ? Math.round((unlockedCount / achievements.length) * 100)
                  : 0}%
              </div>
              <div className="text-xs text-gray-600">
                Complétion
              </div>
            </div>
          </div>

          {/* Derniers achievements débloqués */}
          {recentAchievements.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                Récemment débloqués
              </h4>
              <div className="space-y-2">
                {recentAchievements.map((ua) => {
                  const achievement = ua.achievement as any
                  if (!achievement) return null

                  return (
                    <div
                      key={ua.id}
                      className="flex items-center gap-2 p-2 bg-white border border-purple-200 rounded-lg"
                    >
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          +{achievement.points} pts
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Message si aucun achievement */}
          {unlockedCount === 0 && (
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Complétez votre premier questionnaire pour débloquer des badges ! 🎯
              </p>
            </div>
          )}

          {/* Bouton voir tout */}
          <Button
            asChild
            variant="outline"
            className="w-full group hover:bg-purple-50 hover:border-purple-300"
          >
            <Link href="/profile#achievements" className="flex items-center justify-center gap-2">
              Voir tous les badges
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
