'use client'

import { useEffect, useState } from 'react'
import { Bell, Search, Moon, Sun, Menu, Download, Bot } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FeatureGate from '@/components/premium/FeatureGate'
import { useTheme } from 'next-themes'
import SearchModal from './SearchModal'

interface DashboardHeaderProps {
    onMenuToggle?: () => void
    showMenuButton?: boolean
    onExportPDF?: () => void
    isGeneratingPDF?: boolean
}

export default function DashboardHeader({
    onMenuToggle,
    showMenuButton = false,
    onExportPDF,
    isGeneratingPDF = false
}: DashboardHeaderProps) {
    const { user, signOut } = useAuth()
    const { isPremium, isConseil } = useSubscription()
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isMac, setIsMac] = useState(true)

    // Détecter le système d'exploitation
    useEffect(() => {
        setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0)
    }, [])

    // Raccourci clavier Cmd+K / Ctrl+K
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault()
                setIsSearchOpen(true)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    const handleSignOut = async () => {
        await signOut()
        router.push('/')
    }

    const userInitials = user?.firstName
        ? user.firstName.charAt(0).toUpperCase()
        : user?.email?.charAt(0).toUpperCase() || 'U'

    return (
        <header className="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">

                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-3 flex-1">
                    {showMenuButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuToggle}
                            className="md:hidden"
                            aria-label="Ouvrir le menu"
                        >
                            <Menu className="w-5 h-5" aria-hidden="true" />
                        </Button>
                    )}

                    {/* Search Bar */}
                    <div className="relative hidden md:flex items-center max-w-md flex-1">
                        <Search className="absolute left-3 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                        <button
                            type="button"
                            onClick={() => setIsSearchOpen(true)}
                            aria-label="Rechercher"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-left text-gray-500 dark:text-gray-400 hover:border-pink-300 dark:hover:border-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                        >
                            Rechercher... ({isMac ? '⌘' : 'Ctrl+'}K)
                        </button>
                    </div>
                </div>

                {/* Search Modal */}
                <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

                {/* Right: Actions */}
                <div className="flex items-center gap-2">

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="hidden md:flex"
                        aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                        )}
                    </Button>

                    {/* Export PDF - Premium/Conseil */}
                    {onExportPDF && (
                        <FeatureGate
                            featureCode="pdf_export"
                            customMessage="L'export PDF est limité à 10 par mois pour Premium, illimité pour Conseil"
                        >
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={onExportPDF}
                                disabled={isGeneratingPDF}
                                className="hidden md:flex"
                            >
                                <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                                {isGeneratingPDF ? 'Génération...' : 'Export PDF'}
                            </Button>
                        </FeatureGate>
                    )}

                    {/* Coach AI - Conseil only */}
                    {isConseil && (
                        <Link href="/coach-ai">
                            <Button
                                size="sm"
                                className="hidden md:flex bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700"
                            >
                                <Bot className="w-4 h-4 mr-2" aria-hidden="true" />
                                Coach AI
                            </Button>
                        </Link>
                    )}

                    {/* Notifications (placeholder - pas encore de système de notifs) */}
                    <Button variant="ghost" size="icon" aria-label="Notifications" disabled>
                        <Bell className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full" aria-label="Menu utilisateur">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-gradient-to-br from-pink-500 to-purple-600 text-white">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {user?.firstName || user?.name || 'Utilisateur'}
                                    </p>
                                    <p className="text-xs leading-none text-gray-500">
                                        {user?.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/profile" className="w-full">
                                    Mon Profil
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/dashboard/settings" className="w-full">
                                    Paramètres
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuItem asChild className="cursor-pointer">
                                <Link href="/pricing" className="w-full">
                                    Abonnement
                                </Link>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                                Se déconnecter
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
