'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Heart, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'

interface InvitePageProps {
  params: Promise<{ code: string }>
}

interface SharedQuestionnaire {
  id: string
  share_code: string
  creator_id: string | null
  creator_email: string | null
  partner_email: string | null
  partner_completed_at: string | null
  compatibility_score: number | null
  status: string
  created_at: string
}

export default function InvitePage({ params }: InvitePageProps) {
  const router = useRouter()
  const [code, setCode] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [sharedData, setSharedData] = useState<SharedQuestionnaire | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    params.then(p => setCode(p.code))
  }, [params])

  useEffect(() => {
    if (!code) return

    const loadSharedQuestionnaire = async () => {
      try {
        const supabase = createClient()

        // Vérifier l'utilisateur connecté
        const { data: { user } } = await supabase.auth.getUser()
        setUserId(user?.id || null)

        // Charger les données du questionnaire partagé
        const { data, error: fetchError } = await supabase
          .from('shared_questionnaires')
          .select('*')
          .eq('share_code', code)
          .single()

        if (fetchError || !data) {
          setError('Code invalide ou expiré')
          return
        }

        // Vérifier si expiré (30 jours depuis la création)
        const createdAt = new Date(data.created_at)
        const expiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
        if (expiresAt < new Date()) {
          setError('Ce lien a expiré (validité : 30 jours)')
          await supabase
            .from('shared_questionnaires')
            .update({ status: 'expired' })
            .eq('id', data.id)
          return
        }

        setSharedData(data as SharedQuestionnaire)
      } catch (err) {
        console.error('Error loading shared questionnaire:', err)
        setError('Erreur lors du chargement')
      } finally {
        setLoading(false)
      }
    }

    loadSharedQuestionnaire()
  }, [code])

  const handleStartQuestionnaire = async () => {
    if (!sharedData) return

    // Si l'utilisateur n'est pas connecté, rediriger vers inscription
    if (!userId) {
      toast.info('Créez un compte pour répondre au questionnaire')
      router.push(`/auth/register?redirect=/questionnaire/invite/${code}`)
      return
    }

    // Si c'est le créateur lui-même
    if (userId === sharedData.creator_id) {
      toast.error('Vous ne pouvez pas répondre à votre propre questionnaire partagé')
      return
    }

    // Rediriger vers le questionnaire partagé existant
    router.push(`/questionnaire/shared/${code}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (error || !sharedData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-6 w-6" />
              Lien Invalide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg text-red-800 dark:text-red-300">
              {error}
            </div>
            <Button
              onClick={() => router.push('/')}
              className="w-full mt-4"
              variant="outline"
            >
              Retour à l&apos;accueil
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isCompleted = sharedData.status === 'completed' || !!sharedData.compatibility_score
  const partnerAlreadyAnswered = !!sharedData.partner_completed_at

  // Calculer les jours restants depuis created_at + 30 jours
  const createdAt = new Date(sharedData.created_at)
  const expiresAt = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000)
  const expiresIn = Math.ceil(
    (expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* En-tête */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <Heart className="h-8 w-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Questionnaire de Compatibilité
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez été invité(e) à répondre au questionnaire
            </p>
          </div>

          {/* Statut */}
          {isCompleted ? (
            <div className="flex items-center gap-3 p-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 border rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 shrink-0" />
              <p className="text-green-800 dark:text-green-300 text-sm">
                Les deux partenaires ont répondu ! Vous pouvez consulter vos résultats.
              </p>
            </div>
          ) : partnerAlreadyAnswered ? (
            <div className="flex items-center gap-3 p-4 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 border rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400 shrink-0" />
              <p className="text-orange-800 dark:text-orange-300 text-sm">
                Vous avez déjà répondu. En attente de la réponse du créateur.
              </p>
            </div>
          ) : null}

          {/* Carte principale */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Questionnaire Partagé
              </CardTitle>
              <CardDescription>
                Répondez aux mêmes questions pour découvrir votre compatibilité
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Info validité */}
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                <Clock className="h-4 w-4" />
                <span>
                  Lien valide encore <strong>{expiresIn} jours</strong>
                </span>
              </div>

              {/* Description */}
              <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
                <p className="font-semibold text-purple-700 dark:text-purple-400">
                  Ce qui vous attend :
                </p>
                <ul className="space-y-2 ml-4 list-disc">
                  <li>50 questions sur vos valeurs, objectifs et attentes</li>
                  <li>15-20 minutes de réponses sincères</li>
                  <li>Analyse de compatibilité détaillée</li>
                  <li>Comparaison de vos réponses</li>
                  <li>Recommandations personnalisées</li>
                </ul>
              </div>

              {/* Call to action */}
              {!partnerAlreadyAnswered ? (
                <>
                  <Button
                    onClick={handleStartQuestionnaire}
                    className="w-full bg-purple-600 hover:bg-purple-700 h-12 text-lg"
                    size="lg"
                  >
                    <Heart className="h-5 w-5 mr-2" />
                    Commencer le Questionnaire
                  </Button>

                  {!userId && (
                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                      Un compte gratuit sera créé pour sauvegarder vos réponses
                    </p>
                  )}
                </>
              ) : isCompleted ? (
                <Button
                  onClick={() => router.push(`/results/couple/${code}`)}
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  size="lg"
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Voir nos Résultats
                </Button>
              ) : (
                <div className="flex items-center gap-3 p-4 border bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Clock className="h-5 w-5 shrink-0" />
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Vous avez déjà répondu. Vous recevrez une notification quand votre partenaire aura terminé.
                  </p>
                </div>
              )}

              {/* Garanties */}
              <div className="pt-4 border-t dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Vos réponses sont confidentielles et seront uniquement partagées avec votre partenaire
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Info supplémentaires */}
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-purple-900 dark:text-purple-300 mb-3">
                Conseils pour répondre
              </h3>
              <ul className="space-y-2 text-sm text-purple-800 dark:text-purple-300">
                <li>Répondez honnêtement, sans vous juger</li>
                <li>Prenez votre temps, il n&apos;y a pas de limite</li>
                <li>Ne cherchez pas la &quot;bonne&quot; réponse</li>
                <li>Exprimez ce que vous ressentez vraiment</li>
                <li>Les différences ne sont pas forcément des problèmes</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
