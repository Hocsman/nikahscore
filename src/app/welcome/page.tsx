'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, BarChart3, ArrowRight, Heart, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WelcomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    console.log('🔍 /welcome - État:', { user: !!user, loading, userName })
    
    // Récupérer le nom de l'utilisateur
    if (user) {
      const name = user.name || user.email?.split('@')[0] || 'Utilisateur'
      setUserName(name)
      console.log('✅ /welcome - Utilisateur trouvé:', name)
    }
    
    // Rediriger vers /auth si pas connecté (SEULEMENT après le chargement)
    if (!loading && !user) {
      console.log('⚠️ /welcome - Pas d\'utilisateur, redirection vers /auth')
      router.push('/auth?mode=register')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-50">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* En-tête de bienvenue */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mb-6">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            🎉 Bienvenue {userName} !
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre compte <strong>NikahScore</strong> a été créé avec succès ! 
            Nous sommes ravis de vous accompagner dans votre parcours vers un mariage réussi.
          </p>
        </motion.div>

        {/* Cartes d'options */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Option 1 : Commencer le questionnaire */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-2 border-pink-200 hover:border-pink-400 transition-all hover:shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-pink-100 rounded-lg">
                    <Heart className="w-6 h-6 text-pink-600" />
                  </div>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs font-semibold rounded-full">
                    RECOMMANDÉ
                  </span>
                </div>
                <CardTitle className="text-2xl">Commencer mon questionnaire</CardTitle>
                <CardDescription className="text-base">
                  Répondez à notre questionnaire de compatibilité pour obtenir votre score et vos insights personnalisés
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Questionnaire rapide (10 minutes)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Score de compatibilité instantané</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Analyse détaillée de votre profil</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Recommandations personnalisées</span>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push('/questionnaire')}
                  className="w-full h-12 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-medium"
                  size="lg"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Commencer maintenant
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Option 2 : Voir le dashboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-2 border-purple-200 hover:border-purple-400 transition-all hover:shadow-lg h-full">
              <CardHeader>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Voir mon dashboard</CardTitle>
                <CardDescription className="text-base">
                  Accédez à votre tableau de bord pour consulter vos résultats et gérer votre profil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Consultez vos résultats</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Suivez votre progression</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Gérez votre profil</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span>Explorez vos options Premium</span>
                  </div>
                </div>

                <Button 
                  onClick={() => router.push('/dashboard')}
                  variant="outline"
                  className="w-full h-12 border-2 border-purple-300 hover:bg-purple-50 font-medium"
                  size="lg"
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Accéder au dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Informations supplémentaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">💡 Conseil</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Nous vous recommandons de <strong>commencer par le questionnaire</strong> pour obtenir 
                    votre score de compatibilité. Cela ne prend que 10 minutes et vous donnera 
                    des insights précieux sur votre relation ! ✨
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Note de confidentialité */}
        <p className="text-center text-sm text-gray-500 mt-8">
          🔒 Toutes vos données sont sécurisées et confidentielles
        </p>
      </div>
    </div>
  )
}
