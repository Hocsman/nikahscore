'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { useAdmin } from '@/hooks/useAdmin'
import { redirect } from 'next/navigation'

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
    <AdminAnalyticsContent
      analyticsData={analyticsData}
      chartData={chartData}
      funnelData={funnelData}
      onExport={exportData}
    />
  )
}