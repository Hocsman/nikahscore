'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, Users, BarChart3, FileText, Mail, Download } from 'lucide-react'

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: <Users className="h-8 w-8" />,
      title: "Créez votre session",
      description: "Commencez seul ou invitez directement votre partenaire par email",
      details: ["Inscription rapide avec email", "Profil de base (âge, ville, pratique)", "Génération d'un lien sécurisé"],
      color: "bg-blue-500"
    },
    {
      number: 2,
      icon: <FileText className="h-8 w-8" />,
      title: "Répondez au questionnaire",
      description: "40 questions sur 6 dimensions clés du mariage islamique",
      details: ["Questions sur les valeurs religieuses", "Mode de vie et traditions", "Projets d'avenir et famille"],
      color: "bg-green-500"
    },
    {
      number: 3,
      icon: <Mail className="h-8 w-8" />,
      title: "Invitez votre partenaire",
      description: "Partagez le lien sécurisé pour que votre partenaire réponde aussi",
      details: ["Invitation par email automatique", "Lien valable 30 jours", "Suivi en temps réel"],
      color: "bg-purple-500"
    },
    {
      number: 4,
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Découvrez vos résultats",
      description: "Analyse détaillée de votre compatibilité avec recommandations",
      details: ["Score global de compatibilité", "Graphique radar par dimension", "Points forts et frictions"],
      color: "bg-orange-500"
    },
    {
      number: 5,
      icon: <Download className="h-8 w-8" />,
      title: "Exportez votre rapport",
      description: "Téléchargez un PDF complet pour vos discussions",
      details: ["Rapport PDF professionnel", "Conseils personnalisés", "Resources pour approfondir"],
      color: "bg-red-500"
    }
  ]

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 text-brand-600 border-brand-600">
            Comment ça marche
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Un processus simple et respectueux
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre approche en 5 étapes vous guide vers une meilleure compréhension 
            de votre compatibilité matrimoniale selon les valeurs islamiques.
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-20 w-0.5 h-24 bg-gray-200 z-0"></div>
              )}
              
              <Card className={`mb-8 card-hover ${index % 2 === 1 ? 'md:ml-auto md:mr-0' : ''} md:max-w-2xl`}>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    {/* Icône numérotée */}
                    <div className={`${step.color} text-white rounded-full p-4 flex-shrink-0 relative z-10`}>
                      {step.icon}
                      <div className="absolute -top-2 -right-2 bg-white text-gray-900 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-2 border-gray-200">
                        {step.number}
                      </div>
                    </div>
                    
                    {/* Contenu */}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-600 mb-4 text-lg">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-center gap-2 text-gray-600">
                            <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Call to action section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-brand-50 to-brand-100 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à découvrir votre compatibilité ?
            </h3>
            <p className="text-gray-600 mb-6 text-lg">
              Rejoignez les couples qui ont fait le choix de l'évaluation avant l'engagement.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-brand-600">15 min</div>
                <div className="text-sm text-gray-600">Durée moyenne</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-brand-600">100%</div>
                <div className="text-sm text-gray-600">Confidentiel</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-2xl font-bold text-brand-600">Gratuit</div>
                <div className="text-sm text-gray-600">Première évaluation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
