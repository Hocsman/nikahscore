'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { QuestionnaireHistory } from '@/hooks/useUserStats'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Heart, 
  ExternalLink,
  Calendar,
  Users
} from 'lucide-react'

interface QuestionnaireHistoryProps {
  questionnaires: QuestionnaireHistory[]
  loading: boolean
}

export default function QuestionnaireHistoryCard({ 
  questionnaires, 
  loading 
}: QuestionnaireHistoryProps) {
  
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Historique des tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (questionnaires.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Historique des tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Vous n'avez pas encore créé de questionnaire
            </p>
            <Link href="/couple">
              <Button className="bg-gradient-to-r from-pink-500 to-purple-500">
                Créer mon premier test
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            Historique des tests
            <Badge variant="secondary" className="ml-2">
              {questionnaires.length}
            </Badge>
          </div>
          <Link href="/couple">
            <Button size="sm" variant="outline">
              Nouveau test
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {questionnaires.slice(0, 5).map((questionnaire, index) => (
          <motion.div
            key={questionnaire.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-4 h-4 text-gray-500" />
                <p className="font-medium text-gray-900">
                  {questionnaire.partner_email 
                    ? `Couple avec ${questionnaire.partner_email.split('@')[0]}`
                    : 'En attente du partenaire'}
                </p>
                {getStatusBadge(questionnaire.status)}
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(questionnaire.created_at)}
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-gray-400">•</span>
                  Code: <span className="font-mono text-xs">{questionnaire.couple_code}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {questionnaire.compatibility_score !== null && (
                <div className="text-right mr-3">
                  <div className={`text-2xl font-bold ${
                    questionnaire.compatibility_score >= 80 
                      ? 'text-green-600' 
                      : questionnaire.compatibility_score >= 60
                      ? 'text-yellow-600'
                      : 'text-orange-600'
                  }`}>
                    {questionnaire.compatibility_score}%
                  </div>
                  <p className="text-xs text-gray-500">compatibilité</p>
                </div>
              )}
              
              {questionnaire.status === 'both_completed' && (
                <Link href={`/results/${questionnaire.id}`}>
                  <Button size="sm" variant="outline" className="gap-2">
                    Voir résultats
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                </Link>
              )}
              
              {questionnaire.status === 'pending' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="gap-2"
                  disabled
                >
                  En attente
                  <Clock className="w-3 h-3" />
                </Button>
              )}
            </div>
          </motion.div>
        ))}
        
        {questionnaires.length > 5 && (
          <div className="text-center pt-2">
            <Button variant="ghost" size="sm" className="text-blue-600">
              Voir tous les tests ({questionnaires.length})
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'both_completed':
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600 gap-1">
          <CheckCircle className="w-3 h-3" />
          Complété
        </Badge>
      )
    case 'pending':
      return (
        <Badge variant="secondary" className="gap-1">
          <Clock className="w-3 h-3" />
          En attente
        </Badge>
      )
    case 'expired':
      return (
        <Badge variant="destructive" className="gap-1">
          <AlertCircle className="w-3 h-3" />
          Expiré
        </Badge>
      )
    default:
      return null
  }
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Aujourd\'hui'
  if (diffInDays === 1) return 'Hier'
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`
  
  return date.toLocaleDateString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  })
}
