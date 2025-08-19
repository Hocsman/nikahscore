'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: number
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

interface AxisScore {
  axis: string
  score: number
  maxScore: number
  percentage: number
  questionCount: number
  dealbreakers: number
  dealbreakersPassed: number
}

interface CompatibilityResult {
  globalScore: number
  axisScores: AxisScore[]
  dealbreakersTotal: number
  dealbreakersPassed: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
  responsesCount: number
}

export default function ResultsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<{[key: number]: boolean | number}>({})
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDataAndCalculate()
  }, [])

  const loadDataAndCalculate = async () => {
    try {
      setLoading(true)
      
      // Charger les questions
      const questionsResponse = await fetch('/api/questions')
      const questionsData = await questionsResponse.json()
      
      if (!questionsData.questions?.length) {
        setError('Aucune question trouvée')
        return
      }

      // Charger les réponses depuis localStorage
      const savedResponses = localStorage.getItem('nikahscore-responses')
      if (!savedResponses) {
        setError('Aucune réponse trouvée. Veuillez d\'abord compléter le questionnaire.')
        return
      }

      const parsedResponses = JSON.parse(savedResponses)
      
      setQuestions(questionsData.questions)
      setResponses(parsedResponses)
      
      // Calculer les résultats
      const compatibilityResult = calculateCompatibility(questionsData.questions, parsedResponses)
      setResult(compatibilityResult)
      
    } catch (err) {
      console.error('Erreur chargement résultats:', err)
      setError('Erreur lors du calcul des résultats')
    } finally {
      setLoading(false)
    }
  }

  const calculateCompatibility = (questions: Question[], responses: {[key: number]: boolean | number}): CompatibilityResult => {
    // Grouper les questions par axe
    const axiGroups: {[key: string]: Question[]} = {}
    questions.forEach(q => {
      if (!axiGroups[q.axis]) {
        axiGroups[q.axis] = []
      }
      axiGroups[q.axis].push(q)
    })

    const axisScores: AxisScore[] = []
    let totalScore = 0
    let totalMaxScore = 0
    let dealbreakersTotal = 0
    let dealbreakersPassed = 0

    // Calculer le score par axe
    Object.entries(axiGroups).forEach(([axis, axisQuestions]) => {
      let axisScore = 0
      let axisMaxScore = 0
      let axisDealbreakersPassed = 0
      let axisDealbreakerTotal = 0

      axisQuestions.forEach(question => {
        const response = responses[question.id]
        if (response !== undefined) {
          if (question.category === 'bool') {
            const score = response ? question.weight : 0
            axisScore += score
            axisMaxScore += question.weight
            
            if (question.is_dealbreaker) {
              axisDealbreakerTotal++
              dealbreakersTotal++
              if (response) {
                axisDealbreakersPassed++
                dealbreakersPassed++
              }
            }
          } else if (question.category === 'scale') {
            // Scale de 1-5, on normalise sur le poids
            const normalizedScore = ((response as number) / 5) * question.weight
            axisScore += normalizedScore
            axisMaxScore += question.weight
            
            if (question.is_dealbreaker) {
              axisDealbreakerTotal++
              dealbreakersTotal++
              // Pour les scales, on considère 4+ comme "passé"
              if ((response as number) >= 4) {
                axisDealbreakersPassed++
                dealbreakersPassed++
              }
            }
          }
        }
      })

      const percentage = axisMaxScore > 0 ? (axisScore / axisMaxScore) * 100 : 0
      
      axisScores.push({
        axis,
        score: Math.round(axisScore * 10) / 10,
        maxScore: axisMaxScore,
        percentage: Math.round(percentage),
        questionCount: axisQuestions.length,
        dealbreakers: axisDealbreakerTotal,
        dealbreakersPassed: axisDealbreakersPassed
      })

      totalScore += axisScore
      totalMaxScore += axisMaxScore
    })

    const globalScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    // Générer des recommandations
    const recommendations = generateRecommendations(axisScores, globalScore, dealbreakersPassed, dealbreakersTotal)
    const strengths = generateStrengths(axisScores)
    const concerns = generateConcerns(axisScores)

    return {
      globalScore,
      axisScores: axisScores.sort((a, b) => b.percentage - a.percentage),
      dealbreakersTotal,
      dealbreakersPassed,
      recommendations,
      strengths,
      concerns,
      responsesCount: Object.keys(responses).length
    }
  }

  const generateRecommendations = (axisScores: AxisScore[], globalScore: number, dealbreakers: number, totalDealbreakers: number): string[] => {
    const recs = []
    
    if (globalScore >= 85) {
      recs.push("Excellent profil de compatibilité ! Vous avez une vision très claire et cohérente du mariage islamique.")
    } else if (globalScore >= 70) {
      recs.push("Très bon profil de compatibilité. Vos attentes matrimoniales sont bien définies.")
    } else if (globalScore >= 55) {
      recs.push("Profil de compatibilité correct. Quelques aspects méritent une réflexion plus approfondie.")
    } else {
      recs.push("Il serait bénéfique de clarifier davantage vos attentes et priorités matrimoniales.")
    }

    const dealbreakerRatio = totalDealbreakers > 0 ? dealbreakers / totalDealbreakers : 0
    if (dealbreakerRatio < 0.6) {
      recs.push("Attention : plusieurs critères essentiels ne sont pas validés. Cela pourrait créer des incompatibilités majeures.")
    } else if (dealbreakerRatio >= 0.8) {
      recs.push("Très positif : vous respectez la plupart des critères essentiels pour une union réussie.")
    }

    // Recommandations par axe faible
    const weakAxes = axisScores.filter(axis => axis.percentage < 50).slice(0, 2)
    weakAxes.forEach(axis => {
      recs.push(`${axis.axis} : Ce domaine nécessite une réflexion plus approfondie.`)
    })

    return recs
  }

  const generateStrengths = (axisScores: AxisScore[]): string[] => {
    return axisScores
      .filter(axis => axis.percentage >= 80)
      .map(axis => `${axis.axis} : Vision très claire (${axis.percentage}%)`)
      .slice(0, 3)
  }

  const generateConcerns = (axisScores: AxisScore[]): string[] => {
    return axisScores
      .filter(axis => axis.percentage < 60)
      .map(axis => `${axis.axis} : Nécessite une réflexion approfondie (${axis.percentage}%)`)
      .slice(0, 3)
  }

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (percentage >= 65) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getGlobalScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 65) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Analyse de vos réponses...</h2>
          <p className="text-gray-500 mt-2">Calcul de votre score de compatibilité</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Erreur</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link href="/questionnaire">
            <Button className="w-full">Refaire le questionnaire</Button>
          </Link>
        </Card>
      </div>
    )
  }

  if (!result) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Vos Résultats NikahScore
          </h1>
          <p className="text-gray-600">Analyse de votre profil de compatibilité matrimoniale</p>
        </div>

        {/* Score Global */}
        <Card className="p-8 text-center mb-8">
          <div className="mb-4">
            <div className={`text-6xl font-bold mb-2 ${getGlobalScoreColor(result.globalScore)}`}>
              {result.globalScore}%
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Score Global de Compatibilité</h2>
            <p className="text-gray-600 mt-2">
              Basé sur {result.responsesCount} réponses sur {questions.length} questions
            </p>
          </div>
          
          <div className="flex justify-center items-center space-x-6 mt-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.dealbreakersPassed}</div>
              <div className="text-sm text-gray-600">Critères essentiels validés</div>
            </div>
            <div className="w-px h-12 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">{result.dealbreakersTotal}</div>
              <div className="text-sm text-gray-600">Critères essentiels au total</div>
            </div>
          </div>
        </Card>

        {/* Scores par Axe */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Analyse par Domaine</h3>
          <div className="grid gap-4">
            {result.axisScores.map((axis) => (
              <div key={axis.axis} className={`p-4 rounded-lg border-2 ${getScoreColor(axis.percentage)}`}>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{axis.axis}</h4>
                  <span className="font-bold text-lg">{axis.percentage}%</span>
                </div>
                <Progress value={axis.percentage} className="mb-2" />
                <div className="text-sm opacity-75">
                  {axis.questionCount} questions • {axis.dealbreakersPassed}/{axis.dealbreakers} critères essentiels validés
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Points Forts */}
        {result.strengths.length > 0 && (
          <Card className="p-6 mb-8 bg-green-50 border-green-200">
            <h3 className="text-xl font-semibold text-green-800 mb-4">✅ Vos Points Forts</h3>
            <ul className="space-y-2">
              {result.strengths.map((strength, index) => (
                <li key={index} className="text-green-700 flex items-start">
                  <span className="mr-2 text-green-600 font-bold">•</span>
                  {strength}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Points d'Attention */}
        {result.concerns.length > 0 && (
          <Card className="p-6 mb-8 bg-orange-50 border-orange-200">
            <h3 className="text-xl font-semibold text-orange-800 mb-4">⚠️ Points d'Attention</h3>
            <ul className="space-y-2">
              {result.concerns.map((concern, index) => (
                <li key={index} className="text-orange-700 flex items-start">
                  <span className="mr-2 text-orange-600 font-bold">•</span>
                  {concern}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Recommandations */}
        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Recommandations Personnalisées</h3>
          <ul className="space-y-3">
            {result.recommendations.map((rec, index) => (
              <li key={index} className="text-gray-700 flex items-start">
                <span className="mr-2 text-blue-600 font-bold">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/questionnaire">
            <Button variant="outline" className="w-full sm:w-auto">
              Refaire le questionnaire
            </Button>
          </Link>
          <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700">
            Partager mes résultats
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}