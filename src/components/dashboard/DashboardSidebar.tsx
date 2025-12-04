'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Home,
    BarChart3,
    Users,
    CheckSquare,
    Crown,
    Settings,
    ChevronLeft,
    ChevronRight,
    Zap
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useSubscription } from '@/hooks/useSubscription'

interface MenuItem {
    icon: any
    label: string
    href: string
    badge?: string | null
    premiumOnly?: boolean
}

interface DashboardSidebarProps {
    isCollapsed?: boolean
    onToggle?: () => void
}

export default function DashboardSidebar({ isCollapsed = false, onToggle }: DashboardSidebarProps) {
    const pathname = usePathname()
    const { isPremium, isConseil } = useSubscription()

    const menuItems: MenuItem[] = [
        {
            icon: Home,
            label: 'Vue d\'ensemble',
            href: '/dashboard',
            badge: null
        },
        {
            icon: BarChart3,
            label: 'Mes Résultats',
            href: '/dashboard/results',
            badge: null
        },
        {
            icon: Users,
            label: 'Couple Actif',
            href: '/dashboard/couple',
            badge: null
        },
        {
            icon: CheckSquare,
            label: 'Actions Rapides',
            href: '/dashboard/actions',
            badge: '3',
            premiumOnly: true
        },
        {
            icon: Crown,
            label: 'Mon Abonnement',
            href: '/dashboard/premium',
            badge: !isPremium && !isConseil ? 'Upgrade' : null
        },
        {
            icon: Settings,
            label: 'Paramètres',
            href: '/dashboard/settings',
            badge: null
        },
    ]

    return (
        <motion.aside
            initial={false}
            animate={{ width: isCollapsed ? 80 : 280 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="relative flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen"
        >
            {/* Logo & Toggle */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">NS</span>
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">NikahScore</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button
                    onClick={onToggle}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? (
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    )}
                </button>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href
                    const Icon = item.icon
                    const isLocked = item.premiumOnly && !isPremium && !isConseil

                    return (
                        <Link
                            key={item.href}
                            href={isLocked ? '/pricing' : item.href}
                            className={`
                relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group
                ${isActive
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-md'
                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }
                ${isCollapsed ? 'justify-center' : ''}
              `}
                        >
                            <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100'}`} />

                            <AnimatePresence mode="wait">
                                {!isCollapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, width: 0 }}
                                        animate={{ opacity: 1, width: 'auto' }}
                                        exit={{ opacity: 0, width: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex items-center justify-between flex-1 min-w-0"
                                    >
                                        <span className={`text-sm font-medium truncate ${isActive ? 'text-white' : ''}`}>
                                            {item.label}
                                        </span>

                                        {item.badge && (
                                            <Badge
                                                variant={item.badge === 'Upgrade' ? 'destructive' : 'secondary'}
                                                className={`ml-auto text-xs ${isActive ? 'bg-white/20 text-white' : ''}`}
                                            >
                                                {item.badge}
                                            </Badge>
                                        )}

                                        {isLocked && (
                                            <Crown className="w-4 h-4 ml-auto text-yellow-500" />
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Tooltip for collapsed state */}
                            {isCollapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Premium Badge / CTA */}
            <div className="p-3 border-t border-gray-100 dark:border-gray-700">
                {!isPremium && !isConseil ? (
                    <Link href="/pricing">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg p-3 cursor-pointer
                ${isCollapsed ? 'flex justify-center' : ''}
              `}
                        >
                            {isCollapsed ? (
                                <Zap className="w-5 h-5" />
                            ) : (
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4" />
                                        <span className="font-semibold text-sm">Passer Premium</span>
                                    </div>
                                    <p className="text-xs text-white/80">
                                        Débloquez toutes les fonctionnalités
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </Link>
                ) : (
                    <div className={`
            bg-gradient-to-r ${isConseil ? 'from-orange-500 to-orange-600' : 'from-purple-500 to-purple-600'} 
            text-white rounded-lg p-3
            ${isCollapsed ? 'flex justify-center' : ''}
          `}>
                        {isCollapsed ? (
                            <Crown className="w-5 h-5" />
                        ) : (
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <Crown className="w-4 h-4" />
                                    <span className="font-semibold text-sm">
                                        {isConseil ? 'Conseil Premium' : 'Premium Actif'}
                                    </span>
                                </div>
                                <p className="text-xs text-white/80">
                                    Accès complet débloqué
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </motion.aside>
    )
}
