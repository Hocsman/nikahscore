import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import CTA from '@/components/CTA'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Call to Action Section */}
      <CTA />
      
      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="font-bold text-lg mb-4">NikahScore</h3>
              <p className="text-gray-600 mb-4">
                Plateforme de compatibilité matrimoniale respectueuse des valeurs islamiques. 
                Aidons les musulmans à trouver leur partenaire idéal en toute confiance.
              </p>
              <div className="text-sm text-gray-500">
                © 2025 NikahScore. Tous droits réservés.
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/legal/cgu" className="hover:text-brand-600 transition-colors">
                    Conditions d'utilisation
                  </a>
                </li>
                <li>
                  <a href="/legal/privacy" className="hover:text-brand-600 transition-colors">
                    Politique de confidentialité
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>support@nikahscore.com</li>
                <li>Assistance 7j/7</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
