'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Search,
    Home,
    BarChart3,
    Users,
    CheckSquare,
    Crown,
    Settings,
    FileText,
    Bot,
    Calendar,
    HelpCircle,
    X
} from 'lucide-react'
import { useSubscription } from '@/hooks/useSubscription'

interface SearchItem {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    href: string
    category: 'navigation' | 'action' | 'feature'
    keywords: string[]
    premium?: boolean
    conseil?: boolean
}

interface SearchModalProps {
    isOpen: boolean
    onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('')
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()
    const { isPremium, isConseil } = useSubscription()

    // Liste des items de recherche
    const searchItems: SearchItem[] = [
        {
            id: 'home',
            title: 'Tableau de bord',
            description: 'Accueil du dashboard',
            icon: <Home className="w-5 h-5" />,
            href: '/dashboard',
            category: 'navigation',
            keywords: ['accueil', 'home', 'dashboard', 'tableau']
        },
        {
            id: 'results',
            title: 'Mes Résultats',
            description: 'Voir vos scores et analyses',
            icon: <BarChart3 className="w-5 h-5" />,
            href: '/dashboard/results',
            category: 'navigation',
            keywords: ['résultats', 'scores', 'analyse', 'compatibilité', 'graphiques']
        },
        {
            id: 'couple',
            title: 'Mon Couple',
            description: 'Gérer votre espace couple',
            icon: <Users className="w-5 h-5" />,
            href: '/dashboard/couple',
            category: 'navigation',
            keywords: ['couple', 'partenaire', 'invitation', 'lien']
        },
        {
            id: 'actions',
            title: 'Actions Rapides',
            description: 'Sessions budget et to-do',
            icon: <CheckSquare className="w-5 h-5" />,
            href: '/dashboard/actions',
            category: 'navigation',
            keywords: ['actions', 'budget', 'todo', 'tâches', 'session']
        },
        {
            id: 'premium',
            title: 'Mon Abonnement',
            description: 'Gérer votre plan Premium/Conseil',
            icon: <Crown className="w-5 h-5" />,
            href: '/dashboard/premium',
            category: 'navigation',
            keywords: ['abonnement', 'premium', 'conseil', 'plan', 'paiement', 'upgrade']
        },
        {
            id: 'settings',
            title: 'Paramètres',
            description: 'Configurer votre compte',
            icon: <Settings className="w-5 h-5" />,
            href: '/dashboard/settings',
            category: 'navigation',
            keywords: ['paramètres', 'settings', 'configuration', 'compte', 'notifications']
        },
        {
            id: 'questionnaire',
            title: 'Nouveau questionnaire',
            description: 'Commencer un nouveau test',
            icon: <FileText className="w-5 h-5" />,
            href: '/questionnaire',
            category: 'action',
            keywords: ['questionnaire', 'test', 'nouveau', 'commencer', 'questions']
        },
        {
            id: 'pricing',
            title: 'Tarifs',
            description: 'Voir les offres Premium et Conseil',
            icon: <Crown className="w-5 h-5" />,
            href: '/pricing',
            category: 'navigation',
            keywords: ['tarifs', 'prix', 'premium', 'conseil', 'offres', 'abonnement']
        },
        {
            id: 'coach',
            title: 'Coach AI',
            description: 'Conseils personnalisés par IA',
            icon: <Bot className="w-5 h-5" />,
            href: '/coach-ai',
            category: 'feature',
            keywords: ['coach', 'ia', 'intelligence', 'conseils', 'recommandations'],
            conseil: true
        },
        {
            id: 'budget',
            title: 'Session Budget',
            description: 'Planifier une session budget',
            icon: <Calendar className="w-5 h-5" />,
            href: '/dashboard/actions?tab=budget',
            category: 'action',
            keywords: ['budget', 'session', 'finances', 'argent', 'planifier'],
            premium: true
        },
        {
            id: 'help',
            title: 'Aide & Support',
            description: 'Centre d\'aide et FAQ',
            icon: <HelpCircle className="w-5 h-5" />,
            href: '/contact',
            category: 'navigation',
            keywords: ['aide', 'support', 'faq', 'contact', 'question', 'problème']
        }
    ]

    // Filtrer les items selon la recherche
    const filteredItems = query.trim() === ''
        ? searchItems
        : searchItems.filter(item => {
            const searchLower = query.toLowerCase()
            return (
                item.title.toLowerCase().includes(searchLower) ||
                item.description.toLowerCase().includes(searchLower) ||
                item.keywords.some(k => k.includes(searchLower))
            )
        })

    // Gérer la navigation
    const handleSelect = useCallback((item: SearchItem) => {
        // Vérifier si l'utilisateur a accès
        if (item.conseil && !isConseil) {
            router.push('/dashboard/premium')
        } else if (item.premium && !isPremium && !isConseil) {
            router.push('/dashboard/premium')
        } else {
            router.push(item.href)
        }
        onClose()
        setQuery('')
        setSelectedIndex(0)
    }, [router, onClose, isPremium, isConseil])

    // Gérer les raccourcis clavier
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return

            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault()
                    setSelectedIndex(prev => 
                        prev < filteredItems.length - 1 ? prev + 1 : 0
                    )
                    break
                case 'ArrowUp':
                    e.preventDefault()
                    setSelectedIndex(prev => 
                        prev > 0 ? prev - 1 : filteredItems.length - 1
                    )
                    break
                case 'Enter':
                    e.preventDefault()
                    if (filteredItems[selectedIndex]) {
                        handleSelect(filteredItems[selectedIndex])
                    }
                    break
                case 'Escape':
                    e.preventDefault()
                    onClose()
                    break
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, filteredItems, selectedIndex, handleSelect, onClose])

    // Reset l'index quand la query change
    useEffect(() => {
        setSelectedIndex(0)
    }, [query])

    // Grouper par catégorie
    const groupedItems = filteredItems.reduce((acc, item) => {
        if (!acc[item.category]) {
            acc[item.category] = []
        }
        acc[item.category].push(item)
        return acc
    }, {} as Record<string, SearchItem[]>)

    const categoryLabels = {
        navigation: 'Navigation',
        action: 'Actions',
        feature: 'Fonctionnalités'
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{ duration: 0.15 }}
                    className="max-w-xl mx-auto mt-20 md:mt-32"
                    onClick={e => e.stopPropagation()}
                >
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                        {/* Input de recherche */}
                        <div className="flex items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une page, action..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none text-base"
                                autoFocus
                            />
                            <button
                                onClick={onClose}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                            >
                                <X className="w-4 h-4 text-gray-400" />
                            </button>
                        </div>

                        {/* Résultats */}
                        <div className="max-h-80 overflow-y-auto p-2">
                            {filteredItems.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                    Aucun résultat pour "{query}"
                                </div>
                            ) : (
                                Object.entries(groupedItems).map(([category, items]) => (
                                    <div key={category} className="mb-2">
                                        <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                                            {categoryLabels[category as keyof typeof categoryLabels]}
                                        </div>
                                        {items.map((item) => {
                                            const globalIndex = filteredItems.indexOf(item)
                                            const isSelected = globalIndex === selectedIndex
                                            const isLocked = (item.conseil && !isConseil) || 
                                                           (item.premium && !isPremium && !isConseil)
                                            
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => handleSelect(item)}
                                                    onMouseEnter={() => setSelectedIndex(globalIndex)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                                                        isSelected
                                                            ? 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400'
                                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                                    }`}
                                                >
                                                    <div className={`flex-shrink-0 ${
                                                        isSelected ? 'text-pink-500' : 'text-gray-400'
                                                    }`}>
                                                        {item.icon}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-medium truncate">
                                                                {item.title}
                                                            </span>
                                                            {isLocked && (
                                                                <span className="text-xs px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded">
                                                                    {item.conseil ? 'Conseil' : 'Premium'}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                    {isSelected && (
                                                        <span className="text-xs text-gray-400">
                                                            ↵
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer avec raccourcis */}
                        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-xs text-gray-500">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↑</kbd>
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↓</kbd>
                                    <span className="ml-1">naviguer</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">↵</kbd>
                                    <span className="ml-1">sélectionner</span>
                                </span>
                            </div>
                            <span className="flex items-center gap-1">
                                <kbd className="px-1.5 py-0.5 bg-white dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600">esc</kbd>
                                <span className="ml-1">fermer</span>
                            </span>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
