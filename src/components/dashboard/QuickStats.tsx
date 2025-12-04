'use client'

import { Card } from '@/components/ui/card'
import { Heart, Trophy, Users, Target } from 'lucide-react'

interface Stat {
    label: string
    value: string | number
    icon: any
    color: string
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
    const defaultStats: Stat[] = [
        {
            label: 'Score',
            value: stats?.score !== undefined ? `${stats.score}%` : 'N/A',
            icon: Heart,
            color: 'text-pink-600'
        },
        {
            label: 'Tests',
            value: stats?.tests ?? 0,
            icon: Trophy,
            color: 'text-blue-600'
        },
        {
            label: 'Couples',
            value: stats?.couples ?? 0,
            icon: Users,
            color: 'text-purple-600'
        },
        {
            label: 'Profil',
            value: stats?.profile !== undefined ? `${stats.profile}%` : '0%',
            icon: Target,
            color: 'text-green-600'
        }
    ]

    return (
        <Card className="bg-white">
            <div className="p-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
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
                                className="flex flex-col items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <Icon className={`w-5 h-5 ${stat.color} mb-1`} />
                                <p className="text-2xl font-bold text-gray-900">
                                    {stat.value}
                                </p>
                                <p className="text-xs text-gray-500 text-center">
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
