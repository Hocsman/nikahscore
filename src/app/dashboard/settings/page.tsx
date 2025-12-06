'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Bell, Palette, Database, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function SettingsPage() {
    const { user } = useAuth()
    const { theme, setTheme } = useTheme()
    const [emailNotifications, setEmailNotifications] = useState(true)
    const [budgetReminders, setBudgetReminders] = useState(true)
    const [newsletter, setNewsletter] = useState(false)

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
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nom complet</Label>
                                    <Input
                                        id="name"
                                        defaultValue={user?.name || ''}
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

                                <Button className="w-full">
                                    Enregistrer les modifications
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Notifications Tab */}
                    <TabsContent value="notifications" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Préférences de notifications</CardTitle>
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
                                        checked={emailNotifications}
                                        onCheckedChange={setEmailNotifications}
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
                                        checked={budgetReminders}
                                        onCheckedChange={setBudgetReminders}
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
                                        checked={newsletter}
                                        onCheckedChange={setNewsletter}
                                    />
                                </div>

                                <Button className="w-full">
                                    Enregistrer les préférences
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Preferences Tab */}
                    <TabsContent value="preferences" className="space-y-4 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="dark:text-gray-100">Apparence</CardTitle>
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
                                <CardTitle className="dark:text-gray-100">Gestion des données</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                        Exporter mes données
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        Téléchargez une copie de toutes vos données personnelles
                                    </p>
                                    <Button variant="outline" className="w-full">
                                        Demander une exportation
                                    </Button>
                                </div>

                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                                        Zone dangereuse
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                        La suppression de votre compte est définitive et irréversible
                                    </p>
                                    <Button variant="destructive" className="w-full">
                                        Supprimer mon compte
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </DashboardLayout>
    )
}
