'use client'

import { useState, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Heart, Users, MessageCircle, Zap, Star, ArrowRight, CheckCircle } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false)
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 300], [0, -50])
  const y2 = useTransform(scrollY, [0, 300], [0, -100])

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Compatibilité Spirituelle",
      description: "Évaluez vos valeurs religieuses et votre pratique islamique"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Projet de Vie",
      description: "Alignez vos objectifs familiaux et professionnels"
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: "Communication",
      description: "Mesurez votre compatibilité communicationnelle"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Résultats Instantanés",
      description: "Obtenez votre score détaillé immédiatement"
    }
  ]

  const testimonials = [
    {
      name: "Amina & Youssef",
      score: "92%",
      text: "NikahScore nous a aidés à identifier nos points communs avant notre première rencontre. Un outil précieux !"
    },
    {
      name: "Fatima",
      score: "87%",
      text: "J'ai pu mieux comprendre mes attentes et priorités grâce à ce questionnaire complet."
    },
    {
      name: "Ahmed",
      score: "94%",
      text: "Une approche moderne et respectueuse des valeurs islamiques. Je recommande vivement."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-hidden transition-colors duration-300">
      <ThemeToggle />
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <motion.div 
          className="absolute inset-0 opacity-10"
          style={{ y: y1 }}
        >
          <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-300 rounded-full blur-xl" />
          <div className="absolute top-40 right-32 w-48 h-48 bg-blue-300 rounded-full blur-xl" />
          <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-purple-300 rounded-full blur-xl" />
        </motion.div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent mb-6">
              NikahScore
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Découvrez votre compatibilité matrimoniale selon les valeurs islamiques
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
          >
            <Link 
              href="/questionnaire" 
              className="group bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              Commencer le Test
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="border-2 border-emerald-500 text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-emerald-50 transition-colors duration-300">
              En Savoir Plus
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">60+</div>
              <div className="text-gray-600 dark:text-gray-400">Questions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">9</div>
              <div className="text-gray-600 dark:text-gray-400">Domaines</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-gray-600 dark:text-gray-400">Gratuit</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">2min</div>
              <div className="text-gray-600 dark:text-gray-400">Résultats</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Une Approche Complète
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Notre algorithme évalue 9 domaines essentiels pour une union harmonieuse
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center group"
              >
                <div className="bg-gradient-to-r from-emerald-100 to-blue-100 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-emerald-600">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Témoignages
            </h2>
            <p className="text-xl text-gray-600">
              Découvrez l'expérience de nos utilisateurs
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-semibold text-emerald-600">{testimonial.score}</span>
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.text}"</p>
                <p className="font-semibold text-gray-800">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-emerald-500 to-blue-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à Découvrir Votre Score ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers de musulmans qui ont déjà trouvé leur compatibilité
          </p>
          <Link 
            href="/questionnaire"
            className="inline-flex items-center bg-white text-emerald-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Commencer Maintenant
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
