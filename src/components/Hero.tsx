'use client'

import { Button } from '@/components/ui/button'
import { ArrowRight, Heart, Users, BarChart3 } from 'lucide-react'

export default function Hero() {
  const handleGetStarted = () => {
    // Ici on redirigera vers la création d'une nouvelle session
    window.location.href = '/login'
  }

  return (
    <section className="hero-gradient text-white py-20 px-4">
      <div className="container mx-auto text-center">
        {/* Hero principal */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Découvrez votre{' '}
            <span className="bg-gradient-to-r from-yellow-300 to-yellow-100 bg-clip-text text-transparent">
              compatibilité matrimoniale
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
            Une approche moderne et respectueuse des valeurs islamiques 
            pour évaluer votre harmonie de couple avant le mariage.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-white text-brand-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto"
            >
              Commencer le test
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-brand-600 text-lg px-8 py-4 h-auto"
            >
              Voir un exemple
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Heart className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <div className="text-3xl font-bold mb-2">40+</div>
              <div className="text-blue-100">Questions ciblées</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="text-blue-100">Axes d'analyse</div>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
              <Users className="h-12 w-12 mx-auto mb-4 text-yellow-300" />
              <div className="text-3xl font-bold mb-2">2</div>
              <div className="text-blue-100">Personnes par test</div>
            </div>
          </div>
        </div>

        {/* Message de confiance */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <p className="text-lg text-blue-100">
              "Le mariage est la moitié de la religion" - Hadith
            </p>
            <p className="text-sm text-blue-200 mt-2">
              Prenez une décision éclairée pour votre avenir matrimonial
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
