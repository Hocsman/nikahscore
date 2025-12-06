'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import BudgetSessionModal from '@/components/dashboard/BudgetSessionModal'
import TodoListModal from '@/components/dashboard/TodoListModal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, CheckSquare, Plus } from 'lucide-react'
import FeatureGate from '@/components/premium/FeatureGate'

export default function ActionsPage() {
    const [showBudgetModal, setShowBudgetModal] = useState(false)
    const [showTodoModal, setShowTodoModal] = useState(false)

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Actions Rapides
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Gérez vos sessions budget et to-do liste partagée
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="budget" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="budget" className="gap-2">
                            <Calendar className="w-4 h-4" />
                            Sessions Budget
                        </TabsTrigger>
                        <TabsTrigger value="todos" className="gap-2">
                            <CheckSquare className="w-4 h-4" />
                            To-Do Liste
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="budget" className="space-y-4 mt-6">
                        <FeatureGate
                            featureCode="budget_sessions"
                            fallback={
                                <Card className="border-purple-200 dark:border-purple-800">
                                    <CardContent className="pt-6">
                                        <div className="text-center py-8">
                                            <Calendar className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Sessions Budget Premium
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Passez Premium pour planifier des sessions budget avec votre partenaire
                                            </p>
                                            <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                                                Passer Premium
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        Mes sessions planifiées
                                    </h2>
                                    <Button onClick={() => setShowBudgetModal(true)} className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Nouvelle session
                                    </Button>
                                </div>

                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                            Aucune session planifiée. Créez votre première session budget !
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </FeatureGate>
                    </TabsContent>

                    <TabsContent value="todos" className="space-y-4 mt-6">
                        <FeatureGate
                            featureCode="shared_todos"
                            fallback={
                                <Card className="border-blue-200 dark:border-blue-800">
                                    <CardContent className="pt-6">
                                        <div className="text-center py-8">
                                            <CheckSquare className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                To-Do Liste Premium
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                Passez Premium pour créer une to-do liste partagée avec votre partenaire
                                            </p>
                                            <Button className="bg-gradient-to-r from-blue-500 to-purple-600">
                                                Passer Premium
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            }
                        >
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        To-Do partagées
                                    </h2>
                                    <Button onClick={() => setShowTodoModal(true)} className="gap-2">
                                        <Plus className="w-4 h-4" />
                                        Nouvelle tâche
                                    </Button>
                                </div>

                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                            Aucune tâche créée. Créez votre première to-do !
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </FeatureGate>
                    </TabsContent>
                </Tabs>

                {/* Modals */}
                <BudgetSessionModal
                    open={showBudgetModal}
                    onOpenChange={setShowBudgetModal}
                    onSessionCreated={() => {
                        console.log('Session créée')
                    }}
                />
                <TodoListModal
                    open={showTodoModal}
                    onOpenChange={setShowTodoModal}
                />
            </div>
        </DashboardLayout>
    )
}
