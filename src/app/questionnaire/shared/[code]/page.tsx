'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Users, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  Clock,
  Sparkles,
  Trophy
} from 'lucide-react'
import { toast } from 'sonner'

interface Question {
  id: string
  axis: string
  label: string
  type: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

interface SharedQuestionnairePageProps {
  params: {
    code: string
  }
}

export default function SharedQuestionnairePage({ params }: SharedQuestionnairePageProps) {
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [sharedData, setSharedData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{[key: string]: boolean | number}>({})
  const [userRole, setUserRole] = useState<'creator' | 'partner' | null>(null)
  const [email, setEmail] = useState('')
  const [isCompleted, setIsCompleted] = useState(false)
  const [compatibilityScore, setCompatibilityScore] = useState<number | null>(null)
  const [bothCompleted, setBothCompleted] = useState(false)

  useEffect(() => {
    fetchQuestions()
    fetchSharedQuestionnaire()
    
    // Déterminer le rôle depuis l'URL
    const urlParams = new URLSearchParams(window.location.search)
    const roleParam = urlParams.get('role')
    if (roleParam === 'creator' || roleParam === 'partner') {
      setUserRole(roleParam)
    }
  }, [params.code])

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()
      
      if (data.success) {
        // Trier les questions par ordre
        const sortedQuestions = data.questions.sort((a: Question, b: Question) => a.order_index - b.order_index)
        setQuestions(sortedQuestions)
      } else {
        toast.error('Erreur lors du chargement des questions')
      }
    } catch (error) {
      console.error('Error fetching questions:', error)
      toast.error('Erreur lors du chargement des questions')
    }
  }

  const fetchSharedQuestionnaire = async () => {
    try {
      const response = await fetch(`/api/questionnaire/shared?code=${params.code}`)
      const data = await response.json()

      if (data.success) {
        setSharedData(data.shared)
        
        // Déterminer automatiquement le rôle si pas encore défini
        if (!userRole) {
          if (!data.shared.creator_completed_at) {
            setUserRole('creator')
          } else if (!data.shared.partner_completed_at) {
            setUserRole('partner')
          }
        }

        // Vérifier si les deux ont terminé
        setBothCompleted(data.shared.creator_completed_at && data.shared.partner_completed_at)
        if (data.shared.compatibility_score) {
          setCompatibilityScore(data.shared.compatibility_score)
        }
      } else {
        toast.error(data.error)
        router.push('/questionnaire/shared')
      }
    } catch (error) {
      console.error('Error fetching shared questionnaire:', error)
      toast.error('Erreur lors du chargement')
      router.push('/questionnaire/shared')
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = (response: boolean | number) => {
    if (questions.length === 0) return
    
    const questionId = questions[currentQuestion].id
    const newResponses = { ...responses, [questionId]: response }
    setResponses(newResponses)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Questionnaire terminé, sauvegarder
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
          share_code: params.code,
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

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
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
                  Code: {params.code}
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
                  <p className="text-sm text-gray-500">
                    Partagez ce lien : <code className="bg-gray-100 px-2 py-1 rounded">{window.location.origin}/questionnaire/shared/{params.code}</code>
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

  // Demander l'email si pas encore défini
  if (!email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Users className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <CardTitle>Questionnaire Partagé</CardTitle>
              <CardDescription>
                Code: <Badge variant="outline">{params.code}</Badge>
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
                  onKeyPress={(e) => e.key === 'Enter' && email.trim() && setEmail(email)}
                />
              </div>
              <Button 
                onClick={() => email.trim() && setEmail(email)}
                disabled={!email.trim()}
                className="w-full"
              >
                Commencer le Questionnaire
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  // Vérifier que les questions sont chargées
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center space-y-4">
              <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600">Chargement des questions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="mb-2">
            Code: {params.code} • {userRole === 'creator' ? 'Créateur' : 'Partenaire'}
          </Badge>
          <h1 className="text-2xl font-bold text-gray-800">
            Question {currentQuestion + 1} sur {questions.length}
          </h1>
          <Progress value={progress} className="w-full" />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
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

                {/* Navigation */}
                <div className="flex justify-between pt-4">
                  <Button
                    variant="ghost"
                    onClick={goToPrevious}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Précédent
                  </Button>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    {questions.length - currentQuestion - 1} questions restantes
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
