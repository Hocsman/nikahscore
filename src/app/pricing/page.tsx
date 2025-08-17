// Page de tarification et abonnements
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Heart, Users, Zap } from 'lucide-react';

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Découverte',
      price: '0€',
      period: '',
      description: 'Testez gratuitement la compatibilité',
      icon: Heart,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200',
      features: [
        'Un test de compatibilité gratuit',
        'Résultat de base (% de compatibilité)',
        'Aperçu des axes principaux',
        'Valable 30 jours',
      ],
      limitations: [
        'Analyse détaillée limitée',
        'Pas de conseils personnalisés',
        'Pas de suivi dans le temps',
      ],
      cta: 'Commencer gratuitement',
      popular: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '14,99€',
      period: 'par test',
      description: 'Analyse complète et conseils personnalisés',
      icon: Crown,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      features: [
        'Analyse détaillée sur les 9 axes',
        'Conseils personnalisés par axe',
        'Points forts et points d\'attention',
        'Suggestions d\'amélioration',
        'Rapport PDF téléchargeable',
        'Support email prioritaire',
        'Accès aux résultats à vie',
      ],
      limitations: [],
      cta: 'Choisir Premium',
      popular: true,
    },
    {
      id: 'unlimited',
      name: 'Illimité',
      price: '39,99€',
      period: 'par mois',
      description: 'Tests illimités pour les professionnels',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: [
        'Tests de compatibilité illimités',
        'Toutes les fonctionnalités Premium',
        'Suivi évolution dans le temps',
        'Comparaisons multiples',
        'API d\'intégration disponible',
        'Support téléphonique',
        'Formateur/Conseiller matrimonial',
        'Tableau de bord avancé',
      ],
      limitations: [],
      cta: 'Devenir membre',
      popular: false,
    },
  ];

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setIsLoading(true);

    try {
      // TODO: Intégration Stripe
      console.log(`Souscription au plan: ${planId}`);
      
      if (planId === 'free') {
        // Redirection vers questionnaire gratuit
        window.location.href = '/invite?plan=free';
      } else {
        // Intégration Stripe Checkout
        // const response = await fetch('/api/stripe/checkout', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ planId, priceId: getPriceId(planId) })
        // });
        // const { url } = await response.json();
        // window.location.href = url;
        
        // Simulation pour l'instant
        alert(`Redirection vers le paiement Stripe pour le plan ${planId}`);
      }
    } catch (error) {
      console.error('Erreur souscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-100 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-4xl font-bold text-emerald-800 mb-4">
            Choisissez votre formule
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez votre compatibilité matrimoniale avec notre test scientifique basé sur 9 axes fondamentaux
          </p>
        </div>

        {/* Plans de tarification */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card 
              key={plan.id}
              className={`relative ${plan.bgColor} ${plan.borderColor} border-2 transition-all hover:shadow-lg ${plan.popular ? 'ring-2 ring-emerald-500' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-emerald-600 hover:bg-emerald-700">
                  Le plus populaire
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 ${plan.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <plan.icon className={`w-6 h-6 ${plan.color}`} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-800">
                  {plan.name}
                </CardTitle>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {plan.price}
                  {plan.period && <span className="text-lg font-normal text-gray-600"> {plan.period}</span>}
                </div>
                <CardDescription className="text-gray-600">
                  {plan.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Fonctionnalités incluses */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">✨ Inclus :</h4>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Limitations */}
                {plan.limitations.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-600 mb-3">⚠️ Limitations :</h4>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="w-4 h-4 text-gray-400 mt-0.5">•</span>
                          <span className="text-sm text-gray-600">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isLoading && selectedPlan === plan.id}
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300'
                  }`}
                >
                  {isLoading && selectedPlan === plan.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ / Informations supplémentaires */}
        <Card className="bg-white/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-center text-emerald-800">
              💡 Pourquoi choisir NikahScore ?
            </CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">🎯 Approche scientifique</h3>
              <p className="text-gray-600 mb-4">
                Notre algorithme analyse 9 axes fondamentaux de la compatibilité matrimoniale, 
                basés sur des études psychologiques et les valeurs islamiques.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3">🔒 Confidentialité garantie</h3>
              <p className="text-gray-600">
                Vos données sont sécurisées et ne sont jamais partagées. 
                Conformité RGPD complète.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">📈 Résultats actionables</h3>
              <p className="text-gray-600 mb-4">
                Ne vous contentez pas d'un pourcentage ! Recevez des conseils 
                personnalisés pour renforcer votre relation.
              </p>
              
              <h3 className="font-semibold text-gray-800 mb-3">🤝 Support dédié</h3>
              <p className="text-gray-600">
                Notre équipe vous accompagne dans l'interprétation de vos résultats 
                et répond à vos questions.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
