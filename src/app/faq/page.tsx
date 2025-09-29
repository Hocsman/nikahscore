'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'
import { useState } from 'react'

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<number[]>([])

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const faqData = [
    {
      category: "Général",
      questions: [
        {
          question: "Qu'est-ce que NikahScore ?",
          answer: "NikahScore est une plateforme en ligne qui évalue la compatibilité matrimoniale selon les valeurs islamiques. Notre questionnaire approfondi de 100 questions analyse 6 dimensions clés de la personnalité pour vous donner un score de compatibilité détaillé."
        },
        {
          question: "Est-ce que le service est gratuit ?",
          answer: "NikahScore propose un modèle freemium pour rester accessible à tous. Le test de base avec résultats est entièrement gratuit. Pour ceux qui souhaitent aller plus loin, nous proposons des fonctionnalités premium comme l'analyse détaillée, la comparaison de profils, et l'accompagnement personnalisé."
        },
        {
          question: "Quelles sont les fonctionnalités premium ?",
          answer: "Les fonctionnalités premium incluent : analyse approfondie avec recommandations personnalisées, comparaison détaillée entre deux profils, historique des tests, export PDF professionnel, consultation avec un conseiller matrimonial musulman qualifié, et accès prioritaire aux nouvelles fonctionnalités."
        },
        {
          question: "Combien coûtent les fonctionnalités premium ?",
          answer: "Nos forfaits premium démarrent à 9,99€/mois ou 79€/an. Nous proposons également des forfaits familiaux et des réductions pour les étudiants. L'objectif est de garder nos services accessibles tout en permettant le développement continu de la plateforme."
        },
        {
          question: "Combien de temps faut-il pour compléter le test ?",
          answer: "Le questionnaire de 100 questions prend généralement entre 15 et 25 minutes à compléter. Nous recommandons de prendre votre temps pour répondre honnêtement à chaque question afin d'obtenir une évaluation précise de votre personnalité."
        },
        {
          question: "Dans quelles langues est disponible NikahScore ?",
          answer: "Actuellement, NikahScore est disponible en français. Nous travaillons sur des versions en arabe et en anglais qui seront bientôt disponibles."
        }
      ]
    },
    {
      category: "Confidentialité & Sécurité",
      questions: [
        {
          question: "Mes données sont-elles sécurisées ?",
          answer: "Absolument. Nous prenons la confidentialité très au sérieux. Vos réponses sont chiffrées et ne sont pas stockées de manière permanente sur nos serveurs. Seuls les résultats finaux peuvent être sauvegardés si vous le souhaitez."
        },
        {
          question: "Puis-je supprimer mes données ?",
          answer: "Oui, vous pouvez demander la suppression de toutes vos données à tout moment en nous contactant. Nous respectons pleinement votre droit à l'oubli numérique."
        },
        {
          question: "Partagez-vous mes informations avec des tiers ?",
          answer: "Non, jamais. Nous ne vendons, ne louons, ni ne partageons vos informations personnelles avec des tiers. Votre confidentialité est notre priorité absolue."
        }
      ]
    },
    {
      category: "Le Questionnaire",
      questions: [
        {
          question: "Quels domaines sont évalués dans le test ?",
          answer: "Nous évaluons 6 dimensions clés de la personnalité : spiritualité et pratique religieuse, traits de personnalité et tempérament, communication et relations, famille et projets de vie, style de vie et valeurs, ainsi que vos ambitions et projets futurs. Chaque dimension explore des aspects spécifiques qui influencent la compatibilité matrimoniale."
        },
        {
          question: "Comment le score de compatibilité est-il calculé ?",
          answer: "Notre algorithme analyse vos 100 réponses selon des critères pondérés basés sur l'importance de chaque trait de personnalité dans une relation matrimoniale islamique. L'analyse prend en compte les valeurs spirituelles, la compatibilité caractérielle, les projets de vie communs et les deal-breakers potentiels."
        },
        {
          question: "Que sont les 'deal-breakers' ?",
          answer: "Les deal-breakers sont des éléments considérés comme incompatibles dans une relation matrimoniale islamique, comme des différences majeures dans la pratique religieuse ou des visions opposées sur des sujets fondamentaux."
        },
        {
          question: "Puis-je refaire le test ?",
          answer: "Oui, vous pouvez refaire le test autant de fois que vous le souhaitez. Cependant, nous recommandons d'être honnête dès la première fois pour obtenir des résultats précis."
        }
      ]
    },
    {
      category: "Résultats & Utilisation",
      questions: [
        {
          question: "Comment interpréter mon score ?",
          answer: "Un score de 80%+ indique une excellente compatibilité, 65-79% une bonne compatibilité, 50-64% une compatibilité modérée, et moins de 50% suggère des différences importantes à discuter."
        },
        {
          question: "Puis-je partager mes résultats ?",
          answer: "Oui, vous pouvez partager vos résultats par email avec la personne de votre choix. Nous fournissons également un rapport détaillé que vous pouvez sauvegarder."
        },
        {
          question: "Les résultats sont-ils définitifs ?",
          answer: "Les résultats sont un outil d'aide à la décision, pas une vérité absolue. Ils doivent être complétés par des discussions ouvertes, des rencontres en présence de famille, et l'Istikhara (prière de consultation)."
        },
        {
          question: "Que faire si mon score est faible avec quelqu'un ?",
          answer: "Un score faible n'est pas nécessairement rédhibitoire. Nous recommandons de discuter des points de divergence identifiés et de voir s'ils peuvent être résolus par la communication et des compromis mutuels."
        }
      ]
    },
    {
      category: "Aspect Religieux",
      questions: [
        {
          question: "NikahScore respecte-t-il les principes islamiques ?",
          answer: "Oui, notre plateforme a été développée en consultation avec des érudits islamiques et respecte strictement les principes du mariage en Islam. Nous encourageons toujours la rencontre en présence de mahram et l'Istikhara."
        },
        {
          question: "Remplace-t-il la consultation familiale ?",
          answer: "Absolument pas. NikahScore est un outil complémentaire qui ne remplace jamais la consultation familiale, l'avis des proches, et surtout l'Istikhara. C'est un point de départ pour des discussions plus approfondies."
        },
        {
          question: "Comment intégrer les résultats dans ma démarche matrimoniale ?",
          answer: "Utilisez les résultats comme une base de discussion avec votre famille et votre partenaire potentiel. Explorez les points de compatibilité et de divergence lors de vos rencontres supervisées."
        }
      ]
    },
    {
      category: "Support & Contact",
      questions: [
        {
          question: "Comment puis-je contacter l'équipe NikahScore ?",
          answer: "Vous pouvez nous contacter via notre formulaire de contact ou par email à support@nikahscore.com. Nous répondons généralement sous 24-48 heures."
        },
        {
          question: "Proposez-vous un accompagnement matrimonial ?",
          answer: "Actuellement, nous nous concentrons sur l'outil d'évaluation. Cependant, nous travaillons sur des partenariats avec des conseillers matrimoniaux musulmans qualifiés."
        },
        {
          question: "Comment puis-je signaler un problème technique ?",
          answer: "Pour tout problème technique, merci de nous contacter avec une description détaillée du problème, votre navigateur, et si possible une capture d'écran."
        }
      ]
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
            Questions Fréquentes
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
            Trouvez toutes les réponses à vos questions sur NikahScore et son fonctionnement.
          </p>
        </motion.div>
      </section>

      {/* FAQ Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={categoryIndex}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              viewport={{ once: true }}
              className="mb-12"
            >
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 border-b-2 border-pink-200 dark:border-pink-800 pb-2">
                {category.category}
              </h2>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const globalIndex = categoryIndex * 100 + questionIndex
                  const isOpen = openItems.includes(globalIndex)
                  
                  return (
                    <motion.div
                      key={questionIndex}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleItem(globalIndex)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                      >
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white pr-4">
                          {faq.question}
                        </h3>
                        <motion.div
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {isOpen ? (
                            <Minus className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                          ) : (
                            <Plus className="w-5 h-5 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                          )}
                        </motion.div>
                      </button>
                      
                      <motion.div
                        initial={false}
                        animate={{
                          height: isOpen ? "auto" : 0,
                          opacity: isOpen ? 1 : 0
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-r from-pink-500 to-purple-600 rounded-3xl p-12 text-white"
        >
          <h2 className="text-4xl font-bold mb-6">
            Vous ne trouvez pas votre réponse ?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            N'hésitez pas à nous contacter, nous serons ravis de vous aider
          </p>
          <Link 
            href="/contact"
            className="inline-flex items-center bg-white text-pink-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 mr-4"
          >
            Nous Contacter
          </Link>
          <Link 
            href="/questionnaire"
            className="inline-flex items-center border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-pink-600 transition-colors duration-300"
          >
            Commencer le Test
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
