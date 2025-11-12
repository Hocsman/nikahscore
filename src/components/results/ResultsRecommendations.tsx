'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MessageSquare, Book, Video, Calendar } from 'lucide-react'

interface ResultsRecommendationsProps {
  overallScore: number
  recommendations: string[]
  axisScores: Record<string, number>
}

export default function ResultsRecommendations({ 
  overallScore, 
  recommendations,
  axisScores 
}: ResultsRecommendationsProps) {
  
  // Trouver les catégories faibles (< 70%)
  const weakCategories = Object.entries(axisScores)
    .filter(([, score]) => score < 70)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)

  // Générer des sujets de discussion basés sur les catégories faibles
  const discussionTopics = weakCategories.map(([axis]) => {
    const topics: Record<string, string[]> = {
      'Intentions': ['Vos objectifs de mariage à court et long terme', 'Vos attentes mutuelles dans cette union'],
      'Valeurs': ['Vos priorités spirituelles et religieuses', 'La place de la foi dans votre quotidien'],
      'Rôles': ['La répartition des responsabilités au foyer', 'L\'équilibre entre vie professionnelle et familiale'],
      'Enfants': ['Le nombre d\'enfants souhaité', 'Les méthodes d\'éducation et valeurs à transmettre'],
      'Finance': ['La gestion du budget familial', 'Vos objectifs financiers communs'],
      'Style': ['Vos habitudes de vie et routines quotidiennes', 'Vos attentes concernant le mode de vie'],
      'Communication': ['Vos modes de résolution de conflits', 'L\'expression des émotions et besoins'],
      'Personnalité': ['Vos tempéraments et comment les harmoniser', 'Vos activités et loisirs préférés'],
      'Logistique': ['Le lieu de résidence souhaité', 'Les relations avec les familles respectives']
    }
    return topics[axis] || ['Vos attentes et préoccupations sur ce sujet']
  }).flat()

  // Ressources recommandées
  const resources = [
    {
      icon: Book,
      title: 'Guide du Mariage Islamique',
      description: 'Un e-book complet sur les fondements du mariage en Islam',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: Video,
      title: 'Webinaires de Préparation',
      description: 'Sessions vidéo animées par des conseillers matrimoniaux',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: Calendar,
      title: 'Consultation Personnalisée',
      description: 'Réservez un entretien avec un expert du couple',
      color: 'text-green-600 bg-green-50'
    }
  ]

  return (
    <div className="space-y-6">
      
      {/* Sujets à discuter */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-indigo-700">
            <MessageSquare className="h-5 w-5" />
            Sujets Importants à Aborder Ensemble
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Basé sur votre analyse, voici les discussions prioritaires avant le mariage
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {discussionTopics.length > 0 ? (
              discussionTopics.map((topic, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-gray-800">{topic}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <p className="text-green-800">
                  🎉 Excellent ! Vous avez une bonne harmonie sur toutes les dimensions. 
                  Continuez à communiquer ouvertement pour maintenir cette compatibilité.
                </p>
              </div>
            )}
          </div>

          {/* Recommandations générales */}
          <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r">
            <h4 className="font-semibold text-yellow-900 mb-2">💡 Conseil du Coach</h4>
            <p className="text-sm text-yellow-800">
              {overallScore >= 80 ? (
                'Votre compatibilité est excellente, mais n\'oubliez pas que le mariage nécessite un engagement continu. Continuez à investir dans votre relation.'
              ) : overallScore >= 60 ? (
                'Prenez le temps de bien discuter des points d\'attention identifiés. Une bonne préparation est la clé d\'un mariage réussi.'
              ) : (
                'Nous vous recommandons vivement de consulter un conseiller matrimonial avant de vous engager. Les différences importantes nécessitent une attention particulière.'
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Prochaines étapes recommandées */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-700">
            <Calendar className="h-5 w-5" />
            Vos Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <div 
                key={index}
                className="flex items-start gap-3 p-3 bg-teal-50 rounded-lg"
              >
                <Badge className="bg-teal-600 text-white flex-shrink-0">
                  {index + 1}
                </Badge>
                <p className="text-gray-800 text-sm">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Ressources recommandées */}
      <Card className="shadow-lg bg-gradient-to-br from-purple-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Book className="h-5 w-5" />
            Ressources pour Vous Accompagner
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Des outils pour approfondir votre préparation au mariage
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((resource, index) => {
              const Icon = resource.icon
              return (
                <div 
                  key={index}
                  className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className={`w-12 h-12 rounded-lg ${resource.color} flex items-center justify-center mb-3`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{resource.title}</h4>
                  <p className="text-xs text-gray-600">{resource.description}</p>
                </div>
              )
            })}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              <span className="font-medium">🔒 Fonctionnalité Premium :</span> Accès complet aux ressources et consultations
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
