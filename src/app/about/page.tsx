'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Shield, Users, Target, ArrowLeft, Star } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Valeurs Islamiques",
      description: "Respecter les principes du mariage selon l'Islam et favoriser les unions basées sur la piété et la compatibilité spirituelle."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Confidentialité",
      description: "Protéger la vie privée de nos utilisateurs avec des données chiffrées et aucun stockage permanent des réponses personnelles."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Communauté",
      description: "Servir la Oummah en facilitant les rencontres respectueuses et les mariages durables au sein de la communauté musulmane."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Précision",
      description: "Fournir des analyses fiables basées sur des critères pertinents pour évaluer la compatibilité matrimoniale."
    }
  ]

  const team = [
    {
      name: "Équipe de Développement",
      role: "Développeurs & Designers",
      description: "Une équipe passionnée de musulmans engagés dans l'amélioration des outils matrimoniaux halal."
    },
    {
      name: "Conseillers Religieux",
      role: "Guidance Islamique",
      description: "Des érudits et conseillers qui veillent au respect des principes islamiques dans notre approche."
    },
    {
      name: "Psychologues",
      role: "Expertise Comportementale",
      description: "Des spécialistes en relations humaines qui contribuent à l'élaboration de nos algorithmes de compatibilité."
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
            À Propos de NikahScore
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Notre mission est de faciliter les rencontres matrimoniales halal en offrant un outil moderne et respectueux des valeurs islamiques.
          </p>
        </motion.div>
      </section>

      {/* Histoire Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">
                Notre Histoire
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-300">
                <p>
                  NikahScore est né de la volonté de créer un outil moderne qui respecte les traditions islamiques du mariage. Face aux défis des rencontres matrimoniales dans notre époque, nous avons développé une solution qui allie technologie et spiritualité.
                </p>
                <p>
                  Notre plateforme évalue la compatibilité sur 6 dimensions clés de la personnalité : spiritualité et pratique religieuse, traits de personnalité et tempérament, communication et relations, famille et projets de vie, style de vie et valeurs, ainsi que vos ambitions et projets futurs.
                </p>
                <p>
                  Chaque question a été soigneusement élaborée en collaboration avec des conseillers religieux et des experts en relations humaines pour garantir une évaluation juste et pertinente.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">2025</div>
                  <div className="text-gray-600 dark:text-gray-400">Lancement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">100</div>
                  <div className="text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">6</div>
                  <div className="text-gray-600 dark:text-gray-400">Dimensions</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">100%</div>
                  <div className="text-gray-600 dark:text-gray-400">Halal</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Valeurs Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Les principes qui guident notre travail quotidien
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
              >
                <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/30 dark:to-purple-900/30 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-pink-600 dark:text-pink-400">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Équipe Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Notre Équipe
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Des professionnels engagés au service de la communauté
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 text-center"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{member.name}</h3>
              <p className="text-pink-600 dark:text-pink-400 font-medium mb-3">{member.role}</p>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{member.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Rejoignez-nous dans cette Mission
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Découvrez votre compatibilité et trouvez votre moitié selon les valeurs islamiques
          </p>
          <Link 
            href="/questionnaire"
            className="inline-flex items-center bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Commencer le Test
            <Heart className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
