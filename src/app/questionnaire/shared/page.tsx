'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Share2, Users, Copy, ArrowRight, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

export default function SharedQuestionnairePage() {
  const [email, setEmail] = useState('')
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const createSharedQuestionnaire = async () => {
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/questionnaire/shared', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator_email: email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShareCode(data.share_code)
        setShareUrl(data.share_url)
        toast.success('Lien de partage créé avec succès!')
      } else {
        toast.error(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating shared questionnaire:', error)
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papiers!')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Questionnaire de Couple
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Créez un questionnaire partagé pour découvrir votre compatibilité en tant que couple
        </p>
      </div>

      {!shareCode ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-pink-500" />
              Créer un Questionnaire Partagé
            </CardTitle>
            <CardDescription>
              Entrez votre email pour commencer le processus de création
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Votre email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              onClick={createSharedQuestionnaire}
              disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Créer le Lien de Partage
                </div>
              )}
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Comment ça marche ?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Créez votre questionnaire partagé avec votre email</li>
                <li>• Partagez le lien généré avec votre partenaire</li>
                <li>• Répondez tous les deux aux 100 questions</li>
                <li>• Découvrez votre score de compatibilité!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <Share2 className="h-6 w-6" />
              Questionnaire Créé avec Succès!
            </CardTitle>
            <CardDescription>
              Partagez ce lien avec votre partenaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Code de partage:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {shareCode}
                </Badge>
              </div>
              <div className="bg-white p-3 rounded border break-all text-sm">
                {shareUrl}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={copyToClipboard}
                variant="outline" 
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier le Lien
              </Button>
              <Button 
                onClick={() => window.open(shareUrl || '', '_blank')}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Commencer
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Étapes suivantes :
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>1. Partagez le lien avec votre partenaire</li>
                <li>2. Chacun répond aux questions individuellement</li>
                <li>3. Découvrez votre compatibilité une fois terminé</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
