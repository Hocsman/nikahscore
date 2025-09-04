'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts'
import { 
  Users, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  Activity,
  UserCheck,
  Calendar,
  Target,
  Zap,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  Star,
  Award,
  Download
} from 'lucide-react'

interface DashboardMetrics {
  totalUsers: number
  activeUsers: number
  newUsers: number
  totalMatches: number
  messagesCount: number
  revenue: number
  conversionRate: number
  retentionRate: number
}

interface ChartData {
  date: string
  users: number
  matches: number
  messages: number
  revenue: number
}

export default function AdminAnalytics() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalUsers: 1247,
    activeUsers: 892,
    newUsers: 127,
    totalMatches: 3456,
    messagesCount: 15678,
    revenue: 8940,
    conversionRate: 12.4,
    retentionRate: 68.2
  })

  const [chartData, setChartData] = useState<ChartData[]>([
    { date: '01/01', users: 120, matches: 45, messages: 234, revenue: 1200 },
    { date: '02/01', users: 145, matches: 67, messages: 289, revenue: 1450 },
    { date: '03/01', users: 162, matches: 78, messages: 356, revenue: 1680 },
    { date: '04/01', users: 178, matches: 89, messages: 412, revenue: 1890 },
    { date: '05/01', users: 195, matches: 102, messages: 478, revenue: 2140 },
    { date: '06/01', users: 212, matches: 118, messages: 534, revenue: 2380 },
    { date: '07/01', users: 234, matches: 134, messages: 598, revenue: 2650 }
  ])

  const deviceData = [
    { name: 'Mobile', value: 65, color: '#ec4899' },
    { name: 'Desktop', value: 28, color: '#8b5cf6' },
    { name: 'Tablet', value: 7, color: '#06b6d4' }
  ]

  const ageData = [
    { age: '18-24', users: 145, matches: 67 },
    { age: '25-29', users: 234, matches: 112 },
    { age: '30-34', users: 189, matches: 89 },
    { age: '35-39', users: 123, matches: 56 },
    { age: '40+', users: 89, matches: 34 }
  ]

  const timeData = [
    { hour: '00h', activity: 12 },
    { hour: '04h', activity: 8 },
    { hour: '08h', activity: 45 },
    { hour: '12h', activity: 78 },
    { hour: '16h', activity: 89 },
    { hour: '20h', activity: 134 },
    { hour: '23h', activity: 67 }
  ]

  const conversionFunnel = [
    { stage: 'Visiteurs', count: 10000, percentage: 100, color: '#e5e7eb' },
    { stage: 'Inscription', count: 2500, percentage: 25, color: '#ec4899' },
    { stage: 'Profil complet', count: 1875, percentage: 75, color: '#8b5cf6' },
    { stage: 'Premier match', count: 1250, percentage: 67, color: '#06b6d4' },
    { stage: 'Conversation', count: 875, percentage: 70, color: '#10b981' },
    { stage: 'Premium', count: 125, percentage: 14, color: '#f59e0b' }
  ]

  const exportData = () => {
    const data = {
      metrics,
      chartData,
      deviceData,
      ageData,
      conversionFunnel,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `nikahscore-analytics-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Analytics Admin 📊
            </h1>
            <p className="text-gray-600 mt-1">
              Tableau de bord complet des métriques NikahScore
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={exportData} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exporter
            </Button>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Mis à jour il y a 2min
            </Badge>
          </div>
        </motion.div>

        {/* Métriques principales */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Utilisateurs</p>
                  <p className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-blue-200 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    +{metrics.newUsers} ce mois
                  </p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm">Total Matches</p>
                  <p className="text-2xl font-bold">{metrics.totalMatches.toLocaleString()}</p>
                  <p className="text-xs text-pink-200 flex items-center gap-1 mt-1">
                    <Heart className="w-3 h-3" />
                    +12% ce mois
                  </p>
                </div>
                <Heart className="w-8 h-8 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Chiffre d'Affaires</p>
                  <p className="text-2xl font-bold">{metrics.revenue.toLocaleString()}€</p>
                  <p className="text-xs text-green-200 flex items-center gap-1 mt-1">
                    <DollarSign className="w-3 h-3" />
                    +18% ce mois
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Taux Conversion</p>
                  <p className="text-2xl font-bold">{metrics.conversionRate}%</p>
                  <p className="text-xs text-purple-200 flex items-center gap-1 mt-1">
                    <Target className="w-3 h-3" />
                    +2.3% ce mois
                  </p>
                </div>
                <Target className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="revenue">Revenus</TabsTrigger>
            <TabsTrigger value="conversion">Conversion</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Graphiques principaux */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-500" />
                      Croissance Utilisateurs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="users"
                          stroke="#ec4899"
                          fillOpacity={1}
                          fill="url(#colorUsers)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      Répartition Appareils
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={deviceData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name} ${value}%`}
                        >
                          {deviceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Répartition par Âge</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="age" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#ec4899" />
                      <Bar dataKey="matches" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activité par Heure</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={timeData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="hour" />
                      <YAxis />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="activity" 
                        stroke="#ec4899" 
                        strokeWidth={3}
                        dot={{ fill: '#ec4899' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="conversion" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-500" />
                  Entonnoir de Conversion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conversionFunnel.map((stage, index) => (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-700">{stage.stage}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">{stage.count.toLocaleString()}</span>
                          <Badge variant="outline" style={{ color: stage.color, borderColor: stage.color }}>
                            {stage.percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(stage.count / conversionFunnel[0].count) * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ backgroundColor: stage.color }}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
