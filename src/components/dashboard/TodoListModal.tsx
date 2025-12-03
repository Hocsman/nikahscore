'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { ListTodo, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface TodoItem {
    id: string
    title: string
    completed: boolean
    created_at: string
}

interface TodoListModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export default function TodoListModal({ open, onOpenChange }: TodoListModalProps) {
    const { user } = useAuth()
    const [todos, setTodos] = useState<TodoItem[]>([])
    const [newTodo, setNewTodo] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (open && user) {
            loadTodos()
        }
    }, [open, user])

    const loadTodos = async () => {
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
    }

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user || !newTodo.trim()) return

        setLoading(true)

        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('couple_todos')
                .insert({
                    user_id: user.id,
                    title: newTodo.trim(),
                    completed: false
                })
                .select()
                .single()

            if (error) throw error

            setTodos([data, ...todos])
            setNewTodo('')
            toast.success('Tâche ajoutée!')

        } catch (error) {
            console.error('Error adding todo:', error)
            toast.error('Erreur lors de l\'ajout')
        } finally {
            setLoading(false)
        }
    }

    const handleToggleTodo = async (id: string, completed: boolean) => {
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('couple_todos')
                .update({ completed: !completed })
                .eq('id', id)

            if (error) throw error

            setTodos(todos.map(todo =>
                todo.id === id ? { ...todo, completed: !completed } : todo
            ))

        } catch (error) {
            console.error('Error toggling todo:', error)
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

            setTodos(todos.filter(todo => todo.id !== id))
            toast.success('Tâche supprimée')

        } catch (error) {
            console.error('Error deleting todo:', error)
            toast.error('Erreur lors de la suppression')
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ListTodo className="w-5 h-5 text-green-500" />
                        Routine Commune
                    </DialogTitle>
                    <DialogDescription>
                        Créez une liste de tâches partagée avec votre partenaire
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                    {/* Formulaire ajout */}
                    <form onSubmit={handleAddTodo} className="flex gap-2">
                        <Input
                            placeholder="Ajouter une tâche..."
                            value={newTodo}
                            onChange={(e) => setNewTodo(e.target.value)}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="bg-green-500 hover:bg-green-600"
                            disabled={loading || !newTodo.trim()}
                        >
                            <Plus className="w-4 h-4" />
                        </Button>
                    </form>

                    {/* Liste des tâches */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {todos.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <ListTodo className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">Aucune tâche pour le moment</p>
                                <p className="text-xs">Ajoutez votre première tâche ci-dessus</p>
                            </div>
                        ) : (
                            todos.map((todo) => (
                                <div
                                    key={todo.id}
                                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                >
                                    <Checkbox
                                        checked={todo.completed}
                                        onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                                    />
                                    <span
                                        className={`flex-1 ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                                    >
                                        {todo.title}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteTodo(todo.id)}
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Stats */}
                    {todos.length > 0 && (
                        <div className="pt-2 border-t text-sm text-gray-600 flex justify-between">
                            <span>{todos.filter(t => t.completed).length} / {todos.length} complétées</span>
                            <span>{todos.filter(t => !t.completed).length} restantes</span>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
