import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-4xl mx-auto">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          🌟 NikahScore
        </h1>
        <p className="text-2xl text-gray-600 mb-8">
          Plateforme de compatibilité matrimoniale selon les valeurs islamiques
        </p>
        
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">�</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Test de compatibilité
            </h2>
            <p className="text-gray-600 text-sm mb-6">
              15 questions essentielles basées sur les valeurs islamiques 
              pour évaluer votre compatibilité matrimoniale.
            </p>
            <Link href="/questionnaire">
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors w-full">
                Commencer le test →
              </button>
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💕</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
              Comment ça marche ?
            </h2>
            <div className="text-left space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">1</span>
                <p>Vous répondez au questionnaire</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">2</span>
                <p>Invitez votre partenaire potentiel</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">3</span>
                <p>Découvrez votre score de compatibilité</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <p className="text-green-700 font-medium mb-2">🚀 Nouveau : Questionnaire disponible !</p>
          <p className="text-green-600 text-sm">
            Testez dès maintenant notre questionnaire de compatibilité avec 15 questions essentielles.
          </p>
        </div>
      </div>
    </div>
  )
}
