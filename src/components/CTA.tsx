'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Shield, Users } from 'lucide-react'

export default function CTA() {
  const handleGetStarted = () => {
    window.location.href = '/login'
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-brand-600 to-brand-700 text-white">
      <div className="container mx-auto text-center">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA */}
          <div className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Commencez votre évaluation matrimoniale
            </h2>
            <p className="text-xl text-brand-100 mb-8 leading-relaxed">
              Rejoignez les musulmans qui font le choix de la compatibilité 
              évaluée avant l'engagement. Un pas vers un mariage épanoui.
            </p>
            
            <Button 
              size="lg"
              onClick={handleGetStarted}
              className="bg-white text-brand-600 hover:bg-gray-100 text-xl px-12 py-6 h-auto font-semibold"
            >
              Créer ma session gratuite
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Shield className="h-8 w-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">100% Confidentiel</h3>
              <p className="text-brand-100 text-sm">
                Vos données sont chiffrées et protégées selon les standards les plus élevés
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Heart className="h-8 w-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">Approche Islamique</h3>
              <p className="text-brand-100 text-sm">
                Basé sur les valeurs et enseignements islamiques concernant le mariage
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-full p-4 mb-4">
                <Users className="h-8 w-8 text-yellow-300" />
              </div>
              <h3 className="font-semibold mb-2">Support Continu</h3>
              <p className="text-brand-100 text-sm">
                Notre équipe vous accompagne dans votre démarche matrimoniale
              </p>
            </div>
          </div>

          {/* Social proof */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div 
                    key={i}
                    className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-2 border-white flex items-center justify-center text-white font-bold text-sm"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="font-semibold">500+ couples</div>
                <div className="text-brand-200 text-sm">ont déjà fait le test</div>
              </div>
            </div>
            
            <blockquote className="text-lg italic mb-4">
              "NikahScore nous a aidés à identifier nos forces et nos points d'amélioration 
              avant notre mariage. Une approche mature et respectueuse."
            </blockquote>
            <cite className="text-brand-200 text-sm">
              — Amina & Omar, mariés en 2025
            </cite>
          </div>

          {/* Final message */}
          <div className="mt-12 text-center">
            <p className="text-brand-100 mb-4">
              "Et parmi Ses signes Il a créé de vous, pour vous, des épouses pour que vous viviez en tranquillité avec elles"
            </p>
            <p className="text-brand-200 text-sm">
              Coran, Sourate Ar-Rum (30:21)
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
