'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, 
  ArrowRight, 
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
  Home
} from 'lucide-react'

// Questions statiques temporaires pour debug
const STATIC_QUESTIONS = [
  {
    id: 1,
    axis: 'Intentions',
    text: 'Je souhaite me marier dans les 12 prochains mois.',
    category: 'bool' as const,
    weight: 1,
    is_dealbreaker: true,
    order_index: 1
  },
  {
    id: 2,
    axis: 'Valeurs',
    text: 'La pratique religieuse régulière est importante pour moi.',
    category: 'scale' as const,
    weight: 1,
    is_dealbreaker: true,
    order_index: 2
  },
  {
    id: 3,
    axis: 'Enfants',
    text: 'Je souhaite des enfants.',
    category: 'bool' as const,
    weight: 1,
    is_dealbreaker: true,
    order_index: 3
  },
  {
    id: 4,
    axis: 'Rôles',
    text: 'Je préfère une répartition traditionnelle des rôles.',
    category: 'scale' as const,
    weight: 1,
    is_dealbreaker: false,
    order_index: 4
  },
  {
    id: 5,
    axis: 'Finance',
    text: 'Je peux accepter de gérer un budget serré.',
    category: 'scale' as const,
    weight: 1,
    is_dealbreaker: false,
    order_index: 5
  }
]

interface Question {
  id: number
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

export default function EnhancedQuestionnairePage() {
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

  // Animation variants
  const questionVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction > 0 ? 15 : -15
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
      rotateY: direction < 0 ? 15 : -15,
      transition: {
        duration: 0.4
      }
    })
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  }

  const buttonVariants = {
    rest: { scale: 1, y: 0 },
    hover: { 
      scale: 1.02, 
      y: -2,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.1 }
    },
    selected: {
      scale: 1.05,
      backgroundColor: '#3b82f6',
      boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
      transition: { duration: 0.3 }
    }
  }

  const progressVariants = {
    initial: { width: 0 },
    animate: (progress: number) => ({
      width: `${progress}%`
    })
  }

  const confettiVariants = {
    hidden: { scale: 0, rotate: 0 },
    visible: {
      scale: [0, 1, 0.8],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        ease: "easeOut"
      }
    }
  }

  useEffect(() => {
    console.log('🚀 Chargement questionnaire depuis API...')
    setLoading(true)
    
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions')
        const data = await response.json()
        
        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions)
          console.log('✅ Questions chargées depuis API:', data.questions.length, '(source:', data.source + ')')
        } else {
          setQuestions(STATIC_QUESTIONS)
          console.log('⚠️ Fallback vers questions statiques')
        }
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

  const handleResponse = (response: boolean | number) => {
    if (questions.length === 0) return
    
    setSelectedAnswer(response)
    setIsSubmitting(true)
    
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
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="relative">
              <motion.div 
                className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-400 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Préparation de votre questionnaire...
            </h2>
            <p className="text-gray-600 mb-4">Chargement des questions personnalisées</p>
            
            <div className="flex justify-center space-x-2">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 bg-blue-600 rounded-full"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity, 
                    delay: i * 0.3 
                  }}
                />
              ))}
            </div>
          </motion.div>
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
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  initial={{ 
                    x: Math.random() * window.innerWidth, 
                    y: -50,
                    rotate: 0,
                    scale: 0
                  }}
                  animate={{ 
                    y: window.innerHeight + 50,
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
            className="w-20 h-20 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6"
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
            className="text-3xl font-bold text-gray-800 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Questionnaire terminé !
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 mb-8"
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
                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg">
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Aucune question disponible</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
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
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Link 
              href="/" 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm mb-4 transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Link>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Questionnaire NikahScore
            </h1>
            <p className="text-gray-600 text-lg">
              Question {currentQuestion + 1} sur {questions.length}
            </p>
          </motion.div>

          {/* Badge d'axe avec animation */}
          <motion.div 
            variants={itemVariants}
            className="mt-4"
          >
            <Badge 
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 text-sm font-medium"
            >
              <Target className="w-4 h-4 mr-2" />
              {currentQ.axis}
              {currentQ.is_dealbreaker && (
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
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Timer className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                ~{timeEstimate} min restantes
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-600">
                {completedQuestions}/{questions.length}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full relative"
                variants={progressVariants}
                initial="initial"
                animate="animate"
                custom={progress}
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
            className="mb-8"
          >
            <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
              {/* Indicateur de question critique */}
              {currentQ.is_dealbreaker && (
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
                      <Zap className="w-5 h-5 text-red-600 mr-2" />
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
                <h2 className="text-2xl font-semibold text-gray-800 leading-relaxed">
                  {currentQ.text}
                </h2>
              </motion.div>

              {/* Réponses avec animations */}
              <motion.div 
                className="space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                {currentQ.category === 'bool' ? (
                  // Questions Oui/Non
                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      animate={selectedAnswer === true ? "selected" : "rest"}
                    >
                      <Button
                        onClick={() => handleResponse(true)}
                        disabled={isSubmitting}
                        className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 border-2 border-green-200 hover:border-green-300 transition-all duration-300"
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
                      variants={buttonVariants}
                      initial="rest"
                      whileHover="hover"
                      whileTap="tap"
                      animate={selectedAnswer === false ? "selected" : "rest"}
                    >
                      <Button
                        onClick={() => handleResponse(false)}
                        disabled={isSubmitting}
                        className="w-full h-16 text-lg font-semibold bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 text-red-700 border-2 border-red-200 hover:border-red-300 transition-all duration-300"
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
                  // Questions à échelle 1-5
                  <div className="space-y-3">
                    <p className="text-center text-gray-600 mb-6 text-lg">
                      Évaluez l'importance sur une échelle de 1 à 5
                    </p>
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <motion.div
                          key={value}
                          variants={buttonVariants}
                          initial="rest"
                          whileHover="hover"
                          whileTap="tap"
                          animate={selectedAnswer === value ? "selected" : "rest"}
                        >
                          <Button
                            onClick={() => handleResponse(value)}
                            disabled={isSubmitting}
                            className={`w-full h-14 text-left justify-start text-lg border-2 transition-all duration-300 ${
                              selectedAnswer === value 
                                ? 'bg-blue-600 hover:bg-blue-700 text-white border-blue-600' 
                                : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                            }`}
                            variant="outline"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold ${
                                selectedAnswer === value 
                                  ? 'bg-white text-blue-600 border-white' 
                                  : 'border-current'
                              }`}>
                                {value}
                              </div>
                              <div className="flex items-center space-x-2">
                                {[...Array(value)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-5 h-5 ${
                                      selectedAnswer === value 
                                        ? 'text-yellow-300 fill-yellow-300' 
                                        : 'text-blue-400 fill-blue-400'
                                    }`} 
                                  />
                                ))}
                              </div>
                              <span className="flex-1">
                                {value === 1 ? 'Pas du tout important' : 
                                 value === 2 ? 'Peu important' :
                                 value === 3 ? 'Moyennement important' :
                                 value === 4 ? 'Important' : 
                                 'Très important'}
                              </span>
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
                  className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Précédent
                </Button>

                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>Question {currentQuestion + 1} / {questions.length}</span>
                </div>

                {/* Prochaine question auto (optionnel) */}
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
                animate={actualIndex === currentQuestion ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.5, repeat: actualIndex === currentQuestion ? Infinity : 0, repeatDelay: 2 }}
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
