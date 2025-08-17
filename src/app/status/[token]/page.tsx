'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { Users, Clock, CheckCircle, Download, RefreshCw } from 'lucide-react'

interface PairStatus {
  id: string
  user_a_email: string
  user_b_email: string | null
  status: string
  expires_at: string
  created_at: string
  user_a_completed?: boolean
  user_b_completed?: boolean
}

export default function StatusPage({ params }: { params: { token: string } }) {
  const [pairData, setPairData] = useState<PairStatus | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadPairStatus()
    
    // Actualiser le statut toutes les 30 secondes
    const interval = setInterval(loadPairStatus, 30000)
    
    return () => clearInterval(interval)
  }, [params.token])

  const loadPairStatus = async () => {
    try {
      // Récupérer les données de la paire
      const { data: pairData, error: pairError } = await supabase
        .from('pairs')
        .select('*')
        .eq('invite_token', params.token)
        .single()

      if (pairError || !pairData) {
        setError('Invitation non trouvée')
        return
      }

      // Vérifier les réponses complétées pour chaque utilisateur
      const { data: answers, error: answersError } = await supabase
        .from('answers')
        .select('respondent')
        .eq('pair_id', pairData.id)

      if (!answersError && answers) {
        const userAAnswers = answers.filter(a => a.respondent === 'A').length
        const userBAnswers = answers.filter(a => a.respondent === 'B').length
        
        pairData.user_a_completed = userAAnswers >= 60
        pairData.user_b_completed = userBAnswers >= 60
      }

      setPairData(pairData)
      setError('')
    } catch (error) {
      console.error('Erreur chargement statut:', error)
      setError('Erreur lors du chargement du statut')
    } finally {
      setIsLoading(false)
    }
  }

  const getProgress = () => {
    if (!pairData) return 0
    
    let progress = 0
    if (pairData.status !== 'pending') progress += 25
    if (pairData.user_a_completed) progress += 37.5
    if (pairData.user_b_completed) progress += 37.5
    
    return progress
  }

  const getStatusText = () => {
    if (!pairData) return ''
    
    if (pairData.status === 'pending') {
      return 'En attente que votre partenaire accepte l\'invitation'
    }
    
    if (!pairData.user_a_completed && !pairData.user_b_completed) {
      return 'Les deux participants doivent compléter le questionnaire'
    }
    
    if (pairData.user_a_completed && !pairData.user_b_completed) {
      return 'En attente que votre partenaire termine le questionnaire'
    }
    
    if (!pairData.user_a_completed && pairData.user_b_completed) {
      return 'En attente que vous terminiez le questionnaire'
    }
    
    if (pairData.user_a_completed && pairData.user_b_completed) {
      return 'Test terminé ! Rapport disponible'
    }
    
    return 'Statut inconnu'
  }

  const generateReport = async () => {
    if (!pairData || !pairData.user_a_completed || !pairData.user_b_completed) return

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pairId: pairData.id })
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la génération du rapport')
      }

      // Rediriger vers la page des résultats
      router.push(`/results/${pairData.id}`)
      
    } catch (error) {
      console.error('Erreur génération rapport:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du statut...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <Button onClick={() => router.push('/invite')} className="mt-4">
              Retour
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!pairData) return null

  const progress = getProgress()
  const isCompleted = pairData.user_a_completed && pairData.user_b_completed
  const expiresAt = new Date(pairData.expires_at)
  const timeUntilExpiry = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24)))

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Users className="h-6 w-6" />
            Statut du test de compatibilité
          </CardTitle>
          <CardDescription>
            Suivez l'avancement de votre test de compatibilité
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progression */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression globale</span>
              <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-gray-600 text-center">
              {getStatusText()}
            </p>
          </div>

          {/* Détails des participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Participant A
                  {pairData.user_a_completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{pairData.user_a_email}</p>
                <div className={`text-sm font-medium ${pairData.user_a_completed ? 'text-green-600' : 'text-yellow-600'}`}>
                  {pairData.user_a_completed ? '✅ Terminé' : '⏳ En cours'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Participant B
                  {pairData.user_b_completed && <CheckCircle className="h-5 w-5 text-green-500" />}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">
                  {pairData.user_b_email || 'En attente d\'acceptation'}
                </p>
                <div className={`text-sm font-medium ${
                  pairData.user_b_completed ? 'text-green-600' : 
                  pairData.status === 'pending' ? 'text-gray-500' : 'text-yellow-600'
                }`}>
                  {pairData.status === 'pending' ? '⏳ Non accepté' :
                   pairData.user_b_completed ? '✅ Terminé' : '⏳ En cours'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informations supplémentaires */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-800">Informations</span>
            </div>
            <div className="text-sm text-blue-700 space-y-1">
              <p>• Créé le : {new Date(pairData.created_at).toLocaleDateString('fr-FR')}</p>
              <p>• Expire dans : {timeUntilExpiry} jour{timeUntilExpiry > 1 ? 's' : ''}</p>
              <p>• Lien d'invitation valable jusqu'au : {expiresAt.toLocaleDateString('fr-FR')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button 
                onClick={loadPairStatus}
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualiser
              </Button>

              {isCompleted && (
                <Button 
                  onClick={generateReport}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Voir le rapport
                </Button>
              )}
            </div>

            {!isCompleted && (
              <div className="text-center">
                <Button 
                  onClick={() => router.push(`/questionnaire?pair_id=${pairData.id}`)}
                  variant="outline"
                  className="w-full"
                >
                  Reprendre le questionnaire
                </Button>
              </div>
            )}
          </div>

          {isCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
              <h3 className="font-semibold text-green-800 mb-2">
                🎉 Félicitations !
              </h3>
              <p className="text-green-700 text-sm">
                Votre test de compatibilité est terminé. Vous pouvez maintenant consulter 
                votre rapport détaillé et le télécharger en PDF.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
