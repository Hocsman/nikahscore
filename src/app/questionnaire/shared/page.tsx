'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Heart, Share2, Users, Copy, ArrowRight, Sparkles, Mail, Lock, User, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'

export default function SharedQuestionnairePage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  
  // States pour le questionnaire partagé
  const [email, setEmail] = useState('')
  const [shareCode, setShareCode] = useState<string | null>(null)
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  
  // States pour le formulaire d'inscription
  const [registerData, setRegisterData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [registerLoading, setRegisterLoading] = useState(false)
  const [registerError, setRegisterError] = useState('')
  const [registerSuccess, setRegisterSuccess] = useState(false)

  const createSharedQuestionnaire = async () => {
    if (!email.trim()) {
      toast.error('Veuillez entrer votre email')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/questionnaire/shared/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creator_email: email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setShareCode(data.share_code)
        setShareUrl(data.share_url)
        if (data.email_sent) {
          toast.success('Lien créé et email envoyé ! Vérifiez votre boîte mail.')
        } else {
          toast.success('Lien de partage créé avec succès!')
        }
      } else {
        toast.error(data.error || 'Erreur lors de la création')
      }
    } catch (error) {
      console.error('Error creating shared questionnaire:', error)
      toast.error('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl)
      toast.success('Lien copié dans le presse-papiers!')
    }
  }

  const handleRegisterInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    })
    setRegisterError('')
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setRegisterError('')

    // Validation
    if (!registerData.firstName.trim()) {
      setRegisterError('Le prénom est requis')
      return
    }
    if (!registerData.email.trim()) {
      setRegisterError('L\'email est requis')
      return
    }
    if (registerData.password.length < 6) {
      setRegisterError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError('Les mots de passe ne correspondent pas')
      return
    }

    setRegisterLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: registerData.firstName,
          lastName: registerData.lastName,
          email: registerData.email,
          password: registerData.password
        })
      })

      const data = await response.json()

      if (data.success) {
        setRegisterSuccess(true)
        toast.success('Inscription réussie ! Redirection...')
        setTimeout(() => {
          // L'utilisateur sera maintenant connecté et verra le formulaire de création
          window.location.reload()
        }, 1500)
      } else {
        setRegisterError(data.error || 'Erreur lors de l\'inscription')
      }
    } catch (error) {
      console.error('Erreur inscription:', error)
      setRegisterError('Erreur serveur. Veuillez réessayer.')
    } finally {
      setRegisterLoading(false)
    }
  }

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  // Si l'utilisateur n'est PAS connecté → Formulaire d'inscription
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 py-12 px-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3">
                <Heart className="h-8 w-8 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Créez un Questionnaire Partagé
            </h1>
            <p className="text-gray-600">
              Inscrivez-vous pour évaluer votre compatibilité à deux
            </p>
          </motion.div>

          {/* Features */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-6 mb-6 space-y-3"
          >
            <div className="flex items-start gap-3">
              <div className="bg-pink-100 rounded-full p-2 mt-1">
                <Heart className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Évaluez votre compatibilité à deux</h3>
                <p className="text-sm text-gray-600">Questionnaire conçu pour les couples</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-purple-100 rounded-full p-2 mt-1">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Réponses synchronisées en temps réel</h3>
                <p className="text-sm text-gray-600">Chacun répond de son côté</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 rounded-full p-2 mt-1">
                <Sparkles className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Résultats comparatifs instantanés</h3>
                <p className="text-sm text-gray-600">Découvrez vos points communs et différences</p>
              </div>
            </div>
          </motion.div>

          {/* Formulaire d'inscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Créer mon compte gratuit</CardTitle>
                <CardDescription>
                  Rejoignez NikahScore et créez votre questionnaire partagé
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  {/* Prénom */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Prénom *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="Votre prénom"
                        value={registerData.firstName}
                        onChange={handleRegisterInputChange}
                        className="pl-12 h-12"
                        required
                        disabled={registerLoading}
                      />
                    </div>
                  </div>

                  {/* Nom (optionnel) */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Nom <span className="text-gray-400 text-xs">(optionnel)</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Votre nom de famille"
                        value={registerData.lastName}
                        onChange={handleRegisterInputChange}
                        className="pl-12 h-12"
                        disabled={registerLoading}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Adresse email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        name="email"
                        placeholder="votre@email.com"
                        value={registerData.email}
                        onChange={handleRegisterInputChange}
                        className="pl-12 h-12"
                        required
                        disabled={registerLoading}
                      />
                    </div>
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={handleRegisterInputChange}
                        className="pl-12 pr-12 h-12 dark:text-white"
                        required
                        disabled={registerLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        disabled={registerLoading}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmation mot de passe */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Confirmer le mot de passe *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterInputChange}
                        className="pl-12 h-12 dark:text-white"
                        required
                        disabled={registerLoading}
                      />
                    </div>
                  </div>

                  {/* Erreur */}
                  {registerError && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{registerError}</span>
                    </motion.div>
                  )}

                  {/* Succès */}
                  {registerSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-green-600 text-sm bg-green-50 p-3 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>Inscription réussie ! Redirection...</span>
                    </motion.div>
                  )}

                  {/* Bouton */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                    disabled={registerLoading}
                  >
                    {registerLoading ? 'Inscription...' : 'Créer mon compte et continuer'}
                    {!registerLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                {/* Lien connexion */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Déjà inscrit ?{' '}
                    <button
                      onClick={() => router.push('/auth?mode=login')}
                      className="text-pink-600 hover:text-pink-700 font-semibold"
                    >
                      Se connecter
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  // Si l'utilisateur EST connecté → Formulaire de création du questionnaire
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4">
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-3">
            <Heart className="h-8 w-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Questionnaire de Couple
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Créez un questionnaire partagé pour découvrir votre compatibilité en tant que couple
        </p>
      </div>

      {!shareCode ? (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <Users className="h-6 w-6 text-pink-500" />
              Créer un Questionnaire Partagé
            </CardTitle>
            <CardDescription>
              Entrez votre email pour commencer le processus de création
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Votre email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>

            <Button 
              onClick={createSharedQuestionnaire}
              disabled={loading || !email.trim()}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Création en cours...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4" />
                  Créer le Lien de Partage
                </div>
              )}
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Comment ça marche ?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Créez votre questionnaire partagé avec votre email</li>
                <li>• Partagez le lien généré avec votre partenaire</li>
                <li>• Répondez tous les deux aux 100 questions</li>
                <li>• Découvrez votre score de compatibilité!</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-green-600">
              <Share2 className="h-6 w-6" />
              Questionnaire Créé avec Succès!
            </CardTitle>
            <CardDescription>
              Partagez ce lien avec votre partenaire
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-green-800">Code de partage:</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {shareCode}
                </Badge>
              </div>
              <div className="bg-white p-3 rounded border break-all text-sm">
                {shareUrl}
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={copyToClipboard}
                variant="outline" 
                className="flex-1"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copier le Lien
              </Button>
              <Button 
                onClick={() => window.open(shareUrl || '', '_blank')}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Commencer
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900 mb-2">
                Étapes suivantes :
              </h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>1. Partagez le lien avec votre partenaire</li>
                <li>2. Chacun répond aux questions individuellement</li>
                <li>3. Découvrez votre compatibilité une fois terminé</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
