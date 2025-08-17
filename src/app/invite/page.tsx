'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'
import { Copy, Send, Users, Link } from 'lucide-react'

export default function InvitePage() {
  const [partnerEmail, setPartnerEmail] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [inviteLink, setInviteLink] = useState('')
  const [inviteToken, setInviteToken] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const generateInviteLink = async () => {
    setIsGenerating(true)

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !user) {
        throw new Error('Vous devez être connecté')
      }

      // Générer un token unique
      const token = crypto.randomUUID()
      const emailHash = Buffer.from(user.email!).toString('base64')
      const partnerEmailHash = Buffer.from(partnerEmail).toString('base64')
      
      // Date d'expiration (7 jours)
      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 7)

      // Créer la paire dans la base de données
      const { error: pairError } = await supabase
        .from('pairs')
        .insert({
          user_a_email: user.email!,
          user_b_email: partnerEmail,
          user_a_hash: emailHash,
          user_b_hash: partnerEmailHash,
          invite_token: token,
          expires_at: expiresAt.toISOString(),
          status: 'pending'
        })

      if (pairError) {
        throw pairError
      }

      // Générer le lien d'invitation
      const baseUrl = window.location.origin
      const link = `${baseUrl}/invite/${token}`
      
      setInviteLink(link)
      setInviteToken(token)

      toast({
        title: "Lien généré !",
        description: "Partagez ce lien avec votre partenaire.",
      })

    } catch (error: any) {
      console.error('Erreur génération lien:', error)
      toast({
        title: "Erreur",
        description: error.message || "Impossible de générer le lien.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink)
      toast({
        title: "Copié !",
        description: "Le lien a été copié dans le presse-papiers.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de copier le lien.",
        variant: "destructive",
      })
    }
  }

  const shareViaEmail = () => {
    const subject = encodeURIComponent("Test de compatibilité NikahScore")
    const body = encodeURIComponent(`
Salam aleykoum,

Je t'invite à faire un test de compatibilité matrimoniale avec moi sur NikahScore.

Clique sur ce lien pour commencer : ${inviteLink}

Ce lien expire dans 7 jours.

Barakallahu fik !
    `)
    
    window.open(`mailto:${partnerEmail}?subject=${subject}&body=${body}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Inviter votre partenaire
          </CardTitle>
          <CardDescription>
            Générez un lien d'invitation pour faire le test de compatibilité ensemble
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!inviteLink ? (
            // Formulaire pour générer le lien
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="partnerEmail">Email de votre partenaire</Label>
                <Input
                  id="partnerEmail"
                  type="email"
                  placeholder="partenaire@example.com"
                  value={partnerEmail}
                  onChange={(e) => setPartnerEmail(e.target.value)}
                  required
                />
              </div>

              <Button 
                onClick={generateInviteLink}
                disabled={!partnerEmail || isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  'Génération...'
                ) : (
                  <>
                    <Link className="mr-2 h-4 w-4" />
                    Générer le lien d'invitation
                  </>
                )}
              </Button>
            </div>
          ) : (
            // Affichage du lien généré
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800 mb-2">
                  ✅ Lien d'invitation généré !
                </h3>
                <p className="text-green-700 text-sm">
                  Partagez ce lien avec <strong>{partnerEmail}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <Label>Lien d'invitation</Label>
                <div className="flex gap-2">
                  <Input
                    value={inviteLink}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={copyToClipboard}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  onClick={shareViaEmail}
                  variant="outline"
                  className="w-full"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer par email
                </Button>

                <Button
                  onClick={() => router.push(`/status/${inviteToken}`)}
                  className="w-full"
                >
                  <Users className="mr-2 h-4 w-4" />
                  Voir le statut
                </Button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-1">ℹ️ Important</h4>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Ce lien expire dans <strong>7 jours</strong></li>
                  <li>• Les deux personnes doivent compléter le questionnaire</li>
                  <li>• Le rapport sera disponible une fois les deux tests terminés</li>
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
