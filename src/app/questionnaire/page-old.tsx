'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Loader2, AlertTriangle, Check, X } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { Question, QuestionAnswer, SaveAnswerPayload } from '@/types/questionnaire'
import { debounce } from 'lodash'

// Schéma de validation pour une réponse
const AnswerSchema = z.object({
  value: z.union([z.number(), z.boolean()]),
  importance: z.number().min(1).max(3).optional()
})

// Schéma pour toutes les réponses
const QuestionsFormSchema = z.record(AnswerSchema)

type FormData = z.infer<typeof QuestionsFormSchema>

export default function QuestionnairePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Paramètres URL requis
  const pairId = searchParams.get('pair')
  const who = searchParams.get('who') as 'A' | 'B' | null

  // États
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  
  // Hook Form
  const { 
    register, 
    watch, 
    setValue, 
    getValues, 
    formState: { errors } 
  } = useForm<FormData>({
    resolver: zodResolver(QuestionsFormSchema),
    mode: 'onChange'
  })

  // Surveiller les changements pour l'autosave
  const watchedValues = watch()

  // Validation des paramètres
  useEffect(() => {
    if (!pairId || !who || (who !== 'A' && who !== 'B')) {
      toast({
        title: "Paramètres manquants",
        description: "URL invalide. Redirection vers l'accueil.",
        variant: "destructive"
      })
      router.push('/')
      return
    }
  }, [pairId, who, router])

  // Charger les questions
  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/questions')
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors du chargement des questions')
      }

      if (data.questions.length !== 60) {
        throw new Error(`Questions incomplètes: ${data.questions.length}/60`)
      }

      setQuestions(data.questions)
    } catch (error) {
      console.error('Erreur chargement questions:', error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les questions.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (pairId && who) {
      loadQuestions()
    }
  }, [pairId, who])

  // Fonction de sauvegarde avec debounce
  const saveAnswers = useCallback(async (answers: FormData) => {
    if (!pairId || !who || Object.keys(answers).length === 0) return

    try {
      setIsSaving(true)

      // Convertir le format des réponses
      const answerPayloads: SaveAnswerPayload[] = Object.entries(answers).map(([questionId, answer]) => ({
        pair_id: pairId,
        question_id: questionId,
        respondent: who,
        value: answer.value,
        importance: answer.importance || 1
      }))

      const response = await fetch('/api/answers/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: answerPayloads })
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erreur lors de la sauvegarde')
      }

      setLastSaved(new Date())

    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      toast({
        title: "Erreur de sauvegarde",
        description: "Vos réponses n'ont pas pu être sauvegardées.",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }, [pairId, who])

  // Debounced save (800ms comme spécifié)
  const debouncedSave = useCallback(
    debounce((answers: FormData) => saveAnswers(answers), 800),
    [saveAnswers]
  )

  // Déclencher l'autosave quand les valeurs changent
  useEffect(() => {
    const answers = getValues()
    if (Object.keys(answers).length > 0) {
      debouncedSave(answers)
    }
  }, [watchedValues, debouncedSave, getValues])

  // Gestion des réponses aux questions bool
  const handleBoolAnswer = (questionId: string, value: boolean) => {
    setValue(questionId, { value, importance: 1 })
  }

  // Gestion des réponses aux questions scale
  const handleScaleAnswer = (questionId: string, value: number, importance?: number) => {
    setValue(questionId, { value, importance: importance || 1 })
  }

  // Navigation
  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // Calculer le progrès
  const answeredCount = Object.keys(watchedValues).length
  const progressPercentage = questions.length > 0 ? (answeredCount / questions.length) * 100 : 0

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600 mb-4" />
            <p className="text-gray-600">Chargement du questionnaire...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="mx-auto h-8 w-8 text-red-600 mb-4" />
            <p className="text-red-600 mb-4">Erreur lors du chargement des questions</p>
            <Button onClick={() => router.push('/')} variant="outline">
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const currentAnswer = watchedValues[currentQuestion.id]

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Test de compatibilité - Participant {who}
              </h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} sur {questions.length}
              </p>
            </div>
            
            <div className="text-right">
              {isSaving && (
                <div className="flex items-center text-blue-600 text-sm mb-2">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Sauvegarde...
                </div>
              )}
              {lastSaved && !isSaving && (
                <div className="flex items-center text-green-600 text-sm mb-2">
                  <Check className="h-4 w-4 mr-1" />
                  Sauvegardé {lastSaved.toLocaleTimeString()}
                </div>
              )}
              <p className="text-sm text-gray-600">
                {answeredCount}/{questions.length} réponses
              </p>
            </div>
          </div>
          
          <Progress value={progressPercentage} className="h-3" />
        </div>

        {/* Question actuelle */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">
                  {currentQuestion.label}
                </CardTitle>
                <CardDescription>
                  Axe : {currentQuestion.axis}
                </CardDescription>
              </div>
              
              <div className="flex gap-2">
                {currentQuestion.is_dealbreaker && (
                  <Badge variant="destructive">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Deal-breaker
                  </Badge>
                )}
                <Badge variant="outline">
                  {currentQuestion.type === 'bool' ? 'Oui/Non' : 'Échelle 1-5'}
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            {currentQuestion.type === 'bool' ? (
              // Question booléenne
              <div className="flex gap-4">
                <Button
                  onClick={() => handleBoolAnswer(currentQuestion.id, true)}
                  variant={currentAnswer?.value === true ? 'default' : 'outline'}
                  size="lg"
                  className="flex-1"
                >
                  <Check className="h-5 w-5 mr-2" />
                  Oui
                </Button>
                <Button
                  onClick={() => handleBoolAnswer(currentQuestion.id, false)}
                  variant={currentAnswer?.value === false ? 'default' : 'outline'}
                  size="lg"
                  className="flex-1"
                >
                  <X className="h-5 w-5 mr-2" />
                  Non
                </Button>
              </div>
            ) : (
              // Question échelle
              <div className="space-y-6">
                <RadioGroup
                  value={currentAnswer?.value?.toString() || ''}
                  onValueChange={(value: string) => handleScaleAnswer(currentQuestion.id, parseInt(value))}
                >
                  <div className="grid grid-cols-5 gap-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <div key={value} className="flex items-center space-x-2 justify-center">
                        <RadioGroupItem value={value.toString()} id={`q${currentQuestion.id}-${value}`} />
                        <Label 
                          htmlFor={`q${currentQuestion.id}-${value}`}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {value}
                        </Label>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Pas du tout d'accord</span>
                    <span>Tout à fait d'accord</span>
                  </div>
                </RadioGroup>

                {/* Importance pour les questions scale */}
                {currentAnswer?.value && (
                  <div className="border-t pt-4">
                    <Label className="text-sm font-medium mb-3 block">
                      Importance de cette question pour vous :
                    </Label>
                    <RadioGroup
                      value={currentAnswer?.importance?.toString() || '1'}
                      onValueChange={(importance: string) => 
                        handleScaleAnswer(
                          currentQuestion.id, 
                          currentAnswer.value as number, 
                          parseInt(importance)
                        )
                      }
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 1, label: 'Peu important' },
                          { value: 2, label: 'Important' },
                          { value: 3, label: 'Très important' }
                        ].map(({ value, label }) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value.toString()} id={`imp-${value}`} />
                            <Label htmlFor={`imp-${value}`} className="text-sm cursor-pointer">
                              {label}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button
            onClick={goToPrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            ← Précédent
          </Button>

          <div className="flex gap-2">
            {questions.slice(Math.max(0, currentQuestionIndex - 2), currentQuestionIndex + 3).map((q, idx) => {
              const actualIndex = Math.max(0, currentQuestionIndex - 2) + idx
              const isAnswered = watchedValues[q.id]
              return (
                <Button
                  key={q.id}
                  onClick={() => goToQuestion(actualIndex)}
                  variant={actualIndex === currentQuestionIndex ? 'default' : 'outline'}
                  size="sm"
                  className={isAnswered ? 'ring-2 ring-green-500' : ''}
                >
                  {actualIndex + 1}
                </Button>
              )
            })}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button
              onClick={() => {
                toast({
                  title: "Questionnaire terminé !",
                  description: "Vos réponses ont été sauvegardées.",
                })
                router.push(`/status/${pairId}`)
              }}
              disabled={answeredCount < questions.length}
              className="bg-green-600 hover:bg-green-700"
            >
              Terminer
            </Button>
          ) : (
            <Button
              onClick={goToNext}
              disabled={currentQuestionIndex === questions.length - 1}
            >
              Suivant →
            </Button>
          )}
        </div>

        {/* Récapitulatif du progrès */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>
            Progression : {Math.round(progressPercentage)}% • 
            Questions deal-breaker répondues : {
              questions.filter(q => q.is_dealbreaker && watchedValues[q.id]).length
            }/{questions.filter(q => q.is_dealbreaker).length}
          </p>
        </div>
      </div>
    </div>
  )
}
