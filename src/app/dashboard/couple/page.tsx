'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, Link2, Share2, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface CoupleData {
  couple_code: string
  couple_id: string
  status: string
  is_creator: boolean
}

export default function CouplePage() {
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [coupleData, setCoupleData] = useState<CoupleData | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)

  useEffect(() => {
    checkCouple()
  }, [])

  const checkCouple = async () => {
    try {
      const res = await fetch('/api/couple/check')
      const data = await res.json()

      if (data.success && data.hasCouple) {
        setCoupleData({
          couple_code: data.couple_code,
          couple_id: data.couple_id,
          status: data.status,
          is_creator: data.is_creator
        })
        setShareUrl(`${window.location.origin}/questionnaire/shared/${data.couple_code}`)
      }
    } catch (error) {
      console.error('Error checking couple:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCouple = async () => {
    setCreating(true)
    try {
      const res = await fetch('/api/couple', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      })

      const data = await res.json()

      if (data.success) {
        setCoupleData({
          couple_code: data.couple_code,
          couple_id: data.couple_id,
          status: 'waiting_partner',
          is_creator: true
        })
        setShareUrl(data.share_url)
        toast.success('Couple créé avec succès !')
      } else {
        toast.error(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating couple:', error)
      toast.error('Erreur serveur')
    } finally {
      setCreating(false)
    }
  }

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papiers !')
    }
  }

  const shareLink = async () => {
    if (shareUrl && navigator.share) {
      try {
        await navigator.share({
          title: 'NikahScore - Questionnaire de couple',
          text: 'Rejoins-moi pour répondre au questionnaire de compatibilité !',
          url: shareUrl
        })
      } catch {
        copyLink()
      }
    } else {
      copyLink()
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
        </div>
      </DashboardLayout>
    )
  }

  // Pas encore de couple → formulaire de création
  if (!coupleData) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              Mon Couple
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Créez votre couple pour comparer vos résultats
            </p>
          </div>

          <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                Créer un questionnaire de couple
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Créez un lien unique et partagez-le avec votre partenaire pour découvrir votre compatibilité.
              </p>
              <Button
                onClick={createCouple}
                disabled={creating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Création en cours...
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 mr-2" />
                    Créer mon couple
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  // Couple existant → affichage du lien + statut
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Mon Couple
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gérez votre couple et partagez le lien
          </p>
        </div>

        {/* Statut */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                Mon Couple
              </CardTitle>
              <Badge className={
                coupleData.status === 'active'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  : 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300'
              }>
                {coupleData.status === 'active' ? 'Actif' : 'En attente du partenaire'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Code couple</span>
              <span className="text-sm font-mono font-medium dark:text-gray-200">{coupleData.couple_code}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Rôle</span>
              <span className="text-sm font-medium dark:text-gray-200">
                {coupleData.is_creator ? 'Créateur' : 'Partenaire'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lien de partage */}
        <Card className="border-pink-200 dark:border-pink-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
              <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              Lien d&apos;invitation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Partagez ce lien avec votre partenaire pour qu&apos;il/elle puisse répondre au questionnaire.
            </p>
            <div className="flex gap-2">
              <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono truncate">
                {shareUrl}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={copyLink}
                aria-label="Copier le lien d'invitation"
              >
                <Copy className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={shareLink}
                aria-label="Partager le lien d'invitation"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
