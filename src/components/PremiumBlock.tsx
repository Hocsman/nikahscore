'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAnalytics } from '@/lib/analytics'
import Link from 'next/link'
import { 
  Crown, 
  Lock, 
  Zap, 
  Star, 
  ArrowRight, 
  CheckCircle, 
  X 
} from 'lucide-react'
import { PlanType } from '@/lib/subscription'

interface PremiumBlockProps {
  feature: string
  title: string
  description: string
  requiredPlan: PlanType
  currentPlan?: PlanType
  onUpgrade?: () => void
}

const PLAN_INFO = {
  premium: {
    name: 'Premium',
    price: '9,99€',
    color: 'from-blue-500 to-indigo-600',
    icon: '⚡',
    features: ['Analyse détaillée', 'Rapport PDF', 'Graphiques avancés']
  },
  family: {
    name: 'Famille',
    price: '17,99€',
    color: 'from-purple-500 to-pink-600',
    icon: '👨‍👩‍👧‍👦',
    features: ['Jusqu\'à 5 profils', 'Comparaison familiale', 'Support prioritaire']
  },
  conseil: {
    name: 'Conseil',
    price: '49,99€',
    color: 'from-yellow-500 to-orange-600',
    icon: '🏆',
    features: ['Consultation expert', 'Support personnalisé', 'Questions sur mesure']
  },
  free: {
    name: 'Gratuit',
    price: '0€',
    color: 'from-gray-400 to-gray-500',
    icon: '🆓',
    features: ['Test basique', 'Score simple']
  }
}

export default function PremiumBlock({ 
  feature, 
  title, 
  description, 
  requiredPlan, 
  currentPlan = 'free',
  onUpgrade 
}: PremiumBlockProps) {
  const planInfo = PLAN_INFO[requiredPlan]
  const { trackEvent, trackPremiumClick } = useAnalytics()

  const handleUpgradeClick = () => {
    // Track analytics
    trackPremiumClick(feature, currentPlan, requiredPlan)
    trackEvent('upgrade_button_clicked', {
      feature,
      currentPlan,
      requiredPlan,
      source: 'premium_block'
    })
    
    if (onUpgrade) onUpgrade()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="max-w-lg w-full"
      >
        <Card className="bg-white shadow-2xl border-0 overflow-hidden">
          <CardHeader className={`bg-gradient-to-r ${planInfo.color} text-white p-6`}>
            <div className="text-center">
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Lock className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold text-white">
                Fonctionnalité Premium
              </CardTitle>
              <p className="text-white/90 mt-2">
                Déverrouillez tout le potentiel de NikahScore
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-6">
            {/* Fonctionnalité demandée */}
            <div className="mb-6">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              </div>
            </div>

            {/* Plan requis */}
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-3">
                Plan requis : {planInfo.name}
              </h4>
              
              <div className={`p-4 rounded-xl bg-gradient-to-r ${planInfo.color} text-white`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{planInfo.icon}</span>
                    <span className="font-bold text-xl">{planInfo.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{planInfo.price}</div>
                    <div className="text-sm opacity-90">/mois</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {planInfo.features.map((planFeature, index) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>{planFeature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Comparaison plans */}
            <div className="mb-6 p-4 bg-gray-50 rounded-xl">
              <h5 className="font-medium text-gray-900 mb-3">Votre plan actuel :</h5>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-gray-100">
                    {PLAN_INFO[currentPlan].icon} {PLAN_INFO[currentPlan].name}
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {PLAN_INFO[currentPlan].price}/mois
                  </span>
                </div>
                <div className="text-sm text-red-600">
                  Fonctionnalité non incluse
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <Link href="/pricing">
                <Button 
                  className={`w-full h-12 text-white font-semibold bg-gradient-to-r ${planInfo.color} hover:opacity-90 transition-opacity`}
                  onClick={handleUpgradeClick}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Passer au plan {planInfo.name}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.history.back()}
              >
                Retour
              </Button>
            </div>

            {/* Note de sécurité */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <strong>Garantie satisfait ou remboursé</strong> - 
                  Annulez à tout moment dans les 30 premiers jours.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
