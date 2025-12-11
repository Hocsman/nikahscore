'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { User, Bell, Palette, Database, Sun, Moon, Loader2, Check, AlertTriangle, Trash2, Download } from 'lucide-react'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'

interface NotificationSettings {
    email_notifications: boolean
    budget_reminders: boolean
    partner_activity: boolean
    newsletter: boolean
    marketing: boolean
}

export default function SettingsPage() {
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const router = useRouter()
    const supabase = createClient()

    // États pour le profil
    const [name, setName] = useState('')
    const [isSavingProfile, setIsSavingProfile] = useState(false)
    const [profileSaved, setProfileSaved] = useState(false)

    // États pour les notifications
    const [notifications, setNotifications] = useState<NotificationSettings>({
        email_notifications: true,
        budget_reminders: true,
        partner_activity: true,
        newsletter: false,
        marketing: false
    })
    const [isSavingNotifications, setIsSavingNotifications] = useState(false)
    const [notificationsSaved, setNotificationsSaved] = useState(false)

    // États pour la suppression de compte
    const [showDeleteDialog, setShowDeleteDialog] = useState(false)
    const [deleteConfirmText, setDeleteConfirmText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    // États pour l'export de données
    const [isExporting, setIsExporting] = useState(false)

    // Charger les données du profil
    useEffect(() => {
        if (user) {
            setName(user.name || user.firstName || '')
            loadNotificationSettings()
        }
    }, [user])

    const loadNotificationSettings = async () => {
        if (!user) return

        try {
            const { data } = await supabase
                .from('profiles')
                .select('notification_settings')
                .eq('id', user.id)
                .single()

            if (data?.notification_settings) {
                setNotifications(prev => ({
                    ...prev,
                    ...data.notification_settings
                }))
            }
        } catch (error) {
            console.error('Erreur chargement notifications:', error)
        }
    }

    // Sauvegarder le profil
    const handleSaveProfile = async () => {
        if (!user) return

        setIsSavingProfile(true)
        setProfileSaved(false)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    first_name: name.split(' ')[0] || name,
                    last_name: name.split(' ').slice(1).join(' ') || '',
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            setProfileSaved(true)
            setTimeout(() => setProfileSaved(false), 3000)
        } catch (error) {
            console.error('Erreur sauvegarde profil:', error)
            alert('Erreur lors de la sauvegarde du profil')
        } finally {
            setIsSavingProfile(false)
        }
    }

    // Sauvegarder les notifications
    const handleSaveNotifications = async () => {
        if (!user) return

        setIsSavingNotifications(true)
        setNotificationsSaved(false)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    notification_settings: notifications,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)

            if (error) throw error
            setNotificationsSaved(true)
            setTimeout(() => setNotificationsSaved(false), 3000)
        } catch (error) {
            console.error('Erreur sauvegarde notifications:', error)
            alert('Erreur lors de la sauvegarde des préférences')
        } finally {
            setIsSavingNotifications(false)
        }
    }

    // Exporter les données
    const handleExportData = async () => {
        if (!user) return

        setIsExporting(true)

        try {
            // Récupérer toutes les données de l'utilisateur
            const [profileData, couplesData, responsesData] = await Promise.all([
                supabase.from('profiles').select('*').eq('id', user.id).single(),
                supabase.from('couples').select('*').or(`creator_id.eq.${user.id},partner_id.eq.${user.id}`),
                supabase.from('questionnaire_responses').select('*').eq('user_id', user.id)
            ])

            const exportData = {
                exported_at: new Date().toISOString(),
                user_id: user.id,
                email: user.email,
                profile: profileData.data,
                couples: couplesData.data,
                questionnaire_responses: responsesData.data
            }

            // Télécharger en JSON
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `nikahscore-data-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Erreur export données:', error)
            alert('Erreur lors de l\'export des données')
        } finally {
            setIsExporting(false)
        }
    }

    // Supprimer le compte
    const handleDeleteAccount = async () => {
        if (!user || deleteConfirmText !== 'SUPPRIMER') return

        setIsDeleting(true)

        try {
            // Appeler l'API de suppression
            const response = await fetch('/api/user/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                throw new Error('Erreur lors de la suppression')
            }

            // Déconnecter et rediriger
            await supabase.auth.signOut()
            router.push('/?deleted=true')
        } catch (error) {
            console.error('Erreur suppression compte:', error)
            alert('Erreur lors de la suppression du compte. Veuillez contacter le support.')
        } finally {
            setIsDeleting(false)
            setShowDeleteDialog(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        Paramètres
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Gérez votre profil et vos préférences
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="profile" className="gap-2">
                            <User className="w-4 h-4" />
                            <span className="hidden sm:inline">Profil</span>
                        </TabsTrigger>
                        <TabsTrigger value="notifications" className="gap-2">
                            <Bell className="w-4 h-4" />
                            <span className="hidden sm:inline">Notifications</span>
                        </TabsTrigger>
                        <TabsTrigger value="preferences" className="gap-2">
                            <Palette className="w-4 h-4" />
                            <span className="hidden sm:inline">Préférences</span>
                        </TabsTrigger>
                        <TabsTrigger value="data" className="gap-2">
                            <Database className="w-4 h-4" />
                            <span className="hidden sm:inline">Données</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Informations personnelles</CardTitle>
                                <CardDescription>
                                    Mettez à jour vos informations de profil
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Votre nom"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        defaultValue={user?.email || ''}
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-800"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        L'email ne peut pas être modifié
                                    </p>
                                </div>

                                <Button 
                                    className="w-full" 
                                    onClick={handleSaveProfile}
                                    disabled={isSavingProfile}
                                >
                                    {isSavingProfile ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : profileSaved ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Enregistré !
                                        </>
                                    ) : (
                                        'Enregistrer les modifications'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Préférences de notifications</CardTitle>
                                <CardDescription>
                                    Choisissez comment vous souhaitez être notifié
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="email-notif">Notifications par email</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Recevoir des emails sur l'activité du compte
                                        </p>
                                    </div>
                                    <Switch
                                        id="email-notif"
                                        checked={notifications.email_notifications}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, email_notifications: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="partner-activity">Activité partenaire</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Être notifié quand votre partenaire complète un questionnaire
                                        </p>
                                    </div>
                                    <Switch
                                        id="partner-activity"
                                        checked={notifications.partner_activity}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, partner_activity: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="budget-reminders">Rappels sessions budget</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Recevoir un rappel avant vos sessions planifiées
                                        </p>
                                    </div>
                                    <Switch
                                        id="budget-reminders"
                                        checked={notifications.budget_reminders}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, budget_reminders: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="newsletter">Newsletter hebdomadaire</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Conseils couple et actualités NikahScore
                                        </p>
                                    </div>
                                    <Switch
                                        id="newsletter"
                                        checked={notifications.newsletter}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, newsletter: checked }))
                                        }
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label htmlFor="marketing">Offres et promotions</Label>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Recevoir des offres spéciales et promotions
                                        </p>
                                    </div>
                                    <Switch
                                        id="marketing"
                                        checked={notifications.marketing}
                                        onCheckedChange={(checked) => 
                                            setNotifications(prev => ({ ...prev, marketing: checked }))
                                        }
                                    />
                                </div>

                                <Button 
                                    className="w-full"
                                    onClick={handleSaveNotifications}
                                    disabled={isSavingNotifications}
                                >
                                    {isSavingNotifications ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Enregistrement...
                                        </>
                                    ) : notificationsSaved ? (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Préférences enregistrées !
                                        </>
                                    ) : (
                                        'Enregistrer les préférences'
                                    )}
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Apparence</CardTitle>
                                <CardDescription>
                                    Personnalisez l'apparence de l'application
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Thème</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <Button
                                            variant={theme === 'light' ? 'default' : 'outline'}
                                            className="justify-start gap-2"
                                            onClick={() => setTheme('light')}
                                        >
                                            <Sun className="w-4 h-4" />
                                            Clair
                                        </Button>
                                        <Button
                                            variant={theme === 'dark' ? 'default' : 'outline'}
                                            className="justify-start gap-2"
                                            onClick={() => setTheme('dark')}
                                        >
                                            <Moon className="w-4 h-4" />
                                            Sombre
                                        </Button>
                                        <Button
                                            variant={theme === 'system' ? 'default' : 'outline'}
                                            className="justify-start gap-2"
                                            onClick={() => setTheme('system')}
                                        >
                                            Système
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="language">Langue</Label>
                                    <Input
                                        id="language"
                                        defaultValue="Français"
                                        disabled
                                        className="bg-gray-50 dark:bg-gray-800"
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Autres langues bientôt disponibles
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Data Tab */}
                    <TabsContent value="data" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Exporter mes données</CardTitle>
                                <CardDescription>
                                    Téléchargez une copie de toutes vos données personnelles
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Vous recevrez un fichier JSON contenant votre profil, vos questionnaires et vos résultats.
                                </p>
                                <Button 
                                    variant="outline" 
                                    className="w-full gap-2"
                                    onClick={handleExportData}
                                    disabled={isExporting}
                                >
                                    {isExporting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Export en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            Télécharger mes données
                                        </>
                                    )}
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="border-red-200 dark:border-red-900">
                            <CardHeader>
                                <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5" />
                                    Zone dangereuse
                                </CardTitle>
                                <CardDescription>
                                    Actions irréversibles sur votre compte
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    La suppression de votre compte est <strong>définitive et irréversible</strong>. 
                                    Toutes vos données, questionnaires et résultats seront supprimés.
                                </p>
                                <Button 
                                    variant="destructive" 
                                    className="w-full gap-2"
                                    onClick={() => setShowDeleteDialog(true)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                    Supprimer mon compte
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Dialog de confirmation de suppression */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5" />
                            Supprimer votre compte
                        </DialogTitle>
                        <DialogDescription>
                            Cette action est irréversible. Toutes vos données seront définitivement supprimées.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-red-800 dark:text-red-200 mb-2">
                                Cela supprimera définitivement :
                            </h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                <li>• Votre profil et informations personnelles</li>
                                <li>• Tous vos questionnaires et réponses</li>
                                <li>• Vos résultats de compatibilité</li>
                                <li>• Votre historique et préférences</li>
                            </ul>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-delete">
                                Tapez <strong>SUPPRIMER</strong> pour confirmer
                            </Label>
                            <Input
                                id="confirm-delete"
                                value={deleteConfirmText}
                                onChange={(e) => setDeleteConfirmText(e.target.value)}
                                placeholder="SUPPRIMER"
                                className="font-mono"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setShowDeleteDialog(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={deleteConfirmText !== 'SUPPRIMER' || isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Suppression...
                                </>
                            ) : (
                                'Supprimer définitivement'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </DashboardLayout>
    )
}
