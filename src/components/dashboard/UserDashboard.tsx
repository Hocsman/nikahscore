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
import Link from 'next/link'
import CompatibilityAnalysis from './CompatibilityAnalysis'
import MatchInsights from './MatchInsights'
import { 
  User, 
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
  EyeOff
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
  const [isPremium, setIsPremium] = useState(false) // TODO: Récupérer depuis la BDD
  const [stats, setStats] = useState<DashboardStats>({
    profileCompletion: 85,
    compatibilityScore: 92,
    messagesCount: 24,
    profileViews: 156,
    lastActivity: '2 heures'
  })

  const handleExportPDF = () => {
    // TODO: Implémenter l'export PDF
    alert('Fonctionnalité Export PDF en cours de développement')
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
    { 
      icon: Heart, 
      label: 'Découvrir', 
      href: '/discover', 
      color: 'from-pink-500 to-rose-500',
      description: 'Nouveaux profils compatibles'
    },
    { 
      icon: MessageSquare, 
      label: 'Messages', 
      href: '/messages', 
      color: 'from-blue-500 to-indigo-500',
      description: '3 conversations en cours'
    },
    { 
      icon: BarChart3, 
      label: 'Résultats', 
      href: '/results', 
      color: 'from-purple-500 to-violet-500',
      description: 'Voir votre analyse'
    },
    { 
      icon: Settings, 
      label: 'Paramètres', 
      href: '/settings', 
      color: 'from-gray-500 to-slate-500',
      description: 'Gérer votre compte'
    }
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header avec salutation */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Salam {user?.email?.split('@')[0] || 'Utilisateur'} 👋
            </h1>
            <p className="text-gray-600 mt-1">
              Votre parcours vers un mariage épanoui continue
            </p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
              <span className="text-sm text-gray-500">En ligne maintenant</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isPremium ? (
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <Download className="w-4 h-4 mr-2" />
                Export PDF
              </Button>
            ) : (
              <Link href="/premium">
                <Button className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600">
                  <Crown className="w-4 h-4 mr-2" />
                  Passer Premium
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
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
                      <p className="text-pink-100 text-sm">Score</p>
                      <p className="text-2xl font-bold">{stats.compatibilityScore}%</p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Messages</p>
                      <p className="text-2xl font-bold">{stats.messagesCount}</p>
                    </div>
                    <MessageSquare className="w-8 h-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-violet-500 text-white">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Vues profil</p>
                      <p className="text-2xl font-bold">{stats.profileViews}</p>
                    </div>
                    <Activity className="w-8 h-8 text-purple-200" />
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
                      <span className="text-sm font-medium">Niveau de compatibilité</span>
                      <span className="text-sm text-gray-500">{stats.compatibilityScore}%</span>
                    </div>
                    <Progress value={stats.compatibilityScore} className="h-2" />
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
                        className={`p-4 rounded-lg border-2 transition-all ${
                          achievement.unlocked 
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
                      className={`p-3 rounded-lg border ${
                        notification.unread 
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
                      <p className="text-xs text-gray-500">Il y a {stats.lastActivity}</p>
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
      </div>
    </div>
  )
}
