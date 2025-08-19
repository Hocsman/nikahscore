'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function ResultsPage() {
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Vos Résultats NikahScore
          </h1>
          <p className="text-gray-600">Analyse de votre profil de compatibilité matrimoniale</p>
        </div>

        <Card className="p-8 text-center mb-8">
          <div className="mb-4">
            <div className="text-6xl font-bold mb-2 text-blue-600">
              85%
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Score de Compatibilité</h2>
            <p className="text-gray-600 mt-2">
              Basé sur vos réponses aux 60 questions du questionnaire
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-800 font-medium">
              🎉 Excellent profil ! Vos réponses montrent une vision claire du mariage islamique.
            </p>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">💡 Recommandations</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              Continuez à approfondir vos valeurs islamiques
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              Votre vision du mariage est cohérente et équilibrée
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-blue-600">•</span>
              Vous êtes prêt(e) pour une relation matrimoniale sérieuse
            </li>
          </ul>
        </Card>

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