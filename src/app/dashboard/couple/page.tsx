import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, Link2, Calendar, CheckSquare, Share2, Copy } from 'lucide-react'

export default function CouplePage() {
    // TODO: Get real couple data from useCouple hook
    const hasCouple = false // Placeholder

    if (!hasCouple) {
        return (
            <DashboardLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                            Mon Couple
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Créez votre couple pour comparer vos résultats
                        </p>
                    </div>

                    {/* Invite Partner Card */}
                    <Card className="border-pink-200 dark:border-pink-800 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                                <Heart className="w-5 h-5 text-pink-600 dark:text-pink-400" />
                                Inviter votre partenaire
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Partagez ce lien avec votre partenaire pour qu'il/elle puisse répondre au questionnaire et comparer vos résultats.
                            </p>

                            <div className="flex gap-2">
                                <div className="flex-1 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 font-mono">
                                    https://nikahscore.com/couple/invite/ABC123
                                </div>
                                <Button variant="outline" size="icon">
                                    <Copy className="w-4 h-4" />
                                </Button>
                                <Button variant="outline" size="icon">
                                    <Share2 className="w-4 h-4" />
                                </Button>
                            </div>

                            <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-600">
                                <Link2 className="w-4 h-4 mr-2" />
                                Créer mon couple
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </DashboardLayout>
        )
    }

    // Active couple view
    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Mon Couple
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Gérez votre couple et vos actions partagées
                    </p>
                </div>

                {/* Couple Status Card */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                Sarah & Hocine
                            </CardTitle>
                            <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                Actif
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Depuis</span>
                            <span className="text-sm font-medium dark:text-gray-200">15 novembre 2024</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Questionnaires complétés</span>
                            <span className="text-sm font-medium dark:text-gray-200">2/2</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Compatibility Score */}
                <Card className="border-purple-200 dark:border-purple-800">
                    <CardHeader>
                        <CardTitle className="dark:text-gray-100">Compatibilité</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-center py-8">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-purple-600 dark:text-purple-400">
                                    85%
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                    Excellent score de compatibilité
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Shared Actions */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Actions partagées
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                    <Calendar className="w-4 h-4" />
                                    Sessions Budget
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold dark:text-gray-200">2</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">sessions planifiées</p>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                    <CheckSquare className="w-4 h-4" />
                                    To-Do Partagées
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-bold dark:text-gray-200">5</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">tâches actives</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}
