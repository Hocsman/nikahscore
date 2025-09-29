'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useFeaturePermission } from '@/hooks/usePermission'
import PremiumBlock from '@/components/PremiumBlock'
import { useAnalytics } from '@/hooks/useAnalytics'
import PaginatedQuestionnaire from '@/components/PaginatedQuestionnaire'
import { 
  ArrowLeft, 
  Sparkles,
  Timer,
  Users,
  MessageCircle,
  Star,
  Crown,
  Zap
} from 'lucide-react'

import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'

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
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showPremiumBlock, setShowPremiumBlock] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Vérification des permissions
  const { allowed: hasBasicAccess, blocked: needsUpgrade, requiredPlan } = useFeaturePermission('basic_questionnaire')
  
  // Analytics tracking
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    console.log('🚀 Chargement questionnaire paginé...')
    setLoading(true)
    
    // Track page view
    trackEvent('questionnaire_page_view', {
      source: 'direct',
      version: 'paginated'
    })
    
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions')
        const data = await response.json()
        
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          console.log('✅ Questions chargées depuis API:', data.questions.length)
        } else {
          setQuestions(PERSONALITY_QUESTIONS)
          console.log('⚠️ Fallback vers questions statiques:', PERSONALITY_QUESTIONS.length)
        }
        
        // Track questionnaire start
        trackEvent('questionnaire_started', {
          question_count: data.questions?.length || PERSONALITY_QUESTIONS.length,
          version: 'paginated'
        })
        
      } catch (err) {
        console.error('❌ Erreur API, fallback:', err)
        setQuestions(PERSONALITY_QUESTIONS)
        setError('Connexion limitée - mode hors ligne')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [trackEvent])

  // Gestion de la completion du questionnaire
  const handleQuestionnaireComplete = async (responses: {[key: number]: boolean | number}) => {
    console.log('🎯 Questionnaire terminé avec', Object.keys(responses).length, 'réponses')
    setIsSubmitting(true)

    try {
      // Analytics
      trackEvent('questionnaire_completed', {
        total_questions: questions.length,
        total_responses: Object.keys(responses).length,
        completion_rate: (Object.keys(responses).length / questions.length) * 100,
        version: 'paginated'
      })

      // Sauvegarder les réponses
      const saveData = {
        responses,
        completed_at: new Date().toISOString(),
        question_count: questions.length,
        version: 'v2.0-personality'
      }

      localStorage.setItem('nikahscore-final-responses', JSON.stringify(saveData))
      
      // Rediriger vers les résultats ou page de création de couple
      router.push('/questionnaire/shared')
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error)
      setError('Erreur lors de la sauvegarde')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Charger les réponses sauvegardées
  const getSavedResponses = () => {
    try {
      const saved = localStorage.getItem('nikahscore-paginated-responses')
      if (saved) {
        const data = JSON.parse(saved)
        return data.responses || {}
      }
    } catch (e) {
      console.error('❌ Erreur chargement sauvegarde:', e)
    }
    return {}
  }

  // Vérification des permissions
  if (needsUpgrade && !hasBasicAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <PremiumBlock 
          title="Questionnaire Premium"
          description="Accédez au questionnaire de compatibilité complet"
          feature="questionnaire de base"
          requiredPlan={requiredPlan || 'premium'}
          onUpgrade={() => setShowPremiumBlock(false)}
        />
      </div>
    )
  }

  // Écran de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Préparation de votre questionnaire</h3>
          <p className="text-gray-600">Chargement des 100 questions de personnalité...</p>
          {error && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg max-w-md mx-auto">
              <p className="text-yellow-700 text-sm">{error}</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Erreur de chargement
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-red-500 mb-4">
            <Star className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Questions indisponibles</h3>
          <p className="text-gray-600 mb-4">
            Impossible de charger le questionnaire. Veuillez réessayer.
          </p>
          <Button onClick={() => window.location.reload()} className="w-full">
            Recharger
          </Button>
        </Card>
      </div>
    )
  }

  // Écran de soumission
  if (isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sauvegarde en cours</h3>
          <p className="text-gray-600">Finalisation de vos réponses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Introduction */}
      <div className="max-w-4xl mx-auto p-4 py-8">
        <Card className="mb-8 bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Sparkles className="w-8 h-8 text-pink-600" />
                <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Questionnaire de Personnalité
                </h1>
                <Sparkles className="w-8 h-8 text-purple-600" />
              </div>
              
              <p className="text-lg text-gray-700 mb-6">
                100 questions approfondies pour évaluer votre compatibilité matrimoniale selon les valeurs islamiques
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-pink-600 mb-1">100</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-purple-600 mb-1">6</div>
                  <div className="text-sm text-gray-600">Dimensions</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-blue-600 mb-1">5</div>
                  <div className="text-sm text-gray-600">Pages</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="text-2xl font-bold text-green-600 mb-1">15-25</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Star className="w-5 h-5 text-yellow-500" />
                <div>
                  <div className="font-semibold text-sm">Spiritualité</div>
                  <div className="text-xs text-gray-600">Pratique religieuse</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <Users className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="font-semibold text-sm">Personnalité</div>
                  <div className="text-xs text-gray-600">Tempérament & caractère</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <div className="font-semibold text-sm">Communication</div>
                  <div className="text-xs text-gray-600">Style relationnel</div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <Zap className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-800 mb-1">Sauvegarde automatique</h4>
                  <p className="text-blue-700 text-sm">
                    Vos réponses sont sauvegardées automatiquement. Vous pouvez reprendre à tout moment où vous vous êtes arrêté.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Crown className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-800 mb-1">Confidentialité assurée</h4>
                  <p className="text-green-700 text-sm">
                    Vos réponses sont privées et sécurisées. Seul votre rapport de compatibilité peut être partagé.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Questionnaire paginé */}
        <PaginatedQuestionnaire
          questions={questions}
          onComplete={handleQuestionnaireComplete}
          savedResponses={getSavedResponses()}
        />
      </div>
    </div>
  )
}