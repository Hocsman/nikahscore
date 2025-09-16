'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircle, Download, Crown, Star, ArrowRight, Gift } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/lib/analytics'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan')
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { trackEvent } = useAnalytics()

  useEffect(() => {
    // Vérifier le paiement et activer le plan
    const verifyPayment = async () => {
      if (!sessionId) {
        setError('Session de paiement non trouvée')
        setLoading(false)
        return
      }

      try {
        const response = await fetch('/api/stripe/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId })
        })

        const data = await response.json()

        if (data.success) {
          // Track l'événement de conversion
          trackEvent('plan_purchased', {
            plan: plan || 'unknown',
            sessionId,
            amount: data.amount,
            customer: data.customer
          })
        } else {
          setError(data.error || 'Erreur de vérification du paiement')
        }
      } catch (error) {
        console.error('Erreur vérification paiement:', error)
        setError('Erreur lors de la vérification du paiement')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [sessionId, plan, trackEvent])

  const planDetails = {
    premium: {
      name: 'Premium',
      icon: <Star className="w-12 h-12 text-purple-600" />,
      color: 'from-purple-500 to-purple-600',
      benefits: [
        'Tests illimités',
        'Analyses détaillées',
        'Export PDF',
        'Support prioritaire'
      ]
    },
    conseil: {
      name: 'Conseil',
      icon: <Crown className="w-12 h-12 text-orange-600" />,
      color: 'from-orange-500 to-orange-600',
      benefits: [
        'Consultation personnalisée',
        'Expert matrimonial dédié',
        'Support téléphonique illimité',
        'Accès VIP'
      ]
    }
  }

  const currentPlan = plan && planDetails[plan as keyof typeof planDetails] 
    ? planDetails[plan as keyof typeof planDetails] 
    : planDetails.premium

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Vérification de votre paiement...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center p-8 max-w-md mx-auto">
          <div className="text-red-500 mb-4">
            <Crown className="w-12 h-12 mx-auto" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Erreur de paiement
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <Link href="/pricing">
            <Button>Retour aux tarifs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Icône de succès */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${currentPlan.color} mx-auto flex items-center justify-center mb-4`}>
                {currentPlan.icon}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute -top-2 -right-2"
              >
                <CheckCircle className="w-8 h-8 text-green-500 bg-white rounded-full" />
              </motion.div>
            </div>
          </motion.div>

          {/* Titre et message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              🎉 Félicitations !
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
              Votre abonnement <span className="font-semibold text-purple-600">{currentPlan.name}</span> est activé
            </p>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              Vous avez maintenant accès à toutes les fonctionnalités premium de NikahScore
            </p>
          </motion.div>

          {/* Avantages du plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Ce que vous débloquez :
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {currentPlan.benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Bonus de bienvenue */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 text-white mb-8"
          >
            <Gift className="w-8 h-8 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">🎁 Bonus de bienvenue</h3>
            <p className="text-pink-100">
              En tant que nouveau membre premium, vous recevrez un guide exclusif 
              "Les 10 clés d'un mariage réussi" par email dans les prochaines minutes.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/questionnaire">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer mon test premium
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Voir mon dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Note de support */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Une question ? Notre équipe est là pour vous aider à{' '}
              <a href="mailto:support@nikahscore.com" className="text-purple-600 hover:underline">
                support@nikahscore.com
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
