'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    Heart,
    Users,
    FileText,
    Crown,
    Calendar,
    CheckCircle,
    Clock
} from 'lucide-react'

interface Activity {
    id: string
    type: 'questionnaire' | 'couple' | 'result' | 'premium' | 'session' | 'task'
    title: string
    description?: string
    timestamp: Date | string
    icon?: any
}

interface ActivityTimelineProps {
    activities?: Activity[]
    maxItems?: number
}

export default function ActivityTimeline({
    activities: customActivities,
    maxItems = 5
}: ActivityTimelineProps) {

    // Default sample activities (can be overridden by props)
    const defaultActivities: Activity[] = [
        {
            id: '1',
            type: 'result',
            title: 'Score calculé',
            description: 'Votre compatibilité est de 85% - Excellent !',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2h ago
        },
        {
            id: '2',
            type: 'couple',
            title: 'Partenaire a répondu',
            description: 'Marie a complété le questionnaire',
            timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            id: '3',
            type: 'session',
            title: 'Session budget planifiée',
            description: 'Samedi 7 décembre à 14h',
            timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            id: '4',
            type: 'questionnaire',
            title: 'Questionnaire complété',
            description: 'Vous avez répondu à 100 questions',
            timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            id: '5',
            type: 'premium',
            title: 'Abonnement activé',
            description: 'Formule Premium mensuelle',
            timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        }
    ]

    const activities = customActivities || defaultActivities
    const displayedActivities = activities.slice(0, maxItems)

    const getActivityConfig = (type: Activity['type']) => {
        switch (type) {
            case 'questionnaire':
                return {
                    icon: FileText,
                    color: 'bg-blue-100 text-blue-600',
                    dot: 'bg-blue-500'
                }
            case 'couple':
                return {
                    icon: Users,
                    color: 'bg-purple-100 text-purple-600',
                    dot: 'bg-purple-500'
                }
            case 'result':
                return {
                    icon: Heart,
                    color: 'bg-pink-100 text-pink-600',
                    dot: 'bg-pink-500'
                }
            case 'premium':
                return {
                    icon: Crown,
                    color: 'bg-orange-100 text-orange-600',
                    dot: 'bg-orange-500'
                }
            case 'session':
                return {
                    icon: Calendar,
                    color: 'bg-green-100 text-green-600',
                    dot: 'bg-green-500'
                }
            case 'task':
                return {
                    icon: CheckCircle,
                    color: 'bg-teal-100 text-teal-600',
                    dot: 'bg-teal-500'
                }
            default:
                return {
                    icon: Clock,
                    color: 'bg-gray-100 text-gray-600',
                    dot: 'bg-gray-500'
                }
        }
    }

    const formatTimestamp = (timestamp: Date | string): string => {
        const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 60) {
            return `Il y a ${diffMins} min`
        } else if (diffHours < 24) {
            return `Il y a ${diffHours}h`
        } else if (diffDays === 1) {
            return 'Hier'
        } else if (diffDays < 7) {
            return `Il y a ${diffDays} jours`
        } else {
            return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
        }
    }

    return (
        <Card className="bg-white">
            <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gray-600" />
                    Activité récente
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {displayedActivities.map((activity, index) => {
                        const config = getActivityConfig(activity.type)
                        const Icon = config.icon
                        const isLast = index === displayedActivities.length - 1

                        return (
                            <div key={activity.id} className="relative">
                                {/* Timeline line */}
                                {!isLast && (
                                    <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                                )}

                                <div className="flex gap-3">
                                    {/* Icon */}
                                    <div className={`relative z-10 w-10 h-10 rounded-full ${config.color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0 pb-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-gray-900">
                                                    {activity.title}
                                                </p>
                                                {activity.description && (
                                                    <p className="text-xs text-gray-500 mt-0.5">
                                                        {activity.description}
                                                    </p>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap">
                                                {formatTimestamp(activity.timestamp)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}
