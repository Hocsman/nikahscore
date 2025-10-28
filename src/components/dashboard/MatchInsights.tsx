'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Heart,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Star,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Crown,
  Target,
  ThumbsUp,
  Filter
} from 'lucide-react'

interface Match {
  id: string
  name: string
  age: number
  city: string
  compatibilityScore: number
  lastSeen: string
  avatar: string
  mutualInterests: string[]
  isOnline: boolean
  isPremium: boolean
}

interface ViewsData {
  date: string
  views: number
  matches: number
  messages: number
}

export default function MatchInsights() {
  const [matches, setMatches] = useState<Match[]>([
    {
      id: '1',
      name: 'Amina K.',
      age: 26,
      city: 'Paris',
      compatibilityScore: 94,
      lastSeen: 'En ligne',
      avatar: '/avatars/amina.jpg',
      mutualInterests: ['Spiritualité', 'Famille', 'Voyages'],
      isOnline: true,
      isPremium: true
    },
    {
      id: '2',
      name: 'Sara M.',
      age: 24,
      city: 'Lyon',
      compatibilityScore: 89,
      lastSeen: 'Il y a 2h',
      avatar: '/avatars/sara.jpg',
      mutualInterests: ['Lecture', 'Cuisine', 'Sport'],
      isOnline: false,
      isPremium: false
    },
    {
      id: '3',
      name: 'Leila B.',
      age: 28,
      city: 'Marseille',
      compatibilityScore: 87,
      lastSeen: 'Il y a 1 jour',
      avatar: '/avatars/leila.jpg',
      mutualInterests: ['Art', 'Nature', 'Bénévolat'],
      isOnline: false,
      isPremium: true
    }
  ])

  const [viewsData, setViewsData] = useState<ViewsData[]>([
    { date: 'Lun', views: 23, matches: 3, messages: 5 },
    { date: 'Mar', views: 34, matches: 5, messages: 8 },
    { date: 'Mer', views: 28, matches: 2, messages: 6 },
    { date: 'Jeu', views: 45, matches: 7, messages: 12 },
    { date: 'Ven', views: 52, matches: 4, messages: 9 },
    { date: 'Sam', views: 67, matches: 8, messages: 15 },
    { date: 'Dim', views: 41, matches: 6, messages: 10 }
  ])

  const interestDistribution = [
    { name: 'Spiritualité', value: 35, color: '#8B5CF6' },
    { name: 'Famille', value: 28, color: '#EF4444' },
    { name: 'Carrière', value: 20, color: '#10B981' },
    { name: 'Voyages', value: 17, color: '#F59E0B' }
  ]

  const totalViews = viewsData.reduce((sum, day) => sum + day.views, 0)
  const totalMatches = viewsData.reduce((sum, day) => sum + day.matches, 0)
  const totalMessages = viewsData.reduce((sum, day) => sum + day.messages, 0)

  return (
    <div className="space-y-6">
      {/* Statistiques de la semaine */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Vues Profil</p>
                  <p className="text-2xl font-bold text-blue-700">{totalViews}</p>
                  <p className="text-xs text-blue-500">Cette semaine</p>
                </div>
                <Eye className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-600 text-sm font-medium">Nouveaux Matchs</p>
                  <p className="text-2xl font-bold text-pink-700">{totalMatches}</p>
                  <p className="text-xs text-pink-500">Cette semaine</p>
                </div>
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Messages</p>
                  <p className="text-2xl font-bold text-green-700">{totalMessages}</p>
                  <p className="text-xs text-green-500">Cette semaine</p>
                </div>
                <MessageCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Taux Réponse</p>
                  <p className="text-2xl font-bold text-purple-700">78%</p>
                  <p className="text-xs text-purple-500">Excellent score</p>
                </div>
                <ThumbsUp className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Graphique d'activité */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Activité de la Semaine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={viewsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stackId="1" 
                  stroke="#3B82F6" 
                  fill="#93C5FD" 
                  name="Vues"
                />
                <Area 
                  type="monotone" 
                  dataKey="matches" 
                  stackId="1" 
                  stroke="#EC4899" 
                  fill="#F9A8D4" 
                  name="Matchs"
                />
                <Area 
                  type="monotone" 
                  dataKey="messages" 
                  stackId="1" 
                  stroke="#10B981" 
                  fill="#86EFAC" 
                  name="Messages"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribution des intérêts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-500" />
              Affinités Communes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={interestDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {interestDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {interestDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Meilleurs matchs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              Vos Meilleurs Matchs
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filtrer
              </Button>
              <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                Voir tous
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {matches.map((match, index) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-lg border bg-gradient-to-r from-white to-gray-50 hover:shadow-md transition-shadow"
              >
                <div className="relative">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={match.avatar} alt={match.name} />
                    <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-semibold">
                      {match.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  {match.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                  {match.isPremium && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className="w-5 h-5 text-yellow-500" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">{match.name}</h3>
                    <Badge 
                      variant="secondary" 
                      className="bg-gradient-to-r from-pink-500 to-purple-500 text-white"
                    >
                      {match.compatibilityScore}% compatibles
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {match.age} ans
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {match.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {match.lastSeen}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {match.mutualInterests.map((interest, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <Button variant="ghost" className="text-purple-600 hover:text-purple-700">
              Découvrir plus de profils compatibles
              <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conseils d'optimisation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Optimisez votre Visibilité
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Heures d'activité optimales</p>
                <p className="text-sm text-gray-600">18h-21h : +67% de vues en moyenne</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Taux de réponse excellent</p>
                <p className="text-sm text-gray-600">Continuez vos conversations authentiques</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-500" />
              Prochaines Étapes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Planifiez une rencontre</p>
                <p className="text-sm text-gray-600">3 matchs sont prêts pour une conversation vidéo</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
              <div>
                <p className="font-medium text-sm">Mettez à jour vos préférences</p>
                <p className="text-sm text-gray-600">Affinez vos critères pour de meilleurs matchs</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}