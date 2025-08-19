'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { 
  RadialBarChart, 
  RadialBar, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  Legend,
  Tooltip,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  Award, 
  Star, 
  TrendingUp, 
  Heart, 
  Target,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Download,
  Share2,
  ArrowRight,
  Trophy,
  Zap,
  Users,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Lightbulb,
  ArrowLeft
} from 'lucide-react'

interface Question {
  id: number
  axis: string
  text: string
  category: 'bool' | 'scale'
  weight: number
  is_dealbreaker: boolean
  order_index: number
}

interface AxisScore {
  axis: string
  score: number
  maxScore: number
  percentage: number
  questionCount: number
  dealbreakers: number
  dealbreakersPassed: number
}

interface CompatibilityResult {
  globalScore: number
  axisScores: AxisScore[]
  dealbreakersTotal: number
  dealbreakersPassed: number
  recommendations: string[]
  strengths: string[]
  concerns: string[]
  responsesCount: number
}

// Composant de badge de score animé
const ScoreDisplay = ({ score, label, delay = 0 }: { score: number, label: string, delay?: number }) => {
  const [displayScore, setDisplayScore] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        const interval = setInterval(() => {
          setDisplayScore(prev => {
            if (prev >= score) {
              clearInterval(interval)
              return score
            }
            return Math.min(prev + Math.ceil(score / 50), score)
          })
        }, 30)
      }, delay)
    }
  }, [isInView, score, delay])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-600'
    if (score >= 65) return 'from-blue-500 to-indigo-600'
    if (score >= 50) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-600'
  }

  return (
    <div ref={ref} className="text-center">
      <motion.div
        className={`text-6xl font-bold bg-gradient-to-br ${getScoreColor(score)} bg-clip-text text-transparent mb-2`}
        animate={isInView ? { scale: [0.5, 1.1, 1] } : {}}
        transition={{ duration: 0.8, delay: delay / 1000 }}
      >
        {displayScore}%
      </motion.div>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  )
}

// Composant graphique radar animé
const AnimatedRadarChart = ({ data }: { data: any[] }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [animatedData, setAnimatedData] = useState(data.map(item => ({ ...item, score: 0 })))

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        setAnimatedData(data)
      }, 300)
    }
  }, [isInView, data])

  return (
    <div ref={ref}>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={animatedData}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: '#6b7280' }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} />
          <Radar 
            name="Score" 
            dataKey="score" 
            stroke="#3b82f6" 
            fill="#3b82f6" 
            fillOpacity={0.3}
            strokeWidth={3}
            animationBegin={300}
            animationDuration={1500}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Score']}
            labelStyle={{ color: '#1f2937' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Composant graphique en barres animé
const AnimatedBarChart = ({ data }: { data: AxisScore[] }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis 
            dataKey="axis" 
            angle={-45}
            textAnchor="end"
            height={120}
            fontSize={12}
            tick={{ fill: '#6b7280' }}
          />
          <YAxis tick={{ fill: '#6b7280' }} />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Score']}
            labelStyle={{ color: '#1f2937' }}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
            }}
          />
          <Bar 
            dataKey="percentage" 
            radius={[8, 8, 0, 0]}
            animationBegin={isInView ? 0 : 999999}
            animationDuration={1200}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={
                  entry.percentage >= 80 ? '#10b981' : 
                  entry.percentage >= 65 ? '#3b82f6' : 
                  entry.percentage >= 50 ? '#f59e0b' : '#ef4444'
                } 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// Composant de carte de statut animé
const StatusCard = ({ 
  icon: Icon, 
  title, 
  value, 
  description, 
  color = 'blue',
  delay = 0 
}: {
  icon: any,
  title: string,
  value: string | number,
  description: string,
  color?: 'blue' | 'green' | 'yellow' | 'red',
  delay?: number
}) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  const colorClasses = {
    blue: {
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      icon: 'text-blue-600 bg-blue-100',
      value: 'text-blue-700'
    },
    green: {
      bg: 'from-green-50 to-emerald-50',
      border: 'border-green-200',
      icon: 'text-green-600 bg-green-100',
      value: 'text-green-700'
    },
    yellow: {
      bg: 'from-yellow-50 to-orange-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600 bg-yellow-100',
      value: 'text-yellow-700'
    },
    red: {
      bg: 'from-red-50 to-pink-50',
      border: 'border-red-200',
      icon: 'text-red-600 bg-red-100',
      value: 'text-red-700'
    }
  }

  return (
    <motion.div
      ref={ref}
      className={`p-6 rounded-2xl bg-gradient-to-br ${colorClasses[color].bg} border ${colorClasses[color].border} shadow-sm`}
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={isInView ? { 
        opacity: 1, 
        scale: 1, 
        y: 0 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: delay / 1000,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      whileHover={{ 
        scale: 1.02,
        transition: { duration: 0.2 }
      }}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-xl ${colorClasses[color].icon}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <div className={`text-2xl font-bold ${colorClasses[color].value} mb-1`}>
            {value}
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default function EnhancedResultsPage() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [responses, setResponses] = useState<{[key: number]: boolean | number}>({})
  const [result, setResult] = useState<CompatibilityResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('overview')
  const [showDetailedView, setShowDetailedView] = useState(false)

  useEffect(() => {
    loadDataAndCalculate()
  }, [])

  const loadDataAndCalculate = async () => {
    try {
      setLoading(true)
      
      // Charger les questions
      const questionsResponse = await fetch('/api/questions')
      const questionsData = await questionsResponse.json()
      
      if (!questionsData.questions?.length) {
        setError('Aucune question trouvée')
        return
      }

      // Charger les réponses depuis localStorage
      const savedResponses = localStorage.getItem('nikahscore-responses')
      if (!savedResponses) {
        setError('Aucune réponse trouvée. Veuillez d\'abord compléter le questionnaire.')
        return
      }

      const parsedResponses = JSON.parse(savedResponses)
      
      setQuestions(questionsData.questions)
      setResponses(parsedResponses)
      
      // Calculer les résultats
      const compatibilityResult = calculateCompatibility(questionsData.questions, parsedResponses)
      setResult(compatibilityResult)
      
    } catch (err) {
      console.error('Erreur chargement résultats:', err)
      setError('Erreur lors du calcul des résultats')
    } finally {
      setLoading(false)
    }
  }

  const calculateCompatibility = (questions: Question[], responses: {[key: number]: boolean | number}): CompatibilityResult => {
    // Logique de calcul simplifiée pour la démo
    const axiGroups: {[key: string]: Question[]} = {}
    questions.forEach(q => {
      if (!axiGroups[q.axis]) {
        axiGroups[q.axis] = []
      }
      axiGroups[q.axis].push(q)
    })

    const axisScores: AxisScore[] = []
    let totalScore = 0
    let totalMaxScore = 0
    let dealbreakersTotal = 0
    let dealbreakersPassed = 0

    // Calculer le score par axe
    Object.entries(axiGroups).forEach(([axis, axisQuestions]) => {
      let axisScore = 0
      let axisMaxScore = 0
      let axisDealbreakersPassed = 0
      let axisDealbreakerTotal = 0

      axisQuestions.forEach(question => {
        const response = responses[question.id]
        if (response !== undefined) {
          if (question.category === 'bool') {
            const score = response ? question.weight : 0
            axisScore += score
            axisMaxScore += question.weight
            
            if (question.is_dealbreaker) {
              axisDealbreakerTotal++
              dealbreakersTotal++
              if (response) {
                axisDealbreakersPassed++
                dealbreakersPassed++
              }
            }
          } else if (question.category === 'scale') {
            const normalizedScore = ((response as number) / 5) * question.weight
            axisScore += normalizedScore
            axisMaxScore += question.weight
            
            if (question.is_dealbreaker) {
              axisDealbreakerTotal++
              dealbreakersTotal++
              if ((response as number) >= 4) {
                axisDealbreakersPassed++
                dealbreakersPassed++
              }
            }
          }
        }
      })

      const percentage = axisMaxScore > 0 ? (axisScore / axisMaxScore) * 100 : 0
      
      axisScores.push({
        axis,
        score: Math.round(axisScore * 10) / 10,
        maxScore: axisMaxScore,
        percentage: Math.round(percentage),
        questionCount: axisQuestions.length,
        dealbreakers: axisDealbreakerTotal,
        dealbreakersPassed: axisDealbreakersPassed
      })

      totalScore += axisScore
      totalMaxScore += axisMaxScore
    })

    const globalScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0

    // Générer des recommandations et points forts
    const recommendations = generateRecommendations(axisScores, globalScore)
    const strengths = generateStrengths(axisScores)
    const concerns = generateConcerns(axisScores)

    return {
      globalScore,
      axisScores: axisScores.sort((a, b) => b.percentage - a.percentage),
      dealbreakersTotal,
      dealbreakersPassed,
      recommendations,
      strengths,
      concerns,
      responsesCount: Object.keys(responses).length
    }
  }

  const generateRecommendations = (axisScores: AxisScore[], globalScore: number): string[] => {
    const recs = []
    
    if (globalScore >= 85) {
      recs.push("Excellent profil ! Vous avez une vision très claire du mariage islamique.")
    } else if (globalScore >= 70) {
      recs.push("Très bon profil de compatibilité. Vos attentes sont bien définies.")
    } else if (globalScore >= 55) {
      recs.push("Profil correct. Quelques aspects méritent une réflexion approfondie.")
    } else {
      recs.push("Il serait bénéfique de clarifier davantage vos attentes matrimoniales.")
    }

    // Recommandations spécifiques par axe faible
    const weakAxes = axisScores.filter(axis => axis.percentage < 60).slice(0, 2)
    weakAxes.forEach(axis => {
      recs.push(`${axis.axis} : Domaine à approfondir pour plus de clarté.`)
    })

    return recs.slice(0, 4)
  }

  const generateStrengths = (axisScores: AxisScore[]): string[] => {
    return axisScores
      .filter(axis => axis.percentage >= 80)
      .map(axis => `${axis.axis} : Vision très claire (${axis.percentage}%)`)
      .slice(0, 4)
  }

  const generateConcerns = (axisScores: AxisScore[]): string[] => {
    return axisScores
      .filter(axis => axis.percentage < 60)
      .map(axis => `${axis.axis} : Nécessite une réflexion (${axis.percentage}%)`)
      .slice(0, 3)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-8">
            <motion.div 
              className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute top-2 left-1/2 transform -translate-x-1/2 w-16 h-16 border-4 border-purple-400 border-b-transparent rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
            <motion.div 
              className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 border-4 border-green-400 border-r-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          <motion.h2 
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Analyse de vos réponses...
          </motion.h2>
          <motion.p 
            className="text-gray-600 text-lg mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Calcul de votre score de compatibilité
          </motion.p>
          
          <div className="flex justify-center space-x-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                animate={{ 
                  scale: [1, 1.8, 1], 
                  opacity: [0.4, 1, 0.4] 
                }}
                transition={{ 
                  duration: 1.8, 
                  repeat: Infinity, 
                  delay: i * 0.2 
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-8 max-w-md w-full text-center border-red-200">
            <motion.div 
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </motion.div>
            <h2 className="text-xl font-semibold text-red-800 mb-4">Erreur</h2>
            <p className="text-red-600 mb-6">{error}</p>
            <Link href="/questionnaire">
              <Button className="w-full bg-red-600 hover:bg-red-700">
                Refaire le questionnaire
              </Button>
            </Link>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (!result) return null

  const radarData = result.axisScores.map(axis => ({
    axis: axis.axis.length > 12 ? axis.axis.substring(0, 12) + '...' : axis.axis,
    score: axis.percentage
  }))

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header avec navigation */}
      <motion.div 
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/questionnaire">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Vos Résultats NikahScore
                </h1>
                <p className="text-sm text-gray-600">
                  Analyse basée sur {result.responsesCount} réponses
                </p>
              </div>
            </div>
            
            {/* Tabs navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
              {[
                { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
                { id: 'details', label: 'Détails', icon: PieChartIcon },
                { id: 'recommendations', label: 'Conseils', icon: Lightbulb }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-sm' 
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {/* Vue d'ensemble */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              {/* Score principal avec animation */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
              >
                <Card className="p-8 text-center bg-gradient-to-br from-white to-blue-50 border-0 shadow-2xl">
                  <motion.div
                    className="mb-6"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="50" 
                          fill="none" 
                          stroke="#e5e7eb" 
                          strokeWidth="10"
                        />
                        <motion.circle
                          cx="60"
                          cy="60"
                          r="50"
                          fill="none"
                          stroke="url(#gradient)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={`${2 * Math.PI * 50}`}
                          initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                          animate={{ 
                            strokeDashoffset: 2 * Math.PI * 50 * (1 - result.globalScore / 100) 
                          }}
                          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ScoreDisplay score={result.globalScore} label="" />
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.h2 
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.6 }}
                  >
                    Score Global de Compatibilité
                  </motion.h2>
                  
                  <motion.p 
                    className="text-lg text-gray-600 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    Basé sur {result.responsesCount} réponses personnalisées
                  </motion.p>

                  <motion.div 
                    className="grid md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <StatusCard
                      icon={CheckCircle}
                      title="Critères Essentiels"
                      value={`${result.dealbreakersPassed}/${result.dealbreakersTotal}`}
                      description="Critères fondamentaux validés"
                      color={result.dealbreakersPassed / result.dealbreakersTotal >= 0.8 ? 'green' : 'yellow'}
                      delay={200}
                    />
                    <StatusCard
                      icon={Target}
                      title="Domaines Évalués"
                      value={result.axisScores.length}
                      description="Axes de compatibilité analysés"
                      color="blue"
                      delay={400}
                    />
                    <StatusCard
                      icon={Star}
                      title="Points Forts"
                      value={result.strengths.length}
                      description="Domaines d'excellence identifiés"
                      color="green"
                      delay={600}
                    />
                  </motion.div>
                </Card>
              </motion.div>

              {/* Graphiques de vue d'ensemble */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Graphique Radar */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <Card className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <Activity className="w-5 h-5 text-blue-600" />
                        <span>Profil de Compatibilité</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnimatedRadarChart data={radarData} />
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Graphique en Barres */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                >
                  <Card className="p-6">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center space-x-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        <span>Scores par Domaine</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <AnimatedBarChart data={result.axisScores} />
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Points forts et préoccupations */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Points forts */}
                {result.strengths.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                  >
                    <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-green-700">
                          <Trophy className="w-5 h-5" />
                          <span>Vos Points Forts</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.strengths.map((strength, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start space-x-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.4 + index * 0.1 }}
                            >
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-green-800 font-medium">{strength}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* Points d'attention */}
                {result.concerns.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.6 }}
                  >
                    <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                      <CardHeader className="pb-4">
                        <CardTitle className="flex items-center space-x-2 text-orange-700">
                          <AlertTriangle className="w-5 h-5" />
                          <span>Points d'Attention</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.concerns.map((concern, index) => (
                            <motion.div
                              key={index}
                              className="flex items-start space-x-3"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 1.6 + index * 0.1 }}
                            >
                              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                              <p className="text-orange-800 font-medium">{concern}</p>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {/* Vue détaillée */}
          {activeTab === 'details' && (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Analyse Détaillée par Domaine</h2>
              
              <div className="grid gap-6">
                {result.axisScores.map((axis, index) => (
                  <motion.div
                    key={axis.axis}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800">{axis.axis}</h3>
                        <Badge 
                          className={`text-white ${
                            axis.percentage >= 80 ? 'bg-green-500' :
                            axis.percentage >= 65 ? 'bg-blue-500' :
                            axis.percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                        >
                          {axis.percentage}%
                        </Badge>
                      </div>
                      
                      <div className="mb-4">
                        <Progress value={axis.percentage} className="h-3" />
                      </div>
                      
                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">{axis.questionCount}</span> questions
                        </div>
                        <div>
                          <span className="font-medium">{axis.dealbreakersPassed}/{axis.dealbreakers}</span> critères essentiels
                        </div>
                        <div>
                          Score: <span className="font-medium">{axis.score.toFixed(1)}/{axis.maxScore}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Recommandations */}
          {activeTab === 'recommendations' && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center space-x-2 text-blue-700 text-2xl">
                    <Lightbulb className="w-6 h-6" />
                    <span>Recommandations Personnalisées</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {result.recommendations.map((recommendation, index) => (
                      <motion.div
                        key={index}
                        className="p-6 bg-white rounded-xl border border-blue-200 shadow-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2, duration: 0.5 }}
                      >
                        <div className="flex items-start space-x-4">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
                          </div>
                          <p className="text-gray-800 leading-relaxed font-medium">{recommendation}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Call-to-action */}
              <motion.div
                className="text-center p-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  Prêt(e) à passer à l'étape suivante ?
                </h3>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Ces résultats sont un point de départ pour mieux vous connaître. 
                  Continuez votre parcours avec nos conseils personnalisés.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Download className="w-5 h-5 mr-2" />
                    Télécharger le rapport PDF
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="w-5 h-5 mr-2" />
                    Partager mes résultats
                  </Button>
                  <Link href="/questionnaire">
                    <Button size="lg" variant="ghost">
                      Refaire le test
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
