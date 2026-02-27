'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Heart, CheckCircle, Trophy, Clock, ArrowLeft, ArrowRight, LogIn } from 'lucide-react'
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

// Couple codes contain a dash (e.g. "594-42672"), shared codes are 8 uppercase alphanumeric
function isCoupleCode(code: string): boolean {
  return code.includes('-')
}

export default function SharedQuestionnairePage({ params }: SharedQuestionnairePageProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{ [key: string]: boolean | number }>({})
  const [userRole, setUserRole] = useState<'creator' | 'participant' | null>(null)
  const [loading, setLoading] = useState(true)
  const [notAuthenticated, setNotAuthenticated] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [alreadyAnswered, setAlreadyAnswered] = useState(false)
  const [bothCompleted, setBothCompleted] = useState(false)
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null)
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null)
  const [expired, setExpired] = useState(false)

  useEffect(() => {
    params.then(p => setResolvedParams(p))
  }, [params])

  // --- Load COUPLE questionnaire ---
  const loadCoupleQuestionnaire = useCallback(async (code: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setNotAuthenticated(true)
        setLoading(false)
        return
      }

      // Fetch couple info
      const coupleRes = await fetch(`/api/couple?code=${code}`)
      const coupleData = await coupleRes.json()

      if (!coupleData.success) {
        toast.error(coupleData.error || 'Questionnaire couple non trouvé')
        router.push('/dashboard/couple')
        return
      }

      const couple = coupleData.couple

      // If user is not yet partner, auto-join
      if (couple.user_role === 'guest') {
        const joinRes = await fetch('/api/couple/join', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ couple_code: code })
        })
        const joinData = await joinRes.json()
        if (!joinData.success) {
          toast.error(joinData.error || 'Impossible de rejoindre le questionnaire')
          setLoading(false)
          return
        }
        setUserRole('participant')
      } else {
        setUserRole(couple.user_role === 'creator' ? 'creator' : 'participant')
      }

      // Check if user already submitted responses
      const respRes = await fetch(`/api/couple/responses?code=${code}`)
      const respData = await respRes.json()

      if (respData.success && respData.responses) {
        const userResponse = respData.responses.find((r: { user_id: string }) => r.user_id === user.id)
        if (userResponse) {
          setAlreadyAnswered(true)
          setIsCompleted(true)
        }
        if (respData.responses.length >= 2) {
          setBothCompleted(true)
          setIsCompleted(true)
        }
      }

      // Load questions from DB
      const { data: questionsRaw } = await supabase
        .from('questions')
        .select('id, text, category')
        .order('order_index')

      if (questionsRaw && questionsRaw.length > 0) {
        setQuestions(questionsRaw.map(q => ({
          id: q.id,
          label: q.text || '',
          type: q.category || ''
        })))
      } else {
        // Fallback minimal questions
        setQuestions([
          { id: '1', label: 'Partagez-vous les mêmes valeurs religieuses fondamentales ?', type: 'bool' },
          { id: '2', label: 'Êtes-vous d\'accord sur l\'importance de la prière quotidienne ?', type: 'bool' },
          { id: '3', label: 'Avez-vous une vision similaire du rôle de la famille ?', type: 'bool' },
          { id: '4', label: 'Partagez-vous les mêmes objectifs de vie ?', type: 'bool' },
          { id: '5', label: 'Êtes-vous compatibles sur le plan de la communication ?', type: 'scale' }
        ])
      }
    } catch (error) {
      console.error('Error loading couple questionnaire:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [router])

  // --- Load SHARED questionnaire ---
  const loadSharedQuestionnaire = useCallback(async (code: string) => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setNotAuthenticated(true)
        setLoading(false)
        return
      }

      // Charger le questionnaire partagé via l'API
      const response = await fetch(`/api/questionnaire/shared?code=${code}`)
      const data = await response.json()

      if (!data.success) {
        if (data.expired) {
          setExpired(true)
        } else {
          toast.error(data.error || 'Questionnaire non trouvé')
          router.push('/questionnaire/shared')
        }
        return
      }

      setQuestions(data.questions)
      const shared = data.shared

      // Auto-détection du rôle via creator_id
      const isCreator = user.id === shared.creator_id
      const role = isCreator ? 'creator' : 'participant'
      setUserRole(role)

      // Vérifier si l'utilisateur a déjà répondu
      const userAlreadyAnswered = isCreator
        ? !!shared.creator_completed_at
        : !!shared.partner_completed_at

      // Vérifier l'état de complétion global
      const bothDone = !!shared.creator_completed_at && !!shared.partner_completed_at

      if (userAlreadyAnswered) {
        setAlreadyAnswered(true)
        setIsCompleted(true)
      }

      if (bothDone) {
        setBothCompleted(true)
        setIsCompleted(true)
        if (shared.compatibility_score) {
          setCompatibilityScore(shared.compatibility_score)
        }
      }
    } catch (error) {
      console.error('Error loading shared questionnaire:', error)
      toast.error('Erreur lors du chargement')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    if (resolvedParams?.code) {
      const code = resolvedParams.code
      if (isCoupleCode(code)) {
        loadCoupleQuestionnaire(code)
      } else {
        loadSharedQuestionnaire(code)
      }
    }
  }, [resolvedParams, loadCoupleQuestionnaire, loadSharedQuestionnaire])

  const handleResponse = (response: boolean | number) => {
    if (!questions || questions.length === 0 || currentQuestion >= questions.length) return

    const questionId = questions[currentQuestion].id
    const newResponses = { ...responses, [questionId]: response }
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      submitResponses(newResponses)
    }
  }

  const submitResponses = async (finalResponses: { [key: string]: boolean | number }) => {
    if (!userRole) {
      toast.error('Impossible de déterminer votre rôle')
      return
    }

    const code = resolvedParams?.code
    if (!code) return

    try {
      let response: Response
      if (isCoupleCode(code)) {
        // Couple: submit via couple API
        response = await fetch('/api/couple/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            couple_code: code,
            responses: finalResponses
          })
        })
      } else {
        // Shared: submit via shared questionnaire API
        response = await fetch('/api/questionnaire/shared/responses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            share_code: code,
            responses: finalResponses,
            role: userRole
          })
        })
      }

      const data = await response.json()

      if (data.success) {
        setIsCompleted(true)
        setAlreadyAnswered(true)
        setBothCompleted(data.both_completed)

        if (data.compatibility_score) {
          setCompatibilityScore(data.compatibility_score)
        }

        toast.success('Réponses sauvegardées avec succès !')
      } else {
        toast.error(data.error)
      }
    } catch (error) {
      console.error('Error submitting responses:', error)
      toast.error('Erreur lors de la sauvegarde')
    }
  }

  // --- LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 mx-auto text-pink-500 animate-pulse" />
          <p className="text-gray-600 dark:text-gray-400">Chargement du questionnaire partagé...</p>
        </div>
      </div>
    )
  }

  // --- NOT AUTHENTICATED ---
  if (notAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <LogIn className="w-12 h-12 mx-auto text-purple-500 mb-4" />
              <CardTitle>Connexion requise</CardTitle>
              <CardDescription>
                Connectez-vous pour répondre au questionnaire partagé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={() => router.push(`/auth?mode=login&redirect=/questionnaire/shared/${resolvedParams?.code}`)}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Se connecter
              </Button>
              <Button
                onClick={() => router.push(`/auth?mode=register&redirect=/questionnaire/shared/${resolvedParams?.code}`)}
                variant="outline"
                className="w-full"
              >
                Créer un compte
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // --- EXPIRED ---
  if (expired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Clock className="w-12 h-12 mx-auto text-orange-500 mb-4" />
              <CardTitle>Questionnaire expiré</CardTitle>
              <CardDescription>
                Ce questionnaire a dépassé sa durée de validité de 30 jours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => router.push('/questionnaire/shared')}
                className="w-full"
                variant="outline"
              >
                Créer un nouveau questionnaire
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // --- BOTH COMPLETED WITH SCORE ---
  if (bothCompleted && compatibilityScore !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">Score de Compatibilité</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-6">
              <div className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                {compatibilityScore}%
              </div>
              <p className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                {compatibilityScore >= 80 ? "Excellente compatibilité !" :
                  compatibilityScore >= 60 ? "Bonne compatibilité" :
                    compatibilityScore >= 40 ? "Compatibilité modérée" :
                      "Différences importantes à explorer"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => router.push('/dashboard/results')}
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  Voir les résultats détaillés
                </Button>
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

  // --- ALREADY ANSWERED (waiting for partner) ---
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
              <CardTitle className="text-2xl text-green-700 dark:text-green-400">Questionnaire Terminé !</CardTitle>
              <CardDescription>
                Merci d&apos;avoir répondu au questionnaire partagé
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  Code: {resolvedParams?.code}
                </Badge>
              </div>

              <div className="text-center space-y-4">
                <Clock className="w-12 h-12 mx-auto text-blue-500" />
                <h3 className="text-xl font-semibold dark:text-gray-100">En attente de votre partenaire</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Le score de compatibilité sera calculé une fois que votre partenaire aura terminé le questionnaire.
                </p>
              </div>

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

  // --- NO QUESTIONS LOADED ---
  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Aucune question disponible.</p>
        </div>
      </div>
    )
  }

  // --- QUESTIONNAIRE IN PROGRESS ---
  if (userRole && questions.length > 0 && currentQuestion < questions.length) {
    const currentQ = questions[currentQuestion]

    if (!currentQ) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">Erreur de chargement de la question...</p>
          </div>
        </div>
      )
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-950 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <Badge variant="outline" className="mb-2">
              Code: {resolvedParams?.code} &bull; {userRole === 'creator' ? 'Créateur' : 'Partenaire'}
            </Badge>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
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
                      className="h-12 text-green-600 border-green-200 hover:bg-green-50 dark:hover:bg-green-950/30"
                    >
                      Oui
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleResponse(false)}
                      className="h-12 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      Non
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Button
                        key={value}
                        variant="outline"
                        onClick={() => handleResponse(value)}
                        className="h-12 hover:bg-blue-50 dark:hover:bg-blue-950/30 text-xs sm:text-sm"
                      >
                        {value}
                      </Button>
                    ))}
                    <div className="col-span-3 sm:col-span-5 flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
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

  return null
}
