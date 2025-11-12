'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, CheckCircle, AlertCircle, TrendingUp, MessageCircle, BookOpen, Calendar } from 'lucide-react'
import FeatureGate from '@/components/premium/FeatureGate'

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

export default function CoupleResultsPage({ params }: CoupleResultsPageProps) {
  const router = useRouter()
  const [shareCode, setShareCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sharedData, setSharedData] = useState<SharedQuestionnaire | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [creatorName, setCreatorName] = useState<string>('Partenaire 1')
  const [partnerName, setPartnerName] = useState<string>('Partenaire 2')

  useEffect(() => {
    params.then(p => setShareCode(p.shareCode))
  }, [params])

  useEffect(() => {
    if (!shareCode) return

    const loadCoupleResults = async () => {
      try {
        const supabase = createClient()

        // Charger les données du questionnaire partagé
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

        // Charger les noms
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

  // Mock data pour démonstration (à remplacer par vraies données)
  const overallScore = 78
  const agreementStats = {
    perfectMatch: 35,
    minorDifference: 12,
    majorDifference: 3,
    total: 50
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
                {/* TODO: Ajouter CoupleRadarChart ici */}
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Graphique radar comparatif (à implémenter)</p>
                </div>

                {/* Statistiques d'accord */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="text-3xl font-bold text-green-700">
                      {agreementStats.perfectMatch}
                    </div>
                    <div className="text-sm text-green-600">
                      Points d'accord ({Math.round(agreementStats.perfectMatch / agreementStats.total * 100)}%)
                    </div>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="text-3xl font-bold text-yellow-700">
                      {agreementStats.minorDifference}
                    </div>
                    <div className="text-sm text-yellow-600">
                      Différences mineures ({Math.round(agreementStats.minorDifference / agreementStats.total * 100)}%)
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="text-3xl font-bold text-red-700">
                      {agreementStats.majorDifference}
                    </div>
                    <div className="text-sm text-red-600">
                      Désaccords majeurs ({Math.round(agreementStats.majorDifference / agreementStats.total * 100)}%)
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FeatureGate>

          {/* Section 2 : Comparaison détaillée */}
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
                {/* TODO: Ajouter QuestionComparison ici */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-gray-500 text-center">
                      Comparaison détaillée des réponses (à implémenter)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </FeatureGate>

          {/* Section 3 : Points forts */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Vos Forces en Commun
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Vous êtes alignés sur vos valeurs religieuses (95%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Vous partagez la même vision du rôle parental (92%)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <span>Vous avez des objectifs financiers similaires (88%)</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 4 : Points d'attention */}
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <AlertCircle className="h-5 w-5" />
                Sujets à Approfondir Ensemble
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    1. Vision du mariage (traditionnel vs moderne)
                  </h4>
                  <p className="text-sm text-orange-700 flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    Discutez de vos attentes concrètes sur les cérémonies et traditions
                  </p>
                </div>
                
                <div className="p-4 bg-white rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2">
                    2. Gestion des conflits (méthodes différentes)
                  </h4>
                  <p className="text-sm text-orange-700 flex items-start gap-2">
                    <MessageCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    Essayez de comprendre le style de communication de l'autre
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

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
