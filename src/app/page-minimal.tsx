export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🌟 NikahScore
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Plateforme de compatibilité matrimoniale islamique
        </p>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🚀</span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Site déployé avec succès !
          </h2>
          <p className="text-gray-600 text-sm">
            La plateforme est maintenant en ligne. 
            Fonctionnalités complètes à venir bientôt.
          </p>
        </div>
      </div>
    </div>
  )
}
