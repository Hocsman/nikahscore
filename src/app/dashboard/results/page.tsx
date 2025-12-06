'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import ActivityTimeline from '@/components/dashboard/ActivityTimeline'
import QuestionnaireHistoryCard from '@/components/dashboard/QuestionnaireHistoryCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, Download, TrendingUp } from 'lucide-react'
import { useUserStats } from '@/hooks/useUserStats'

export default function ResultsPage() {
    const { questionnaires, loading } = useUserStats()

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
                            Historique de vos questionnaires et évolution
                        </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                        <Download className="w-4 h-4" />
                        Exporter
                    </Button>
                </div>

                {/* Score Evolution Card */}
                <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                            Évolution de votre score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                                    85%
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Score actuel
                                </p>
                                <p className="text-xs text-green-600 dark:text-green-400 mt-1 flex items-center justify-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    +7% vs dernier questionnaire
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Questionnaire History */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Historique des questionnaires
                    </h2>
                    <QuestionnaireHistoryCard
                        questionnaires={questionnaires}
                        loading={loading}
                    />
                </div>

                {/* Activity Timeline */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Activité récente
                    </h2>
                    <ActivityTimeline />
                </div>
            </div>
        </DashboardLayout>
    )
}
