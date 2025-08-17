'use client'

export default function ResultsPage({ params }: { params: { pairId: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Rapport de Compatibilité
        </h1>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="text-6xl font-bold text-green-600 mb-4">78%</div>
            <p className="text-xl text-gray-600 mb-6">Bonne compatibilité</p>
            <p className="text-gray-600">
              Analyse basée sur vos réponses communes pour le couple: <strong>{params.pairId}</strong>
            </p>
          </div>
          
          <div className="mt-8 space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Points forts</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Valeurs spirituelles alignées</li>
                <li>• Objectifs familiaux compatibles</li>
                <li>• Communication respectueuse</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Points d'attention</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Différences sur l'éducation des enfants</li>
                <li>• Visions divergentes sur le mode de vie</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
