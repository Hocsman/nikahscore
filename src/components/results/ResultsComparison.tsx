'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, Users, Award } from 'lucide-react'

interface ResultsComparisonProps {
  overallScore: number
  axisScores: Record<string, number>
}

export default function ResultsComparison({ overallScore, axisScores }: ResultsComparisonProps) {
  
  // Simuler des données de benchmark (dans une vraie app, ces données viendraient de la DB)
  const getBenchmarkData = () => {
    // Nombre de couples avec un score similaire (±5%)
    const similarScoreCouples = Math.floor(Math.random() * 300) + 100
    
    // Taux de réussite pour ce range de score
    const successRate = Math.min(95, Math.max(40, overallScore - 10 + Math.random() * 20))
    
    // Rang percentile
    const percentile = Math.min(99, Math.max(1, overallScore - 20 + Math.random() * 40))
    
    return {
      similarScoreCouples,
      successRate: Math.round(successRate),
      percentile: Math.round(percentile)
    }
  }

  const benchmark = getBenchmarkData()

  // Top 3 catégories
  const topCategories = Object.entries(axisScores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)

  // Bottom 3 catégories
  const bottomCategories = Object.entries(axisScores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Benchmarks statistiques */}
      <Card className="shadow-lg border-2 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <TrendingUp className="h-5 w-5" />
            Comparaison avec la Communauté
          </CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Votre score comparé aux autres couples NikahScore
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Couples similaires */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-700">
                {benchmark.similarScoreCouples}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                couples avec un score similaire
              </p>
            </div>

            {/* Taux de réussite */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">
                {benchmark.successRate}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                de réussite pour ce score
              </p>
            </div>

            {/* Percentile */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-700">
                Top {100 - benchmark.percentile}%
              </div>
              <p className="text-sm text-gray-600 mt-1">
                des couples inscrits
              </p>
            </div>
          </div>

          {/* Message contextuel */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
            <p className="text-sm text-gray-700">
              {overallScore >= 80 ? (
                <>
                  🎉 <strong>Excellent résultat !</strong> Vous faites partie des couples les plus compatibles de notre plateforme. 
                  Votre harmonie sur plusieurs dimensions est un très bon indicateur pour un mariage épanoui.
                </>
              ) : overallScore >= 60 ? (
                <>
                  👍 <strong>Bonne compatibilité !</strong> Votre score est au-dessus de la moyenne. 
                  En travaillant sur les quelques points d'attention, vous pouvez encore améliorer votre relation.
                </>
              ) : (
                <>
                  🤔 <strong>Points à travailler.</strong> Votre score indique quelques différences importantes. 
                  Nous vous recommandons de bien discuter de ces sujets avant de vous engager.
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top & Bottom catégories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Vos meilleures dimensions */}
        <Card className="shadow-lg border-l-4 border-green-500">
          <CardHeader>
            <CardTitle className="text-green-700 text-lg">
              🏆 Vos Meilleures Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCategories.map(([axis, score], index) => (
                <div key={axis}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {index + 1}. {axis}
                    </span>
                    <span className="font-bold text-green-600">
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 italic">
              Ces dimensions sont vos atouts majeurs. Continuez à les cultiver !
            </p>
          </CardContent>
        </Card>

        {/* Dimensions à améliorer */}
        <Card className="shadow-lg border-l-4 border-orange-500">
          <CardHeader>
            <CardTitle className="text-orange-700 text-lg">
              📈 Dimensions à Améliorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bottomCategories.map(([axis, score], index) => (
                <div key={axis}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">
                      {index + 1}. {axis}
                    </span>
                    <span className="font-bold text-orange-600">
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600 mt-4 italic">
              Concentrez vos efforts de dialogue sur ces sujets pour progresser.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
