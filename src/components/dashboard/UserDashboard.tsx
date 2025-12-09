'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/hooks/useAuth'
import { useSubscription } from '@/hooks/useSubscription'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import ShortcutsModal from './ShortcutsModal'
import { useCouple } from '@/hooks/useCouple'
import { useUserStats } from '@/hooks/useUserStats'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import NextActionsWidget from '@/components/dashboard/NextActionsWidget'
import QuickStats from '@/components/dashboard/QuickStats'
import BudgetSessionModal from '@/components/dashboard/BudgetSessionModal'
import TodoListModal from '@/components/dashboard/TodoListModal'
import { AchievementsChecker } from '@/components/AchievementsChecker'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import StripeCheckout from '@/components/stripe/StripeCheckout'
import {
  BarChart3,
  Users,
  Zap,
  Crown,
  ArrowRight,
  Settings
} from 'lucide-react'
import Link from 'next/link'

export default function UserDashboard() {
  const { user } = useAuth()
  const { isPremium, isConseil, planName } = useSubscription()
  const { isShortcutsModalOpen, setIsShortcutsModalOpen } = useKeyboardShortcuts()
  const router = useRouter()
  const { getUserCoupleCode } = useCouple()
  const { stats: userStats, loading: statsLoading } = useUserStats()
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showTodoModal, setShowTodoModal] = useState(false)

  // Utiliser les stats réelles ou des valeurs par défaut pendant le chargement
  const stats = userStats || {
    profileCompletion: 40,
    questionnairesCompleted: 0,
    couplesCreated: 0,
    averageCompatibilityScore: null,
    lastActivity: 'Jamais',
    hasActiveCouples: false
  }

  const handleExportPDF = async () => {
    // ... (Logique export PDF inchangée, déplacée dans un hook idéalement mais gardée ici pour l'instant)
    alert('Fonctionnalité disponible sur la page Résultats')
    router.push('/dashboard/results')
  }

  const quickLinks = [
    {
      title: 'Mes Résultats',
      description: 'Historique et analyses',
      icon: BarChart3,
      href: '/dashboard/results',
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    },
    {
      title: 'Mon Couple',
      description: 'Gérer votre espace',
      icon: Users,
      href: '/dashboard/couple',
      color: 'text-pink-600',
      bg: 'bg-pink-50 dark:bg-pink-900/20'
    },
    {
      title: 'Actions',
      description: 'Budget & Todos',
      icon: Zap,
      href: '/dashboard/actions',
      color: 'text-yellow-600',
      bg: 'bg-yellow-50 dark:bg-yellow-900/20'
    },
    {
      title: 'Abonnement',
      description: planName,
      icon: Crown,
      href: '/dashboard/premium',
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    }
  ]

  return (
    <DashboardLayout onExportPDF={handleExportPDF} isGeneratingPDF={isGeneratingPDF}>
      <AchievementsChecker />

      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bonjour, {user?.name || 'Bienvenue'} 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Voici un aperçu de votre progression et vos prochaines étapes.
          </p>
        </div>

        {/* Quick Stats Row */}
        <QuickStats
          stats={{
            score: stats.averageCompatibilityScore !== null ? stats.averageCompatibilityScore : undefined,
            tests: stats.questionnairesCompleted,
            couples: stats.couplesCreated,
            profile: stats.profileCompletion
          }}
        />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Next Actions (Priority) */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Priorités
                </h2>
              </div>
              <NextActionsWidget
                actions={[
                  {
                    id: 'complete-questionnaire',
                    label: stats.questionnairesCompleted === 0 ? 'Compléter votre premier questionnaire' : 'Nouveau questionnaire',
                    description: 'Découvrez votre compatibilité en 10 minutes',
                    priority: stats.questionnairesCompleted === 0 ? 'urgent' : 'normal',
                    href: '/questionnaire',
                    completed: stats.questionnairesCompleted > 0
                  },
                  {
                    id: 'invite-partner',
                    label: 'Inviter votre partenaire',
                    description: 'Partagez le lien pour comparer vos réponses',
                    priority: 'important',
                    href: '/dashboard/couple',
                    completed: stats.couplesCreated > 0
                  },
                  {
                    id: 'plan-budget-session',
                    label: 'Planifier une session budget',
                    description: 'Organisez 2h cette semaine',
                    priority: 'normal',
                    href: '/dashboard/actions',
                    completed: false
                  }
                ]}
              />
            </section>

            {/* Quick Access Grid */}
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Accès Rapide
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card className="hover:shadow-md transition-shadow border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                        <CardContent className="p-4 flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${link.bg}`}>
                            <link.icon className={`w-6 h-6 ${link.color}`} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-gray-100">
                              {link.title}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {link.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Premium/Status */}
          <div className="space-y-6">
            {/* Premium Card */}
            <Card className={`border-2 ${isPremium
              ? 'border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900'
              : 'border-gray-200 dark:border-gray-700'
              }`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-2 rounded-lg ${isPremium ? 'bg-purple-100 dark:bg-purple-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    <Crown className={`w-6 h-6 ${isPremium ? 'text-purple-600 dark:text-purple-400' : 'text-gray-600 dark:text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Plan {planName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isPremium ? 'Actif' : 'Gratuit'}
                    </p>
                  </div>
                </div>

                {!isPremium && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Débloquez toutes les fonctionnalités pour votre couple.
                    </p>
                    <StripeCheckout plan="premium" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                      Passer Premium
                    </StripeCheckout>
                  </div>
                )}

                {isPremium && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/dashboard/premium">Gérer mon abonnement</Link>
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Settings Link */}
            <Link href="/dashboard/settings">
              <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700 dark:text-gray-300">Paramètres</span>
                  <ArrowRight className="w-4 h-4 text-gray-400 ml-auto" />
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Modals */}
        <BudgetSessionModal
          open={showBudgetModal}
          onOpenChange={setShowBudgetModal}
          onSessionCreated={() => console.log('Session créée')}
        />
        <TodoListModal
          open={showTodoModal}
          onOpenChange={setShowTodoModal}
        />
        <ShortcutsModal
          open={isShortcutsModalOpen}
          onOpenChange={setIsShortcutsModalOpen}
        />
      </div>
    </DashboardLayout>
  )
}
