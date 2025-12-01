'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, CheckCircle, AlertCircle, TrendingUp, MessageCircle, BookOpen, Calendar, Clock, Copy, Mail, Loader2, Download } from 'lucide-react'
import FeatureGate from '@/components/premium/FeatureGate'
import CoupleRadarChart from '@/components/couple/CoupleRadarChart'
import QuestionComparison from '@/components/couple/QuestionComparison'
import CoupleStatistics from '@/components/couple/CoupleStatistics'
import { usePDFExport } from '@/hooks/usePDFExport'

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
  const [copied, setCopied] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [sendingEmail, setSendingEmail] = useState(false)
  const { generatePDF, isGenerating, error: pdfError } = usePDFExport()

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

        // Vérifier expiration
        if (new Date(data.expires_at) < new Date()) {
          setError('Ce lien a expiré')
          return
        }

        // Vérifier que les 2 ont complété - État d'attente spécifique
        if (!data.creator_questionnaire_id || !data.partner_questionnaire_id) {
          setSharedData(data as SharedQuestionnaire)
          setLoading(false)
          // Ne pas définir d'erreur, on affichera un état d'attente
          return
        }

        setSharedData(data as SharedQuestionnaire)

        // 2. Charger les noms
        const { data: creatorUser } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', data.creator_id)
          .single()

        if (creatorUser) {
          setCreatorName(creatorUser.name || creatorUser.email?.split('@')[0] || 'Partenaire 1')
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

  const handleExportPDF = async () => {
    if (!sharedData) return

    // Générer le PDF à partir du contenu visible
    const filename = `nikahscore-couple-${creatorName}-${partnerName}-${new Date().toISOString().split('T')[0]}.pdf`
    const success = await generatePDF('couple-results-content', { filename })

    if (success) {
    } else {
      console.error('❌ Erreur lors de la génération du PDF')
    }
  }

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

  // État d'attente si le partenaire n'a pas encore complété
  if (sharedData && (!sharedData.creator_questionnaire_id || !sharedData.partner_questionnaire_id)) {
    const shareUrl = `${window.location.origin}/questionnaire/shared/${shareCode}`
    
    const handleCopyLink = () => {
      navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    const handleSendReminder = async () => {
      if (!sharedData.partner_name) return
      
      setSendingEmail(true)
      try {
        const response = await fetch('/api/questionnaire/shared/send-link', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: sharedData.partner_name, // Assuming partner_name contains email
            shareCode: shareCode
          })
        })
        
        if (response.ok) {
          setEmailSent(true)
          setTimeout(() => setEmailSent(false), 3000)
        }
      } catch (error) {
        console.error('Error sending reminder:', error)
      } finally {
        setSendingEmail(false)
      }
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full shadow-2xl">
          <CardHeader className="text-center pb-4">
            {/* Badge animé */}
            <div className="flex justify-center mb-4">
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 text-lg animate-pulse">
                <Clock className="w-5 h-5 mr-2 inline animate-spin" />
                En attente
              </Badge>
            </div>
            
            {/* Animation de coeurs */}
            <div className="flex justify-center items-center gap-4 mb-6">
              <div className="relative">
                <Heart className="w-16 h-16 md:w-20 md:h-20 text-purple-400 fill-purple-200 animate-pulse" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 text-purple-600 animate-spin" />
                </div>
              </div>
            </div>

            <CardTitle className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Patience, les résultats arrivent bientôt ! 💫
            </CardTitle>
            
            <CardDescription className="text-base md:text-lg text-gray-600">
              Votre partenaire n'a pas encore terminé le questionnaire
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Message encourageant */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800 text-lg">Que se passe-t-il maintenant ?</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Vous avez complété votre partie du questionnaire avec succès ! 🎉
                    <br />
                    Dès que votre partenaire aura également terminé, vous pourrez découvrir vos résultats de compatibilité détaillés.
                  </p>
                </div>
              </div>
            </div>

            {/* Partage du lien */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                Partagez le questionnaire
              </h3>
              
              <p className="text-sm text-gray-600">
                Envoyez ce lien à votre partenaire pour qu'il puisse compléter sa partie :
              </p>
              
              {/* Lien à copier */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 text-sm text-gray-700 font-mono overflow-x-auto">
                  {shareUrl}
                </div>
                <Button
                  onClick={handleCopyLink}
                  variant={copied ? "default" : "outline"}
                  className={`whitespace-nowrap ${copied ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Copié !
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copier
                    </>
                  )}
                </Button>
              </div>

              {/* Bouton email de rappel */}
              {sharedData.partner_name && (
                <Button
                  onClick={handleSendReminder}
                  disabled={sendingEmail || emailSent}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {sendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Envoi...
                    </>
                  ) : emailSent ? (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Email envoyé !
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer un rappel par email
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Info supplémentaire */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">💡 Le saviez-vous ?</p>
                  <p>
                    Vous recevrez une notification automatique par email dès que votre partenaire aura terminé le questionnaire.
                  </p>
                </div>
              </div>
            </div>

            {/* Bouton retour */}
            <div className="pt-4 border-t">
              <Button 
                onClick={() => router.push('/dashboard')}
                variant="outline"
                className="w-full"
              >
                <Heart className="w-4 h-4 mr-2" />
                Retour au tableau de bord
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div id="couple-results-content" className="max-w-6xl mx-auto space-y-6">
          
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
            <FeatureGate featureCode="pdf_export">
              <Button
                className="bg-purple-600 hover:bg-purple-700"
                onClick={handleExportPDF}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération en cours...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le Rapport PDF
                  </>
                )}
              </Button>
            </FeatureGate>
          </div>

        </div>
      </div>
    </div>
  )
}
