'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, CheckCircle, Trophy, Clock, ArrowLeft, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

interface Question {
  id: string
  label: string
  type: 'bool' | 'scale'
}

interface SharedQuestionnairePageProps {
  params: Promise<{
    code: string
  }>
}

export default function SharedQuestionnairePage({ params }: SharedQuestionnairePageProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: boolean | number }>({})
  const [email, setEmail] = useState('')
  const [userRole, setUserRole] = useState<'creator' | 'participant' | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCompleted, setIsCompleted] = useState(false)
  const [bothCompleted, setBothCompleted] = useState(false)
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  const loadSharedQuestionnaire = React.useCallback(async () => {
    if (!resolvedParams?.code) return
    
    try {
      const response = await fetch(`/api/questionnaire/shared?code=${resolvedParams.code}`)
      const data = await response.json()
      
      if (data.success) {
        setQuestions(data.questions)
        
        if (data.creator_responses || data.participant_responses) {
          setIsCompleted(true)
          setBothCompleted(data.both_completed)
          
          if (data.compatibility_score) {
            setCompatibilityScore(data.compatibility_score)
          }
        }
      } else {
        toast.error('Questionnaire non trouvé')
        router.push('/questionnaire/shared')
      }
    } catch (error) {
      console.error('Error loading shared questionnaire:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [resolvedParams?.code, router])

  useEffect(() => {
    if (resolvedParams?.code) {
      loadSharedQuestionnaire()
    }
  }, [resolvedParams, loadSharedQuestionnaire])

  const handleResponse = (response: boolean | number) => {
    if (questions.length === 0) return
    
    const questionId = questions[currentQuestion].id
    const newResponses = { ...responses, [questionId]: response }
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitResponses(newResponses)
    }
  }

  const submitResponses = async (finalResponses: any) => {
    if (!userRole || !email.trim()) {
      toast.error('Email requis pour sauvegarder')
      return
    }

    try {
      const response = await fetch('/api/questionnaire/shared/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          share_code: resolvedParams?.code,
          email: email,
          responses: finalResponses,
          role: userRole
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setIsCompleted(true)
        setBothCompleted(data.both_completed)
        
        if (data.compatibility_score) {
          setCompatibilityScore(data.compatibility_score)
        }
        
        toast.success('Réponses sauvegardées avec succès!')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error('Error submitting responses:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 mx-auto text-pink-500 animate-pulse" />
          <p className="text-gray-600">Chargement du questionnaire partagé...</p>
        </div>
      </div>
    )
  }

  if (bothCompleted && compatibilityScore !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-2xl text-green-700">Score de Compatibilité</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {compatibilityScore}%
              </div>
              <p className="text-gray-600">
                {compatibilityScore >= 80 ? "Excellente compatibilité !" :
                 compatibilityScore >= 60 ? "Bonne compatibilité" :
                 compatibilityScore >= 40 ? "Compatibilité modérée" :
                 "Différences importantes à explorer"}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <CardTitle className="text-2xl text-green-700">Questionnaire Terminé !</CardTitle>
              <CardDescription>
                Merci d'avoir répondu au questionnaire partagé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Code: {resolvedParams?.code}
                </Badge>
              </div>

              {bothCompleted && compatibilityScore !== null ? (
                <div className="text-center space-y-4">
                  <Trophy className="w-12 h-12 mx-auto text-yellow-500" />
                  <h3 className="text-xl font-semibold">Score de Compatibilité</h3>
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    {compatibilityScore}%
                  </div>
                  <p className="text-gray-600">
                    {compatibilityScore >= 80 ? "Excellente compatibilité !" :
                     compatibilityScore >= 60 ? "Bonne compatibilité" :
                     compatibilityScore >= 40 ? "Compatibilité modérée" :
                     "Différences importantes à explorer"}
                  </p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <Clock className="w-12 h-12 mx-auto text-blue-500" />
                  <h3 className="text-xl font-semibold">En attente de votre partenaire</h3>
                  <p className="text-gray-600">
                    Le score de compatibilité sera calculé une fois que votre partenaire aura terminé le questionnaire.
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button 
                  onClick={() => router.push('/questionnaire/shared')}
                  variant="outline"
                >
                  Créer un Nouveau Questionnaire
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <CardTitle>Questionnaire Partagé</CardTitle>
              <CardDescription>
                Code: <Badge variant="outline">{resolvedParams?.code}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Votre Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              
              <Button 
                onClick={() => {
                  if (email.trim()) {
                    setUserRole('participant')
                  }
                }}
                disabled={!email.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Commencer le Questionnaire
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (questions.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Chargement des questions...</p>
        </div>
      </div>
    )
  }

  if (userRole && email && questions.length > 0) {
    const currentQ = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="mb-2">
              Code: {resolvedParams?.code} • {userRole === 'creator' ? 'Créateur' : 'Partenaire'}
            </Badge>
            <h1 className="text-2xl font-bold text-gray-800">
              Question {currentQuestion + 1} sur {questions.length}
            </h1>
            <Progress value={progress} className="w-full" />
          </div>

          <div className="transition-all duration-300 ease-in-out">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg leading-relaxed">
                    {currentQ.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {currentQ.type === 'bool' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleResponse(true)}
                        className="h-12 text-green-600 border-green-200 hover:bg-green-50"
                      >
                        Oui
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleResponse(false)}
                        className="h-12 text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Non
                      </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <Button
                          key={value}
                          variant="outline"
                          onClick={() => handleResponse(value)}
                          className="h-12 hover:bg-blue-50"
                        >
                          {value}
                        </Button>
                      ))}
                      <div className="col-span-5 flex justify-between text-xs text-gray-500 mt-1">
                        <span>Pas du tout</span>
                        <span>Extrêmement</span>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-4">
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Précédent
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => handleResponse(currentQ.type === 'bool' ? false : 3)}
                    >
                      Passer
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <Badge variant="outline" className="mb-4">
            Code: {resolvedParams?.code}
          </Badge>
          <h1 className="text-2xl font-bold text-gray-800">
            Interface Questionnaire Partagé
          </h1>
          <p className="text-gray-600 mt-2">
            Le système est maintenant fonctionnel !
          </p>
        </div>
      </div>
    </div>
  )
}