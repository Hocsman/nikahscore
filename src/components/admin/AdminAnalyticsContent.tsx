'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, FunnelChart, Funnel, LabelList, Cell
} from 'recharts'
import { 
  Users, UserCheck, Heart, TrendingUp, Download,
  ArrowUp
} from 'lucide-react'

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

interface AdminAnalyticsContentProps {
  analyticsData: AnalyticsData
  chartData: ChartData[]
  funnelData: FunnelData[]
  onExport: () => void
}

export default function AdminAnalyticsContent({
  analyticsData,
  chartData,
  funnelData,
  onExport
}: AdminAnalyticsContentProps) {
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
          <Button onClick={onExport} className="flex items-center space-x-2">
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
