'use client'

import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useSubscription } from '@/hooks/useSubscription'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Check, X, ArrowRight, Bot, Download, Calendar, CheckSquare } from 'lucide-react'
import Link from 'next/link'

export default function PremiumPage() {
    const { isPremium, isConseil, plan, planName } = useSubscription()

    const plans = [
        {
            name: 'Gratuit',
            price: '0€',
            period: '',
            features: [
                { name: '1 questionnaire', included: true },
                { name: '1 résultat visible', included: true },
                { name: 'Score de base', included: true },
                { name: 'Export PDF', included: false },
                { name: 'Sessions budget', included: false },
                { name: 'To-do partagées', included: false },
                { name: 'Coach AI', included: false },
            ],
            current: !isPremium && !isConseil,
        },
        {
            name: 'Premium',
            price: '6.67€',
            period: '/mois',
            features: [
                { name: 'Questionnaires illimités', included: true },
                { name: 'Tous les résultats', included: true },
                { name: 'Analyses détaillées', included: true },
                { name: 'Export PDF illimité', included: true },
                { name: 'Sessions budget', included: true },
                { name: 'To-do partagées', included: true },
                { name: 'Coach AI', included: false },
            ],
            current: isPremium && !isConseil,
            popular: true
        },
        {
            name: 'Conseil',
            price: '41.67€',
            period: '/mois',
            features: [
                { name: 'Tout Premium', included: true },
                { name: 'Coach AI illimité', included: true },
                { name: 'Support prioritaire', included: true },
                { name: 'Conseils personnalisés', included: true },
                { name: 'Ressources exclusives', included: true },
                { name: 'Webinaires mensuels', included: true },
                { name: 'Communauté privée', included: true },
            ],
            current: isConseil,
        },
    ]

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Mon Abonnement
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Gérez votre plan et débloquez plus de fonctionnalités
                    </p>
                </div>

                {/* Current Plan Status */}
                {(isPremium || isConseil) && (
                    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2 dark:text-gray-100">
                                    <Crown className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                    Plan Actuel : {planName}
                                </CardTitle>
                                <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300">
                                    Actif
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Prix</span>
                                <span className="text-lg font-semibold dark:text-gray-200">
                                    {isConseil ? '41.67€/mois' : '6.67€/mois'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Prochain paiement</span>
                                <span className="text-sm font-medium dark:text-gray-200">15 janvier 2025</span>
                            </div>
                            <Button variant="outline" className="w-full" asChild>
                                <a href="https://billing.stripe.com/p/login/test_example" target="_blank" rel="noopener noreferrer">
                                    Gérer mon abonnement
                                </a>
                            </Button>
                        </CardContent>
                    </Card>
                )}

                {/* Features Comparison */}
                <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                        Comparaison des plans
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((planItem) => (
                            <Card
                                key={planItem.name}
                                className={`relative ${planItem.current
                                        ? 'border-purple-500 dark:border-purple-400 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700'
                                    } ${planItem.popular ? 'ring-2 ring-purple-500 dark:ring-purple-400' : ''
                                    }`}
                            >
                                {planItem.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-purple-600 text-white">
                                            Plus populaire
                                        </Badge>
                                    </div>
                                )}
                                {planItem.current && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-green-600 text-white">
                                            Plan actuel
                                        </Badge>
                                    </div>
                                )}

                                <CardHeader>
                                    <CardTitle className="dark:text-gray-100">{planItem.name}</CardTitle>
                                    <div className="mt-4">
                                        <span className="text-4xl font-bold dark:text-gray-100">{planItem.price}</span>
                                        <span className="text-gray-600 dark:text-gray-400">{planItem.period}</span>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <ul className="space-y-3 mb-6">
                                        {planItem.features.map((feature) => (
                                            <li key={feature.name} className="flex items-center gap-2">
                                                {feature.included ? (
                                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                                                )}
                                                <span className={`text-sm ${feature.included
                                                        ? 'text-gray-700 dark:text-gray-300'
                                                        : 'text-gray-400 dark:text-gray-600'
                                                    }`}>
                                                    {feature.name}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>

                                    {!planItem.current && planItem.name !== 'Gratuit' && (
                                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600" asChild>
                                            <Link href="/pricing">
                                                Passer à {planItem.name}
                                                <ArrowRight className="w-4 h-4 ml-2" />
                                            </Link>
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Features Details */}
                {(isPremium || isConseil) && (
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
                            Vos fonctionnalités actives
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                        <Download className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        Export PDF
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Exportez vos résultats en PDF à tout moment
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                        <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        Sessions Budget
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Planifiez des sessions budget en couple
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                        <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        To-Do Partagées
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Gérez vos tâches communes ensemble
                                    </p>
                                </CardContent>
                            </Card>

                            {isConseil && (
                                <Card className="md:col-span-2 lg:col-span-1">
                                    <CardHeader>
                                        <CardTitle className="text-base flex items-center gap-2 dark:text-gray-100">
                                            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                            Coach AI
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Conseils personnalisés par intelligence artificielle
                                        </p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
