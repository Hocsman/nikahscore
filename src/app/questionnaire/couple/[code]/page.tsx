'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, Users, Clock, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface CoupleData {
  id: string
  couple_code: string
  creator_id: string
  partner_id: string | null
  status: string
  created_at: string
  partner_joined_at: string | null
  completed_at: string | null
  user_role: 'creator' | 'partner' | 'guest'
  creator?: { name: string; email: string }
  partner?: { name: string; email: string }
}

interface CoupleJoinPageProps {
  params: {
    code: string
  }
}

export default function CoupleJoinPage({ params }: CoupleJoinPageProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)

  useEffect(() => {
    if (params.code) {
      fetchCoupleDetails(params.code)
    }
  }, [params.code, user])

  const fetchCoupleDetails = async (code: string) => {
    try {
      const response = await fetch(`/api/couple?code=${code}&user_id=${user?.id || ''}`)
      const data = await response.json()

      if (data.success) {
        setCoupleData(data.couple)
      } else {
        toast.error(data.error || 'Questionnaire couple introuvable')
        router.push('/couple')
      }
    } catch (error) {
      console.error('Error fetching couple:', error)
      toast.error('Erreur lors de la récupération du questionnaire couple')
      router.push('/couple')
    } finally {
      setLoading(false)
    }
  }

  const joinCouple = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour rejoindre un questionnaire couple')
      router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setJoining(true)
    try {
      const response = await fetch('/api/couple/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couple_code: params.code,
          partner_id: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Vous avez rejoint le questionnaire couple!')
        await fetchCoupleDetails(params.code)
      } else {
        toast.error(data.error || 'Erreur lors de la jonction au questionnaire couple')
      }
    } catch (error) {
      console.error('Error joining couple:', error)
      toast.error('Erreur lors de la jonction au questionnaire couple')
    } finally {
      setJoining(false)
    }
  }

  const startQuestionnaire = () => {
    router.push(`/questionnaire?couple_code=${params.code}`)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'active':
        return 'bg-blue-100 text-blue-800'
      case 'waiting_partner':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (couple: CoupleData) => {
    if (couple.completed_at) return 'Terminé'
    if (!couple.partner_id) return 'En attente du partenaire'
    return 'Actif'
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart className="w-12 h-12 mx-auto text-pink-500 animate-pulse" />
          <p className="text-gray-600">Chargement du questionnaire couple...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <CardTitle>Connexion Requise</CardTitle>
            <CardDescription>
              Connectez-vous pour rejoindre ce questionnaire couple
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname))}
              className="w-full"
            >
              Se Connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!coupleData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <CardTitle>Questionnaire Introuvable</CardTitle>
            <CardDescription>
              Ce questionnaire couple n'existe pas ou n'est plus disponible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={() => router.push('/couple')}
              className="w-full"
            >
              Retour aux Questionnaires Couple
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Questionnaire Couple
            </h1>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-500" />
                <CardTitle>Code: {coupleData.couple_code}</CardTitle>
                <Badge className={getStatusColor(coupleData.status)}>
                  {getStatusText(coupleData)}
                </Badge>
              </div>
            </div>
            <CardDescription>
              Questionnaire de compatibilité créé le {new Date(coupleData.created_at).toLocaleDateString('fr-FR')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Participants */}
            <div className="space-y-4">
              <h3 className="font-semibold">Participants</h3>
              
              <div className="space-y-3">
                {/* Créateur */}
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium">{coupleData.creator?.name || 'Créateur'}</p>
                    <p className="text-sm text-gray-500">Créateur du questionnaire</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-blue-500" />
                </div>

                {/* Partenaire */}
                <div className={`flex items-center space-x-3 p-3 rounded-lg ${
                  coupleData.partner_id ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    coupleData.partner_id ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <div className="flex-1">
                    {coupleData.partner_id ? (
                      <>
                        <p className="font-medium">{coupleData.partner?.name || 'Partenaire'}</p>
                        <p className="text-sm text-gray-500">
                          Rejoint le {coupleData.partner_joined_at ? 
                            new Date(coupleData.partner_joined_at).toLocaleDateString('fr-FR') : 
                            'récemment'
                          }
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="font-medium text-gray-500">Partenaire</p>
                        <p className="text-sm text-gray-400">En attente...</p>
                      </>
                    )}
                  </div>
                  {coupleData.partner_id ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <Clock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Actions selon le rôle et statut */}
            <div className="space-y-4 pt-4 border-t">
              {coupleData.user_role === 'guest' && !coupleData.partner_id && (
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Rejoindre ce Questionnaire</h4>
                    <p className="text-sm text-yellow-700">
                      Rejoignez {coupleData.creator?.name || 'votre partenaire'} pour découvrir votre compatibilité
                    </p>
                  </div>
                  <Button 
                    onClick={joinCouple}
                    disabled={joining}
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    {joining ? 'Connexion...' : 'Rejoindre le Questionnaire'}
                  </Button>
                </div>
              )}

              {coupleData.user_role === 'guest' && coupleData.partner_id && (
                <div className="text-center space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <h4 className="font-semibold text-red-800 mb-2">Questionnaire Complet</h4>
                    <p className="text-sm text-red-700">
                      Ce questionnaire couple a déjà ses deux participants.
                    </p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => router.push('/couple')}
                  >
                    Créer un Nouveau Questionnaire
                  </Button>
                </div>
              )}

              {(coupleData.user_role === 'creator' || coupleData.user_role === 'partner') && (
                <div className="space-y-4">
                  {!coupleData.partner_id && coupleData.user_role === 'creator' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-800 mb-2">En Attente de votre Partenaire</h4>
                      <p className="text-sm text-blue-700">
                        Partagez ce lien avec votre partenaire pour qu'il puisse vous rejoindre
                      </p>
                    </div>
                  )}

                  {coupleData.partner_id && !coupleData.completed_at && (
                    <Button 
                      onClick={startQuestionnaire}
                      className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    >
                      Commencer le Questionnaire
                    </Button>
                  )}

                  {coupleData.completed_at && (
                    <Button 
                      onClick={() => router.push(`/results/couple/${coupleData.couple_code}`)}
                      className="w-full"
                      variant="outline"
                    >
                      Voir les Résultats de Compatibilité
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
