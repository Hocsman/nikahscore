'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Loader2, AlertTriangle, Check, X } from 'lucide-react'
import { debounce } from 'lodash'

interface Question {
  id: string
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

type FormValues = Record<string, number | boolean | null>

export default function QuestionnairePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Paramètres URL
  const pair = searchParams.get('pair')
  const who = searchParams.get('who') || 'A'
  
  // États
  const [questions, setQuestions] = useState<Question[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  
  // React Hook Form
  const { register, watch, setValue, getValues, formState } = useForm<FormValues>({
    defaultValues: {}
  })

  const watchedValues = watch()

  // Validation pair obligatoire
  useEffect(() => {
    if (!pair) {
      return // L'alerte sera affichée dans le render
    }
  }, [pair])

  // Charger les questions au mount
  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/questions', { cache: 'no-store' })
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors du chargement des questions')
      }

      // Trier par order_index
      const sortedQuestions = data.questions.sort((a: Question, b: Question) => 
        a.order_index - b.order_index
      )
      
      setQuestions(sortedQuestions)
      
      // Initialiser tous les champs à null
      const defaultValues: FormValues = {}
      sortedQuestions.forEach((q: Question) => {
        defaultValues[q.id] = null
      })
      
      // Définir les valeurs par défaut
      Object.keys(defaultValues).forEach(key => {
        setValue(key, null)
      })
      
    } catch (error) {
      console.error('Erreur chargement questions:', error)
      setSaveState('error')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadQuestions()
  }, [])

  // Fonction de sauvegarde
  const saveAnswers = async (values: FormValues) => {
    if (!pair || !who) return

    try {
      setSaveState('saving')
      
      // Ne pas envoyer les champs null
      const answers = Object.entries(values)
        .filter(([_, value]) => value !== null)
        .map(([questionId, value]) => ({
          questionId,
          value
        }))

      if (answers.length === 0) {
        setSaveState('idle')
        return
      }

      const response = await fetch('/api/answers/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pairId: pair,
          respondent: who,
          answers
        })
      })

      if (!response.ok) {
        throw new Error('Erreur sauvegarde')
      }

      setSaveState('saved')
      setTimeout(() => setSaveState('idle'), 2000)

    } catch (error) {
      console.error('Erreur sauvegarde:', error)
      setSaveState('error')
      setTimeout(() => setSaveState('idle'), 3000)
    }
  }

  // Debounce 800ms
  const debouncedSave = useCallback(
    debounce((values: FormValues) => saveAnswers(values), 800),
    [pair, who]
  )

  // Déclencher autosave sur changement
  useEffect(() => {
    debouncedSave(watchedValues)
  }, [watchedValues, debouncedSave])

  // Calculer progression
  const answeredCount = Object.values(watchedValues).filter(v => v !== null).length
  const totalQuestions = questions.length
  const progressPercent = totalQuestions > 0 ? (answeredCount / totalQuestions) * 100 : 0

  // Grouper par axe
  const questionsByAxis = questions.reduce((acc, question) => {
    if (!acc[question.axis]) {
      acc[question.axis] = []
    }
    acc[question.axis].push(question)
    return acc
  }, {} as Record<string, Question[]>)

  // Handlers
  const handleScaleClick = (questionId: string, value: number) => {
    setValue(questionId, value)
  }

  const handleBoolClick = (questionId: string, value: boolean) => {
    setValue(questionId, value)
  }

  // Render état de sauvegarde
  const renderSaveState = () => {
    switch (saveState) {
      case 'saving':
        return (
          <div className="flex items-center text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Enregistrement…
          </div>
        )
      case 'saved':
        return (
          <div className="flex items-center text-green-600">
            <Check className="h-4 w-4 mr-2" />
            Enregistré ✓
          </div>
        )
      case 'error':
        return (
          <div className="flex items-center text-red-600">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Erreur
          </div>
        )
      default:
        return null
    }
  }

  // Alerte si pair manquant
  if (!pair) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
              <AlertTriangle className="h-4 w-4 text-red-600 mr-3" />
              <p className="text-red-800">
                Paramètre 'pair' manquant dans l'URL. Veuillez utiliser un lien valide.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-600 mb-4" />
            <p className="text-gray-600">Chargement du questionnaire...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Test de compatibilité
              </h1>
              <p className="text-gray-600">
                Participant {who} • Paire: {pair}
              </p>
            </div>
            
            {/* État sauvegarde */}
            <div className="text-sm">
              {renderSaveState()}
            </div>
          </div>

          {/* Barre de progression */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{answeredCount}/{totalQuestions} réponses</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>
        </div>

        {/* Questions groupées par axe */}
        <div className="space-y-8">
          {Object.entries(questionsByAxis).map(([axis, axisQuestions]) => (
            <Card key={axis} className="overflow-hidden">
              <CardHeader className="bg-brand-50">
                <CardTitle className="text-xl text-brand-900">
                  {axis}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  {axisQuestions.map((question) => {
                    const currentValue = watchedValues[question.id]
                    
                    return (
                      <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <p className="text-lg font-medium text-gray-900 mb-2">
                              {question.text}
                            </p>
                          </div>
                          {question.is_dealbreaker && (
                            <Badge variant="destructive" className="ml-4">
                              Deal-breaker
                            </Badge>
                          )}
                        </div>

                        {question.category === 'scale' ? (
                          // Question échelle 1-5
                          <div className="grid grid-cols-5 gap-3">
                            {[1, 2, 3, 4, 5].map((value) => (
                              <Button
                                key={value}
                                onClick={() => handleScaleClick(question.id, value)}
                                variant={currentValue === value ? 'default' : 'outline'}
                                size="lg"
                                className="h-12 text-lg font-semibold"
                                aria-label={`Répondre ${value} sur 5 à la question: ${question.text}`}
                              >
                                {value}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          // Question bool
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              onClick={() => handleBoolClick(question.id, true)}
                              variant={currentValue === true ? 'default' : 'outline'}
                              size="lg"
                              className="h-12 text-lg font-semibold"
                              aria-label={`Répondre Oui à la question: ${question.text}`}
                            >
                              <Check className="h-5 w-5 mr-2" />
                              Oui
                            </Button>
                            <Button
                              onClick={() => handleBoolClick(question.id, false)}
                              variant={currentValue === false ? 'default' : 'outline'}
                              size="lg"
                              className="h-12 text-lg font-semibold"
                              aria-label={`Répondre Non à la question: ${question.text}`}
                            >
                              <X className="h-5 w-5 mr-2" />
                              Non
                            </Button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions finales */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-4">
            Progression: {answeredCount} / {totalQuestions} questions répondues
          </p>
          {answeredCount === totalQuestions && (
            <Button
              onClick={() => router.push(`/results/${pair}`)}
              size="lg"
              className="bg-green-600 hover:bg-green-700"
            >
              Voir les résultats
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
