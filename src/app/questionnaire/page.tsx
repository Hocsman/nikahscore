'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useFeaturePermission } from '@/hooks/usePermission'
import PremiumBlock from '@/components/PremiumBlock'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useAuth } from '@/hooks/useAuth'
import { 
  ArrowLeft, 
  CheckCircle, 
  Circle, 
  Heart,
  Star,
  Sparkles,
  Timer,
  Target,
  Award,
  Zap,
  ChevronRight,
  Home,
  Lock,
  Crown
} from 'lucide-react'

import { PERSONALITY_QUESTIONS } from '@/data/personality-questions'
import { getQuestionHint } from '@/data/question-hints'
import QuestionTooltip from '@/components/QuestionTooltip'

// Questions statiques améliorées
const STATIC_QUESTIONS = PERSONALITY_QUESTIONS

interface Question {
  id: number
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
  hint?: string // Explication optionnelle de la question
}

export default function QuestionnairePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<{[key: number]: boolean | number}>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [direction, setDirection] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPremiumBlock, setShowPremiumBlock] = useState(false)
  const [checkingCouple, setCheckingCouple] = useState(true)

  // Vérification des permissions
  const { allowed: hasBasicAccess, blocked: needsUpgrade, requiredPlan } = useFeaturePermission('basic_questionnaire')
  
  // Analytics tracking
  const { trackEvent } = useAnalytics()

  // Vérification du couple - rediriger vers /couple si pas de couple créé/rejoint
  useEffect(() => {
    const checkCoupleStatus = async () => {
      if (!user) {
        console.log('⚠️ Pas d\'utilisateur connecté')
        setCheckingCouple(false)
        return
      }

      try {
        console.log('🔍 Vérification du statut couple pour:', user.email)
        const response = await fetch(`/api/couple/check?user_id=${user.id}`)
        const data = await response.json()

        if (!data.hasCouple) {
          console.log('⚠️ Aucun couple trouvé - Redirection vers /couple')
          router.push('/couple')
        } else {
          console.log('✅ Couple trouvé:', data.couple_code)
          setCheckingCouple(false)
        }
      } catch (error) {
        console.error('❌ Erreur vérification couple:', error)
        setCheckingCouple(false)
      }
    }

    checkCoupleStatus()
  }, [user, router])

  // Animation variants
  const questionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    })
  }

  useEffect(() => {
    console.log('🚀 Chargement questionnaire depuis API...')
    setLoading(true)
    
    // Track page view
    trackEvent('questionnaire_page_view', {
      source: 'direct'
    })
    
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions')
        const data = await response.json()
        
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          console.log('✅ Questions chargées depuis API:', data.questions.length)
        } else {
          setQuestions(STATIC_QUESTIONS)
          console.log('⚠️ Fallback vers questions statiques')
        }
        
        // Track questionnaire start
        trackEvent('questionnaire_started', {
          question_count: data.questions?.length || STATIC_QUESTIONS.length
        })
        
      } catch (err) {
        console.error('❌ Erreur API, fallback:', err)
        setQuestions(STATIC_QUESTIONS)
        setError('Connexion limitée - mode hors ligne')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()

    // Charger les réponses sauvegardées
    const saved = localStorage.getItem('nikahscore-responses')
    if (saved) {
      try {
        const parsedResponses = JSON.parse(saved)
        setResponses(parsedResponses)
        console.log('📝 Réponses restaurées:', parsedResponses)
      } catch (e) {
        console.error('❌ Erreur réponses:', e)
      }
    }
  }, [])

  useEffect(() => {
    if (questions.length > 0) {
      const answeredCount = Object.keys(responses).length
      if (answeredCount >= questions.length) {
        setIsCompleted(true)
      } else {
        setCurrentQuestion(answeredCount)
      }
      console.log(`📊 Questions: ${questions.length}, Réponses: ${answeredCount}`)
    }
  }, [questions, responses])

  // Réinitialiser selectedAnswer quand on change de question
  useEffect(() => {
    setSelectedAnswer(null)
  }, [currentQuestion])

  // Debug: Log de la question courante
  useEffect(() => {
    if (questions.length > 0 && questions[currentQuestion]) {
      const currentQ = questions[currentQuestion]
      console.log('🎯 Question courante:', { 
        id: currentQ.id, 
        category: currentQ.category, 
        text: currentQ.text.substring(0, 50) + '...' 
      })
    }
  }, [currentQuestion, questions])

  const handleResponse = (response: boolean | number) => {
    if (questions.length === 0) return
    
    setSelectedAnswer(response)
    setIsSubmitting(true)
    
    const currentQ = questions[currentQuestion]
    
    // Track question response
    trackEvent('questionnaire_question_answered', {
      question_id: currentQ.id,
      question_axis: currentQ.axis,
      question_category: currentQ.category,
      response: response,
      is_dealbreaker: currentQ.is_dealbreaker,
      question_number: currentQuestion + 1,
      total_questions: questions.length
    })
    
    // Animation délai pour voir la sélection
    setTimeout(() => {
      const questionId = questions[currentQuestion].id
      const newResponses = { ...responses, [questionId]: response }
      
      setResponses(newResponses)
      localStorage.setItem('nikahscore-responses', JSON.stringify(newResponses))

      if (currentQuestion < questions.length - 1) {
        setDirection(1)
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsSubmitting(false)
      } else {
        // Questionnaire terminé
        trackEvent('questionnaire_completed', {
          total_questions: questions.length,
          completion_time: Date.now() - (performance.timeOrigin || 0)
        })
        
        setShowConfetti(true)
        setTimeout(() => {
          setIsCompleted(true)
          setIsSubmitting(false)
        }, 1500)
      }
      
      console.log('💾 Réponse sauvée:', { questionId, response })
    }, 600)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setDirection(-1)
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(null)
    }
  }

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0
  const completedQuestions = Object.keys(responses).length
  const timeEstimate = Math.max(1, Math.ceil((questions.length - completedQuestions) * 0.5))

  // États de chargement avec animations
  if (loading || checkingCouple) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <motion.div 
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-400 border-b-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
            {checkingCouple ? 'Vérification de votre couple...' : 'Préparation de votre questionnaire...'}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {checkingCouple ? 'Validation de votre questionnaire partagé' : 'Chargement des questions personnalisées'}
          </p>
          
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-600 rounded-full"
                animate={{ 
                  scale: [1, 1.5, 1], 
                  opacity: [0.5, 1, 0.5] 
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  delay: i * 0.3 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  // État d'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 max-w-md w-full text-center border-red-200 bg-red-50">
            <motion.div 
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-2xl">⚠️</span>
            </motion.div>
            <h2 className="text-xl font-semibold text-red-800 mb-4">
              Problème de connexion
            </h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Réessayer
            </Button>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Questionnaire terminé avec animation de confettis
  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confettis animés */}
        <AnimatePresence>
          {showConfetti && (
            <>
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl pointer-events-none"
                  initial={{ 
                    x: typeof window !== 'undefined' ? Math.random() * window.innerWidth : 400, 
                    y: -50,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: typeof window !== 'undefined' ? window.innerHeight + 50 : 800,
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                    scale: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3 + Math.random() * 2,
                    ease: "easeOut",
                    delay: i * 0.1
                  }}
                >
                  {['🎉', '✨', '🌟', '💫', '🎊'][Math.floor(Math.random() * 5)]}
                </motion.div>
              ))}
            </>
          )}
        </AnimatePresence>

        <motion.div 
          className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md w-full relative z-10"
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <motion.div 
            className="w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Award className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h2 
            className="text-3xl font-bold text-gray-800 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Questionnaire terminé !
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Félicitations ! Vous avez complété les {questions.length} questions. 
            Découvrez maintenant vos résultats personnalisés.
          </motion.p>

          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            <Link href="/results" className="block">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Voir mes résultats détaillés
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </Link>
            
            <motion.div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('nikahscore-responses')
                  setCurrentQuestion(0)
                  setResponses({})
                  setIsCompleted(false)
                  setShowConfetti(false)
                }}
                className="flex-1 border-gray-300"
              >
                Recommencer
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full border-gray-300">
                  <Home className="w-4 h-4 mr-2" />
                  Accueil
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  // Questionnaire principal avec animations
  const currentQ = questions[currentQuestion]
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300">Aucune question disponible</p>
        </div>
      </div>
    )
  }

  // Enrichir la question avec son hint si disponible
  const questionWithHint = {
    ...currentQ,
    hint: currentQ.hint || getQuestionHint(currentQ.id)
  }

  // Debug log
  console.log('🔍 Question actuelle:', { 
    id: questionWithHint.id, 
    category: questionWithHint.category, 
    text: questionWithHint.text.substring(0, 50) + '...',
    hasHint: !!questionWithHint.hint
  })

  // Vérifier les permissions d'accès
  if (needsUpgrade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 relative flex items-center justify-center">
        <PremiumBlock
          feature="basic_questionnaire"
          title="Questionnaire NikahScore"
          description="Accédez au questionnaire complet de compatibilité matrimoniale"
          requiredPlan={requiredPlan || 'premium'}
          onUpgrade={() => setShowPremiumBlock(false)}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20"
          animate={{ 
            rotate: -360,
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      </div>

      <div className="relative z-10 p-4 max-w-4xl mx-auto py-8">
        {/* Header avec navigation */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mb-4 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>

          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent mb-2">
            Questionnaire NikahScore
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm md:text-lg">
            Question {currentQuestion + 1} sur {questions.length}
          </p>

          {/* Badge d'axe avec animation */}
          <motion.div className="mt-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 text-sm font-medium">
              <Target className="w-4 h-4 mr-2" />
              {questionWithHint.axis}
              {questionWithHint.is_dealbreaker && (
                <motion.span 
                  className="ml-2"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡
                </motion.span>
              )}
            </Badge>
          </motion.div>
        </motion.div>

        {/* Barre de progression avancée */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                ~{timeEstimate} min restantes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {completedQuestions}/{questions.length}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full relative"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.div 
                  className="absolute right-0 top-0 w-6 h-full bg-white opacity-30 rounded-full"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
            <div className="text-center mt-2">
              <span className="text-sm font-medium text-gray-700">
                {Math.round(progress)}% complété
              </span>
            </div>
          </div>
        </motion.div>

        {/* Question Card avec animations */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentQuestion}
            custom={direction}
            variants={questionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.3 }
            }}
            className="mb-8"
          >
            <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              {/* Indicateur de question critique */}
              {questionWithHint.is_dealbreaker && (
                <motion.div 
                  className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4 mb-6"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Zap className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
                    </motion.div>
                    <p className="text-red-700 font-medium">
                      Question critique - Important pour la compatibilité
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Question text */}
              <motion.div 
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-start justify-center gap-3">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-white leading-relaxed flex-1 text-center">
                    {questionWithHint.text}
                  </h2>
                  {questionWithHint.hint && (
                    <QuestionTooltip hint={questionWithHint.hint} />
                  )}
                </div>
              </motion.div>

              {/* Réponses avec animations */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {questionWithHint.category === 'bool' ? (
                  // Questions Oui/Non
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      animate={selectedAnswer === true ? { scale: 1.05 } : {}}
                    >
                      <Button
                        onClick={() => handleResponse(true)}
                        disabled={isSubmitting}
                        className={`w-full h-16 text-lg font-semibold border-2 transition-all duration-300 ${
                          selectedAnswer === true 
                            ? 'bg-green-600 hover:bg-green-700 text-white border-green-600 shadow-lg' 
                            : 'bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 text-pink-700 border-pink-200 hover:border-pink-300'
                        }`}
                        variant="outline"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          {selectedAnswer === true ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                          <span>Oui</span>
                        </div>
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      animate={selectedAnswer === false ? { scale: 1.05 } : {}}
                    >
                      <Button
                        onClick={() => handleResponse(false)}
                        disabled={isSubmitting}
                        className={`w-full h-16 text-lg font-semibold border-2 transition-all duration-300 ${
                          selectedAnswer === false 
                            ? 'bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg' 
                            : 'bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 border-red-200 hover:border-red-300'
                        }`}
                        variant="outline"
                      >
                        <div className="flex items-center justify-center space-x-3">
                          {selectedAnswer === false ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Circle className="w-6 h-6" />
                          )}
                          <span>Non</span>
                        </div>
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  // Questions à échelle de Likert
                  <div className="space-y-3">
                    <p className="text-center text-gray-600 dark:text-gray-300 mb-6 text-lg">
                      Indiquez votre niveau d'accord avec cette affirmation
                    </p>
                    <div className="space-y-3">
                      {[
                        { value: 1, label: "Pas du tout d'accord", color: "from-red-500 to-red-600", emoji: "😔" },
                        { value: 2, label: "Plutôt en désaccord", color: "from-orange-500 to-orange-600", emoji: "🤔" },
                        { value: 3, label: "Neutre", color: "from-gray-500 to-gray-600", emoji: "😐" },
                        { value: 4, label: "Plutôt d'accord", color: "from-pink-500 to-pink-600", emoji: "🙂" },
                        { value: 5, label: "Tout à fait d'accord", color: "from-green-500 to-green-600", emoji: "😊" }
                      ].map((option, index) => (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.01, y: -2 }}
                          whileTap={{ scale: 0.99 }}
                          animate={{ scale: 1, opacity: 1, x: 0 }}
                          initial={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0, duration: 0.3 }}
                        >
                          <Button
                            onClick={() => handleResponse(option.value)}
                            disabled={isSubmitting}
                            className={`w-full h-16 text-left justify-start text-lg border-2 transition-all duration-300 ${
                              selectedAnswer === option.value 
                                ? `bg-gradient-to-r ${option.color} text-white border-transparent shadow-xl transform scale-105` 
                                : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                            variant="outline"
                          >
                            <div className="flex items-center space-x-4 w-full">
                              <div className="text-2xl">{option.emoji}</div>
                              <div className="flex-1">
                                <div className={`font-semibold ${selectedAnswer === option.value ? 'text-white' : 'text-gray-800 dark:text-white'}`}>
                                  {option.label}
                                </div>
                                <div className={`text-sm ${selectedAnswer === option.value ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                  Niveau {option.value}/5
                                </div>
                              </div>
                              {selectedAnswer === option.value && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg"
                                >
                                  <CheckCircle className="w-5 h-5 text-green-500" />
                                </motion.div>
                              )}
                            </div>
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Navigation */}
              <motion.div 
                className="flex justify-between items-center mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0 || isSubmitting}
                  variant="ghost"
                  className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Question {currentQuestion + 1} / {questions.length}</span>
                </div>

                <div className="w-24"></div>
              </motion.div>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Indicateurs de progression en bas */}
        <motion.div 
          className="flex justify-center space-x-2 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          {questions.slice(Math.max(0, currentQuestion - 2), currentQuestion + 3).map((_, index) => {
            const actualIndex = Math.max(0, currentQuestion - 2) + index
            return (
              <motion.div
                key={actualIndex}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  actualIndex === currentQuestion 
                    ? 'bg-blue-600 scale-125' 
                    : actualIndex < currentQuestion 
                      ? 'bg-green-500' 
                      : 'bg-gray-300'
                }`}
                animate={actualIndex === currentQuestion ? { 
                  scale: [1, 1.3, 1] 
                } : {}}
                transition={{ 
                  duration: 0.5, 
                  repeat: actualIndex === currentQuestion ? Infinity : 0, 
                  repeatDelay: 2 
                }}
              />
            )
          })}
        </motion.div>

        {/* Loading overlay pendant soumission */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
              >
                <div className="flex items-center space-x-3">
                  <motion.div
                    className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="text-gray-700 font-medium">Enregistrement...</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
