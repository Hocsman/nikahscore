'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Heart, Users, Shield, Lightbulb, Award, Target, Calendar, ArrowRight } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Respect",
      description: "Respect des valeurs islamiques et de la dignité de chaque personne"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Confidentialité",
      description: "Protection absolue de vos données personnelles et de votre vie privée"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Authenticité",
      description: "Des résultats honnêtes basés sur une méthodologie scientifique rigoureuse"
    },
    {
      icon: <Lightbulb className="w-6 h-6" />,
      title: "Excellence",
      description: "Un service de qualité supérieur pour accompagner votre projet matrimonial"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Innovation Halal",
      description: "Une approche moderne qui allie technologie et principes islamiques"
    }
  ]

  const timeline = [
    {
      year: "Inspiration",
      title: "Prise de Conscience",
      description: "Face au nombre alarmant de divorces dans notre communauté, une question émerge : comment mieux préparer les unions matrimoniales ?"
    },
    {
      year: "2025",
      title: "Lancement du Projet",
      description: "Après mûre réflexion et études approfondies, NikahScore voit le jour pour offrir un outil d'aide à la décision matrimoniale"
    },
    {
      year: "Aujourd'hui",
      title: "Phase de Test",
      description: "La plateforme est partagée avec des proches pour affiner l'algorithme et l'expérience utilisateur"
    },
    {
      year: "Vision 2026-2028",
      title: "Expansion & Impact",
      description: "Aider des milliers de couples musulmans à construire des mariages solides et harmonieux insha'Allah"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <ThemeToggle />

      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="inline-flex items-center text-pink-600 dark:text-pink-400 hover:text-pink-700 dark:hover:text-pink-300 mb-8 transition-colors"
          aria-label="Retour à la page d'accueil"
        >
          <ArrowLeft className="w-5 h-5 mr-2" aria-hidden="true" />
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
            À Propos de NikahScore
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Une mission née d'une conviction : prévenir plutôt que guérir
          </p>
        </motion.div>
      </section>

      {/* Histoire Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-8 text-center">
            L'Histoire de NikahScore
          </h2>

          <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            <p>
              <strong className="text-pink-600 dark:text-pink-400">Notre histoire commence par une observation douloureuse :</strong> le nombre croissant de divorces dans notre communauté musulmane. Chaque séparation représente non seulement deux cœurs brisés, mais aussi des familles déchirées et des enfants marqués.
            </p>

            <p>
              En observant mon entourage, en écoutant les témoignages sur les réseaux sociaux, et en vivant mes propres expériences, j'ai réalisé qu'un problème récurrent émergeait : <strong className="text-purple-600 dark:text-purple-400">la compatibilité n'était pas suffisamment explorée avant le mariage</strong>.
            </p>

            <p>
              Trop de couples se découvrent après le nikah, réalisant alors des différences fondamentales sur des sujets cruciaux : la pratique religieuse, la vision de la vie de famille, la communication, les projets futurs... Des éléments qui auraient pu être discutés, anticipés, et mieux compris avant l'engagement.
            </p>

            <p className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-xl border-l-4 border-pink-500">
              <strong className="text-gray-800 dark:text-white">C'est de cette prise de conscience qu'est né NikahScore en 2025.</strong> Non pas pour remplacer les méthodes traditionnelles de recherche matrimoniale, mais pour les compléter avec un outil moderne, scientifique et respectueux de nos valeurs islamiques.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Notre Mission
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Fournir à la communauté musulmane des éléments supplémentaires pour prendre des décisions matrimoniales éclairées. Nous voulons être un outil d'aide, un guide qui révèle les compatibilités et les points de vigilance, pour construire des unions plus solides insha'Allah.
              </p>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-white" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Notre Vision
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Dans 3 à 5 ans, nous espérons avoir contribué à des centaines, voire des milliers de mariages harmonieux. Notre rêve est simple mais puissant : <strong className="text-purple-600 dark:text-purple-400">réduire le taux de divorce en aidant les couples à mieux se connaître avant de s'engager</strong>.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Nos Valeurs Fondamentales
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Les principes qui guident chacune de nos décisions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <div className="text-pink-600 dark:text-pink-400">
                  {value.icon}
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {value.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Notre Parcours
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              De l'idée à la réalisation, une aventure au service de la Oummah
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative mb-8 last:mb-0"
              >
                <div className="flex items-center gap-6">
                  {/* Timeline dot */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <Calendar className="w-8 h-8 text-white" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-semibold text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30 px-3 py-1 rounded-full">
                        {item.year}
                      </span>
                      <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Connector line */}
                {index < timeline.length - 1 && (
                  <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-pink-300 to-purple-300 dark:from-pink-700 dark:to-purple-700" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Garantie Islamique */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-8 md:p-12 text-white text-center"
        >
          <Shield className="w-16 h-16 mx-auto mb-6" aria-hidden="true" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Notre Engagement Islamique
          </h2>
          <p className="text-lg md:text-xl mb-6 opacity-90 leading-relaxed">
            NikahScore est développé avec le soutien de sources de grands savants de l'Islam. Nous nous engageons à contacter et consulter des imams et érudits pour garantir que notre méthodologie reste conforme aux enseignements islamiques.
          </p>
          <p className="text-lg opacity-90">
            Notre promesse : <strong>Faire au mieux pour servir la communauté tout en respectant nos valeurs</strong>
          </p>
        </motion.div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-6">
            Rejoignez Notre Mission
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            Ensemble, construisons une communauté de mariages épanouis et durables
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/questionnaire/shared"
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Créer un Questionnaire
              <ArrowRight className="ml-2 w-5 h-5" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="border-2 border-pink-500 text-pink-600 dark:text-pink-400 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-colors duration-300"
            >
              Nous Contacter
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
