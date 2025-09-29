'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { useAnalytics } from '@/hooks/useAnalytics'
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
  Home,
  Save,
  RotateCcw
} from 'lucide-react'

interface Question {
  id: number
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

interface PaginatedQuestionnaireProps {
  questions: Question[]
  onComplete: (responses: {[key: number]: boolean | number}) => void
  savedResponses?: {[key: number]: boolean | number}
}

const QUESTIONS_PER_PAGE = 20

export default function PaginatedQuestionnaire({ 
  questions, 
  onComplete, 
  savedResponses = {} 
}: PaginatedQuestionnaireProps) {
  const router = useRouter()
  const { trackEvent } = useAnalytics()
  
  const [currentPage, setCurrentPage] = useState(0)
  const [responses, setResponses] = useState<{[key: number]: boolean | number}>(savedResponses)
  const [direction, setDirection] = useState(0)
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)

  // Calculer le nombre total de pages
  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE)
  
  // Obtenir les questions de la page actuelle
  const getCurrentPageQuestions = () => {
    const start = currentPage * QUESTIONS_PER_PAGE
    const end = start + QUESTIONS_PER_PAGE
    return questions.slice(start, end)
  }

  // Calculer le progrès global
  const getOverallProgress = () => {
    const totalAnswered = Object.keys(responses).length
    return Math.round((totalAnswered / questions.length) * 100)
  }

  // Calculer le progrès de la page actuelle
  const getCurrentPageProgress = () => {
    const currentQuestions = getCurrentPageQuestions()
    const answeredInPage = currentQuestions.filter(q => responses[q.id] !== undefined).length
    return Math.round((answeredInPage / currentQuestions.length) * 100)
  }

  // Vérifier si toutes les questions de la page sont répondues
  const isCurrentPageComplete = () => {
    const currentQuestions = getCurrentPageQuestions()
    return currentQuestions.every(q => responses[q.id] !== undefined)
  }

  // Vérifier si le questionnaire est entièrement terminé
  const isQuestionnaireComplete = () => {
    return questions.every(q => responses[q.id] !== undefined)
  }

  // Sauvegarde automatique
  useEffect(() => {
    if (autoSaveEnabled && Object.keys(responses).length > 0) {
      const saveData = {
        responses,
        currentPage,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('nikahscore-paginated-responses', JSON.stringify(saveData))
      console.log('💾 Sauvegarde automatique:', Object.keys(responses).length, 'réponses')
    }
  }, [responses, currentPage, autoSaveEnabled])

  // Charger la sauvegarde au démarrage
  useEffect(() => {
    const saved = localStorage.getItem('nikahscore-paginated-responses')
    if (saved) {
      try {
        const data = JSON.parse(saved)
        setResponses(prev => ({ ...prev, ...data.responses }))
        setCurrentPage(data.currentPage || 0)
        console.log('📂 Sauvegarde restaurée:', Object.keys(data.responses).length, 'réponses')
      } catch (e) {
        console.error('❌ Erreur chargement sauvegarde:', e)
      }
    }
  }, [])

  // Gérer les réponses
  const handleResponse = (questionId: number, value: boolean | number) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))

    // Analytics
    trackEvent('question_answered', {
      question_id: questionId,
      page: currentPage + 1,
      total_pages: totalPages,
      progress: getOverallProgress()
    })
  }

  // Navigation entre pages
  const goToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setDirection(pageIndex > currentPage ? 1 : -1)
      setCurrentPage(pageIndex)
      
      // Analytics
      trackEvent('questionnaire_page_change', {
        from_page: currentPage + 1,
        to_page: pageIndex + 1,
        total_pages: totalPages,
        progress: getOverallProgress()
      })
    }
  }

  // Page suivante
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1)
    } else if (isQuestionnaireComplete()) {
      handleComplete()
    }
  }

  // Page précédente
  const previousPage = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1)
    }
  }

  // Terminer le questionnaire
  const handleComplete = () => {
    trackEvent('questionnaire_completed', {
      total_questions: questions.length,
      total_pages: totalPages,
      completion_time: Date.now()
    })
    
    onComplete(responses)
  }

  // Reset du questionnaire
  const resetQuestionnaire = () => {
    setResponses({})
    setCurrentPage(0)
    localStorage.removeItem('nikahscore-paginated-responses')
    
    trackEvent('questionnaire_reset', {
      page: currentPage + 1,
      progress: getOverallProgress()
    })
  }

  // Obtenir l'icône de la dimension
  const getDimensionIcon = (axis: string) => {
    const icons: { [key: string]: any } = {
      'Spiritualité': <Star className="w-5 h-5" />,
      'Personnalité': <Heart className="w-5 h-5" />,
      'Communication': <Sparkles className="w-5 h-5" />,
      'Famille': <Home className="w-5 h-5" />,
      'Style de vie': <Target className="w-5 h-5" />,
      'Ambitions': <Award className="w-5 h-5" />
    }
    return icons[axis] || <Circle className="w-5 h-5" />
  }

  // Animation variants
  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    })
  }

  const currentQuestions = getCurrentPageQuestions()
  const overallProgress = getOverallProgress()
  const currentPageProgress = getCurrentPageProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto p-4 py-8">
        
        {/* Header avec progrès */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={() => router.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour
            </Button>
            
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                Sauvegarde auto
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={resetQuestionnaire}
                className="text-red-600 hover:text-red-700"
              >
                <RotateCcw className="w-4 h-4 mr-1" />
                Reset
              </Button>
            </div>
          </div>

          {/* Progrès global */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-2xl font-bold text-gray-900">
                  Questionnaire de Personnalité
                </h1>
                <span className="text-lg font-semibold text-pink-600">
                  {Object.keys(responses).length} / {questions.length}
                </span>
              </div>
              <Progress value={overallProgress} className="h-3 mb-2" />
              <p className="text-sm text-gray-600">
                Progrès global : {overallProgress}% • Page {currentPage + 1} sur {totalPages}
              </p>
            </div>

            {/* Progrès de la page actuelle */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">
                  Page actuelle
                </span>
                <span className="text-sm text-pink-600">
                  {currentQuestions.filter(q => responses[q.id] !== undefined).length} / {currentQuestions.length}
                </span>
              </div>
              <Progress value={currentPageProgress} className="h-2" />
            </div>
          </div>
        </div>

        {/* Navigation par pages */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={currentPage === i ? "default" : "outline"}
              size="sm"
              onClick={() => goToPage(i)}
              className="w-10 h-10 p-0"
            >
              {i + 1}
            </Button>
          ))}
        </div>

        {/* Questions de la page actuelle */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getDimensionIcon(currentQuestions[0]?.axis)}
                  Page {currentPage + 1} - {currentQuestions[0]?.axis}
                  <Badge variant="secondary">
                    {currentQuestions.length} questions
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {currentQuestions.map((question, index) => {
                  const isAnswered = responses[question.id] !== undefined
                  const currentValue = responses[question.id]

                  return (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        isAnswered 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 hover:border-pink-200'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-4">
                        {isAnswered ? (
                          <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium text-gray-500">
                              Q{(currentPage * QUESTIONS_PER_PAGE) + index + 1}
                            </span>
                            {question.is_dealbreaker && (
                              <Badge variant="destructive" className="text-xs">
                                Important
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-lg text-gray-800 font-medium mb-4">
                            {question.text}
                          </p>

                          {/* Options de réponse */}
                          {question.category === 'bool' ? (
                            <div className="flex gap-3">
                              <Button
                                variant={currentValue === true ? "default" : "outline"}
                                onClick={() => handleResponse(question.id, true)}
                                className="flex-1"
                              >
                                Oui
                              </Button>
                              <Button
                                variant={currentValue === false ? "default" : "outline"}
                                onClick={() => handleResponse(question.id, false)}
                                className="flex-1"
                              >
                                Non
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-600 mb-2">
                                <span>Pas du tout d'accord</span>
                                <span>Tout à fait d'accord</span>
                              </div>
                              <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((value) => (
                                  <Button
                                    key={value}
                                    variant={currentValue === value ? "default" : "outline"}
                                    onClick={() => handleResponse(question.id, value)}
                                    className="flex-1 aspect-square p-0"
                                  >
                                    {value}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            onClick={previousPage}
            disabled={currentPage === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Précédent
          </Button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Page {currentPage + 1} sur {totalPages}
            </p>
            {!isCurrentPageComplete() && (
              <p className="text-xs text-orange-600 mt-1">
                Complétez cette page pour continuer
              </p>
            )}
          </div>

          {currentPage === totalPages - 1 ? (
            <Button
              onClick={handleComplete}
              disabled={!isQuestionnaireComplete()}
              className="bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Terminer
            </Button>
          ) : (
            <Button
              onClick={nextPage}
              disabled={!isCurrentPageComplete()}
            >
              Suivant
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Résumé des réponses par dimension */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Résumé par Dimension</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['Spiritualité', 'Personnalité', 'Communication', 'Famille', 'Style de vie', 'Ambitions'].map(dimension => {
                const dimensionQuestions = questions.filter(q => q.axis === dimension)
                const answeredInDimension = dimensionQuestions.filter(q => responses[q.id] !== undefined).length
                const progress = Math.round((answeredInDimension / dimensionQuestions.length) * 100)

                return (
                  <div key={dimension} className="text-center p-3 border rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {getDimensionIcon(dimension)}
                      <span className="text-sm font-medium">{dimension}</span>
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {answeredInDimension} / {dimensionQuestions.length}
                    </div>
                    <Progress value={progress} className="h-1" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}