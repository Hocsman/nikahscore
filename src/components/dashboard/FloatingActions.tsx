'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, FileText, Calendar, Bot, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useSubscription } from '@/hooks/useSubscription'

interface Action {
    id: string
    icon: React.ComponentType<{ className?: string }>
    label: string
    href?: string
    onClick?: () => void
    requiresPremium?: boolean
    requiresConseil?: boolean
    color: string
}

export default function FloatingActions() {
    const [isOpen, setIsOpen] = useState(false)
    const router = useRouter()
    const { isPremium, isConseil } = useSubscription()

    const actions: Action[] = [
        {
            id: 'questionnaire',
            icon: FileText,
            label: 'Nouveau questionnaire',
            href: '/questionnaire',
            color: 'bg-blue-500 hover:bg-blue-600',
        },
        {
            id: 'budget',
            icon: Calendar,
            label: 'Session budget',
            onClick: () => {
                // TODO: Open budget modal
                console.log('Open budget modal')
                setIsOpen(false)
            },
            requiresPremium: true,
            color: 'bg-purple-500 hover:bg-purple-600',
        },
        {
            id: 'coach',
            icon: Bot,
            label: 'Coach AI',
            href: '/coach-ai',
            requiresConseil: true,
            color: 'bg-gradient-to-r from-pink-500 to-purple-600',
        },
        {
            id: 'help',
            icon: HelpCircle,
            label: 'Aide',
            href: '/faq',
            color: 'bg-gray-500 hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700',
        },
    ]

    // Filter actions based on subscription
    const visibleActions = actions.filter(action => {
        if (action.requiresConseil && !isConseil) return false
        if (action.requiresPremium && !isPremium && !isConseil) return false
        return true
    })

    // Calculate position in circular menu
    const getActionPosition = (index: number, total: number) => {
        // Spread from -90deg to -180deg (top-left quarter circle)
        const angle = -90 - (90 / (total + 1)) * (index + 1)
        const radius = 110 // Increased from 80 for better spacing
        return {
            x: Math.cos((angle * Math.PI) / 180) * radius,
            y: Math.sin((angle * Math.PI) / 180) * radius,
        }
    }

    const handleActionClick = (action: Action) => {
        if (action.onClick) {
            action.onClick()
        } else if (action.href) {
            router.push(action.href)
            setIsOpen(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Action Buttons */}
            <AnimatePresence>
                {isOpen && (
                    <div>
                        {visibleActions.map((action, index) => {
                            const Icon = action.icon
                            const position = getActionPosition(index, visibleActions.length)

                            return (
                                <motion.div
                                    key={action.id}
                                    initial={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                    animate={{
                                        scale: 1,
                                        x: position.x,
                                        y: position.y,
                                        opacity: 1
                                    }}
                                    exit={{ scale: 0, x: 0, y: 0, opacity: 0 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 260,
                                        damping: 20,
                                        delay: index * 0.05
                                    }}
                                    className="absolute bottom-0 right-0"
                                >
                                    <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Button
                                            size="icon"
                                            className={`w-12 h-12 rounded-full shadow-lg ${action.color} text-white border-2 border-white dark:border-gray-800`}
                                            onClick={() => handleActionClick(action)}
                                            title={action.label}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </Button>
                                    </motion.div>

                                    {/* Label tooltip */}
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 + index * 0.05 }}
                                        className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 dark:bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none"
                                    >
                                        {action.label}
                                    </motion.div>
                                </motion.div>
                            )
                        })}
                    </div>
                )}
            </AnimatePresence>

            {/* Main FAB Button */}
            <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <Button
                    size="icon"
                    className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-shadow"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu rapide'}
                >
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                    >
                        <Plus className="w-6 h-6" />
                    </motion.div>
                </Button>
            </motion.div>
        </div>
    )
}
