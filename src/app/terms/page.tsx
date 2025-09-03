'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, FileText, AlertTriangle, CheckCircle, XCircle, Scale, Heart } from 'lucide-react'

export default function TermsPage() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Conditions d'utilisation
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
            Les présentes conditions régissent votre utilisation de NikahScore et définissent nos droits et responsabilités mutuels.
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
              <CheckCircle className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                1. Acceptation des conditions
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                En créant un compte ou en utilisant NikahScore, vous acceptez ces conditions d'utilisation dans leur intégralité.
              </p>
              <p>
                Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre service.
              </p>
              <p>
                Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications prendront effet dès leur publication sur cette page.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Heart className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                2. Description du service
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>NikahScore</strong> est une plateforme d'évaluation de compatibilité destinée aux musulmans cherchant à évaluer leur compatibilité avec un partenaire potentiel.
              </p>
              <p>
                <strong>Fonctionnalités principales :</strong>
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Questionnaires de compatibilité basés sur les valeurs islamiques</li>
                <li>Calcul de scores de compatibilité</li>
                <li>Rapports détaillés et conseils</li>
                <li>Partage sécurisé des résultats entre partenaires</li>
              </ul>
              <p className="font-semibold text-purple-600">
                ⚠️ Notre service est un outil d'aide à la décision et ne remplace pas le conseil religieux ou matrimonial professionnel.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <AlertTriangle className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                3. Utilisation acceptable
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p><strong>Vous vous engagez à :</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Fournir des informations exactes et honnêtes</li>
                <li>Maintenir la confidentialité de vos identifiants</li>
                <li>Respecter les droits des autres utilisateurs</li>
                <li>Utiliser le service uniquement dans le cadre du mariage halal</li>
                <li>Respecter les principes islamiques dans vos interactions</li>
              </ul>
              
              <p><strong>Il est strictement interdit de :</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Utiliser le service à des fins illégales ou non-islamiques</li>
                <li>Harceler, menacer ou intimider d'autres utilisateurs</li>
                <li>Partager ou revendre l'accès à votre compte</li>
                <li>Tenter de contourner les mesures de sécurité</li>
                <li>Utiliser des robots ou scripts automatisés</li>
              </ul>
            </div>
          </div>

          {/* Section 4 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <Scale className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                4. Propriété intellectuelle
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Contenu de NikahScore :</strong> Tous les questionnaires, algorithmes, rapports, designs et textes sont la propriété exclusive de NikahScore.
              </p>
              <p>
                <strong>Vos données :</strong> Vous conservez la propriété de vos réponses et données personnelles. Vous nous accordez une licence d'utilisation nécessaire au fonctionnement du service.
              </p>
              <p>
                <strong>Restrictions :</strong> Vous ne pouvez pas copier, reproduire, distribuer ou créer des œuvres dérivées de notre contenu sans autorisation écrite.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <XCircle className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                5. Limitation de responsabilité
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Avertissement important :</strong> NikahScore fournit des outils d'évaluation de compatibilité à titre informatif uniquement.
              </p>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
                  ⚠️ Nous ne garantissons pas :
                </p>
                <ul className="list-disc list-inside space-y-1 text-yellow-700 dark:text-yellow-300">
                  <li>La compatibilité réelle des partenaires</li>
                  <li>Le succès d'un mariage basé sur nos scores</li>
                  <li>L'exactitude absolue des algorithmes</li>
                  <li>La disponibilité continue du service</li>
                </ul>
              </div>

              <p>
                <strong>Consultation recommandée :</strong> Nous recommandons fortement de consulter des conseillers matrimoniaux musulmans qualifiés et des savants religieux avant toute décision importante.
              </p>
              
              <p>
                <strong>Limitation :</strong> Notre responsabilité est limitée au montant payé pour le service au cours des 12 derniers mois.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                6. Abonnements et paiements
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Tarification :</strong> Les prix sont clairement affichés sur notre site et peuvent être modifiés avec un préavis de 30 jours.
              </p>
              <p>
                <strong>Renouvellement :</strong> Les abonnements se renouvellent automatiquement sauf annulation avant la date de renouvellement.
              </p>
              <p>
                <strong>Remboursement :</strong> Conformément à notre politique de remboursement, vous pouvez demander un remboursement dans les 14 jours suivant l'achat initial.
              </p>
              <p>
                <strong>Annulation :</strong> Vous pouvez annuler votre abonnement à tout moment depuis votre compte.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div className="border-l-4 border-pink-500 pl-6">
            <div className="flex items-center mb-3">
              <Scale className="w-5 h-5 text-pink-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                7. Suspension et résiliation
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <strong>Par vous :</strong> Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre compte.
              </p>
              <p>
                <strong>Par nous :</strong> Nous nous réservons le droit de suspendre ou supprimer votre compte en cas de :
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Violation de ces conditions d'utilisation</li>
                <li>Activité suspecte ou frauduleuse</li>
                <li>Non-paiement des frais d'abonnement</li>
                <li>Utilisation contraire aux valeurs islamiques</li>
              </ul>
              <p>
                <strong>Effet :</strong> En cas de résiliation, votre accès au service sera immédiatement supprimé et vos données pourront être supprimées selon notre politique de confidentialité.
              </p>
            </div>
          </div>

          {/* Section 8 */}
          <div className="border-l-4 border-purple-500 pl-6">
            <div className="flex items-center mb-3">
              <FileText className="w-5 h-5 text-purple-600 mr-3" />
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
                8. Droit applicable et juridiction
              </h2>
            </div>
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                Ces conditions sont régies par le droit français et les principes de la Charia islamique quand ils ne sont pas en conflit.
              </p>
              <p>
                Tout litige sera soumis à la juridiction des tribunaux français compétents.
              </p>
              <p>
                En cas de conflit entre différentes versions linguistiques, la version française fait foi.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20 rounded-xl p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              Questions sur ces conditions ?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Notre équipe est disponible pour clarifier toute question concernant ces conditions d'utilisation.
            </p>
            <Link 
              href="/contact" 
              className="inline-flex items-center bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <FileText className="w-4 h-4 mr-2" />
              Nous contacter
            </Link>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
