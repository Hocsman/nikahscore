'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useCouple } from '@/hooks/useCouple'
import { useUserStats } from '@/hooks/useUserStats'
import Link from 'next/link'
import CompatibilityAnalysis from './CompatibilityAnalysis'
import MatchInsights from './MatchInsights'
import QuestionnaireHistoryCard from './QuestionnaireHistoryCard'
import SharedQuestionnairesCard from './SharedQuestionnairesCard'
import { AchievementsSummary } from '@/components/AchievementsSummary'
import { AchievementsChecker } from '@/components/AchievementsChecker'
import FeatureGate from '@/components/premium/FeatureGate'
import BudgetSessionModal from '@/components/dashboard/BudgetSessionModal'
import TodoListModal from '@/components/dashboard/TodoListModal'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import {
  User,
  Users,
  Heart,
  Trophy,
  TrendingUp,
  Calendar,
  Star,
  Target,
  Activity,
  Settings,
  Bell,
  Download,
  Share2,
  BarChart3,
  PieChart,
  ArrowRight,
  Zap,
  Crown,
  Award,
  BookOpen,
  MessageSquare,
  Clock,
  CheckCircle,
  Eye,
  EyeOff,
  Bot
} from 'lucide-react'

interface DashboardStats {
  profileCompletion: number
  compatibilityScore: number
  messagesCount: number
  profileViews: number
  lastActivity: string
}

export default function UserDashboard() {
  const { user } = useAuth()
  const { isPremium, isConseil, plan, planName, loading: subscriptionLoading } = useSubscription()
  const { getUserCoupleCode } = useCouple()
  const { stats: userStats, questionnaires, loading: statsLoading } = useUserStats()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showTodoModal, setShowTodoModal] = useState(false)

  // Utiliser les stats réelles ou des valeurs par défaut pendant le chargement
  const stats = userStats || {
    profileCompletion: 40,
    questionnairesCompleted: 0,
    couplesCreated: 0,
    averageCompatibilityScore: null,
    lastActivity: 'Jamais',
    hasActiveCouples: false
  }

  // Anciennes stats pour compatibilité UI (à supprimer progressivement)
  const legacyStats = {
    messagesCount: 0, // Fonctionnalité future
    profileViews: 0, // Fonctionnalité future
  }

  const handleExportPDF = async () => {
    // Vérifier si l'utilisateur est Premium ou Conseil
    if (!isPremium && !isConseil) {
      alert('⭐ Fonctionnalité Premium\n\nL\'export PDF est réservé aux membres Premium et Conseil.\n\nPassez Premium pour débloquer cette fonctionnalité !')
      return
    }

    if (!user) {
      alert('Vous devez être connecté pour exporter le PDF')
      return
    }

    setIsGeneratingPDF(true)

    try {
      // Récupérer le couple_code de l'utilisateur
      const { couple_code, error: coupleError } = await getUserCoupleCode()

      if (!couple_code) {
        alert('❌ Aucun couple trouvé\n\nVous devez créer ou rejoindre un couple pour générer un rapport PDF.')
        setIsGeneratingPDF(false)
        return
      }

      // Récupérer les données du couple depuis l'API
      const response = await fetch(`/api/couple?code=${couple_code}`)

      if (!response.ok) {
        throw new Error('Impossible de récupérer les données du couple')
      }

      const coupleData = await response.json()

      // Vérifier que les deux partenaires ont répondu
      if (!coupleData.creator_responses || !coupleData.participant_responses) {
        alert('⏳ Questionnaires incomplets\n\nLes deux partenaires doivent avoir complété le questionnaire pour générer le PDF.')
        setIsGeneratingPDF(false)
        return
      }

      // Générer le PDF avec jsPDF (import dynamique pour réduire le bundle)
      const { generateCompatibilityPDF } = await import('@/lib/pdfGenerator')

      // Préparer les données pour le PDF
      const pdfData = {
        user1Name: coupleData.creator_name || 'Partenaire 1',
        user2Name: coupleData.participant_name || 'Partenaire 2',
        overallScore: coupleData.compatibility_score || 0,
        dimensions: coupleData.dimensions || [],
        strengths: coupleData.strengths || [],
        improvements: coupleData.improvements || [],
        recommendations: coupleData.recommendations || [],
        coupleCode: couple_code,
        generatedDate: new Date().toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      }

      const pdfBlob = generateCompatibilityPDF(pdfData)

      // Télécharger le PDF
      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      a.download = `NikahScore-Rapport-${couple_code}-${new Date().toISOString().split('T')[0]}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      alert('✅ PDF téléchargé avec succès !')
    } catch (error) {
      console.error('❌ Erreur export PDF:', error)
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors de la génération du PDF. Veuillez réessayer.'
      alert(`❌ ${errorMessage}`)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'compatibility',
      title: 'Nouveau match !',
      message: 'Vous avez 94% de compatibilité avec Amina K.',
      time: '5 min',
      unread: true
    },
    {
      id: 2,
      type: 'message',
      title: 'Nouveau message',
      message: 'Sara vous a envoyé un message',
      time: '1h',
      unread: true
    },
    {
      id: 3,
      type: 'profile',
      title: 'Profil consulté',
      message: '3 personnes ont visité votre profil',
      time: '2h',
      unread: false
    }
  ])

  const quickActions = [
    // Pages temporairement désactivées (à créer plus tard)
    // { 
    //   icon: Heart, 
    //   label: 'Découvrir', 
    //   href: '/discover', 
    //   color: 'from-pink-500 to-rose-500',
    //   description: 'Nouveaux profils compatibles'
    // },
    // { 
    //   icon: MessageSquare, 
    //   label: 'Messages', 
    //   href: '/messages', 
    //   color: 'from-blue-500 to-indigo-500',
    //   description: '3 conversations en cours'
    // },
    {
      icon: BarChart3,
      label: 'Résultats',
      href: '/results',
      color: 'from-purple-500 to-violet-500',
      description: 'Voir votre analyse'
    },
    // { 
    //   icon: Settings, 
    //   label: 'Paramètres', 
    //   href: '/settings', 
    //   color: 'from-gray-500 to-slate-500',
    //   description: 'Gérer votre compte'
    // }
  ]

  const achievements = [
    {
      id: 1,
      title: 'Profil Complet',
      description: 'Félicitations ! Votre profil est maintenant complet',
      unlocked: true,
      icon: Trophy,
      color: 'text-yellow-600'
    },
    {
      id: 2,
      title: 'Premier Match',
      description: 'Vous avez obtenu votre premier match !',
      unlocked: true,
      icon: Heart,
      color: 'text-pink-600'
    },
    {
      id: 3,
      title: 'Communicateur',
      description: 'Envoyez 10 messages',
      unlocked: false,
      progress: 60,
      icon: MessageSquare,
      color: 'text-blue-600'
    }
  ]

  return (
    <DashboardLayout>
      {/* Vérificateur d'achievements en arrière-plan */}
      <AchievementsChecker />

      <div className="space-y-6">

        {/* Colonne principale */}
        <div className="lg:col-span-2 space-y-6">

          {/* Stats principales */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <Card className="bg-gradient-to-br from-pink-500 to-rose-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-pink-100 text-sm">Score moyen</p>
                    <p className="text-2xl font-bold">
                      {stats.averageCompatibilityScore !== null
                        ? `${stats.averageCompatibilityScore}%`
                        : 'N/A'}
                    </p>
                  </div>
                  <Heart className="w-8 h-8 text-pink-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Tests complétés</p>
                    <p className="text-2xl font-bold">{stats.questionnairesCompleted}</p>
                  </div>
                  <Trophy className="w-8 h-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-violet-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Couples créés</p>
                    <p className="text-2xl font-bold">{stats.couplesCreated}</p>
                  </div>
                  <Users className="w-8 h-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-emerald-500 text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">Complétude</p>
                    <p className="text-2xl font-bold">{stats.profileCompletion}%</p>
                  </div>
                  <Target className="w-8 h-8 text-green-200" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Avantages Premium débloqués */}
          {isPremium && !subscriptionLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className={`border-2 ${isPremium
                ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100/50'
                : 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100/50'
                }`}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {isPremium ? (
                      <>
                        <Crown className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-900">Avantages Premium Actifs</span>
                      </>
                    ) : (
                      <>
                        <Star className="w-5 h-5 text-purple-600" />
                        <span className="text-purple-900">Avantages Premium Actifs</span>
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">Tests illimités</p>
                        <p className="text-xs text-gray-600">Aucune limite mensuelle</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">Analyse détaillée</p>
                        <p className="text-xs text-gray-600">Insights approfondis</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">Historique complet</p>
                        <p className="text-xs text-gray-600">Tous vos résultats sauvegardés</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm text-gray-900">Export PDF</p>
                        <p className="text-xs text-gray-600">Rapports professionnels (bientôt)</p>
                      </div>
                    </div>
                    {isPremium && (
                      <>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">Consultation mensuelle</p>
                            <p className="text-xs text-gray-600">Expert matrimonial dédié</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-sm text-gray-900">Support prioritaire</p>
                            <p className="text-xs text-gray-600">Réponse sous 24h</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link href="/profile">
                      <Button variant="outline" size="sm" className="w-full">
                        <Settings className="w-4 h-4 mr-2" />
                        Gérer mon profil
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Actions Rapides - Premium/Conseil uniquement */}
          {(isPremium || isConseil) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    Actions Rapides
                    <Badge className="ml-auto bg-purple-500 text-white">
                      {isConseil ? 'Conseil' : 'Premium'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Session Budget */}
                    <button
                      onClick={() => setShowBudgetModal(true)}
                      className="text-left p-4 bg-white rounded-xl border-2 border-transparent hover:border-pink-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Calendar className="w-6 h-6 text-pink-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">💰 Session Budget</p>
                          <p className="text-sm text-gray-600 mb-2">
                            Planifiez 2h cette semaine pour établir votre budget commun et définir vos priorités financières.
                          </p>
                          <span className="text-xs font-medium text-pink-600 group-hover:underline">
                            Planifier maintenant →
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* Routine Commune */}
                    <button
                      onClick={() => setShowTodoModal(true)}
                      className="text-left p-4 bg-white rounded-xl border-2 border-transparent hover:border-green-300 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 mb-1">✅ Routine Commune</p>
                          <p className="text-sm text-gray-600 mb-2">
                            Identifiez 3 activités que vous aimeriez faire ensemble régulièrement.
                          </p>
                          <span className="text-xs font-medium text-green-600 group-hover:underline">
                            Créer la liste →
                          </span>
                        </div>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Analyse de compatibilité complète avec onglets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-purple-500" />
                  Tableau de Bord NikahScore
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="compatibility" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="compatibility" className="flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Compatibilité
                    </TabsTrigger>
                    <TabsTrigger value="insights" className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      Insights & Matchs
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="compatibility" className="mt-6">
                    <CompatibilityAnalysis />
                  </TabsContent>

                  <TabsContent value="insights" className="mt-6">
                    <MatchInsights />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* Historique des questionnaires */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <QuestionnaireHistoryCard
              questionnaires={questionnaires}
              loading={statsLoading}
            />
          </motion.div>

          {/* Questionnaires partagés */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <SharedQuestionnairesCard />
          </motion.div>

          {/* Actions rapides */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Actions rapides
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`p-4 rounded-xl bg-gradient-to-br ${action.color} hover:shadow-lg transition-all cursor-pointer text-white`}
                      >
                        <action.icon className="w-6 h-6 mb-2" />
                        <p className="font-semibold text-sm">{action.label}</p>
                        <p className="text-xs text-white/90">{action.description}</p>
                      </motion.div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progression et objectifs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  Votre progression
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Complétude du profil</span>
                    <span className="text-sm text-gray-500">{stats.profileCompletion}%</span>
                  </div>
                  <Progress value={stats.profileCompletion} className="h-2" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Score moyen</span>
                    <span className="text-sm text-gray-500">
                      {stats.averageCompatibilityScore !== null
                        ? `${stats.averageCompatibilityScore}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <Progress
                    value={stats.averageCompatibilityScore || 0}
                    className="h-2"
                  />
                </div>

                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-2">Prochaines étapes recommandées:</p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Ajouter 3 photos supplémentaires
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-yellow-500" />
                      Répondre aux questions optionnelles
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Succès et badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Vos succès
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement) => (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-lg border-2 transition-all ${achievement.unlocked
                        ? 'border-green-200 bg-green-50'
                        : 'border-gray-200 bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <achievement.icon className={`w-6 h-6 ${achievement.color}`} />
                        <div>
                          <p className="font-semibold text-sm">{achievement.title}</p>
                          {achievement.unlocked ? (
                            <Badge variant="secondary" className="text-xs">
                              Débloqué
                            </Badge>
                          ) : (
                            <div className="mt-1">
                              <Progress value={achievement.progress} className="h-1" />
                              <p className="text-xs text-gray-500 mt-1">
                                {achievement.progress}% complété
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar droite */}
        <div className="space-y-6">

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-blue-500" />
                    Notifications
                  </span>
                  <Badge variant="secondary">
                    {notifications.filter(n => n.unread).length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.map((notification) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-3 rounded-lg border ${notification.unread
                      ? 'border-blue-200 bg-blue-50'
                      : 'border-gray-200 bg-gray-50'
                      }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-sm">{notification.title}</p>
                      <span className="text-xs text-gray-500">{notification.time}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{notification.message}</p>
                    {notification.unread && (
                      <div className="flex justify-end">
                        <Button size="sm" variant="ghost" className="text-xs h-6 px-2">
                          Marquer lu
                        </Button>
                      </div>
                    )}
                  </motion.div>
                ))}

                <Button variant="ghost" className="w-full text-sm">
                  Voir toutes les notifications
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <AchievementsSummary />
          </motion.div>

          {/* Activité récente */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-500" />
                  Activité récente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Connexion</p>
                    <p className="text-xs text-gray-500">{stats.lastActivity}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Questionnaire complété</p>
                    <p className="text-xs text-gray-500">Hier</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Profil mis à jour</p>
                    <p className="text-xs text-gray-500">Il y a 2 jours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Conseils personnalisés */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-pink-500" />
                  Conseil du jour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-800">
                    💡 Optimisez votre profil
                  </p>
                  <p className="text-sm text-gray-600">
                    Les profils avec une photo de qualité reçoivent 40% plus de vues.
                    Pensez à ajouter une photo souriante !
                  </p>
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    Ajouter une photo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Modals */}
      <BudgetSessionModal
        open={showBudgetModal}
        onOpenChange={setShowBudgetModal}
        onSessionCreated={() => {
          // Optionnellement, recharger les données ou afficher un message
          console.log('Session créée avec succès')
        }}
      />
      <TodoListModal
        open={showTodoModal}
        onOpenChange={setShowTodoModal}
      />
    </DashboardLayout>
  )
}
