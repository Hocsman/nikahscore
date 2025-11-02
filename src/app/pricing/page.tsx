'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Check, Star, Heart, Crown, Zap } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useState } from 'react'
import { useAnalytics } from '@/lib/analytics'
import { Button } from '@/components/ui/button'
import StripeCheckout from '@/components/stripe/StripeCheckout'

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false)
  const { trackEvent } = useAnalytics()

  const plans = [
    {
      name: "Gratuit",
      description: "Pour découvrir NikahScore",
      price: "0€",
      period: "toujours",
      icon: <Heart className="w-8 h-8" />,
      color: "from-pink-500 to-pink-600",
      features: [
        "Test de compatibilité complet (100 questions personnalité)",
        "Score global de compatibilité",
        "Résultats par domaine",
        "Partage des résultats par email",
        "Recommandations de base",
        "Support communautaire"
      ],
      limitations: [
        "1 test par mois",
        "Pas d'historique des tests",
        "Support par email uniquement"
      ],
      cta: "Commencer gratuitement",
      href: "/questionnaire",
      popular: false
    },
    {
      name: "Premium",
      description: "Pour une analyse approfondie",
      price: isAnnual ? "6,67€" : "9,99€",
      period: isAnnual ? "par mois (79€/an)" : "par mois",
      savings: isAnnual ? "Économisez 33%" : "",
      icon: <Star className="w-8 h-8" />,
      color: "from-purple-500 to-purple-600",
      features: [
        "Tout du plan Gratuit",
        "Tests illimités",
        "Analyse détaillée avec insights",
        "Comparaison entre deux profils",
        "Historique complet des tests",
        "Export PDF professionnel",
        "Recommandations personnalisées avancées",
        "Support prioritaire par email",
        "Accès aux nouvelles fonctionnalités"
      ],
      limitations: [],
      cta: "Essayer Premium",
      planId: "premium",
      stripeEnabled: true,
      popular: true
    },
    {
      name: "Conseil",
      description: "Avec accompagnement personnel",
      price: isAnnual ? "41,67€" : "49,99€",
      period: isAnnual ? "par mois (499€/an)" : "par mois",
      savings: isAnnual ? "Économisez 17%" : "",
      icon: <Crown className="w-8 h-8" />,
      color: "from-orange-500 to-orange-600",
      features: [
        "Tout du plan Premium",
        "Consultation mensuelle avec conseiller matrimonial",
        "Analyse personnalisée par expert",
        "Plan d'action matrimonial sur-mesure",
        "Support téléphonique illimité",
        "Accompagnement durant les rencontres",
        "Accès aux événements VIP",
        "Garantie satisfaction 30 jours"
      ],
      limitations: [],
      cta: "Réserver une consultation",
      planId: "conseil",
      stripeEnabled: true,
      popular: false
    }
  ]

  const faq = [
    {
      question: "Puis-je changer de plan à tout moment ?",
      answer: "Oui, vous pouvez passer à un plan supérieur ou inférieur à tout moment depuis votre tableau de bord. Les changements prennent effet immédiatement."
    },
    {
      question: "Y a-t-il un essai gratuit pour les plans payants ?",
      answer: "Oui, tous nos plans premium incluent 14 jours d'essai gratuit. Aucun engagement, vous pouvez annuler à tout moment."
    },
    {
      question: "Comment fonctionne la garantie satisfaction ?",
      answer: "Si vous n'êtes pas satisfait dans les 30 premiers jours, nous vous remboursons intégralement, sans questions."
    },
    {
      question: "Proposez-vous des réductions pour les étudiants ?",
      answer: "Oui, nous offrons 50% de réduction sur tous nos plans pour les étudiants avec une carte étudiante valide."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ThemeToggle />
      
      {/* Header avec navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/"
          className="inline-flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour à l'accueil
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent mb-6">
            Nos Tarifs
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            Choisissez le plan qui correspond à vos besoins matrimoniaux
          </p>

          {/* Toggle Annual/Monthly */}
          <div className="inline-flex items-center bg-white dark:bg-gray-800 rounded-xl p-2 shadow-lg mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                !isAnnual 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isAnnual 
                  ? 'bg-pink-500 text-white shadow-md' 
                  : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              Annuel
              <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                -33%
              </span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans de tarification */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto justify-items-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`relative bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden ${
                plan.popular ? 'ring-2 ring-blue-500 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-center py-2 text-sm font-semibold">
                  ⭐ Plus Populaire
                </div>
              )}

              <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                {/* Header */}
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                    <div className="text-white">
                      {plan.icon}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {plan.description}
                  </p>
                </div>

                {/* Prix */}
                <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center mb-2">
                    <span className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                      {plan.price}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {plan.period}
                  </p>
                  {plan.savings && (
                    <p className="text-pink-600 dark:text-pink-400 text-sm font-semibold mt-1">
                      {plan.savings}
                    </p>
                  )}
                </div>

                {/* Fonctionnalités */}
                <div className="mb-8">
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-3">
                    Inclus :
                  </h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-pink-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                {plan.stripeEnabled ? (
                  <StripeCheckout
                    plan={plan.planId as 'premium' | 'conseil'}
                    isAnnual={isAnnual}
                    className={`w-full bg-gradient-to-r ${plan.color} text-white font-semibold hover:opacity-90 transition-opacity h-12`}
                  >
                    {plan.cta}
                  </StripeCheckout>
                ) : (
                  <Link 
                    href={plan.href || '/questionnaire'}
                    className={`block w-full bg-gradient-to-r ${plan.color} text-white text-center py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity`}
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16 bg-white/50 dark:bg-gray-800/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Tout ce que vous devez savoir sur nos plans
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto grid gap-6">
          {faq.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                {item.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {item.answer}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-6 md:p-12 text-white"
        >
          <Zap className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-2xl md:text-4xl font-bold mb-6">
            Prêt à Trouver Votre Compatibilité ?
          </h2>
          <p className="text-lg md:text-xl mb-8 opacity-90">
            Commencez gratuitement dès aujourd'hui, pas de carte bancaire requise
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/questionnaire"
              className="bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors shadow-lg"
            >
              Commencer Gratuitement
            </Link>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-pink-600 transition-colors"
            >
              Nous Contacter
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
