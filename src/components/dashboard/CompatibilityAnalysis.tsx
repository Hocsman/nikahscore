'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  TrendingUp,
  TrendingDown,
  Heart,
  Star,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  Brain,
  Handshake,
  Home,
  DollarSign,
  MessageCircle,
  Sparkles
} from 'lucide-react'

interface CompatibilityData {
  dimension: string
  score: number
  fullName: string
  icon: any
  color: string
  description: string
}

interface StrengthArea {
  title: string
  score: number
  description: string
  icon: any
  color: string
  recommendations: string[]
}

interface ImprovementArea {
  title: string
  score: number
  issue: string
  impact: string
  solutions: string[]
  priority: 'high' | 'medium' | 'low'
}

export default function CompatibilityAnalysis() {
  const [compatibilityData, setCompatibilityData] = useState<CompatibilityData[]>([
    {
      dimension: 'Spiritualité',
      score: 95,
      fullName: 'Spiritualité et Valeurs',
      icon: Star,
      color: '#8B5CF6',
      description: 'Excellente harmonie dans vos valeurs spirituelles et religieuses'
    },
    {
      dimension: 'Famille',
      score: 88,
      fullName: 'Vision Familiale',
      icon: Home,
      color: '#EF4444',
      description: 'Très bonne compatibilité sur les projets familiaux'
    },
    {
      dimension: 'Social',
      score: 82,
      fullName: 'Vie Sociale',
      icon: Handshake,
      color: '#10B981',
      description: 'Bonnes affinités sociales et relationnelles'
    },
    {
      dimension: 'Lifestyle',
      score: 76,
      fullName: 'Style de Vie',
      icon: Sparkles,
      color: '#F59E0B',
      description: 'Quelques différences à harmoniser dans vos modes de vie'
    },
    {
      dimension: 'Finance',
      score: 71,
      fullName: 'Gestion Financière',
      icon: DollarSign,
      color: '#3B82F6',
      description: 'Visions financières à aligner davantage'
    },
    {
      dimension: 'Communication',
      score: 85,
      fullName: 'Communication',
      icon: MessageCircle,
      color: '#EC4899',
      description: 'Excellente communication et compréhension mutuelle'
    },
    {
      dimension: 'Projets',
      score: 79,
      fullName: 'Projets de Vie',
      icon: Target,
      color: '#6366F1',
      description: 'Bonne alignement sur vos projets d\'avenir'
    }
  ])

  const [strengths, setStrengths] = useState<StrengthArea[]>([
    {
      title: 'Spiritualité Partagée',
      score: 95,
      description: 'Vous partagez des valeurs spirituelles profondes et une vision commune de la foi',
      icon: Star,
      color: 'text-purple-600',
      recommendations: [
        'Continuez à partager vos moments de spiritualité ensemble',
        'Établissez des rituels spirituels communs',
        'Soutenez-vous mutuellement dans votre cheminement religieux'
      ]
    },
    {
      title: 'Vision Familiale Harmonieuse',
      score: 88,
      description: 'Vos projets familiaux sont en parfaite harmonie',
      icon: Home,
      color: 'text-red-600',
      recommendations: [
        'Planifiez ensemble votre avenir familial',
        'Discutez de vos rôles parentaux souhaités',
        'Préparez un environnement familial stable'
      ]
    },
    {
      title: 'Communication Excellence',
      score: 85,
      description: 'Votre capacité à communiquer est remarquable',
      icon: MessageCircle,
      color: 'text-pink-600',
      recommendations: [
        'Maintenez cette qualité d\'écoute mutuelle',
        'Exprimez régulièrement vos sentiments',
        'Résolvez les conflits par le dialogue'
      ]
    }
  ])

  const [improvements, setImprovements] = useState<ImprovementArea[]>([
    {
      title: 'Gestion Financière',
      score: 71,
      issue: 'Approches différentes de l\'argent et des dépenses',
      impact: 'Peut créer des tensions dans la vie de couple',
      priority: 'high',
      solutions: [
        'Établir un budget commun transparent',
        'Définir des objectifs financiers partagés',
        'Discuter des priorités de dépenses régulièrement',
        'Considérer une formation en gestion financière de couple'
      ]
    },
    {
      title: 'Style de Vie',
      score: 76,
      issue: 'Quelques différences dans vos habitudes quotidiennes',
      impact: 'Nécessite des ajustements pour une harmonie optimale',
      priority: 'medium',
      solutions: [
        'Identifier les habitudes non-négociables pour chacun',
        'Créer de nouvelles traditions communes',
        'Respecter l\'espace personnel de chacun',
        'Trouver des activités communes plaisantes'
      ]
    }
  ])

  const overallScore = Math.round(
    compatibilityData.reduce((sum, item) => sum + item.score, 0) / compatibilityData.length
  )

  const pieData = compatibilityData.map(item => ({
    name: item.dimension,
    value: item.score,
    color: item.color
  }))

  const COLORS = compatibilityData.map(item => item.color)

  return (
    <div className="space-y-6">
      {/* Score Global avec Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="relative"
              >
                <div className="text-6xl font-bold">{overallScore}%</div>
                <div className="absolute -top-2 -right-2">
                  <Heart className="w-8 h-8 text-pink-200 animate-pulse" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-semibold">Score de Compatibilité Global</h2>
              <p className="text-purple-100">
                {overallScore >= 85 
                  ? "Excellente compatibilité ! Vous êtes faits l'un pour l'autre ✨" 
                  : overallScore >= 75 
                  ? "Très bonne compatibilité avec quelques points à harmoniser 💕"
                  : "Bonne base avec des domaines à développer ensemble 💪"
                }
              </p>
              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-6 h-6 ${
                      i < Math.floor(overallScore / 20) 
                        ? 'text-yellow-300 fill-yellow-300' 
                        : 'text-purple-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="strengths">Points Forts</TabsTrigger>
          <TabsTrigger value="improvements">Axes à Revoir</TabsTrigger>
          <TabsTrigger value="recommendations">Recommandations</TabsTrigger>
        </TabsList>

        {/* Vue d'ensemble avec graphiques */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique Radar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Analyse Radar - Compatibilité
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={compatibilityData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="dimension" className="text-sm" />
                    <PolarRadiusAxis domain={[0, 100]} tickCount={5} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8B5CF6"
                      fill="#8B5CF6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Graphique en Barres */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="w-5 h-5 text-blue-500" />
                  Scores par Dimension
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={compatibilityData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="dimension" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="score" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Détails par dimension */}
          <Card>
            <CardHeader>
              <CardTitle>Analyse Détaillée par Dimension</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compatibilityData.map((item, index) => (
                  <motion.div
                    key={item.dimension}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="p-2 rounded-full"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <item.icon 
                          className="w-5 h-5" 
                          style={{ color: item.color }} 
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{item.fullName}</h3>
                        <div className="flex items-center gap-2">
                          <Progress 
                            value={item.score} 
                            className="flex-1 h-2" 
                          />
                          <span className="text-sm font-bold" style={{ color: item.color }}>
                            {item.score}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Points Forts */}
        <TabsContent value="strengths" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {strengths.map((strength, index) => (
              <motion.div
                key={strength.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <strength.icon className={`w-6 h-6 ${strength.color}`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{strength.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {strength.score}% Excellence
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600">{strength.description}</p>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-500" />
                        Recommandations pour maintenir cette force
                      </h4>
                      <ul className="space-y-1">
                        {strength.recommendations.map((rec, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {rec}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Axes à améliorer */}
        <TabsContent value="improvements" className="space-y-6">
          <div className="space-y-4">
            {improvements.map((improvement, index) => (
              <motion.div
                key={improvement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          improvement.priority === 'high' 
                            ? 'bg-red-100' 
                            : improvement.priority === 'medium' 
                            ? 'bg-yellow-100' 
                            : 'bg-blue-100'
                        }`}>
                          <AlertTriangle className={`w-6 h-6 ${
                            improvement.priority === 'high' 
                              ? 'text-red-500' 
                              : improvement.priority === 'medium' 
                              ? 'text-yellow-500' 
                              : 'text-blue-500'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{improvement.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={improvement.score} className="w-24 h-2" />
                            <span className="text-sm font-semibold">{improvement.score}%</span>
                          </div>
                        </div>
                      </div>
                      <Badge 
                        variant={improvement.priority === 'high' ? 'destructive' : 'secondary'}
                        className="capitalize"
                      >
                        Priorité {improvement.priority}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-red-600">
                          🚨 Problème identifié
                        </h4>
                        <p className="text-sm text-gray-600">{improvement.issue}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-2 text-orange-600">
                          ⚡ Impact potentiel
                        </h4>
                        <p className="text-sm text-gray-600">{improvement.impact}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Target className="w-4 h-4 text-green-500" />
                        Solutions recommandées
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {improvement.solutions.map((solution, i) => (
                          <div 
                            key={i} 
                            className="p-3 rounded-lg bg-gray-50 border-l-4 border-green-500"
                          >
                            <p className="text-sm text-gray-700">{solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Recommandations personnalisées */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recommandations à court terme */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  Actions Immédiates (Cette semaine)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-semibold text-sm mb-1">💰 Session Budget</h4>
                  <p className="text-sm text-gray-600">
                    Planifiez 2h cette semaine pour établir votre budget commun et définir vos priorités financières.
                  </p>
                  <Button size="sm" className="mt-2">
                    Planifier maintenant
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded-lg border-l-4 border-green-500">
                  <h4 className="font-semibold text-sm mb-1">🕐 Routine Commune</h4>
                  <p className="text-sm text-gray-600">
                    Identifiez 3 activités que vous aimeriez faire ensemble régulièrement.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Créer la liste
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recommandations à long terme */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  Projets à Long Terme (3-6 mois)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-white rounded-lg border-l-4 border-purple-500">
                  <h4 className="font-semibold text-sm mb-1">📚 Formation Couple</h4>
                  <p className="text-sm text-gray-600">
                    Envisagez un accompagnement en gestion financière de couple pour optimiser votre harmonie.
                  </p>
                  <Button size="sm" className="mt-2">
                    Trouver un conseiller
                  </Button>
                </div>
                
                <div className="p-3 bg-white rounded-lg border-l-4 border-pink-500">
                  <h4 className="font-semibold text-sm mb-1">🏠 Projet Maison</h4>
                  <p className="text-sm text-gray-600">
                    Votre excellent score familial est parfait pour planifier votre futur foyer ensemble.
                  </p>
                  <Button size="sm" variant="outline" className="mt-2">
                    Explorer les options
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Plan d'action personnalisé */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                Votre Plan d'Action Personnalisé - NikahScore
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-green-800">Maintenir vos Forces</h3>
                    <p className="text-sm text-green-600 mt-1">
                      Spiritualité, Famille, Communication
                    </p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <TrendingUp className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-yellow-800">Améliorer</h3>
                    <p className="text-sm text-yellow-600 mt-1">
                      Finances, Style de vie
                    </p>
                  </div>
                  
                  <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
                    <Sparkles className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-blue-800">Optimiser</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      Projets, Relations sociales
                    </p>
                  </div>
                </div>
                
                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <Heart className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                  <h3 className="text-xl font-bold text-purple-800 mb-2">
                    Félicitations ! Votre profil NikahScore est très prometteur
                  </h3>
                  <p className="text-purple-600 mb-4">
                    Avec {overallScore}% de compatibilité, vous avez d'excellentes bases pour construire une relation épanouie et durable. 
                    Continuez à travailler ensemble sur les points d'amélioration identifiés.
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    Télécharger votre rapport complet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}