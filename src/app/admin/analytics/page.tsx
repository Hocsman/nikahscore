'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, FunnelChart, Funnel, LabelList
} from 'recharts'
import { 
  Users, UserCheck, Heart, TrendingUp, Download, Calendar,
  DollarSign, Activity, Target, Award, Zap, ArrowUp, ArrowDown
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { redirect } from 'next/navigation'

// Types pour les analytics
interface AnalyticsData {
  totalUsers: number
  activeUsers: number
  questionnairesCompleted: number
  conversionRate: number
  monthlyGrowth: number
  revenueGrowth: number
}

interface ChartData {
  date: string
  users: number
  conversions: number
  revenue: number
}

interface FunnelData {
  name: string
  value: number
  fill: string
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00']

export default function AdminAnalyticsPage() {
  const { user, loading } = useAuth()
  const { isAdmin, loading: adminLoading } = useAdmin()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [funnelData, setFunnelData] = useState<FunnelData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Vérification des permissions admin
  useEffect(() => {
    if (!loading && !adminLoading) {
      if (!user || !user.email) {
        redirect('/')
      } else if (!isAdmin) {
        // Rediriger les non-admins vers la page d'accueil
        redirect('/')
      }
    }
  }, [user, loading, isAdmin, adminLoading])

  // Chargement des données analytics
  useEffect(() => {
    if (user?.email) {
      loadAnalyticsData()
    }
  }, [user])

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      
      // Simulation de données analytics (remplacer par vraie API)
      const mockAnalytics: AnalyticsData = {
        totalUsers: 1250,
        activeUsers: 890,
        questionnairesCompleted: 742,
        conversionRate: 23.5,
        monthlyGrowth: 15.2,
        revenueGrowth: 28.7
      }

      const mockChartData: ChartData[] = [
        { date: '2024-01', users: 120, conversions: 28, revenue: 1200 },
        { date: '2024-02', users: 180, conversions: 42, revenue: 1800 },
        { date: '2024-03', users: 250, conversions: 65, revenue: 2500 },
        { date: '2024-04', users: 320, conversions: 84, revenue: 3200 },
        { date: '2024-05', users: 450, conversions: 118, revenue: 4500 },
        { date: '2024-06', users: 580, conversions: 152, revenue: 5800 }
      ]

      const mockFunnelData: FunnelData[] = [
        { name: 'Visiteurs', value: 1000, fill: '#8884d8' },
        { name: 'Inscriptions', value: 650, fill: '#82ca9d' },
        { name: 'Questionnaires', value: 420, fill: '#ffc658' },
        { name: 'Conversions', value: 180, fill: '#ff7300' }
      ]

      setAnalyticsData(mockAnalytics)
      setChartData(mockChartData)
      setFunnelData(mockFunnelData)
      
    } catch (err) {
      setError('Erreur lors du chargement des analytics')
      console.error('Analytics error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    console.log('Export des données analytics...')
    // Implémentation de l'export
  }

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des analytics...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="text-red-500 mb-4">❌</div>
            <h3 className="text-lg font-semibold mb-2">Erreur</h3>
            <p className="text-gray-600">{error}</p>
            <Button onClick={loadAnalyticsData} className="mt-4">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!analyticsData) return null

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Admin
            </h1>
            <p className="text-gray-600 mt-2">
              Tableau de bord des métriques business
            </p>
          </div>
          <Button onClick={exportData} className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </Button>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs totaux</p>
                  <p className="text-2xl font-bold">{analyticsData.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="w-8 h-8 text-blue-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{analyticsData.monthlyGrowth}%</span>
                <span className="text-gray-500 ml-1">ce mois</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilisateurs actifs</p>
                  <p className="text-2xl font-bold">{analyticsData.activeUsers.toLocaleString()}</p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">
                  {((analyticsData.activeUsers / analyticsData.totalUsers) * 100).toFixed(1)}% du total
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Questionnaires complétés</p>
                  <p className="text-2xl font-bold">{analyticsData.questionnairesCompleted.toLocaleString()}</p>
                </div>
                <Heart className="w-8 h-8 text-pink-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <span className="text-gray-500">
                  {((analyticsData.questionnairesCompleted / analyticsData.totalUsers) * 100).toFixed(1)}% taux de complétion
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                  <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500" />
              </div>
              <div className="flex items-center mt-2 text-sm">
                <ArrowUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{analyticsData.revenueGrowth}%</span>
                <span className="text-gray-500 ml-1">revenus</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Évolution des utilisateurs */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution des utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Entonnoir de conversion */}
          <Card>
            <CardHeader>
              <CardTitle>Entonnoir de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <FunnelChart>
                  <Funnel
                    data={funnelData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                  >
                    <LabelList position="center" fill="#fff" stroke="none" />
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Funnel>
                  <Tooltip />
                </FunnelChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Graphique des revenus */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des revenus et conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="conversions" fill="#82ca9d" name="Conversions" />
                <Bar dataKey="revenue" fill="#8884d8" name="Revenus (€)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}