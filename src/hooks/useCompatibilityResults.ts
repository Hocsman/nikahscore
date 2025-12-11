'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

export interface AxisScores {
  [key: string]: number
}

export interface CompatibilityResults {
  id?: string
  couple_code: string
  overall_score: number
  axis_scores: AxisScores
  dimension_scores?: Record<string, {
    score: number
    weight: number
    questions_count: number
    strengths?: string[]
    concerns?: string[]
  }>
  strengths: string[]
  frictions: string[]
  recommendations: string[]
  dealbreaker_conflicts?: number
  compatibility_level?: string
  partner_name?: string
  created_at: string
}

// Générer des forces et faiblesses basées sur les scores par axe
function generateInsightsFromScores(axisScores: AxisScores): {
  strengths: string[]
  frictions: string[]
  recommendations: string[]
} {
  const strengths: string[] = []
  const frictions: string[] = []
  const recommendations: string[] = []

  const insightMap: Record<string, {
    highLabel: string
    lowLabel: string
    recommendation: string
  }> = {
    'Intentions': {
      highLabel: 'Objectifs matrimoniaux parfaitement alignés',
      lowLabel: 'Attentes différentes sur le mariage',
      recommendation: 'Discutez ouvertement de vos intentions à long terme'
    },
    'Valeurs': {
      highLabel: 'Valeurs spirituelles et morales très compatibles',
      lowLabel: 'Divergences sur les valeurs fondamentales',
      recommendation: 'Explorez vos différences de valeurs avec bienveillance'
    },
    'Rôles': {
      highLabel: 'Vision commune des rôles au sein du foyer',
      lowLabel: 'Attentes différentes sur les rôles conjugaux',
      recommendation: 'Clarifiez vos attentes mutuelles sur les responsabilités'
    },
    'Enfants': {
      highLabel: 'Vision similaire de l\'éducation et de la famille',
      lowLabel: 'Divergences sur l\'approche éducative',
      recommendation: 'Dialoguez sur vos attentes concernant les enfants'
    },
    'Finance': {
      highLabel: 'Objectifs financiers compatibles',
      lowLabel: 'Approches différentes de la gestion financière',
      recommendation: 'Établissez un plan financier commun'
    },
    'Style': {
      highLabel: 'Modes de vie harmonieux',
      lowLabel: 'Différences de style de vie à harmoniser',
      recommendation: 'Trouvez des compromis sur votre quotidien'
    },
    'Communication': {
      highLabel: 'Communication ouverte et respectueuse',
      lowLabel: 'Styles de communication à améliorer',
      recommendation: 'Travaillez sur votre communication de couple'
    },
    'Personnalité': {
      highLabel: 'Personnalités complémentaires',
      lowLabel: 'Traits de personnalité à concilier',
      recommendation: 'Apprenez à apprécier vos différences'
    },
    'Logistique': {
      highLabel: 'Organisation pratique compatible',
      lowLabel: 'Points logistiques à clarifier',
      recommendation: 'Planifiez ensemble les aspects pratiques'
    },
    'Religion': {
      highLabel: 'Pratique religieuse alignée',
      lowLabel: 'Niveaux de pratique différents',
      recommendation: 'Respectez le rythme spirituel de chacun'
    },
    'Famille': {
      highLabel: 'Vision familiale partagée',
      lowLabel: 'Attentes familiales à discuter',
      recommendation: 'Discutez de la place de vos familles respectives'
    }
  }

  Object.entries(axisScores).forEach(([axis, score]) => {
    const insight = insightMap[axis]
    if (!insight) return

    if (score >= 75) {
      strengths.push(insight.highLabel)
    } else if (score < 60) {
      frictions.push(insight.lowLabel)
      recommendations.push(insight.recommendation)
    }
  })

  // Ajouter des recommandations générales si peu de frictions
  if (recommendations.length === 0) {
    recommendations.push('Continuez à cultiver votre communication')
    recommendations.push('Prenez le temps de vous connaître davantage')
  }

  // Limiter à 4 éléments max
  return {
    strengths: strengths.slice(0, 4),
    frictions: frictions.slice(0, 4),
    recommendations: recommendations.slice(0, 4)
  }
}

export function useCompatibilityResults() {
  const { user } = useAuth()
  const [results, setResults] = useState<CompatibilityResults | null>(null)
  const [allResults, setAllResults] = useState<CompatibilityResults[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchResults = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // 1. Récupérer tous les couples de l'utilisateur
      const [creatorCouples, partnerCouples] = await Promise.all([
        supabase
          .from('couples')
          .select('*')
          .eq('creator_id', user.id)
          .eq('status', 'both_completed')
          .order('created_at', { ascending: false }),
        supabase
          .from('couples')
          .select('*')
          .eq('partner_id', user.id)
          .eq('status', 'both_completed')
          .order('created_at', { ascending: false })
      ])

      const allCouples = [
        ...(creatorCouples.data || []),
        ...(partnerCouples.data || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      if (allCouples.length === 0) {
        setResults(null)
        setAllResults([])
        setLoading(false)
        return
      }

      // 2. Récupérer les résultats de compatibilité pour ces couples
      const coupleCodes = allCouples.map(c => c.couple_code)
      
      const { data: compatibilityData, error: compatError } = await supabase
        .from('compatibility_results')
        .select('*')
        .in('couple_code', coupleCodes)
        .order('generated_at', { ascending: false })

      if (compatError) {
        console.error('Erreur récupération résultats:', compatError)
      }

      // 3. Transformer les données
      const transformedResults: CompatibilityResults[] = allCouples.map(couple => {
        const compatResult = compatibilityData?.find(r => r.couple_code === couple.couple_code)
        
        // Calculer les axis_scores depuis dimension_scores si disponible
        let axisScores: AxisScores = {}
        
        if (compatResult?.dimension_scores) {
          Object.entries(compatResult.dimension_scores).forEach(([dim, data]: [string, any]) => {
            axisScores[dim] = Math.round(data.score * 100)
          })
        } else if (couple.compatibility_score) {
          // Générer des scores approximatifs basés sur le score global
          const baseScore = couple.compatibility_score
          axisScores = {
            'Valeurs': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 5),
            'Intentions': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 3),
            'Communication': Math.min(100, baseScore + Math.floor(Math.random() * 12) - 6),
            'Famille': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5),
            'Finance': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 8),
            'Personnalité': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5)
          }
        }

        const insights = generateInsightsFromScores(axisScores)

        return {
          id: compatResult?.id || couple.id,
          couple_code: couple.couple_code,
          overall_score: compatResult?.overall_score || couple.compatibility_score || 0,
          axis_scores: axisScores,
          dimension_scores: compatResult?.dimension_scores,
          strengths: compatResult?.detailed_analysis?.strengths || insights.strengths,
          frictions: compatResult?.detailed_analysis?.concerns || insights.frictions,
          recommendations: insights.recommendations,
          dealbreaker_conflicts: compatResult?.dealbreaker_conflicts || 0,
          compatibility_level: compatResult?.compatibility_level,
          created_at: compatResult?.generated_at || couple.created_at
        }
      })

      setAllResults(transformedResults)
      
      // Le dernier résultat (le plus récent) est le principal
      if (transformedResults.length > 0) {
        setResults(transformedResults[0])
      }

    } catch (err: any) {
      console.error('Erreur useCompatibilityResults:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    fetchResults()
  }, [fetchResults])

  return {
    results,
    allResults,
    loading,
    error,
    refetch: fetchResults,
    hasResults: results !== null && results.overall_score > 0
  }
}
