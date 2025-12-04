'use client'

import { useState } from 'react'
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
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FeatureGate from '@/components/premium/FeatureGate'

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
    const { user } = useAuth()
    const { isPremium, isConseil } = useSubscription()
    const router = useRouter()
    const [isDark, setIsDark] = useState(false)
    const [notificationsCount] = useState(3) // TODO: Connect to real notifications

    const handleSignOut = async () => {
        // TODO: Implement sign out
        router.push('/')
    }

    const userInitials = user?.firstName
        ? user.firstName.charAt(0).toUpperCase()
        : user?.email?.charAt(0).toUpperCase() || 'U'

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 md:px-6">

                {/* Left: Mobile Menu + Search */}
                <div className="flex items-center gap-3 flex-1">
                    {showMenuButton && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onMenuToggle}
                            className="md:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </Button>
                    )}

                    {/* Search Bar */}
                    <div className="relative hidden md:flex items-center max-w-md flex-1">
                        <Search className="absolute left-3 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Rechercher... (Cmd+K)"
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">

                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsDark(!isDark)}
                        className="hidden md:flex"
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-gray-600" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
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
                                <Download className="w-4 h-4 mr-2" />
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
                                <Bot className="w-4 h-4 mr-2" />
                                Coach AI
                            </Button>
                        </Link>
                    )}

                    {/* Notifications */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="w-5 h-5 text-gray-600" />
                                {notificationsCount > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 text-xs"
                                    >
                                        {notificationsCount}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Notification Items */}
                            <div className="max-h-96 overflow-y-auto">
                                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="w-2 h-2 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                Nouveau résultat disponible
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Votre score de compatibilité est prêt
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Il y a 2 heures</p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                Partenaire a répondu
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Marie a complété le questionnaire
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Hier</p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>

                                <DropdownMenuItem className="flex flex-col items-start p-3 cursor-pointer">
                                    <div className="flex items-start gap-3 w-full">
                                        <div className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">
                                                Session budget ce week-end
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                N'oubliez pas votre rendez-vous samedi
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">Il y a 2 jours</p>
                                        </div>
                                    </div>
                                </DropdownMenuItem>
                            </div>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="justify-center text-sm text-pink-600 font-medium cursor-pointer">
                                Voir toutes les notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
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
