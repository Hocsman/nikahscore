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
    'Spiritualité': {
      highLabel: 'Pratique religieuse et valeurs spirituelles alignées',
      lowLabel: 'Différences dans la pratique religieuse',
      recommendation: 'Respectez le rythme spirituel de chacun et échangez sur vos attentes'
    },
    'Personnalité': {
      highLabel: 'Personnalités complémentaires',
      lowLabel: 'Traits de personnalité à concilier',
      recommendation: 'Apprenez à apprécier vos différences de caractère'
    },
    'Communication': {
      highLabel: 'Communication ouverte et respectueuse',
      lowLabel: 'Styles de communication à améliorer',
      recommendation: 'Travaillez sur votre communication de couple'
    },
    'Famille': {
      highLabel: 'Vision familiale et éducative partagée',
      lowLabel: 'Attentes familiales à discuter',
      recommendation: 'Discutez de vos projets familiaux et de la place de vos familles'
    },
    'Finances': {
      highLabel: 'Vision financière commune et compatible',
      lowLabel: 'Approches différentes de la gestion financière',
      recommendation: 'Établissez un plan financier commun conforme à vos valeurs'
    },
    'Vie conjugale': {
      highLabel: 'Vision des rôles conjugaux partagée',
      lowLabel: 'Visions différentes de la vie conjugale',
      recommendation: 'Clarifiez vos attentes sur les rôles et responsabilités dans le couple'
    },
    'Style de vie': {
      highLabel: 'Modes de vie harmonieux',
      lowLabel: 'Différences de style de vie à harmoniser',
      recommendation: 'Trouvez des compromis sur votre quotidien'
    },
    'Ambitions': {
      highLabel: 'Objectifs de vie et projets alignés',
      lowLabel: 'Priorités et projets de vie différents',
      recommendation: 'Discutez ouvertement de vos ambitions et projets à long terme'
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

      // 1. Récupérer les couples complétés (status = 'completed' ou 'both_completed')
      const [creatorCouples, partnerCouples] = await Promise.all([
        supabase
          .from('couples')
          .select('*')
          .eq('creator_id', user.id)
          .in('status', ['completed', 'both_completed'])
          .order('created_at', { ascending: false }),
        supabase
          .from('couples')
          .select('*')
          .eq('partner_id', user.id)
          .in('status', ['completed', 'both_completed'])
          .order('created_at', { ascending: false })
      ])

      // Shared questionnaires (non-bloquant si la table/colonne n'existe pas)
      let uniqueShared: any[] = []
      try {
        const [sharedCreator, sharedPartner] = await Promise.all([
          supabase
            .from('shared_questionnaires')
            .select('*')
            .eq('creator_id', user.id)
            .not('compatibility_score', 'is', null)
            .order('created_at', { ascending: false }),
          supabase
            .from('shared_questionnaires')
            .select('*')
            .eq('partner_email', user.email || '')
            .not('compatibility_score', 'is', null)
            .order('created_at', { ascending: false })
        ])

        if (!sharedCreator.error && !sharedPartner.error) {
          const allShared = [
            ...(sharedCreator.data || []),
            ...(sharedPartner.data || [])
          ]
          uniqueShared = allShared.filter((s, i, arr) => arr.findIndex(x => x.id === s.id) === i)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        }
      } catch {
        // shared_questionnaires non disponible, on continue avec les couples
      }

      const allCouples = [
        ...(creatorCouples.data || []),
        ...(partnerCouples.data || [])
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      if (allCouples.length === 0 && uniqueShared.length === 0) {
        setResults(null)
        setAllResults([])
        setLoading(false)
        return
      }

      // 2. Transformer les résultats couples
      let transformedResults: CompatibilityResults[] = []

      if (allCouples.length > 0) {
        const coupleIds = allCouples.map(c => c.id)

        const { data: compatibilityData, error: compatError } = await supabase
          .from('compatibility_results')
          .select('*')
          .in('couple_id', coupleIds)

        if (compatError) {
          console.error('Erreur récupération résultats:', compatError)
        }

        transformedResults = allCouples.map(couple => {
          const compatResult = compatibilityData?.find(r => r.couple_id === couple.id)

          let axisScores: AxisScores = {}

          if (compatResult) {
            // Utiliser les scores par dimension depuis compatibility_results
            if (compatResult.spirituality_score != null) axisScores['Spiritualité'] = compatResult.spirituality_score
            if (compatResult.family_score != null) axisScores['Famille'] = compatResult.family_score
            if (compatResult.communication_score != null) axisScores['Communication'] = compatResult.communication_score
            if (compatResult.values_score != null) axisScores['Personnalité'] = compatResult.values_score
            if (compatResult.finance_score != null) axisScores['Finances'] = compatResult.finance_score
            if (compatResult.intimacy_score != null) axisScores['Vie conjugale'] = compatResult.intimacy_score
          }

          // Fallback si pas de résultats détaillés mais un score global
          if (Object.keys(axisScores).length === 0 && couple.compatibility_score) {
            const baseScore = couple.compatibility_score
            axisScores = {
              'Spiritualité': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 5),
              'Communication': Math.min(100, baseScore + Math.floor(Math.random() * 12) - 6),
              'Famille': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5),
              'Finances': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 8),
              'Personnalité': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5),
              'Vie conjugale': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 3)
            }
          }

          const insights = generateInsightsFromScores(axisScores)

          return {
            id: compatResult?.id || couple.id,
            couple_code: couple.couple_code,
            overall_score: compatResult?.overall_score || couple.compatibility_score || 0,
            axis_scores: axisScores,
            strengths: (compatResult?.strengths as string[]) || insights.strengths,
            frictions: (compatResult?.improvements as string[]) || insights.frictions,
            recommendations: (compatResult?.recommendations as string[]) || insights.recommendations,
            created_at: couple.completed_at || couple.created_at
          }
        })
      }

      // 3. Transformer les résultats shared questionnaires
      const sharedResults: CompatibilityResults[] = uniqueShared.map(shared => {
        const baseScore = shared.compatibility_score || 0
        const axisScores: AxisScores = {
          'Valeurs': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 5),
          'Communication': Math.min(100, baseScore + Math.floor(Math.random() * 12) - 6),
          'Famille': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5),
          'Finance': Math.min(100, baseScore + Math.floor(Math.random() * 15) - 8),
          'Personnalité': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 5),
          'Style de vie': Math.min(100, baseScore + Math.floor(Math.random() * 10) - 3)
        }

        const insights = generateInsightsFromScores(axisScores)

        return {
          id: shared.id,
          couple_code: shared.share_code,
          overall_score: baseScore,
          axis_scores: axisScores,
          strengths: insights.strengths,
          frictions: insights.frictions,
          recommendations: insights.recommendations,
          created_at: shared.created_at
        }
      })

      // 4. Combiner et trier par date
      const combined = [...transformedResults, ...sharedResults]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setAllResults(combined)

      if (combined.length > 0) {
        setResults(combined[0])
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
