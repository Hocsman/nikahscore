'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

  useEffect(() => {
    if (resolvedParams?.code) {
      loadSharedQuestionnaire()
    }
  }, [resolvedParams])

  const loadSharedQuestionnaire = async () => {
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