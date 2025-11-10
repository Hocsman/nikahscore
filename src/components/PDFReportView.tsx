'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  CheckCircle, 
  AlertTriangle, 
  Star,
  Heart
} from 'lucide-react'

interface DimensionData {
  dimension: string
  score: number
  weight: number
  questions_count: number
  strengths: string[]
  concerns: string[]
}

interface QuestionMatches {
  perfect_matches: number
  good_matches: number
  minor_differences: number
  major_differences: number
}

interface DetailedAnalysis {
  strengths: string[]
  areas_to_discuss: string[]
  recommendations: string[]
}

interface CompatibilityResult {
  pairId: string
  user1_name: string
  user2_name: string
  overall_score: number
  compatibility_level: 'Excellente' | 'Bonne' | 'Modérée' | 'Faible'
  dimension_breakdown: DimensionData[]
  dealbreaker_conflicts: number
  question_matches: QuestionMatches
  detailed_analysis: DetailedAnalysis
  generated_at: string
  algorithm_info: {
    version: string
    total_questions: number
    dimensions: number
    description: string
  }
}

interface PDFReportViewProps {
  results: CompatibilityResult
}

export function PDFReportView({ results }: PDFReportViewProps) {
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  return (
    <div 
      id="pdf-report-content" 
      className="bg-white p-8 max-w-[1200px] mx-auto"
      style={{ fontFamily: 'Arial, sans-serif' }}
    >
      {/* En-tête avec branding */}
      <div className="text-center mb-8 pb-6 border-b-4 border-pink-500">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Heart className="h-12 w-12 text-pink-600" />
          <h1 className="text-4xl font-bold text-gray-900">NikahScore</h1>
        </div>
        <p className="text-xl text-gray-600 mb-2">Rapport de Compatibilité Matrimoniale</p>
        <p className="text-sm text-gray-500">
          Généré le {new Date(results.generated_at).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </p>
      </div>

      {/* Noms du couple */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          {results.user1_name} & {results.user2_name}
        </h2>
        <Badge className="text-lg px-6 py-2 bg-pink-600">
          Compatibilité {results.compatibility_level}
        </Badge>
      </div>

      {/* Score Global */}
      <div className="mb-8 p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl border-2 border-pink-200">
        <h3 className="text-xl font-semibold text-center mb-4">Score Global de Compatibilité</h3>
        <div className={`text-6xl font-bold text-center mb-4 ${getScoreColor(results.overall_score)}`}>
          {results.overall_score}%
        </div>
        <Progress value={results.overall_score} className="h-4 mb-4" />
        
        {results.dealbreaker_conflicts > 0 && (
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mt-4">
            <div className="flex items-center justify-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              <span className="font-semibold">
                {results.dealbreaker_conflicts} point(s) d'incompatibilité majeure détecté(s)
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Statistiques des réponses */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Répartition des Réponses</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {results.question_matches.perfect_matches}
            </div>
            <div className="text-sm text-gray-700">Parfaitement alignés</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {results.question_matches.good_matches}
            </div>
            <div className="text-sm text-gray-700">Très compatibles</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-3xl font-bold text-orange-600 mb-1">
              {results.question_matches.minor_differences}
            </div>
            <div className="text-sm text-gray-700">Différences mineures</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="text-3xl font-bold text-red-600 mb-1">
              {results.question_matches.major_differences}
            </div>
            <div className="text-sm text-gray-700">Différences importantes</div>
          </div>
        </div>
      </div>

      {/* Analyse par dimensions */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-semibold mb-4">Analyse Détaillée par Dimensions</h3>
        <div className="space-y-4">
          {results.dimension_breakdown.map((dimension) => (
            <div key={dimension.dimension} className="border-2 border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-lg">{dimension.dimension}</h4>
                  <Badge variant="outline" className="text-xs">
                    {dimension.questions_count} questions
                  </Badge>
                </div>
                <div className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                  {dimension.score}%
                </div>
              </div>
              
              <Progress value={dimension.score} className="mb-3 h-2" />
              
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                {dimension.strengths.length > 0 && (
                  <div className="bg-green-50 p-3 rounded">
                    <h5 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Points forts
                    </h5>
                    <ul className="space-y-1">
                      {dimension.strengths.map((strength, i) => (
                        <li key={i} className="text-green-700">• {strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {dimension.concerns.length > 0 && (
                  <div className="bg-orange-50 p-3 rounded">
                    <h5 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                      <AlertTriangle className="h-4 w-4" />
                      Points d'attention
                    </h5>
                    <ul className="space-y-1">
                      {dimension.concerns.map((concern, i) => (
                        <li key={i} className="text-orange-700">• {concern}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyse détaillée - Forces */}
      <div className="mb-8 page-break-before">
        <h3 className="text-xl font-semibold mb-4">Vos Forces</h3>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
          <ul className="space-y-3">
            {results.detailed_analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-3 text-green-800">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Points à discuter */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Points à Discuter Ensemble</h3>
        <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-6">
          <ul className="space-y-3">
            {results.detailed_analysis.areas_to_discuss.map((area, index) => (
              <li key={index} className="flex items-start gap-3 text-orange-800">
                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recommandations */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Recommandations</h3>
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
          <ul className="space-y-3">
            {results.detailed_analysis.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-3 text-blue-800">
                <Star className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
        <p className="mb-2">
          Rapport généré par <strong>NikahScore</strong> - {results.algorithm_info.description}
        </p>
        <p className="mb-2">
          Analyse basée sur {results.algorithm_info.total_questions} questions réparties en {results.algorithm_info.dimensions} dimensions
        </p>
        <p className="italic">
          Ce rapport est un outil d'aide à la décision. Il doit être complété par des discussions 
          approfondies et l'Istikhara.
        </p>
        <p className="mt-4 text-xs text-gray-500">
          © 2025 NikahScore - Tous droits réservés
        </p>
      </div>
    </div>
  )
}
