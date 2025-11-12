'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Users, Copy, Eye, Clock, CheckCircle, XCircle, Share2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import FeatureGate from '@/components/premium/FeatureGate'

interface SharedQuestionnaire {
  id: string
  share_code: string
  partner_name: string | null
  partner_email: string | null
  status: 'pending' | 'completed' | 'expired'
  created_at: string
  expires_at: string
  creator_questionnaire_id: string | null
  partner_questionnaire_id: string | null
}

export default function SharedQuestionnairesCard() {
  const [sharedQuestionnaires, setSharedQuestionnaires] = useState<SharedQuestionnaire[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSharedQuestionnaires()
  }, [])

  const loadSharedQuestionnaires = async () => {
    try {
      const supabase = createClient()
      
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return

      // Charger les questionnaires partagés
      const { data, error } = await supabase
        .from('shared_questionnaires')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading shared questionnaires:', error)
        return
      }

      setSharedQuestionnaires(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const copyShareLink = (shareCode: string) => {
    const link = `${window.location.origin}/questionnaire/invite/${shareCode}`
    navigator.clipboard.writeText(link)
    toast.success('Lien copié dans le presse-papier !')
  }

  const getStatusBadge = (status: string, expiresAt: string) => {
    const isExpired = new Date(expiresAt) < new Date()
    
    if (isExpired || status === 'expired') {
      return (
        <Badge variant="destructive" className="flex items-center gap-1">
          <XCircle className="w-3 h-3" />
          Expiré
        </Badge>
      )
    }
    
    if (status === 'completed') {
      return (
        <Badge className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          Complété
        </Badge>
      )
    }
    
    return (
      <Badge variant="secondary" className="flex items-center gap-1">
        <Clock className="w-3 h-3" />
        En attente
      </Badge>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Mes Questionnaires Partagés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <FeatureGate featureCode="questionnaire_shareable">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Mes Questionnaires Partagés
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={loadSharedQuestionnaires}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {sharedQuestionnaires.length === 0 ? (
            <div className="text-center py-8">
              <Share2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Aucun questionnaire partagé</p>
              <p className="text-sm text-gray-500 mb-4">
                Complétez un questionnaire pour pouvoir le partager avec votre partenaire
              </p>
              <Link href="/questionnaire">
                <Button variant="outline">
                  Commencer un questionnaire
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {sharedQuestionnaires.map((shared) => {
                const isExpired = new Date(shared.expires_at) < new Date()
                const isCompleted = shared.status === 'completed'
                
                return (
                  <div 
                    key={shared.id}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {shared.partner_name || 'Partenaire non nommé'}
                          </h4>
                          {getStatusBadge(shared.status, shared.expires_at)}
                        </div>
                        {shared.partner_email && (
                          <p className="text-sm text-gray-500">{shared.partner_email}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mb-3">
                      <div>
                        <span className="font-medium">Créé le:</span> {formatDate(shared.created_at)}
                      </div>
                      <div>
                        <span className="font-medium">Expire le:</span> {formatDate(shared.expires_at)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {!isExpired && !isCompleted && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyShareLink(shared.share_code)}
                          className="flex-1"
                        >
                          <Copy className="w-4 h-4 mr-2" />
                          Copier le lien
                        </Button>
                      )}

                      {isCompleted && (
                        <Link 
                          href={`/results/couple/${shared.share_code}`}
                          className="flex-1"
                        >
                          <Button
                            size="sm"
                            className="w-full bg-purple-600 hover:bg-purple-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir la comparaison
                          </Button>
                        </Link>
                      )}

                      {isExpired && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Expiré
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </FeatureGate>
  )
}
