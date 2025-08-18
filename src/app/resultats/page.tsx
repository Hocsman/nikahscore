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
    // Calcul de score simple basé sur les réponses
    const responseValues = Object.values(userResponses)
    let totalScore = 0

    responseValues.forEach(response => {
      if (typeof response === 'boolean') {
        totalScore += response ? 100 : 0
      } else if (typeof response === 'number') {
        totalScore += (response / 5) * 100
      }
    })

    const finalScore = Math.round(totalScore / responseValues.length)

    setScoreDetails({
      totalScore: finalScore,
      dealBreakers: 0,
      categories: {
        'Global': { score: finalScore, questions: responseValues.length }
      }
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
        </Card>

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
