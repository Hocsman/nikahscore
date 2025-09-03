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
        console.log('✅ Questionnaire partagé créé:', data.share_code)
      } else {
        toast.error(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('❌ Erreur:', error)
      toast.error('Erreur lors de la création du lien de partage')
    } finally {
      setLoading(false)
    }
  }

  const copyShareUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papier!')
    }
  }

  const startQuestionnaire = () => {
    if (shareCode) {
      window.location.href = `/questionnaire/shared/${shareCode}?role=creator`
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-10 h-10 text-pink-500" />
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Questionnaire à Deux
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez votre compatibilité ensemble ! Créez un lien partagé et répondez tous les deux aux mêmes questions.
          </p>
        </div>

        {!shareCode ? (
          /* Formulaire de création */
          <Card className="mx-auto max-w-md">
            <CardHeader className="text-center">
              <Share2 className="w-12 h-12 mx-auto text-blue-500 mb-4" />
              <CardTitle>Créer un Questionnaire Partagé</CardTitle>
              <CardDescription>
                Entrez votre email pour commencer. Vous pourrez ensuite partager le lien avec votre partenaire.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Votre Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && createSharedQuestionnaire()}
                />
              </div>
              <Button 
                onClick={createSharedQuestionnaire}
                disabled={loading || !email.trim()}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                {loading ? 'Création...' : 'Créer le Lien de Partage'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Affichage du lien de partage */
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Users className="w-8 h-8 text-green-500" />
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    Code: {shareCode}
                  </Badge>
                </div>
                <CardTitle className="text-green-700">Questionnaire Partagé Créé !</CardTitle>
                <CardDescription>
                  Partagez ce lien avec votre partenaire pour qu'il puisse répondre aux mêmes questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Lien de partage */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lien à partager :</label>
                  <div className="flex space-x-2">
                    <Input
                      value={shareUrl || ''}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyShareUrl}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Comment ça marche :</h4>
                  <ol className="text-sm text-blue-700 space-y-1">
                    <li>1. Vous commencez le questionnaire en premier</li>
                    <li>2. Votre partenaire utilise le même lien pour répondre</li>
                    <li>3. Une fois les deux terminés, vous verrez votre score de compatibilité</li>
                  </ol>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button 
                    onClick={startQuestionnaire}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    Commencer le Questionnaire
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyShareUrl}
                    className="flex items-center space-x-2"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Avantages */}
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="text-center p-4">
                <Heart className="w-8 h-8 mx-auto text-pink-500 mb-2" />
                <h3 className="font-semibold mb-1">Compatibilité</h3>
                <p className="text-sm text-gray-600">Score de compatibilité basé sur vos réponses</p>
              </Card>
              <Card className="text-center p-4">
                <Users className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                <h3 className="font-semibold mb-1">Ensemble</h3>
                <p className="text-sm text-gray-600">Répondez aux mêmes questions en parallèle</p>
              </Card>
              <Card className="text-center p-4">
                <Sparkles className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                <h3 className="font-semibold mb-1">Résultats</h3>
                <p className="text-sm text-gray-600">Analyse détaillée de vos affinités</p>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
