'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Heart, Users, TrendingUp, AlertTriangle, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import FeatureGate from '@/components/premium/FeatureGate'
import ResultsDetailedAnalysis from '@/components/results/ResultsDetailedAnalysis'
import ResultsComparison from '@/components/results/ResultsComparison'
import ResultsRecommendations from '@/components/results/ResultsRecommendations'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'

// Lazy load du radar chart (recharts ~500KB)
const ResultsChartRadar = dynamic(() => import('@/components/results/ResultsChartRadar'), {
  ssr: false,
  loading: () => <div className="h-[300px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
})

interface CompatibilityResult {
  id: string
  pair_id: string
  overall_score: number
  axis_scores: Record<string, number>
  dealbreaker_conflicts: number
  strengths: string[]
  frictions: string[]
  recommendations: string[]
}

interface PairInfo {
  id: string
  user_a_email: string
  user_b_email: string
  created_at: string
}

export default function ResultsPage({ params }: { params: Promise<{ pairId: string }> }) {
  const [pairId, setPairId] = useState<string>('')
  const [results, setResults] = useState<CompatibilityResult | null>(null)
  const [pairInfo, setPairInfo] = useState<PairInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [error, setError] = useState('')
  const reportRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const loadResults = useCallback(async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }

      const { data: resultData, error: resultError } = await supabase
        .from('compatibility_results')
        .select('*')
        .eq('pair_id', pairId)
        .single()

      if (resultError) throw resultError
      setResults(resultData)
    } catch (err: any) {
      setError(err.message)
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les résultats',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }, [pairId, router, supabase])

  useEffect(() => {
    params.then(p => {
      setPairId(p.pairId)
    })
  }, [params])

  useEffect(() => {
    if (pairId) {
      loadResults()
    }
  }, [pairId, loadResults])

  // Mock data temporaire si pas de résultats chargés
  const displayResults = results || {
    overall_score: 78,
    axis_scores: {
      'Intentions': 85,
      'Valeurs': 92,
      'Rôles': 68,
      'Enfants': 88,
      'Finance': 75,
      'Style': 72,
      'Communication': 82,
      'Personnalité': 79,
      'Logistique': 65
    },
    dealbreaker_conflicts: 1,
    strengths: [
      'Valeurs spirituelles très alignées',
      'Vision similaire de la stabilité financière',
      'Objectifs familiaux compatibles',
      'Communication ouverte et respectueuse'
    ],
    frictions: [
      'Différences sur l\'approche éducative',
      'Visions divergentes sur certains aspects du mode de vie',
      'Une incompatibilité mineure sur un point logistique'
    ],
    recommendations: [
      'Dialoguez davantage sur vos attentes concernant l\'éducation des enfants',
      'Explorez ensemble les moyens d\'harmoniser vos différences de mode de vie',
      'Prenez le temps de mieux vous connaître avant de prendre une décision finale',
      'Considérez une discussion avec un conseiller matrimonial islamique'
    ]
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellente compatibilité'
    if (score >= 60) return 'Bonne compatibilité'
    if (score >= 40) return 'Compatibilité modérée'
    return 'Faible compatibilité'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Calcul de votre compatibilité</h3>
            <p className="text-gray-600">Analyse de vos réponses en cours...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        <div className="flex items-center mb-8">
          <Button onClick={() => router.back()} variant="outline" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Votre Rapport de Compatibilité
            </h1>
            <p className="text-gray-600">
              Analyse détaillée pour le couple {pairId}
            </p>
          </div>
        </div>

        <Card className="mb-8">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Heart className="h-6 w-6 text-red-500" />
              Score de Compatibilité Global
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className={`text-6xl font-bold mb-4 ${getScoreColor(displayResults.overall_score)}`}>
              {displayResults.overall_score}%
            </div>
            <Progress value={displayResults.overall_score} className="w-full max-w-md mx-auto mb-4" />
            <Badge 
              variant={displayResults.overall_score >= 80 ? "default" : displayResults.overall_score >= 60 ? "secondary" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {getScoreLabel(displayResults.overall_score)}
            </Badge>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Votre score de compatibilité est basé sur l'analyse de vos réponses 
              communes à {Object.keys(displayResults.axis_scores).length} dimensions clés 
              du mariage islamique.
            </p>
            
            {displayResults.dealbreaker_conflicts > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2 text-red-700">
                  <AlertTriangle className="h-5 w-5" />
                  <span className="font-medium">
                    {displayResults.dealbreaker_conflicts} point(s) d'incompatibilité majeure détecté(s)
                  </span>
                </div>
                <p className="text-red-600 text-sm mt-1">
                  Ces différences nécessitent une discussion approfondie avant le mariage.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Analyse par Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(displayResults.axis_scores).map(([axis, score]) => (
                <div key={axis} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{axis}</span>
                    <span className={`font-bold ${getScoreColor(score)}`}>
                      {score}%
                    </span>
                  </div>
                  <Progress value={score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Heart className="h-5 w-5" />
                Points Forts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayResults.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-green-800">{strength}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <AlertTriangle className="h-5 w-5" />
                Points d'Attention
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {displayResults.frictions.map((friction, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-yellow-800">{friction}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 🔒 PREMIUM: Graphique Radar */}
        <div className="mb-8">
          <FeatureGate featureCode="results_charts">
            <ResultsChartRadar axisScores={displayResults.axis_scores} />
          </FeatureGate>
        </div>

        {/* 🔒 PREMIUM: Analyse Détaillée par Catégorie */}
        <div className="mb-8">
          <FeatureGate featureCode="results_detailed_analysis">
            <ResultsDetailedAnalysis 
              axisScores={displayResults.axis_scores}
              strengths={displayResults.strengths}
              frictions={displayResults.frictions}
            />
          </FeatureGate>
        </div>

        {/* 🔒 PREMIUM: Comparaison avec la Communauté */}
        <div className="mb-8">
          <FeatureGate featureCode="results_comparison">
            <ResultsComparison 
              overallScore={displayResults.overall_score}
              axisScores={displayResults.axis_scores}
            />
          </FeatureGate>
        </div>

        {/* 🔒 PREMIUM: Recommandations Avancées */}
        <div className="mb-8">
          <FeatureGate featureCode="results_recommendations">
            <ResultsRecommendations 
              overallScore={displayResults.overall_score}
              recommendations={displayResults.recommendations}
              axisScores={displayResults.axis_scores}
            />
          </FeatureGate>
        </div>

        <div className="text-center bg-gray-50 rounded-lg p-6">
          <p className="text-sm text-gray-600 italic">
            "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez 
            en tranquillité avec elles et Il a mis entre vous de l'affection et de la bonté. 
            Il y a en cela des preuves pour des gens qui réfléchissent." - Coran 30:21
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Ce rapport est généré par l'algorithme NikahScore v1.0
          </p>
        </div>
      </div>
    </div>
  )
}
