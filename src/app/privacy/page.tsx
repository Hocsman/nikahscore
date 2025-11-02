'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Shield, Eye, Database, Mail, Lock, Users } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Link 
            href="/auth" 
            className="inline-flex items-center text-pink-600 hover:text-pink-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à l'authentification
          </Link>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Politique de confidentialité
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Chez NikahScore, nous respectons votre vie privée et nous nous engageons à protéger vos données personnelles.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Dernière mise à jour : 3 septembre 2025
          </p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 space-y-8"
        >
          
          {/* Section 1 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <Eye className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                1. Informations que nous collectons
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Informations d'inscription :</strong> Nous collectons votre nom, adresse e-mail et mot de passe lorsque vous créez un compte.
              </p>
              <p>
                <strong>Réponses au questionnaire :</strong> Vos réponses aux questions de compatibilité sont stockées de manière sécurisée pour calculer les scores et générer les rapports.
              </p>
              <p>
                <strong>Données d'utilisation :</strong> Nous collectons des informations sur votre utilisation de la plateforme (pages visitées, temps passé, fonctionnalités utilisées) à des fins d'amélioration.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Database className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                2. Comment nous utilisons vos informations
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Fourniture du service :</strong> Calculer les scores de compatibilité, générer des rapports personnalisés et faciliter le partage avec votre partenaire.
              </p>
              <p>
                <strong>Communication :</strong> Vous envoyer des e-mails de bienvenue, des notifications importantes et des mises à jour du service.
              </p>
              <p>
                <strong>Amélioration du service :</strong> Analyser les données d'utilisation pour améliorer nos algorithmes et l'expérience utilisateur.
              </p>
              <p>
                <strong>Sécurité :</strong> Détecter et prévenir les activités frauduleuses ou malveillantes.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <Users className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                3. Partage de vos informations
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Avec votre partenaire :</strong> Lorsque vous partagez un questionnaire, seuls les scores de compatibilité et les analyses sont partagés, jamais vos réponses individuelles détaillées.
              </p>
              <p>
                <strong>Fournisseurs de services :</strong> Nous travaillons avec des partenaires de confiance (hébergement, e-mail, paiement) qui respectent des standards de sécurité élevés.
              </p>
              <p>
                <strong>Obligations légales :</strong> Nous pouvons divulguer des informations si requis par la loi ou pour protéger nos droits.
              </p>
              <p className="font-semibold text-pink-600">
                ✋ Nous ne vendons jamais vos données personnelles à des tiers.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Lock className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                4. Sécurité de vos données
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Chiffrement :</strong> Toutes les données sont chiffrées en transit (HTTPS) et au repos dans nos bases de données.
              </p>
              <p>
                <strong>Accès limité :</strong> Seuls les employés autorisés ont accès aux données, dans le cadre strict de leurs fonctions.
              </p>
              <p>
                <strong>Surveillance :</strong> Nos systèmes sont surveillés 24h/24 pour détecter toute activité suspecte.
              </p>
              <p>
                <strong>Mots de passe :</strong> Vos mots de passe sont hachés avec des algorithmes sécurisés (bcrypt).
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <Mail className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                5. Vos droits
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Accès :</strong> Vous pouvez demander une copie de toutes les données que nous détenons sur vous.
              </p>
              <p>
                <strong>Rectification :</strong> Vous pouvez corriger ou mettre à jour vos informations personnelles.
              </p>
              <p>
                <strong>Suppression :</strong> Vous pouvez demander la suppression de votre compte et de toutes vos données.
              </p>
              <p>
                <strong>Portabilité :</strong> Vous pouvez demander l'exportation de vos données dans un format lisible.
              </p>
              <p>
                <strong>Opposition :</strong> Vous pouvez vous opposer à certains traitements de vos données.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Shield className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                6. Conservation des données
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Nous conservons vos données personnelles aussi longtemps que votre compte est actif ou que cela est nécessaire pour fournir nos services.
              </p>
              <p>
                Après la suppression de votre compte, vos données sont supprimées de manière sécurisée dans un délai de 30 jours, sauf obligation légale de conservation.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Des questions sur cette politique ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Nous sommes là pour vous aider et répondre à toutes vos questions concernant vos données.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Mail className="w-4 h-4 mr-2" />
              Nous contacter
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
