'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface UserResponses {
  [key: string]: boolean | number
}

interface ScoreDetails {
  totalScore: number
  dealBreakers: number
  categories: {
    [key: string]: {
      score: number
      questions: number
    }
  }
}

export default function ResultatsPage() {
  const [responses, setResponses] = useState<UserResponses | null>(null)
  const [scoreDetails, setScoreDetails] = useState<ScoreDetails | null>(null)

  useEffect(() => {
    // Récupérer les réponses depuis localStorage
    const savedResponses = localStorage.getItem('nikahscore-responses')
    if (savedResponses) {
      const parsedResponses = JSON.parse(savedResponses)
      setResponses(parsedResponses)
      calculateScore(parsedResponses)
    }
  }, [])

  const calculateScore = (userResponses: UserResponses) => {
    // Questions avec leurs axes et statut de deal-breaker
    const questions = [
      { id: 'q1', axis: 'Intentions', dealBreaker: true },
      { id: 'q2', axis: 'Valeurs', dealBreaker: true },
      { id: 'q3', axis: 'Rôles', dealBreaker: false },
      { id: 'q4', axis: 'Enfants', dealBreaker: true },
      { id: 'q5', axis: 'Finance', dealBreaker: false },
      { id: 'q6', axis: 'Style de vie', dealBreaker: false },
      { id: 'q7', axis: 'Communication', dealBreaker: false },
      { id: 'q8', axis: 'Personnalité', dealBreaker: false },
      { id: 'q9', axis: 'Logistique', dealBreaker: false },
      { id: 'q10', axis: 'Valeurs', dealBreaker: false },
      { id: 'q11', axis: 'Rôles', dealBreaker: true },
      { id: 'q12', axis: 'Communication', dealBreaker: false },
      { id: 'q13', axis: 'Style de vie', dealBreaker: true },
      { id: 'q14', axis: 'Personnalité', dealBreaker: false },
      { id: 'q15', axis: 'Intentions', dealBreaker: false }
    ]

    let totalScore = 0
    let dealBreakersCount = 0
    const categoryScores: { [key: string]: { score: number; questions: number } } = {}

    questions.forEach((q, index) => {
      const response = userResponses[q.id]
      let questionScore = 0

      // Calculer le score pour cette question
      if (typeof response === 'boolean') {
        questionScore = response ? 100 : 0
        if (q.dealBreaker && !response) {
          dealBreakersCount++
        }
      } else if (typeof response === 'number') {
        questionScore = (response / 5) * 100
        if (q.dealBreaker && response <= 2) {
          dealBreakersCount++
        }
      }

      totalScore += questionScore

      // Accumuler par catégorie
      if (!categoryScores[q.axis]) {
        categoryScores[q.axis] = { score: 0, questions: 0 }
      }
      categoryScores[q.axis].score += questionScore
      categoryScores[q.axis].questions += 1
    })

    // Moyennes par catégorie
    Object.keys(categoryScores).forEach(axis => {
      categoryScores[axis].score = Math.round(categoryScores[axis].score / categoryScores[axis].questions)
    })

    const finalScore = Math.round(totalScore / questions.length)

    setScoreDetails({
      totalScore: finalScore,
      dealBreakers: dealBreakersCount,
      categories: categoryScores
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellente compatibilité ! Vos valeurs sont très alignées.'
    if (score >= 60) return 'Bonne compatibilité. Quelques points à discuter ensemble.'
    return 'Compatibilité modérée. Des différences importantes à considérer.'
  }

  if (!responses || !scoreDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Aucun résultat trouvé</p>
          <Link href="/questionnaire">
            <Button>Commencer le questionnaire</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vos résultats NikahScore
          </h1>
          <p className="text-gray-600">
            Analyse de votre profil matrimonial
          </p>
        </div>

        {/* Score principal */}
        <Card className="p-8 mb-8 text-center">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold mb-4 ${getScoreColor(scoreDetails.totalScore)}`}>
            {scoreDetails.totalScore}%
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Score de compatibilité personnelle
          </h2>
          <p className="text-gray-600 mb-4">
            {getScoreMessage(scoreDetails.totalScore)}
          </p>
          
          {scoreDetails.dealBreakers > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-700 font-medium">
                ⚠️ {scoreDetails.dealBreakers} point(s) critique(s) détecté(s)
              </p>
              <p className="text-red-600 text-sm mt-1">
                Ces aspects nécessitent une discussion approfondie avec votre partenaire potentiel.
              </p>
            </div>
          )}
        </Card>

        {/* Détail par catégorie */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {Object.entries(scoreDetails.categories).map(([axis, data]) => (
            <Card key={axis} className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {axis}
              </h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Score</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${getScoreColor(data.score)}`}>
                  {data.score}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${data.score >= 80 ? 'bg-green-500' : data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ width: `${data.score}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Basé sur {data.questions} question(s)
              </p>
            </Card>
          ))}
        </div>

        {/* Actions suivantes */}
        <Card className="p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Et maintenant ?
          </h3>
          <div className="space-y-4">
            <p className="text-gray-600">
              Invitez votre partenaire potentiel à passer le même questionnaire 
              pour découvrir votre compatibilité mutuelle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => {
                  const url = window.location.origin + '/questionnaire'
                  navigator.clipboard.writeText(url)
                  alert('Lien copié ! Partagez-le avec votre partenaire potentiel.')
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                Partager le lien 📋
              </Button>
              <Link href="/questionnaire">
                <Button variant="outline">
                  Refaire le test
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline">
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
