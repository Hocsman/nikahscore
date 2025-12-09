'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import QuestionnaireHistoryCard from '@/components/dashboard/QuestionnaireHistoryCard'
import ResultsChartRadar from '@/components/results/ResultsChartRadar'
import ResultsDetailedAnalysis from '@/components/results/ResultsDetailedAnalysis'
import ResultsRecommendations from '@/components/results/ResultsRecommendations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
    BarChart3, 
    Download, 
    TrendingUp, 
    Heart, 
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Lightbulb,
    PieChart,
    Activity
} from 'lucide-react'
import { useUserStats } from '@/hooks/useUserStats'
import { useSubscription } from '@/hooks/useSubscription'
import FeatureGate from '@/components/premium/FeatureGate'
import StripeCheckout from '@/components/stripe/StripeCheckout'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function ResultsPage() {
    const { questionnaires, loading } = useUserStats()
    const { isPremium, isConseil } = useSubscription()

    // Données de démonstration / simulées basées sur les vrais résultats
    const mockScores = {
        overall_score: 78,
        axis_scores: {
            'Intentions': 85,
            'Valeurs': 92,
            'Rôles': 68,
            'Enfants': 88,
            'Finance': 75,
            'Style': 72,
            'Communication': 82,
            'Personnalité': 79,
            'Logistique': 65
        },
        strengths: [
            'Valeurs spirituelles très alignées',
            'Vision similaire de la famille',
            'Objectifs financiers compatibles',
            'Communication ouverte et respectueuse'
        ],
        frictions: [
            'Différences sur l\'approche éducative',
            'Attentes différentes sur les rôles au foyer',
            'Points logistiques à clarifier'
        ],
        recommendations: [
            'Dialoguez davantage sur vos attentes concernant l\'éducation des enfants',
            'Explorez ensemble les moyens d\'harmoniser vos différences de mode de vie',
            'Prenez le temps de mieux vous connaître avant de prendre une décision finale',
            'Considérez une discussion avec un conseiller matrimonial islamique'
        ]
    }

    const displayResults = mockScores

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 60) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreLabel = (score: number) => {
        if (score >= 80) return { label: 'Excellente compatibilité', color: 'bg-green-100 text-green-800' }
        if (score >= 60) return { label: 'Bonne compatibilité', color: 'bg-yellow-100 text-yellow-800' }
        if (score >= 40) return { label: 'Compatibilité modérée', color: 'bg-orange-100 text-orange-800' }
        return { label: 'Faible compatibilité', color: 'bg-red-100 text-red-800' }
    }

    const getBarColor = (score: number) => {
        if (score >= 80) return '#22c55e'
        if (score >= 60) return '#eab308'
        return '#ef4444'
    }

    // Préparer les données pour le graphique en barres
    const barChartData = Object.entries(displayResults.axis_scores).map(([axis, score]) => ({
        name: axis,
        score: score,
        fill: getBarColor(score)
    }))

    // Identifier les axes à améliorer (< 70%)
    const axesToImprove = Object.entries(displayResults.axis_scores)
        .filter(([, score]) => score < 70)
        .sort(([, a], [, b]) => a - b)

    const scoreInfo = getScoreLabel(displayResults.overall_score)

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Mes Résultats
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Analyse complète de votre compatibilité
                        </p>
                    </div>
                    <FeatureGate 
                        featureCode="pdf_export"
                        fallback={
                            <Button variant="outline" className="gap-2" disabled>
                                <Download className="w-4 h-4" />
                                Export PDF (Premium)
                            </Button>
                        }
                    >
                        <Button variant="outline" className="gap-2">
                            <Download className="w-4 h-4" />
                            Exporter PDF
                        </Button>
                    </FeatureGate>
                </div>

                {/* Score Global Card */}
                <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                            <Heart className="w-5 h-5 text-pink-500" />
                            Score de Compatibilité Global
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="text-center">
                                <div className={`text-7xl font-bold ${getScoreColor(displayResults.overall_score)}`}>
                                    {displayResults.overall_score}%
                                </div>
                                <Badge className={`mt-3 ${scoreInfo.color} px-4 py-1`}>
                                    {scoreInfo.label}
                                </Badge>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-4 h-4 text-green-500" />
                                    Basé sur 9 dimensions d'analyse
                                </p>
                            </div>
                            
                            <div className="flex-1 max-w-md">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {displayResults.strengths.length} points forts identifiés
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {displayResults.frictions.length} axes d'attention
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Lightbulb className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {displayResults.recommendations.length} recommandations
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs pour les différentes vues */}
                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview" className="gap-2">
                            <BarChart3 className="w-4 h-4" />
                            <span className="hidden sm:inline">Vue d'ensemble</span>
                        </TabsTrigger>
                        <TabsTrigger value="charts" className="gap-2">
                            <PieChart className="w-4 h-4" />
                            <span className="hidden sm:inline">Graphiques</span>
                        </TabsTrigger>
                        <TabsTrigger value="analysis" className="gap-2">
                            <Activity className="w-4 h-4" />
                            <span className="hidden sm:inline">Analyse</span>
                        </TabsTrigger>
                        <TabsTrigger value="history" className="gap-2">
                            <TrendingUp className="w-4 h-4" />
                            <span className="hidden sm:inline">Historique</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Onglet Vue d'ensemble */}
                    <TabsContent value="overview" className="space-y-6 mt-6">
                        {/* Histogramme des scores par axe */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                                    <BarChart3 className="w-5 h-5 text-purple-600" />
                                    Scores par Dimension
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barChartData} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis type="number" domain={[0, 100]} />
                                            <YAxis type="category" dataKey="name" width={100} />
                                            <Tooltip 
                                                formatter={(value: number) => [`${value}%`, 'Score']}
                                                contentStyle={{ 
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '8px'
                                                }}
                                            />
                                            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                                                {barChartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Points Forts et Frictions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Points Forts */}
                            <Card className="border-green-200 dark:border-green-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Points Forts
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {displayResults.strengths.map((strength: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-green-800 dark:text-green-300">{strength}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            {/* Points d'Attention */}
                            <Card className="border-yellow-200 dark:border-yellow-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                                        <AlertTriangle className="w-5 h-5" />
                                        Points d'Attention
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {displayResults.frictions.map((friction: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                                            <p className="text-yellow-800 dark:text-yellow-300">{friction}</p>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Axes à Améliorer */}
                        {axesToImprove.length > 0 && (
                            <Card className="border-orange-200 dark:border-orange-800">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                        <XCircle className="w-5 h-5" />
                                        Axes à Travailler en Priorité
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {axesToImprove.map(([axis, score], index) => (
                                            <div key={index} className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-medium text-gray-700 dark:text-gray-300">{axis}</span>
                                                    <Badge className={`${score < 50 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                        {score}%
                                                    </Badge>
                                                </div>
                                                <Progress value={score} className="h-2" />
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recommandations */}
                        <Card className="border-blue-200 dark:border-blue-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
                                    <Lightbulb className="w-5 h-5" />
                                    Recommandations Personnalisées
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {displayResults.recommendations.map((rec: string, index: number) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                            <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-blue-800 dark:text-blue-300">{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Onglet Graphiques */}
                    <TabsContent value="charts" className="space-y-6 mt-6">
                        <FeatureGate 
                            featureCode="results_charts"
                            fallback={
                                <Card className="border-purple-200 dark:border-purple-800">
                                    <CardContent className="py-12">
                                        <div className="text-center">
                                            <PieChart className="w-16 h-16 text-purple-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Graphiques Premium
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                                                Accédez aux graphiques radar avancés et aux visualisations détaillées avec un abonnement Premium.
                                            </p>
                                            <StripeCheckout plan="premium" className="bg-gradient-to-r from-purple-500 to-pink-600">
                                                Passer Premium
                                            </StripeCheckout>
                                        </div>
                                    </CardContent>
                                </Card>
                            }
                        >
                            <ResultsChartRadar axisScores={displayResults.axis_scores} />
                        </FeatureGate>
                    </TabsContent>

                    {/* Onglet Analyse Détaillée */}
                    <TabsContent value="analysis" className="space-y-6 mt-6">
                        <FeatureGate 
                            featureCode="results_detailed_analysis"
                            fallback={
                                <Card className="border-indigo-200 dark:border-indigo-800">
                                    <CardContent className="py-12">
                                        <div className="text-center">
                                            <Activity className="w-16 h-16 text-indigo-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Analyse Détaillée Premium
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
                                                Obtenez une analyse approfondie par catégorie et des recommandations personnalisées.
                                            </p>
                                            <StripeCheckout plan="premium" className="bg-gradient-to-r from-indigo-500 to-purple-600">
                                                Passer Premium
                                            </StripeCheckout>
                                        </div>
                                    </CardContent>
                                </Card>
                            }
                        >
                            <ResultsDetailedAnalysis 
                                axisScores={displayResults.axis_scores}
                                strengths={displayResults.strengths}
                                frictions={displayResults.frictions}
                            />
                            
                            <ResultsRecommendations 
                                overallScore={displayResults.overall_score}
                                recommendations={displayResults.recommendations}
                                axisScores={displayResults.axis_scores}
                            />
                        </FeatureGate>
                    </TabsContent>

                    {/* Onglet Historique */}
                    <TabsContent value="history" className="space-y-6 mt-6">
                        <QuestionnaireHistoryCard
                            questionnaires={questionnaires}
                            loading={loading}
                        />
                        
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                Activité récente
                            </h2>
                            <ActivityTimeline />
                        </div>
                    </TabsContent>
                </Tabs>

                {/* Citation inspirante */}
                <Card className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-none">
                    <CardContent className="py-6">
                        <p className="text-center text-gray-600 dark:text-gray-400 italic">
                            "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez 
                            en tranquillité avec elles et Il a mis entre vous de l&apos;affection et de la bonté." 
                            <span className="block mt-2 text-sm font-medium text-purple-600 dark:text-purple-400">
                                — Coran 30:21
                            </span>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
