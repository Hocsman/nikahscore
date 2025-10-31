'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Crown, Check, Sparkles, Download, MessageSquare, Eye, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export default function PremiumPage() {
  const { user } = useAuth()

  const features = [
    {
      icon: Download,
      title: 'Export PDF',
      description: 'Téléchargez votre rapport de compatibilité complet en PDF'
    },
    {
      icon: Eye,
      title: 'Analyse Détaillée',
      description: 'Accédez à des insights approfondis sur votre compatibilité'
    },
    {
      icon: MessageSquare,
      title: 'Conseils Personnalisés',
      description: 'Recevez des recommandations sur mesure pour votre couple'
    },
    {
      icon: Star,
      title: 'Priorité Support',
      description: 'Support client prioritaire et assistance dédiée'
    },
    {
      icon: Sparkles,
      title: 'Fonctionnalités Exclusives',
      description: 'Accès anticipé aux nouvelles fonctionnalités'
    },
    {
      icon: Zap,
      title: 'Mises à Jour Illimitées',
      description: 'Refaites le questionnaire autant de fois que vous voulez'
    }
  ]

  const plans = [
    {
      name: 'Gratuit',
      price: 0,
      period: 'Toujours',
      features: [
        'Questionnaire de base',
        'Score de compatibilité',
        'Analyse limitée',
        'Support communautaire'
      ],
      current: true
    },
    {
      name: 'Premium',
      price: 9.99,
      period: 'par mois',
      features: [
        'Toutes les fonctionnalités gratuites',
        'Export PDF illimité',
        'Analyse détaillée complète',
        'Conseils personnalisés',
        'Support prioritaire',
        'Mises à jour illimitées',
        'Accès anticipé aux nouveautés'
      ],
      recommended: true,
      savings: 'Économisez 20% avec l\'abonnement annuel'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-purple-100">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
            Passez à Premium
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Débloquez toutes les fonctionnalités pour une analyse complète de votre compatibilité
          </p>
        </motion.div>

        {/* Fonctionnalités Premium */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <Card className="border-2 border-purple-200 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Fonctionnalités Premium</CardTitle>
              <CardDescription>
                Tout ce dont vous avez besoin pour comprendre votre compatibilité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex gap-4 p-4 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100"
                  >
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plans de tarification */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mb-8"
        >
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative ${plan.recommended ? 'border-2 border-purple-500 shadow-xl' : 'border-gray-200'}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Recommandé
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}€</span>
                  <span className="text-gray-600 ml-2">{plan.period}</span>
                </div>
                {plan.savings && (
                  <p className="text-sm text-green-600 font-medium">{plan.savings}</p>
                )}
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.current ? (
                  <Button variant="outline" className="w-full" disabled>
                    Plan Actuel
                  </Button>
                ) : (
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    onClick={() => alert('Intégration Stripe à venir !')}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Choisir Premium
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* FAQ / Garantie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-100 rounded-lg flex-shrink-0">
                  <Sparkles className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 mb-2">💝 Garantie Satisfaction</h3>
                  <p className="text-amber-800 text-sm leading-relaxed mb-3">
                    Nous sommes convaincus que Premium transformera votre expérience.
                  </p>
                  <p className="text-amber-700 text-xs">
                    🔒 Paiement sécurisé via Stripe • ❌ Annulation à tout moment
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bouton retour */}
        <div className="text-center mt-8">
          <Link href="/dashboard">
            <Button variant="ghost">
              Retour au Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
