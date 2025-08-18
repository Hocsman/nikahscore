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

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{[key: number]: boolean | number}>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuestions()
    // Charger les réponses sauvegardées
    const saved = localStorage.getItem('nikahscore-responses')
    if (saved) {
      try {
        const parsedResponses = JSON.parse(saved)
        setResponses(parsedResponses)
      } catch (e) {
        console.error('Erreur lors du chargement des réponses:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      // Déterminer la question actuelle basée sur les réponses
      const answeredCount = Object.keys(responses).length
      if (answeredCount >= questions.length) {
        setIsCompleted(true)
      } else {
        setCurrentQuestion(answeredCount)
      }
    }
  }, [questions, responses])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/questions')
      
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des questions')
      }
      
      const data = await response.json()
      setQuestions(data.questions || [])
    } catch (err) {
      console.error('Erreur:', err)
      setError(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = (response: boolean | number) => {
    if (questions.length === 0) return
    
    const questionId = questions[currentQuestion].id
    const newResponses = { ...responses, [questionId]: response }
    
    setResponses(newResponses)
    localStorage.setItem('nikahscore-responses', JSON.stringify(newResponses))

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const progress = questions.length > 0 ? ((currentQuestion + Object.keys(responses).length) / questions.length) * 100 : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des questions...</p>
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
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Erreur de chargement
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={fetchQuestions} className="w-full">
            Réessayer
          </Button>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune question disponible</p>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Questionnaire terminé !
          </h2>
          <p className="text-gray-600 mb-6">
            Merci d'avoir complété les {questions.length} questions NikahScore. 
            Découvrez maintenant vos résultats détaillés.
          </p>
          <div className="space-y-3">
            <Link href="/resultats">
              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Voir mes résultats →
              </Button>
            </Link>
            <Button 
              variant="outline" 
              onClick={() => {
                localStorage.removeItem('nikahscore-responses')
                setCurrentQuestion(0)
                setResponses({})
                setIsCompleted(false)
              }}
              className="w-full"
            >
              Recommencer
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  if (!currentQ) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-blue-600 hover:text-blue-700 text-sm">
            ← Retour à l'accueil
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
            Questionnaire NikahScore
          </h1>
          <p className="text-gray-600">
            Question {currentQuestion + 1} sur {questions.length}
          </p>
          <p className="text-sm text-blue-600 font-medium">
            Axe : {currentQ.axis}
          </p>
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {Math.round(progress)}% complété
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            {currentQ.is_dealbreaker && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm font-medium">
                  ⚠️ Question critique - Important pour la compatibilité
                </p>
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {currentQ.text}
            </h2>
          </div>

          <div className="space-y-3">
            {currentQ.category === 'bool' ? (
              <>
                <Button
                  onClick={() => handleResponse(true)}
                  className="w-full text-left justify-start bg-green-50 hover:bg-green-100 text-green-700 border border-green-200"
                  variant="outline"
                >
                  ✓ Oui
                </Button>
                <Button
                  onClick={() => handleResponse(false)}
                  className="w-full text-left justify-start bg-red-50 hover:bg-red-100 text-red-700 border border-red-200"
                  variant="outline"
                >
                  ✗ Non
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-3">Choisissez sur une échelle de 1 à 5 :</p>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    onClick={() => handleResponse(value)}
                    variant="outline"
                    className="w-full text-left justify-start hover:bg-blue-50"
                  >
                    {value} - {value === 1 ? 'Pas du tout important' : 
                         value === 2 ? 'Peu important' :
                         value === 3 ? 'Moyennement important' :
                         value === 4 ? 'Important' : 
                         'Très important'}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {currentQuestion > 0 && (
            <Button
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              variant="ghost"
              className="mt-6 w-full"
            >
              ← Question précédente
            </Button>
          )}
        </Card>
      </div>
    </div>
  )
}
