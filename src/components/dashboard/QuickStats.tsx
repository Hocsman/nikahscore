'use client'

import Link from 'next/link'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Heart, Trophy, Users, Target, ArrowRight, Sparkles } from 'lucide-react'

interface Stat {
    label: string
    value: string | number
    icon: any
    color: string
    colorBg: string
}

interface QuickStatsProps {
    stats?: {
        score?: number
        tests?: number
        couples?: number
        profile?: number
    }
}

export default function QuickStats({ stats }: QuickStatsProps) {
    const isNewUser = !stats?.tests && !stats?.couples && stats?.score === undefined

    const defaultStats: Stat[] = [
        {
            label: 'Score',
            value: stats?.score !== undefined ? `${stats.score}%` : '--',
            icon: Heart,
            color: 'text-pink-600 dark:text-pink-400',
            colorBg: 'bg-pink-50 dark:bg-pink-900/20'
        },
        {
            label: 'Tests',
            value: stats?.tests ?? 0,
            icon: Trophy,
            color: 'text-blue-600 dark:text-blue-400',
            colorBg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            label: 'Couples',
            value: stats?.couples ?? 0,
            icon: Users,
            color: 'text-purple-600 dark:text-purple-400',
            colorBg: 'bg-purple-50 dark:bg-purple-900/20'
        },
        {
            label: 'Profil',
            value: stats?.profile !== undefined ? `${stats.profile}%` : '0%',
            icon: Target,
            color: 'text-green-600 dark:text-green-400',
            colorBg: 'bg-green-50 dark:bg-green-900/20'
        }
    ]

    if (isNewUser) {
        return (
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 border-pink-200 dark:border-pink-800">
                <div className="p-6 text-center">
                    <Sparkles className="w-10 h-10 text-pink-500 dark:text-pink-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                        Bienvenue sur NikahScore
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Commencez votre premier questionnaire pour d&eacute;couvrir votre score de compatibilit&eacute;.
                    </p>
                    <Button asChild size="sm" className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white">
                        <Link href="/questionnaire">
                            Commencer le questionnaire
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <span className="text-gray-400">📊</span>
                        Statistiques
                    </h3>
                </div>

                <div className="grid grid-cols-4 gap-3 mt-4">
                    {defaultStats.map((stat) => {
                        const Icon = stat.icon
                        return (
                            <div
                                key={stat.label}
                                className={`flex flex-col items-center p-2 rounded-lg ${stat.colorBg} transition-colors`}
                            >
                                <Icon className={`w-5 h-5 ${stat.color} mb-1`} />
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                    {stat.label}
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </Card>
    )
}
