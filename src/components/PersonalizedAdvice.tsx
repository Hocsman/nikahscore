'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Lightbulb, 
  Heart, 
  MessageSquare, 
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface PersonalizedAdviceProps {
  overallScore: number
  axisScores: Record<string, number>
  dealbreakerConflicts?: number
}

interface Advice {
  category: string
  icon: any
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

export function PersonalizedAdvice({ 
  overallScore, 
  axisScores, 
  dealbreakerConflicts = 0 
}: PersonalizedAdviceProps) {
  
  const getAdvices = (): Advice[] => {
    const advices: Advice[] = []

    // Analyse du score global
    if (overallScore >= 80) {
      advices.push({
        category: 'Compatibilité',
        icon: Heart,
        title: 'Excellente compatibilité détectée',
        description: 'Votre score indique une très bonne harmonie. Continuez à cultiver votre communication et à approfondir votre connaissance mutuelle.',
        priority: 'low'
      })
    } else if (overallScore >= 60) {
      advices.push({
        category: 'Compatibilité',
        icon: TrendingUp,
        title: 'Bonne base de compatibilité',
        description: 'Vous avez une base solide. Identifiez les axes à améliorer et travaillez ensemble sur ces points avant de vous engager.',
        priority: 'medium'
      })
    } else {
      advices.push({
        category: 'Compatibilité',
        icon: AlertCircle,
        title: 'Points d\'attention importants',
        description: 'Votre score suggère des différences significatives. Prenez le temps de discuter en profondeur de vos attentes avant toute décision.',
        priority: 'high'
      })
    }

    // Analyse des dealbreakers
    if (dealbreakerConflicts > 0) {
      advices.push({
        category: 'Dealbreakers',
        icon: AlertCircle,
        title: `${dealbreakerConflicts} incompatibilité${dealbreakerConflicts > 1 ? 's' : ''} majeure${dealbreakerConflicts > 1 ? 's' : ''}`,
        description: 'Des points non-négociables sont en désaccord. Il est crucial de les discuter ouvertement et de déterminer si un compromis est possible.',
        priority: 'high'
      })
    }

    // Analyse par axe
    Object.entries(axisScores).forEach(([axis, score]) => {
      if (score < 60) {
        let advice: Advice | null = null

        switch (axis) {
          case 'Intentions':
            advice = {
              category: axis,
              icon: Heart,
              title: 'Alignez vos intentions matrimoniales',
              description: 'Vos objectifs de mariage semblent différents. Clarifie z ce que vous attendez vraiment de cette union et assurez-vous d\'être sur la même longueur d\'onde.',
              priority: 'high'
            }
            break
          case 'Valeurs':
            advice = {
              category: axis,
              icon: BookOpen,
              title: 'Approfondissez vos valeurs spirituelles',
              description: 'Des différences dans vos valeurs religieuses ont été détectées. Discutez de votre pratique, de vos convictions et de l\'importance de la religion dans votre vie quotidienne.',
              priority: 'high'
            }
            break
          case 'Communication':
            advice = {
              category: axis,
              icon: MessageSquare,
              title: 'Améliorez votre communication',
              description: 'Votre style de communication présente des différences. Apprenez à écouter activement et à exprimer vos besoins de manière constructive.',
              priority: 'high'
            }
            break
          case 'Finance':
            advice = {
              category: axis,
              icon: TrendingUp,
              title: 'Harmonisez votre gestion financière',
              description: 'Vos approches de la gestion d\'argent divergent. Établissez ensemble un plan financier clair et discutez de vos priorités budgétaires.',
              priority: 'medium'
            }
            break
          case 'Enfants':
            advice = {
              category: axis,
              icon: Users,
              title: 'Clarifiez votre projet parental',
              description: 'Vos visions concernant les enfants ne sont pas totalement alignées. Discutez du nombre d\'enfants souhaité, du timing et de l\'approche éducative.',
              priority: 'high'
            }
            break
          case 'Rôles':
            advice = {
              category: axis,
              icon: Users,
              title: 'Définissez les rôles dans le couple',
              description: 'Vos attentes sur les rôles au sein du couple diffèrent. Échangez sur vos visions du partage des responsabilités et du travail.',
              priority: 'medium'
            }
            break
        }

        if (advice) advices.push(advice)
      }
    })

    // Conseils généraux
    advices.push({
      category: 'Général',
      icon: Lightbulb,
      title: 'Consultez un conseiller matrimonial',
      description: 'Quelle que soit votre compatibilité, il est toujours bénéfique de consulter un conseiller matrimonial islamique pour préparer votre union.',
      priority: 'low'
    })

    // Trier par priorité
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return advices.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
  }

  const advices = getAdvices()

  const getPriorityColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  const getPriorityLabel = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return 'Priorité haute'
      case 'medium': return 'Priorité moyenne'
      case 'low': return 'Recommandation'
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-600" />
          Conseils Personnalisés
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {advices.map((advice, index) => {
            const Icon = advice.icon
            return (
              <div
                key={index}
                className="p-4 rounded-lg border bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-purple-100 flex-shrink-0">
                    <Icon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {advice.title}
                      </h4>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getPriorityColor(advice.priority)}`}
                      >
                        {getPriorityLabel(advice.priority)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {advice.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Message de conclusion */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
          <p className="text-sm text-gray-700 text-center">
            <strong>💡 Rappel :</strong> Ce questionnaire est un outil d'aide à la réflexion. 
            La décision finale vous appartient après une istikhara et une consultation appropriée.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
