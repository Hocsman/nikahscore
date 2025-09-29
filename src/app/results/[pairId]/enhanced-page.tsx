'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  Heart, 
  Star, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  Share2,
  TrendingUp,
  Users,
  MessageCircle,
  Home,
  Target,
  Briefcase,
  Sparkles
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

export default function EnhancedResultsPage({ 
  params 
}: { 
  params: { pairId: string } 
}) {
  const router = useRouter()
  const [results, setResults] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateReport()
  }, [params.pairId])

  const generateReport = async () => {
    setLoading(true)
    setError(null)
    
    try {
      console.log('🔄 Génération du rapport pour:', params.pairId)
      
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pairId: params.pairId })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du rapport')
      }

      const data = await response.json()
      setResults(data)
      console.log('✅ Rapport généré:', data)
      
    } catch (err) {
      console.error('❌ Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-orange-600'
    return 'text-red-600'
  }

  const getCompatibilityIcon = (level: string) => {
    switch (level) {
      case 'Excellente': return <Star className="h-6 w-6 text-yellow-500" />
      case 'Bonne': return <CheckCircle className="h-6 w-6 text-green-500" />
      case 'Modérée': return <AlertTriangle className="h-6 w-6 text-orange-500" />
      default: return <AlertTriangle className="h-6 w-6 text-red-500" />
    }
  }

  const getDimensionIcon = (dimension: string) => {
    const icons: { [key: string]: any } = {
      'Spiritualité': <Star className="h-5 w-5" />,
      'Personnalité': <Users className="h-5 w-5" />,
      'Communication': <MessageCircle className="h-5 w-5" />,
      'Famille': <Home className="h-5 w-5" />,
      'Style de vie': <Target className="h-5 w-5" />,
      'Ambitions': <Briefcase className="h-5 w-5" />
    }
    return icons[dimension] || <Sparkles className="h-5 w-5" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-700">Génération de votre rapport</h3>
          <p className="text-gray-600">Analyse de vos 100 réponses en cours...</p>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Erreur</h3>
            <p className="text-gray-600 mb-4">{error || 'Impossible de générer le rapport'}</p>
            <Button onClick={generateReport} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto p-4 py-8">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Button 
              onClick={() => router.back()} 
              variant="outline" 
              className="mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Rapport de Compatibilité
              </h1>
              <p className="text-gray-600">
                {results.user1_name} & {results.user2_name}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Télécharger PDF
            </Button>
          </div>
        </div>

        {/* Score Global */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                {getCompatibilityIcon(results.compatibility_level)}
                Score de Compatibilité Global
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className={`text-7xl font-bold mb-4 ${getScoreColor(results.overall_score)}`}>
                {results.overall_score}%
              </div>
              <Progress 
                value={results.overall_score} 
                className="w-full max-w-md mx-auto mb-6 h-3"
              />
              <Badge 
                variant={results.overall_score >= 80 ? "default" : "secondary"}
                className="text-xl px-6 py-3 mb-4"
              >
                Compatibilité {results.compatibility_level}
              </Badge>
              
              {results.dealbreaker_conflicts > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-semibold">
                      {results.dealbreaker_conflicts} point(s) d'incompatibilité majeure
                    </span>
                  </div>
                </div>
              )}
              
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
                Analyse basée sur {results.algorithm_info.total_questions} questions 
                réparties en {results.algorithm_info.dimensions} dimensions clés 
                du mariage islamique.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistiques des Réponses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Analyse des Réponses
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    {results.question_matches.perfect_matches}
                  </div>
                  <div className="text-sm text-gray-600">Parfaitement alignés</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    {results.question_matches.good_matches}
                  </div>
                  <div className="text-sm text-gray-600">Très compatibles</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    {results.question_matches.minor_differences}
                  </div>
                  <div className="text-sm text-gray-600">Différences mineures</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-1">
                    {results.question_matches.major_differences}
                  </div>
                  <div className="text-sm text-gray-600">Différences importantes</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyse par Dimensions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Analyse par Dimensions</CardTitle>
              <p className="text-gray-600">
                Détail de votre compatibilité sur chaque dimension évaluée
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.dimension_breakdown.map((dimension, index) => (
                  <motion.div
                    key={dimension.dimension}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {getDimensionIcon(dimension.dimension)}
                        <h3 className="font-semibold text-lg">{dimension.dimension}</h3>
                        <Badge variant="outline">
                          {dimension.questions_count} questions
                        </Badge>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(dimension.score)}`}>
                        {dimension.score}%
                      </div>
                    </div>
                    
                    <Progress value={dimension.score} className="mb-3" />
                    
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {dimension.strengths.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                            <CheckCircle className="h-4 w-4" />
                            Points forts
                          </h4>
                          <ul className="space-y-1">
                            {dimension.strengths.map((strength, i) => (
                              <li key={i} className="text-green-600">• {strength}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {dimension.concerns.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-1">
                            <AlertTriangle className="h-4 w-4" />
                            Points d'attention
                          </h4>
                          <ul className="space-y-1">
                            {dimension.concerns.map((concern, i) => (
                              <li key={i} className="text-orange-600">• {concern}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analyse Détaillée */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            
            {/* Forces */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  Vos Forces
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.detailed_analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-green-600 flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Points à Discuter */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-orange-700">
                  <MessageCircle className="h-5 w-5" />
                  À Discuter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.detailed_analysis.areas_to_discuss.map((area, index) => (
                    <li key={index} className="text-orange-600 flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recommandations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <Star className="h-5 w-5" />
                  Recommandations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.detailed_analysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-blue-600 flex items-start gap-2">
                      <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Footer */}
        <Card className="bg-gray-50">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Rapport généré le {new Date(results.generated_at).toLocaleDateString('fr-FR')} 
              par {results.algorithm_info.description}
            </p>
            <p className="text-xs text-gray-500">
              Ce rapport est un outil d'aide à la décision. Il doit être complété par des discussions 
              approfondies et l'Istikhara.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}