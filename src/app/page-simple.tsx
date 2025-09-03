export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">
            🌟 NikahScore
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Plateforme de compatibilité matrimoniale selon les valeurs islamiques
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">🚀 Site en déploiement</h2>
            <p className="text-gray-600 mb-6">
              Notre plateforme est en cours de déploiement. Bientôt disponible avec :
            </p>
            <ul className="text-left space-y-2 text-gray-600">
              <li>✅ 60 questions de compatibilité</li>
              <li>✅ 9 axes d'évaluation</li>
              <li>✅ Algorithme de matching avancé</li>
              <li>✅ Respect des valeurs islamiques</li>
            </ul>
            <div className="mt-8 p-4 bg-green-50 rounded">
              <p className="text-green-700 font-medium">
                🎉 Déployement en cours... Revenez bientôt !
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
