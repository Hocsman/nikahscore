'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Copy, Share2, Heart, Users, Sparkles } from 'lucide-react'
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

export default function CoupleQuestionnaire() {
  const router = useRouter()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [joinCode, setJoinCode] = useState('')
  const [showJoinForm, setShowJoinForm] = useState(false)

  const createCouple = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour créer un questionnaire couple')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/couple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Questionnaire couple créé avec succès!')
        
        // Récupérer les détails complets du couple
        await fetchCoupleDetails(data.couple_code)
      } else {
        toast.error(data.error || 'Erreur lors de la création du questionnaire couple')
      }
    } catch (error) {
      console.error('Error creating couple:', error)
      toast.error('Erreur lors de la création du questionnaire couple')
    } finally {
      setLoading(false)
    }
  }

  const fetchCoupleDetails = async (code: string) => {
    try {
      const response = await fetch(`/api/couple?code=${code}&user_id=${user?.id || ''}`)
      const data = await response.json()

      if (data.success) {
        setCoupleData(data.couple)
      } else {
        toast.error(data.error || 'Questionnaire couple introuvable')
      }
    } catch (error) {
      console.error('Error fetching couple:', error)
      toast.error('Erreur lors de la récupération du questionnaire couple')
    }
  }

  const joinCouple = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour rejoindre un questionnaire couple')
      return
    }

    if (!joinCode.trim()) {
      toast.error('Veuillez entrer un code de couple')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/couple/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couple_code: joinCode.toUpperCase(),
          partner_id: user.id
        })
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Vous avez rejoint le questionnaire couple!')
        await fetchCoupleDetails(joinCode.toUpperCase())
        setShowJoinForm(false)
        setJoinCode('')
      } else {
        toast.error(data.error || 'Erreur lors de la jonction au questionnaire couple')
      }
    } catch (error) {
      console.error('Error joining couple:', error)
      toast.error('Erreur lors de la jonction au questionnaire couple')
    } finally {
      setLoading(false)
    }
  }

  const copyShareUrl = (code: string) => {
    const shareUrl = `${window.location.origin}/questionnaire/couple/${code}`
    navigator.clipboard.writeText(shareUrl)
    toast.success('Lien de partage copié!')
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Heart className="w-12 h-12 mx-auto text-pink-500 mb-4" />
            <CardTitle>Questionnaire Couple</CardTitle>
            <CardDescription>
              Connectez-vous pour créer ou rejoindre un questionnaire couple
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Questionnaire Couple
            </h1>
            <Heart className="w-8 h-8 text-pink-500" />
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Créez un questionnaire partagé avec votre partenaire pour découvrir votre compatibilité 
            et renforcer votre relation
          </p>
        </div>

        {/* Section explicative du processus */}
        <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2 text-lg">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span>Comment ça fonctionne ?</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-pink-600">1</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Créez un code</h3>
                <p className="text-xs text-gray-600">Générez un code unique de couple</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-purple-600">2</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Partagez le code</h3>
                <p className="text-xs text-gray-600">Envoyez-le à votre partenaire</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Répondez ensemble</h3>
                <p className="text-xs text-gray-600">Chacun répond de son côté</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-green-600">4</span>
                </div>
                <h3 className="font-semibold text-sm mb-1">Score commun</h3>
                <p className="text-xs text-gray-600">Découvrez votre compatibilité</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {!coupleData && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Créer un nouveau questionnaire couple */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Share2 className="w-5 h-5 text-blue-500" />
                  <CardTitle>Créer un Questionnaire</CardTitle>
                </div>
                <CardDescription>
                  Commencez un nouveau questionnaire couple et invitez votre partenaire
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={createCouple}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                >
                  {loading ? 'Création...' : 'Créer un Questionnaire Couple'}
                </Button>
              </CardContent>
            </Card>

            {/* Rejoindre un questionnaire existant */}
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-500" />
                  <CardTitle>Rejoindre un Questionnaire</CardTitle>
                </div>
                <CardDescription>
                  Votre partenaire a créé un questionnaire ? Rejoignez-le avec son code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!showJoinForm ? (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowJoinForm(true)}
                    className="w-full"
                  >
                    J'ai un code de questionnaire
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <Input
                      placeholder="Entrez le code de couple"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      maxLength={8}
                    />
                    <div className="flex space-x-2">
                      <Button 
                        onClick={joinCouple}
                        disabled={loading || !joinCode.trim()}
                        className="flex-1"
                      >
                        {loading ? 'Connexion...' : 'Rejoindre'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowJoinForm(false)
                          setJoinCode('')
                        }}
                      >
                        Annuler
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {coupleData && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <CardTitle>Questionnaire Couple</CardTitle>
                  <Badge className={getStatusColor(coupleData.status)}>
                    {getStatusText(coupleData)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  Code: <code className="font-mono font-bold text-lg">{coupleData.couple_code}</code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyShareUrl(coupleData.couple_code)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Participants */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Créateur</span>
                  </h3>
                  <div className="pl-5">
                    <p className="font-medium">{coupleData.creator?.name || 'Utilisateur'}</p>
                    <p className="text-sm text-gray-500">{coupleData.creator?.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${coupleData.partner_id ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span>Partenaire</span>
                  </h3>
                  <div className="pl-5">
                    {coupleData.partner_id ? (
                      <>
                        <p className="font-medium">{coupleData.partner?.name || 'Partenaire'}</p>
                        <p className="text-sm text-gray-500">{coupleData.partner?.email}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 italic">En attente...</p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-4">
                {!coupleData.partner_id && coupleData.user_role === 'creator' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">Invitez votre partenaire</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Partagez ce lien ou ce code avec votre partenaire pour qu'il puisse rejoindre le questionnaire
                    </p>
                    <div className="flex space-x-2">
                      <Input
                        value={`${window.location.origin}/questionnaire/couple/${coupleData.couple_code}`}
                        readOnly
                        className="text-sm"
                      />
                      <Button
                        size="sm"
                        onClick={() => copyShareUrl(coupleData.couple_code)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {coupleData.partner_id && !coupleData.completed_at && (
                  <Button 
                    className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                    onClick={() => router.push(`/questionnaire?couple_code=${coupleData.couple_code}`)}
                  >
                    Commencer le Questionnaire
                  </Button>
                )}

                {coupleData.completed_at && (
                  <Button 
                    className="w-full"
                    variant="outline"
                    onClick={() => router.push(`/results/couple/${coupleData.couple_code}`)}
                  >
                    Voir les Résultats de Compatibilité
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
