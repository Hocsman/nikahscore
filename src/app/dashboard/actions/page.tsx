'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import BudgetSessionModal from '@/components/dashboard/BudgetSessionModal'
import TodoListModal from '@/components/dashboard/TodoListModal'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar, CheckSquare, Plus, Trash2 } from 'lucide-react'
import FeatureGate from '@/components/premium/FeatureGate'
import StripeCheckout from '@/components/stripe/StripeCheckout'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'
import { toast } from 'sonner'

interface TodoItem {
    id: string
    title: string
    completed: boolean
    created_at: string
}

export default function ActionsPage() {
    const { user } = useAuth()
    const [showBudgetModal, setShowBudgetModal] = useState(false)
    const [showTodoModal, setShowTodoModal] = useState(false)
    const [todos, setTodos] = useState<TodoItem[]>([])

    const loadTodos = useCallback(async () => {
        if (!user) return
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('couple_todos')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
            if (error) throw error
            setTodos(data || [])
        } catch (error) {
            console.error('Error loading todos:', error)
        }
    }, [user])

    useEffect(() => {
        if (user) loadTodos()
    }, [user, loadTodos])

    const handleToggleTodo = async (id: string, completed: boolean) => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('couple_todos')
                .update({ completed: !completed })
                .eq('id', id)
            if (error) throw error
            setTodos(todos.map(t => t.id === id ? { ...t, completed: !completed } : t))
        } catch {
            toast.error('Erreur lors de la mise à jour')
        }
    }

    const handleDeleteTodo = async (id: string) => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('couple_todos')
                .delete()
                .eq('id', id)
            if (error) throw error
            setTodos(todos.filter(t => t.id !== id))
            toast.success('Tâche supprimée')
        } catch {
            toast.error('Erreur lors de la suppression')
        }
    }

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
                                            <StripeCheckout plan="premium" className="bg-gradient-to-r from-purple-500 to-pink-600">
                                                Passer Premium
                                            </StripeCheckout>
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
                                            <StripeCheckout plan="premium" className="bg-gradient-to-r from-blue-500 to-purple-600">
                                                Passer Premium
                                            </StripeCheckout>
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

                                {todos.length === 0 ? (
                                    <Card>
                                        <CardContent className="pt-6">
                                            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                                                Aucune tâche créée. Créez votre première to-do !
                                            </p>
                                        </CardContent>
                                    </Card>
                                ) : (
                                    <Card>
                                        <CardContent className="pt-6 space-y-2">
                                            {todos.map((todo) => (
                                                <div
                                                    key={todo.id}
                                                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <Checkbox
                                                        checked={todo.completed}
                                                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                                                    />
                                                    <span className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                        {todo.title}
                                                    </span>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleDeleteTodo(todo.id)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="pt-2 border-t text-sm text-gray-500 dark:text-gray-400 flex justify-between">
                                                <span>{todos.filter(t => t.completed).length} / {todos.length} complétées</span>
                                                <span>{todos.filter(t => !t.completed).length} restantes</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )}
                            </div>
                        </FeatureGate>
                    </TabsContent>
                </Tabs>

                {/* Modals */}
                <BudgetSessionModal
                    open={showBudgetModal}
                    onOpenChange={setShowBudgetModal}
                    onSessionCreated={() => {}}
                />
                <TodoListModal
                    open={showTodoModal}
                    onOpenChange={(open) => {
                        setShowTodoModal(open)
                        if (!open) loadTodos()
                    }}
                />
            </div>
        </DashboardLayout>
    )
}
