'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Tooltip,
  Legend
} from 'recharts'
import {
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Eye,
  MousePointer,
  CreditCard,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Crown,
  Zap
} from 'lucide-react'

interface AnalyticsData {
  overview: {
    totalEvents: number
    uniqueSessions: number
    uniqueUsers: number
    eventsByType: Record<string, number>
  }
  funnel: {
    questionnaire_started: number
    questionnaire_completed: number
    premium_features_clicked: number
    upgrade_buttons_clicked: number
    registrations: number
  }
  conversion: {
    completion_rate: string
    premium_interest_rate: string
    upgrade_click_rate: string
  }
  premiumFeatures: Record<string, number>
  dailyStats: Array<{
    date: string
    events: number
    sessions: number
    conversions: number
  }>
}

const COLORS = ['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#6366F1']

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [activeTab, setActiveTab] = useState<'overview' | 'funnel' | 'premium' | 'abtest'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90
      const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()
      
      const response = await fetch(`/api/analytics?start_date=${startDate}`)
      const result = await response.json()
      
      if (result.success) {
        setData(result.data)
      }
    } catch (error) {
      console.error('Erreur chargement analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Erreur de chargement des données</p>
      </div>
    )
  }

  const premiumFeatureData = Object.entries(data.premiumFeatures || {}).map(([feature, count], index) => ({
    name: feature,
    value: count,
    color: COLORS[index % COLORS.length]
  }))

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Dashboard Analytics NikahScore
          </h1>
          <p className="text-gray-600">
            Surveillez les performances et optimisez vos conversions
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            {(['overview', 'funnel', 'premium', 'abtest'] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'overview' && <BarChart3 className="w-4 h-4 mr-2" />}
                {tab === 'funnel' && <Target className="w-4 h-4 mr-2" />}
                {tab === 'premium' && <Crown className="w-4 h-4 mr-2" />}
                {tab === 'abtest' && <Zap className="w-4 h-4 mr-2" />}
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Button>
            ))}
          </div>
          
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Sessions Uniques
                    </CardTitle>
                    <Users className="h-4 w-4 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {(data.overview?.uniqueSessions || 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Utilisateurs
                    </CardTitle>
                    <Eye className="h-4 w-4 text-green-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {(data.overview?.uniqueUsers || 0).toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Taux de Completion
                    </CardTitle>
                    <Target className="h-4 w-4 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {data.conversion?.completion_rate || 0}%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      Intérêt Premium
                    </CardTitle>
                    <Crown className="h-4 w-4 text-yellow-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">
                      {data.conversion?.premium_interest_rate || 0}%
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution Quotidienne</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.dailyStats || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sessions" stroke="#3B82F6" name="Sessions" />
                      <Line type="monotone" dataKey="conversions" stroke="#10B981" name="Conversions" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition des Événements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={Object.entries(data.overview.eventsByType || {}).map(([key, value]) => ({
                      name: key.replace('_', ' '),
                      count: value
                    }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8B5CF6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Funnel Tab */}
        {activeTab === 'funnel' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Entonnoir de Conversion</CardTitle>
                <p className="text-sm text-gray-600">
                  Suivez le parcours utilisateur et identifiez les points de friction
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(data.funnel || {}).map(([step, count], index) => {
                    const totalStarted = data.funnel?.questionnaire_started || 1
                    const percentage = (count / totalStarted * 100).toFixed(1)
                    
                    return (
                      <div key={step} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {step.replace('_', ' ')}
                          </span>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold">{count}</span>
                            <Badge variant="secondary">{percentage}%</Badge>
                          </div>
                        </div>
                        <Progress value={parseInt(percentage)} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Premium Tab */}
        {activeTab === 'premium' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Fonctionnalités Premium Populaires</CardTitle>
                <p className="text-sm text-gray-600">
                  Découvrez quelles fonctionnalités génèrent le plus d'intérêt
                </p>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={premiumFeatureData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {premiumFeatureData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}

        {/* A/B Test Tab */}
        {activeTab === 'abtest' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>A/B Testing - Messages Premium</CardTitle>
                <p className="text-sm text-gray-600">
                  Testez différents messages pour optimiser vos conversions
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h3 className="font-medium text-blue-900 mb-2">💡 Recommandations d'optimisation</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Tester des call-to-action plus urgents ("Débloquer maintenant" vs "Voir les plans")</li>
                      <li>• Expérimenter avec des preuves sociales ("Rejoint par +1000 couples")</li>
                      <li>• Tester différents prix d'ancrage (montrer d'abord le plan le plus cher)</li>
                      <li>• Utiliser la rareté ("Offre limitée" ou "Places limitées")</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
