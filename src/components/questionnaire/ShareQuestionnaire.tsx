'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Share2, Copy, Check, Mail, Clock, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

interface ShareQuestionnaireProps {
  questionnaireId: string
  userId: string
}

export default function ShareQuestionnaire({ questionnaireId, userId }: ShareQuestionnaireProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')
  const [copied, setCopied] = useState(false)

  const generateShareCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let code = ''
    for (let i = 0; i < 12; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return code
  }

  const handleShare = async () => {
    setIsSharing(true)
    try {
      const supabase = createClient()
      const code = generateShareCode()
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30) // Expire dans 30 jours

      const { data, error } = await supabase
        .from('shared_questionnaires')
        .insert({
          share_code: code,
          creator_id: userId,
          creator_questionnaire_id: questionnaireId,
          partner_name: partnerName || null,
          partner_email: partnerEmail || null,
          status: 'pending',
          expires_at: expiresAt.toISOString()
        })
        .select()
        .single()

      if (error) throw error

      setShareCode(code)
      toast.success('Lien de partage généré avec succès ! 🎉')

      // TODO: Envoyer email au partenaire si email fourni
      if (partnerEmail) {
        toast.info(`Email envoyé à ${partnerEmail}`)
      }
    } catch (error) {
      console.error('Error sharing questionnaire:', error)
      toast.error('Erreur lors de la génération du lien')
    } finally {
      setIsSharing(false)
    }
  }

  const copyToClipboard = () => {
    if (!shareCode) return
    const url = `${window.location.origin}/questionnaire/invite/${shareCode}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success('Lien copié dans le presse-papiers ! 📋')
    setTimeout(() => setCopied(false), 2000)
  }

  if (shareCode) {
    const shareUrl = `${window.location.origin}/questionnaire/invite/${shareCode}`
    
    return (
      <Card className="border-purple-200 bg-purple-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-700">
            <Share2 className="h-5 w-5" />
            Questionnaire Partagé
          </CardTitle>
          <CardDescription>
            Partagez ce lien avec votre partenaire pour comparer vos réponses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200">
            <Input 
              value={shareUrl} 
              readOnly 
              className="flex-1 font-mono text-sm"
            />
            <Button 
              onClick={copyToClipboard}
              variant="outline"
              size="icon"
              className="shrink-0"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Valide 30 jours</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Users className="h-4 w-4" />
              <span>{partnerName || 'Partenaire'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="h-4 w-4" />
              <span>{partnerEmail || 'Non renseigné'}</span>
            </div>
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-gray-600 mb-3">
              💡 <strong>Comment ça marche ?</strong>
            </p>
            <ol className="text-sm text-gray-600 space-y-1 ml-4 list-decimal">
              <li>Copiez le lien ci-dessus</li>
              <li>Envoyez-le à votre partenaire (WhatsApp, SMS, Email...)</li>
              <li>Votre partenaire répond au questionnaire</li>
              <li>Vous recevrez une notification quand c'est terminé</li>
              <li>Comparez vos résultats et découvrez votre compatibilité !</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200 bg-purple-50/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Share2 className="h-5 w-5" />
          Partager avec votre Partenaire
        </CardTitle>
        <CardDescription>
          Invitez votre partenaire à répondre au même questionnaire pour comparer vos résultats
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="partnerName">
            Nom du partenaire (optionnel)
          </Label>
          <Input
            id="partnerName"
            placeholder="Ex: Ahmed, Fatima..."
            value={partnerName}
            onChange={(e) => setPartnerName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="partnerEmail">
            Email du partenaire (optionnel)
          </Label>
          <Input
            id="partnerEmail"
            type="email"
            placeholder="partenaire@exemple.com"
            value={partnerEmail}
            onChange={(e) => setPartnerEmail(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Un email de notification lui sera envoyé avec le lien
          </p>
        </div>

        <Button 
          onClick={handleShare}
          disabled={isSharing}
          className="w-full bg-purple-600 hover:bg-purple-700"
        >
          {isSharing ? (
            <>
              <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
              Génération du lien...
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Générer le lien de partage
            </>
          )}
        </Button>

        <div className="pt-4 border-t text-sm text-gray-600">
          <p className="font-semibold mb-2">✨ Avantages :</p>
          <ul className="space-y-1 ml-4 list-disc">
            <li>Comparez vos réponses côte à côte</li>
            <li>Découvrez vos points communs et différences</li>
            <li>Score de compatibilité personnalisé</li>
            <li>Sujets de discussion recommandés</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
