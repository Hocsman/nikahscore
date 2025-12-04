'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    CheckCircle,
    Circle,
    ArrowRight,
    Zap,
    AlertCircle,
    Clock
} from 'lucide-react'
import Link from 'next/link'

interface NextAction {
    id: string
    label: string
    description?: string
    priority: 'urgent' | 'important' | 'normal'
    completed?: boolean
    href?: string
    action?: () => void
}

interface NextActionsWidgetProps {
    actions?: NextAction[]
    onActionToggle?: (actionId: string) => void
}

export default function NextActionsWidget({
    actions: customActions,
    onActionToggle
}: NextActionsWidgetProps) {
    // Default suggested actions (can be overridden by props)
    const defaultActions: NextAction[] = [
        {
            id: 'complete-questionnaire',
            label: 'Compléter votre premier questionnaire',
            description: 'Découvrez votre compatibilité en 10 minutes',
            priority: 'urgent',
            href: '/questionnaire',
            completed: false
        },
        {
            id: 'invite-partner',
            label: 'Inviter votre partenaire',
            description: 'Partagez le lien pour comparer vos réponses',
            priority: 'important',
            href: '/couple',
            completed: false
        },
        {
            id: 'plan-budget-session',
            label: 'Planifier une session budget',
            description: 'Organisez 2h cette semaine pour discuter finances',
            priority: 'normal',
            href: '/dashboard/actions',
            completed: false
        }
    ]

    const [localActions, setLocalActions] = useState<NextAction[]>(
        customActions || defaultActions
    )

    const handleToggle = (actionId: string) => {
        setLocalActions(prev =>
            prev.map(action =>
                action.id === actionId
                    ? { ...action, completed: !action.completed }
                    : action
            )
        )
        onActionToggle?.(actionId)
    }

    const getPriorityConfig = (priority: NextAction['priority']) => {
        switch (priority) {
            case 'urgent':
                return {
                    icon: AlertCircle,
                    color: 'text-red-500',
                    bg: 'bg-red-50',
                    badge: 'Urgent'
                }
            case 'important':
                return {
                    icon: Zap,
                    color: 'text-orange-500',
                    bg: 'bg-orange-50',
                    badge: 'Important'
                }
            default:
                return {
                    icon: Clock,
                    color: 'text-blue-500',
                    bg: 'bg-blue-50',
                    badge: null
                }
        }
    }

    const pendingActions = localActions.filter(a => !a.completed)
    const completedCount = localActions.filter(a => a.completed).length

    return (
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-blue-600" />
                        Prochaines actions
                    </CardTitle>
                    {completedCount > 0 && (
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {completedCount} complétée{completedCount > 1 ? 's' : ''}
                        </Badge>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {pendingActions.length === 0 ? (
                    <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                        <p className="text-sm font-medium text-gray-900">
                            Tout est à jour ! 🎉
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            Vous avez complété toutes vos actions suggérées
                        </p>
                    </div>
                ) : (
                    pendingActions.map((action) => {
                        const config = getPriorityConfig(action.priority)
                        const PriorityIcon = config.icon

                        return (
                            <motion.div
                                key={action.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className={`
                  flex items-start gap-3 p-3 rounded-lg border-2 transition-all
                  ${action.completed
                                        ? 'bg-gray-50 border-gray-200 opacity-60'
                                        : `${config.bg} border-transparent hover:border-blue-300`
                                    }
                `}
                            >
                                <Checkbox
                                    checked={action.completed}
                                    onCheckedChange={() => handleToggle(action.id)}
                                    className="mt-0.5"
                                />

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <p className={`
                        text-sm font-medium
                        ${action.completed ? 'line-through text-gray-500' : 'text-gray-900'}
                      `}>
                                                {action.label}
                                            </p>
                                            {action.description && (
                                                <p className="text-xs text-gray-600 mt-0.5">
                                                    {action.description}
                                                </p>
                                            )}
                                        </div>

                                        {config.badge && (
                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                <PriorityIcon className={`w-3 h-3 ${config.color}`} />
                                                <span className={`text-xs font-medium ${config.color}`}>
                                                    {config.badge}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {action.href && !action.completed && (
                                        <Link href={action.href}>
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto p-0 mt-2 text-xs text-blue-600 hover:text-blue-700"
                                            >
                                                Commencer maintenant
                                                <ArrowRight className="w-3 h-3 ml-1" />
                                            </Button>
                                        </Link>
                                    )}
                                </div>
                            </motion.div>
                        )
                    })
                )}
            </CardContent>
        </Card>
    )
}
