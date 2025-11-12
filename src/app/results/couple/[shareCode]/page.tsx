'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, CheckCircle, AlertCircle, TrendingUp, MessageCircle, BookOpen, Calendar } from 'lucide-react'
import FeatureGate from '@/components/premium/FeatureGate'
import CoupleRadarChart from '@/components/couple/CoupleRadarChart'
import QuestionComparison from '@/components/couple/QuestionComparison'
import CoupleStatistics from '@/components/couple/CoupleStatistics'

interface CoupleResultsPageProps {
  params: Promise<{ shareCode: string }>
}

interface SharedQuestionnaire {
  id: string
  share_code: string
  creator_id: string
  partner_name: string | null
  status: string
  creator_questionnaire_id: string | null
  partner_questionnaire_id: string | null
}

interface Question {
  id: string
  text: string
  category: string
  type: 'boolean' | 'scale'
  axis: string
  order_index: number
}

interface Response {
  questionId: string
  value: boolean | number
}

interface CategoryScore {
  category: string
  score: number
}

export default function CoupleResultsPage({ params }: CoupleResultsPageProps) {
  const router = useRouter()
  const [shareCode, setShareCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sharedData, setSharedData] = useState<SharedQuestionnaire | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState<string>('Partenaire 1')
  const [partnerName, setPartnerName] = useState<string>('Partenaire 2')
  const [questions, setQuestions] = useState<Question[]>([])
  const [creatorResponses, setCreatorResponses] = useState<Response[]>([])
  const [partnerResponses, setPartnerResponses] = useState<Response[]>([])
  const [creatorScores, setCreatorScores] = useState<CategoryScore[]>([])
  const [partnerScores, setPartnerScores] = useState<CategoryScore[]>([])
  const [overallScore, setOverallScore] = useState<number>(0)

  useEffect(() => {
    params.then(p => setShareCode(p.shareCode))
  }, [params])

  useEffect(() => {
    if (!shareCode) return

    const loadCoupleResults = async () => {
      try {
        const supabase = createClient()

        // 1. Charger les données du questionnaire partagé
        const { data, error: fetchError } = await supabase
          .from('shared_questionnaires')
          .select('*')
          .eq('share_code', shareCode)
          .single()

        if (fetchError || !data) {
          setError('Code invalide ou expiré')
          return
        }

        // Vérifier que les 2 ont complété
        if (!data.creator_questionnaire_id || !data.partner_questionnaire_id) {
          setError('Les deux partenaires doivent avoir complété le questionnaire')
          return
        }

        // Vérifier expiration
        if (new Date(data.expires_at) < new Date()) {
          setError('Ce lien a expiré')
          return
        }

        setSharedData(data as SharedQuestionnaire)

        // 2. Charger les noms
        const { data: creatorUser } = await supabase
          .from('users')
          .select('display_name, email')
          .eq('id', data.creator_id)
          .single()

        if (creatorUser) {
          setCreatorName(creatorUser.display_name || creatorUser.email?.split('@')[0] || 'Partenaire 1')
        }

        if (data.partner_name) {
          setPartnerName(data.partner_name)
        }

        // 3. Charger toutes les questions
        const { data: questionsData, error: questionsError } = await supabase
          .from('questions')
          .select('*')
          .order('order_index')

        if (questionsError || !questionsData) {
          setError('Erreur lors du chargement des questions')
          return
        }

        const formattedQuestions: Question[] = questionsData.map(q => ({
          id: q.id,
          text: q.text,
          category: q.axis,
          type: q.response_type === 'boolean' ? 'boolean' : 'scale',
          axis: q.axis,
          order_index: q.order_index
        }))
        setQuestions(formattedQuestions)

        // 4. Charger les réponses du créateur
        const { data: creatorResponsesData, error: creatorResponsesError } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response_value')
          .eq('questionnaire_id', data.creator_questionnaire_id)

        if (creatorResponsesError) {
          console.error('Error loading creator responses:', creatorResponsesError)
        } else {
          const formattedCreatorResponses: Response[] = creatorResponsesData.map(r => ({
            questionId: r.question_id,
            value: r.response_value
          }))
          setCreatorResponses(formattedCreatorResponses)
        }

        // 5. Charger les réponses du partenaire
        const { data: partnerResponsesData, error: partnerResponsesError } = await supabase
          .from('questionnaire_responses')
          .select('question_id, response_value')
          .eq('questionnaire_id', data.partner_questionnaire_id)

        if (partnerResponsesError) {
          console.error('Error loading partner responses:', partnerResponsesError)
        } else {
          const formattedPartnerResponses: Response[] = partnerResponsesData.map(r => ({
            questionId: r.question_id,
            value: r.response_value
          }))
          setPartnerResponses(formattedPartnerResponses)
        }

        // 6. Calculer les scores par catégorie
        const categories = [...new Set(formattedQuestions.map(q => q.category))]
        
        const creatorCategoryScores: CategoryScore[] = categories.map(category => {
          const categoryQuestions = formattedQuestions.filter(q => q.category === category)
          let totalScore = 0
          let maxScore = 0

          categoryQuestions.forEach(q => {
            const response = creatorResponsesData?.find(r => r.question_id === q.id)
            if (response) {
              if (q.type === 'boolean') {
                totalScore += response.response_value ? 100 : 0
                maxScore += 100
              } else {
                totalScore += (response.response_value as number) * 20
                maxScore += 100
              }
            }
          })

          return {
            category,
            score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
          }
        })
        setCreatorScores(creatorCategoryScores)

        const partnerCategoryScores: CategoryScore[] = categories.map(category => {
          const categoryQuestions = formattedQuestions.filter(q => q.category === category)
          let totalScore = 0
          let maxScore = 0

          categoryQuestions.forEach(q => {
            const response = partnerResponsesData?.find(r => r.question_id === q.id)
            if (response) {
              if (q.type === 'boolean') {
                totalScore += response.response_value ? 100 : 0
                maxScore += 100
              } else {
                totalScore += (response.response_value as number) * 20
                maxScore += 100
              }
            }
          })

          return {
            category,
            score: maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0
          }
        })
        setPartnerScores(partnerCategoryScores)

        // 7. Calculer le score de compatibilité global
        let agreements = 0
        formattedQuestions.forEach(q => {
          const creatorResp = creatorResponsesData?.find(r => r.question_id === q.id)
          const partnerResp = partnerResponsesData?.find(r => r.question_id === q.id)
          
          if (creatorResp && partnerResp) {
            if (q.type === 'boolean') {
              if (creatorResp.response_value === partnerResp.response_value) agreements++
            } else {
              const diff = Math.abs((creatorResp.response_value as number) - (partnerResp.response_value as number))
              if (diff <= 1) agreements += 1
              else if (diff <= 3) agreements += 0.5
            }
          }
        })
        
        const compatibilityScore = Math.round((agreements / formattedQuestions.length) * 100)
        setOverallScore(compatibilityScore)

      } catch (err) {
        console.error('Error loading couple results:', err)
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    loadCoupleResults()
  }, [shareCode])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !sharedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Erreur
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
              {error}
            </div>
            <Button 
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Retour à l'accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* En-tête */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full mb-4">
              <Heart className="h-10 w-10 text-purple-600" />
            </div>
            
            <h1 className="text-4xl font-bold text-gray-900">
              Résultats de Compatibilité Couple
            </h1>
            
            <div className="flex items-center justify-center gap-3 text-xl">
              <span className="font-semibold text-purple-700">{creatorName}</span>
              <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />
              <span className="font-semibold text-purple-700">{partnerName}</span>
            </div>

            <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-2xl font-bold">
              Score global : {overallScore}%
            </div>
          </div>

          {/* Section 1 : Vue d'ensemble avec Feature Gate */}
          <FeatureGate featureCode="couple_results_comparison">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Vue d'ensemble de votre compatibilité
                </CardTitle>
                <CardDescription>
                  Visualisation graphique de vos scores par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Graphique Radar Comparatif */}
                {creatorScores.length > 0 && partnerScores.length > 0 && (
                  <CoupleRadarChart
                    creatorName={creatorName}
                    partnerName={partnerName}
                    creatorScores={creatorScores}
                    partnerScores={partnerScores}
                  />
                )}
              </CardContent>
            </Card>
          </FeatureGate>

          {/* Section 2 : Statistiques détaillées */}
          <FeatureGate featureCode="couple_results_comparison">
            {questions.length > 0 && creatorResponses.length > 0 && partnerResponses.length > 0 && (
              <CoupleStatistics
                questions={questions}
                creatorResponses={creatorResponses}
                partnerResponses={partnerResponses}
              />
            )}
          </FeatureGate>

          {/* Section 3 : Comparaison détaillée par question */}
          <FeatureGate featureCode="couple_results_comparison">
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Comparaison Détaillée par Question
                </CardTitle>
                <CardDescription>
                  Vos réponses côte à côte pour chaque question
                </CardDescription>
              </CardHeader>
              <CardContent>
                {questions.length > 0 && creatorResponses.length > 0 && partnerResponses.length > 0 ? (
                  <QuestionComparison
                    questions={questions}
                    creatorName={creatorName}
                    partnerName={partnerName}
                    creatorResponses={creatorResponses}
                    partnerResponses={partnerResponses}
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-center">Chargement des réponses...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </FeatureGate>

          {/* Section 5 : Recommandations */}
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-600" />
                Nos Conseils pour Votre Couple
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Sujets de conversation */}
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Sujets de Conversation Recommandés
                </h4>
                <ul className="space-y-2 ml-6 list-disc text-gray-700">
                  <li>Comment gérer les finances du couple au quotidien ?</li>
                  <li>Quel type de logement souhaitez-vous et où ?</li>
                  <li>Comment répartir les tâches domestiques équitablement ?</li>
                  <li>Quelle place pour les belles-familles dans votre vie ?</li>
                </ul>
              </div>

              {/* Bouton Consultation (Conseil uniquement) */}
              <FeatureGate featureCode="dedicated_support">
                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-4">
                    <Calendar className="h-8 w-8 text-purple-600 shrink-0" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-purple-900 mb-2">
                        Session Conseil Personnalisée
                      </h4>
                      <p className="text-sm text-purple-700 mb-3">
                        Réservez une consultation avec un conseiller matrimonial spécialisé pour approfondir vos résultats
                      </p>
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Réserver une Consultation
                      </Button>
                    </div>
                  </div>
                </div>
              </FeatureGate>

            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-center gap-4">
            <Button variant="outline" onClick={() => router.push('/dashboard')}>
              Retour au Dashboard
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Télécharger le Rapport PDF
            </Button>
          </div>

        </div>
      </div>
    </div>
  )
}
