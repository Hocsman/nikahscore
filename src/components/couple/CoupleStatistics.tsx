'use client'

interface Question {
  id: string
  text: string
  category: string
  type: 'boolean' | 'scale'
}

interface Response {
  questionId: string
  value: boolean | number
}

interface CoupleStatisticsProps {
  questions: Question[]
  creatorResponses: Response[]
  partnerResponses: Response[]
}

export default function CoupleStatistics({
  questions,
  creatorResponses,
  partnerResponses
}: CoupleStatisticsProps) {
  
  // Calculer les statistiques globales
  const calculateStats = () => {
    let perfectAgreements = 0
    let minorDifferences = 0
    let majorDisagreements = 0

    questions.forEach(question => {
      const creatorResp = creatorResponses.find(r => r.questionId === question.id)
      const partnerResp = partnerResponses.find(r => r.questionId === question.id)

      if (!creatorResp || !partnerResp) return

      if (question.type === 'boolean') {
        if (creatorResp.value === partnerResp.value) {
          perfectAgreements++
        } else {
          majorDisagreements++
        }
      } else {
        const diff = Math.abs((creatorResp.value as number) - (partnerResp.value as number))
        if (diff <= 1) perfectAgreements++
        else if (diff <= 3) minorDifferences++
        else majorDisagreements++
      }
    })

    return {
      total: questions.length,
      perfectAgreements,
      minorDifferences,
      majorDisagreements,
      perfectPercent: Math.round((perfectAgreements / questions.length) * 100),
      minorPercent: Math.round((minorDifferences / questions.length) * 100),
      majorPercent: Math.round((majorDisagreements / questions.length) * 100)
    }
  }

  // Calculer les statistiques par catégorie
  const calculateCategoryStats = () => {
    const categories = [...new Set(questions.map(q => q.category))]
    
    return categories.map(category => {
      const categoryQuestions = questions.filter(q => q.category === category)
      let agreements = 0

      categoryQuestions.forEach(question => {
        const creatorResp = creatorResponses.find(r => r.questionId === question.id)
        const partnerResp = partnerResponses.find(r => r.questionId === question.id)

        if (!creatorResp || !partnerResp) return

        if (question.type === 'boolean') {
          if (creatorResp.value === partnerResp.value) agreements++
        } else {
          const diff = Math.abs((creatorResp.value as number) - (partnerResp.value as number))
          if (diff <= 1) agreements++
        }
      })

      const agreementPercent = Math.round((agreements / categoryQuestions.length) * 100)

      return {
        category,
        agreementPercent,
        totalQuestions: categoryQuestions.length
      }
    }).sort((a, b) => b.agreementPercent - a.agreementPercent)
  }

  const stats = calculateStats()
  const categoryStats = calculateCategoryStats()

  // Top 3 forces
  const strengths = categoryStats.slice(0, 3).filter(c => c.agreementPercent >= 70)
  
  // Bottom 3 sujets à approfondir
  const toDiscuss = categoryStats.slice(-3).filter(c => c.agreementPercent < 80).reverse()

  // Score de compatibilité global
  const compatibilityScore = Math.round(
    (stats.perfectPercent + (stats.minorPercent * 0.5)) 
  )

  return (
    <div className="space-y-6">
      {/* Score de compatibilité global */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Score de Compatibilité Couple
            </h3>
            <p className="text-sm text-gray-600">
              Basé sur {stats.total} questions analysées
            </p>
          </div>
          <div className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            {compatibilityScore}%
          </div>
        </div>
      </div>

      {/* Répartition des accords */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-900">Accords Parfaits</span>
            <span className="text-2xl font-bold text-green-600">{stats.perfectAgreements}</span>
          </div>
          <div className="w-full h-2 bg-green-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500"
              style={{ width: `${stats.perfectPercent}%` }}
            />
          </div>
          <p className="text-xs text-green-700 mt-1">{stats.perfectPercent}% du total</p>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-yellow-900">Différences Légères</span>
            <span className="text-2xl font-bold text-yellow-600">{stats.minorDifferences}</span>
          </div>
          <div className="w-full h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500"
              style={{ width: `${stats.minorPercent}%` }}
            />
          </div>
          <p className="text-xs text-yellow-700 mt-1">{stats.minorPercent}% du total</p>
        </div>

        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-red-900">Désaccords Majeurs</span>
            <span className="text-2xl font-bold text-red-600">{stats.majorDisagreements}</span>
          </div>
          <div className="w-full h-2 bg-red-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-red-500"
              style={{ width: `${stats.majorPercent}%` }}
            />
          </div>
          <p className="text-xs text-red-700 mt-1">{stats.majorPercent}% du total</p>
        </div>
      </div>

      {/* Forces communes */}
      {strengths.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💪</span>
            Vos Forces Communes
          </h3>
          <div className="space-y-3">
            {strengths.map((item, index) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-sm font-semibold text-green-600">
                      {item.agreementPercent}% d'accord
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600"
                      style={{ width: `${item.agreementPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sujets à approfondir */}
      {toDiscuss.length > 0 && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">💬</span>
            Sujets à Approfondir Ensemble
          </h3>
          <div className="space-y-3">
            {toDiscuss.map((item) => (
              <div key={item.category} className="flex items-center gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm">
                  !
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">{item.category}</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {item.agreementPercent}% d'accord
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        item.agreementPercent >= 60 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                        'bg-gradient-to-r from-red-400 to-red-600'
                      }`}
                      style={{ width: `${item.agreementPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-600 italic">
            Ces domaines méritent une attention particulière. Prenez le temps d'en discuter ensemble pour mieux vous comprendre.
          </p>
        </div>
      )}

      {/* Statistiques par catégorie */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Détail par Catégorie
        </h3>
        <div className="space-y-2">
          {categoryStats.map((item) => (
            <div key={item.category} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm font-medium text-gray-700">{item.category}</span>
              <div className="flex items-center gap-3">
                <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${
                      item.agreementPercent >= 80 ? 'bg-green-500' :
                      item.agreementPercent >= 60 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${item.agreementPercent}%` }}
                  />
                </div>
                <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                  {item.agreementPercent}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
