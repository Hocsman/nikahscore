'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Heart, 
  Star, 
  TrendingUp, 
  Target,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  BookOpen,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  Award,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'

interface InteractiveResultsProps {
  result: any
  onAction: (action: string) => void
}

export default function InteractiveResults({ result, onAction }: InteractiveResultsProps) {
  const [selectedAxis, setSelectedAxis] = useState<string | null>(null)
  const [showTips, setShowTips] = useState(false)
  const [currentTip, setCurrentTip] = useState(0)

  const personalizedTips = [
    {
      icon: Heart,
      title: "Travaillez sur vos priorités",
      description: "Les axes avec moins de 60% méritent une réflexion approfondie",
      action: "Voir le guide des priorités"
    },
    {
      icon: BookOpen,
      title: "Approfondissez vos connaissances",
      description: "Consultez nos ressources sur le mariage islamique",
      action: "Accéder aux ressources"
    },
    {
      icon: Users,
      title: "Échangez avec la communauté",
      description: "Rejoignez nos discussions sur les valeurs matrimoniales",
      action: "Rejoindre le forum"
    }
  ]

  const nextSteps = [
    {
      icon: Target,
      title: "Affinez votre profil",
      description: "Améliorez vos axes les plus faibles",
      urgency: "high",
      timeEstimate: "15 min"
    },
    {
      icon: MessageSquare,
      title: "Partagez avec un conseiller",
      description: "Obtenez des conseils personnalisés",
      urgency: "medium",
      timeEstimate: "30 min"
    },
    {
      icon: Calendar,
      title: "Planifiez votre parcours",
      description: "Établissez un plan d'action",
      urgency: "low",
      timeEstimate: "1h"
    }
  ]

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-50 border-green-200'
    if (score >= 65) return 'text-blue-600 bg-blue-50 border-blue-200'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-green-500 bg-green-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  return (
    <div className="space-y-8">
      {/* Score principal avec animation interactive */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <Card className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-purple-500/10"></div>
          <CardContent className="relative p-8 text-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`inline-flex items-center justify-center w-32 h-32 rounded-full border-4 ${getScoreColor(result?.globalScore || 0)} mb-6`}>
                <span className="text-3xl md:text-4xl font-bold">{result?.globalScore || 0}%</span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Votre Score NikahScore
            </h2>
            
            <div className="grid md:grid-cols-3 gap-4 mt-8">
              <div className="p-4 bg-white/60 rounded-xl">
                <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="font-semibold">Points Forts</p>
                <p className="text-2xl font-bold text-green-600">{result?.strengths?.length || 0}</p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl">
                <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="font-semibold">Axes Évalués</p>
                <p className="text-2xl font-bold text-blue-600">{result?.axisScores?.length || 0}</p>
              </div>
              <div className="p-4 bg-white/60 rounded-xl">
                <AlertCircle className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <p className="font-semibold">À Améliorer</p>
                <p className="text-2xl font-bold text-yellow-600">{result?.concerns?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Axes interactifs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Détail par Domaine
            <Badge variant="secondary" className="ml-auto">Cliquez pour explorer</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {result?.axisScores?.map((axis: any, index: number) => (
              <motion.div
                key={axis.axis}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedAxis === axis.axis 
                    ? 'border-purple-300 bg-purple-50' 
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAxis(selectedAxis === axis.axis ? null : axis.axis)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{axis.axis}</h3>
                      <Badge className={getScoreColor(axis.percentage)}>
                        {axis.percentage}%
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <motion.div
                        className="h-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${axis.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 text-gray-400 transition-transform ${
                    selectedAxis === axis.axis ? 'rotate-90' : ''
                  }`} />
                </div>
                
                <AnimatePresence>
                  {selectedAxis === axis.axis && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-purple-200"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Analyse</p>
                          <p className="text-sm text-gray-700">
                            {axis.percentage >= 80 ? 'Excellent ! Vos attentes sont très claires dans ce domaine.' :
                             axis.percentage >= 65 ? 'Bon niveau. Quelques aspects à affiner.' :
                             axis.percentage >= 50 ? 'Convenable, mais mérite plus d\'attention.' :
                             'Important : Ce domaine nécessite une réflexion approfondie.'}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-600 mb-1">Conseil</p>
                          <p className="text-sm text-gray-700">
                            Consultez notre guide "{axis.axis}" pour approfondir vos connaissances.
                          </p>
                          <Button size="sm" variant="outline" className="mt-2">
                            <BookOpen className="w-4 h-4 mr-1" />
                            Voir le guide
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Prochaines étapes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            Vos Prochaines Étapes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 border-l-4 rounded-r-xl ${getUrgencyColor(step.urgency)}`}
              >
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-white rounded-lg">
                    <step.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {step.timeEstimate}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{step.description}</p>
                    <Button size="sm" onClick={() => onAction(step.title.toLowerCase())}>
                      Commencer
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conseils personnalisés */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Conseils Personnalisés
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowTips(!showTips)}
            >
              {showTips ? 'Masquer' : 'Afficher'}
            </Button>
          </CardTitle>
        </CardHeader>
        <AnimatePresence>
          {showTips && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {personalizedTips.map((tip, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 bg-white rounded-xl border border-blue-200"
                    >
                      <tip.icon className="w-8 h-8 text-blue-500 mb-3" />
                      <h3 className="font-semibold mb-2">{tip.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tip.description}</p>
                      <Button size="sm" variant="outline" className="w-full">
                        {tip.action}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Call to action final */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center p-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl text-white"
      >
        <Award className="w-16 h-16 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl font-bold mb-4">
          Félicitations pour ce premier pas ! 🎉
        </h2>
        <p className="text-lg opacity-90 mb-6">
          Votre parcours vers un mariage épanoui commence maintenant
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" onClick={() => onAction('download')}>
            Télécharger mon rapport
          </Button>
          <Button size="lg" variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
            <Link href="/dashboard" className="flex items-center">
              Voir mon dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  )
}