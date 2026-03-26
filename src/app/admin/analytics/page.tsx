'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { redirect } from 'next/navigation'
import logger from '@/lib/logger'

// Lazy load du composant lourd contenant recharts (~500KB)
const AdminAnalyticsContent = dynamic(
  () => import('@/components/admin/AdminAnalyticsContent'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des graphiques analytics...</p>
          <p className="text-sm text-gray-500 mt-2">Optimisation bundle en cours</p>
        </div>
      </div>
    )
  }
)

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

      const res = await fetch('/api/analytics')
      if (!res.ok) throw new Error('Erreur API analytics')
      const json = await res.json()
      const data = json.data

      const overview = data?.overview || {}
      const funnel = data?.funnel || {}
      const eventsByType = overview.eventsByType || {}

      const totalUsers = overview.uniqueUsers || 0
      const questionnairesCompleted = eventsByType['questionnaire_completed'] || 0
      const questionnairesStarted = eventsByType['questionnaire_started'] || 0

      setAnalyticsData({
        totalUsers,
        activeUsers: overview.uniqueSessions || 0,
        questionnairesCompleted,
        conversionRate: questionnairesStarted > 0
          ? parseFloat(((questionnairesCompleted / questionnairesStarted) * 100).toFixed(1))
          : 0,
        monthlyGrowth: 0,
        revenueGrowth: 0,
      })

      // Pas de données temporelles dans l'API actuelle, on laisse vide
      setChartData([])

      setFunnelData([
        { name: 'Sessions', value: overview.uniqueSessions || 0, fill: '#8884d8' },
        { name: 'Inscrits', value: totalUsers, fill: '#82ca9d' },
        { name: 'Questionnaires', value: funnel.questionnaire_started || 0, fill: '#ffc658' },
        { name: 'Complétés', value: funnel.questionnaire_completed || 0, fill: '#ff7300' },
      ])

    } catch (err) {
      setError('Erreur lors du chargement des analytics')
      logger.error('Analytics error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const exportData = () => {
    // Export analytics - fonctionnalité à venir
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
    <AdminAnalyticsContent
      analyticsData={analyticsData}
      chartData={chartData}
      funnelData={funnelData}
      onExport={exportData}
    />
  )
}