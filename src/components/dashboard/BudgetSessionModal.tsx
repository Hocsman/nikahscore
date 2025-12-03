'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, Target } from 'lucide-react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/hooks/useAuth'

interface BudgetSessionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSessionCreated?: () => void
}

export default function BudgetSessionModal({ open, onOpenChange, onSessionCreated }: BudgetSessionModalProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        title: '',
        notes: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast.error('Vous devez être connecté')
            return
        }

        if (!formData.date || !formData.time || !formData.title) {
            toast.error('Veuillez remplir tous les champs obligatoires')
            return
        }

        setLoading(true)

        try {
            const supabase = createClient()

            // Combiner date et heure
            const scheduledAt = new Date(`${formData.date}T${formData.time}`)

            const { error } = await supabase
                .from('budget_sessions')
                .insert({
                    user_id: user.id,
                    title: formData.title,
                    scheduled_at: scheduledAt.toISOString(),
                    notes: formData.notes || null,
                    status: 'scheduled'
                })

            if (error) throw error

            toast.success('Session planifiée avec succès!')

            // Reset form
            setFormData({ date: '', time: '', title: '', notes: '' })
            onOpenChange(false)
            onSessionCreated?.()

        } catch (error) {
            console.error('Error creating budget session:', error)
            toast.error('Erreur lors de la planification')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-pink-500" />
                        Planifier une Session Budget
                    </DialogTitle>
                    <DialogDescription>
                        Planifiez une session pour discuter de votre budget en couple
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Titre */}
                    <div>
                        <label className="text-sm font-medium mb-2 block">
                            Titre de la session *
                        </label>
                        <Input
                            placeholder="Ex: Budget mariage, Économies mensuel, Vacances..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    {/* Date et Heure */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Date *
                            </label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                min={new Date().toISOString().split('T')[0]}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                Heure *
                            </label>
                            <Input
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Notes */}
                    <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Objectifs / Notes
                        </label>
                        <Textarea
                            placeholder="Ex: Discuter des dépenses du mois, Planifier les économies pour la maison..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="resize-none"
                        />
                    </div>

                    {/* Boutons */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                            disabled={loading}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600"
                            disabled={loading}
                        >
                            {loading ? 'Planification...' : 'Planifier'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
