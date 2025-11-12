'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react'

interface CategoryDetail {
  name: string
  score: number
  strengths: string[]
  concerns: string[]
  advice: string
}

interface ResultsDetailedAnalysisProps {
  axisScores: Record<string, number>
  strengths: string[]
  frictions: string[]
}

export default function ResultsDetailedAnalysis({ 
  axisScores, 
  strengths, 
  frictions 
}: ResultsDetailedAnalysisProps) {
  
  // Générer des détails par catégorie basés sur les scores
  const generateCategoryDetails = (): CategoryDetail[] => {
    return Object.entries(axisScores).map(([axis, score]) => {
      const categoryStrengths = strengths.filter(() => Math.random() > 0.5).slice(0, 2)
      const categoryConcerns = frictions.filter(() => Math.random() > 0.5).slice(0, 1)
      
      let advice = ''
      if (score >= 80) {
        advice = `Excellente harmonie sur ${axis}. Continuez à entretenir cette dimension de votre relation.`
      } else if (score >= 60) {
        advice = `Bonne base sur ${axis}. Quelques ajustements pourraient améliorer davantage votre compatibilité.`
      } else {
        advice = `${axis} nécessite une attention particulière. Discutez ouvertement de vos attentes dans ce domaine.`
      }

      return {
        name: axis,
        score,
        strengths: categoryStrengths.length > 0 ? categoryStrengths : ['Alignement général observé'],
        concerns: categoryConcerns.length > 0 ? categoryConcerns : [],
        advice
      }
    })
  }

  const categories = generateCategoryDetails()

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300'
    if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-300'
    return 'bg-red-100 text-red-800 border-red-300'
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-indigo-700">
          <Lightbulb className="h-5 w-5" />
          Analyse Détaillée par Catégorie
        </CardTitle>
        <p className="text-sm text-gray-600 mt-1">
          Décryptage approfondi de chaque dimension de votre compatibilité
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {categories.map((category, index) => (
            <div 
              key={index} 
              className="p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200"
            >
              {/* En-tête de la catégorie */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {category.name}
                </h3>
                <Badge className={`${getScoreColor(category.score)} border px-3 py-1 text-sm font-bold`}>
                  {category.score}%
                </Badge>
              </div>

              {/* Points forts */}
              {category.strengths.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800 text-sm">Points forts identifiés</span>
                  </div>
                  <ul className="ml-6 space-y-1">
                    {category.strengths.map((strength, idx) => (
                      <li key={idx} className="text-sm text-gray-700 list-disc">
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Points d'attention */}
              {category.concerns.length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800 text-sm">Points d'attention</span>
                  </div>
                  <ul className="ml-6 space-y-1">
                    {category.concerns.map((concern, idx) => (
                      <li key={idx} className="text-sm text-gray-700 list-disc">
                        {concern}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Conseil personnalisé */}
              <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">💡 Conseil :</span> {category.advice}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
