'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

interface Question {
  id: string
  text: string
  type: 'boolean' | 'scale'
  dealBreaker?: boolean
}

const questions: Question[] = [
  {
    id: 'q1',
    text: 'Cherchez-vous un mariage dans un but religieux et spirituel ?',
    type: 'boolean',
    dealBreaker: true
  },
  {
    id: 'q2', 
    text: 'La pratique religieuse quotidienne est-elle importante pour vous ?',
    type: 'scale',
    dealBreaker: true
  },
  {
    id: 'q3',
    text: 'Acceptez-vous une répartition traditionnelle des rôles dans le couple ?',
    type: 'boolean'
  },
  {
    id: 'q4',
    text: 'Souhaitez-vous avoir des enfants dans les 3 prochaines années ?',
    type: 'boolean',
    dealBreaker: true
  },
  {
    id: 'q5',
    text: 'Quelle importance accordez-vous à la stabilité financière ? (1=Peu important, 5=Très important)',
    type: 'scale'
  },
  {
    id: 'q6',
    text: 'Préférez-vous un style de vie simple et modeste ?',
    type: 'boolean'
  },
  {
    id: 'q7',
    text: 'Quelle importance accordez-vous à la communication quotidienne ? (1=Peu important, 5=Très important)',
    type: 'scale'
  },
  {
    id: 'q8',
    text: 'Vous considérez-vous comme une personne introvertie ?',
    type: 'boolean'
  },
  {
    id: 'q9',
    text: 'Êtes-vous prêt(e) à déménager pour le mariage ?',
    type: 'boolean'
  },
  {
    id: 'q10',
    text: 'Quelle importance accordez-vous aux traditions familiales ? (1=Peu important, 5=Très important)',
    type: 'scale'
  },
  {
    id: 'q11',
    text: 'Acceptez-vous que votre conjoint(e) travaille à l\'extérieur ?',
    type: 'boolean',
    dealBreaker: true
  },
  {
    id: 'q12',
    text: 'Êtes-vous à l\'aise avec les discussions sur les sujets sensibles ?',
    type: 'boolean'
  },
  {
    id: 'q13',
    text: 'Les sorties et activités sociales sont-elles importantes pour vous ?',
    type: 'boolean',
    dealBreaker: true
  },
  {
    id: 'q14',
    text: 'Quelle importance accordez-vous à l\'humour dans une relation ? (1=Peu important, 5=Très important)',
    type: 'scale'
  },
  {
    id: 'q15',
    text: 'Envisagez-vous le mariage comme un engagement à vie ?',
    type: 'boolean'
  }
]

export default function QuestionnairePage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{[key: string]: boolean | number}>({})
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    // Charger les réponses sauvegardées
    const saved = localStorage.getItem('nikahscore-responses')
    if (saved) {
      const parsedResponses = JSON.parse(saved)
      setResponses(parsedResponses)
      
      // Déterminer la question actuelle basée sur les réponses
      const answeredCount = Object.keys(parsedResponses).length
      if (answeredCount >= questions.length) {
        setIsCompleted(true)
      } else {
        setCurrentQuestion(answeredCount)
      }
    }
  }, [])

  const handleResponse = (response: boolean | number) => {
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

  const progress = ((currentQuestion + Object.keys(responses).length) / questions.length) * 100

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
            Merci d'avoir complété le questionnaire NikahScore. 
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
        </div>

        <div className="mb-6">
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-gray-500 mt-2 text-center">
            {Math.round(progress)}% complété
          </p>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            {currentQ.dealBreaker && (
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
            {currentQ.type === 'boolean' ? (
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
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
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
