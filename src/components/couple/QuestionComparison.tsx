'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

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

interface QuestionComparisonProps {
  questions: Question[]
  creatorName: string
  partnerName: string
  creatorResponses: Response[]
  partnerResponses: Response[]
}

type AgreementLevel = 'perfect' | 'slight' | 'disagreement'

export default function QuestionComparison({
  questions,
  creatorName,
  partnerName,
  creatorResponses,
  partnerResponses
}: QuestionComparisonProps) {
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({})

  // Grouper les questions par catégorie
  const questionsByCategory = questions.reduce((acc, question) => {
    if (!acc[question.category]) {
      acc[question.category] = []
    }
    acc[question.category].push(question)
    return acc
  }, {} as Record<string, Question[]>)

  // Calculer le niveau d'accord
  const calculateAgreement = (
    question: Question,
    creatorValue: boolean | number,
    partnerValue: boolean | number
  ): { level: AgreementLevel; difference?: number } => {
    if (question.type === 'boolean') {
      return {
        level: creatorValue === partnerValue ? 'perfect' : 'disagreement'
      }
    } else {
      const diff = Math.abs((creatorValue as number) - (partnerValue as number))
      if (diff <= 1) return { level: 'perfect', difference: diff }
      if (diff <= 3) return { level: 'slight', difference: diff }
      return { level: 'disagreement', difference: diff }
    }
  }

  // Obtenir les badges et couleurs
  const getBadgeConfig = (level: AgreementLevel) => {
    switch (level) {
      case 'perfect':
        return {
          text: '✅ ACCORD PARFAIT',
          className: 'bg-green-100 text-green-800 border-green-300'
        }
      case 'slight':
        return {
          text: '⚠️ LÉGÈRE DIFFÉRENCE',
          className: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        }
      case 'disagreement':
        return {
          text: '❌ DÉSACCORD - À DISCUTER',
          className: 'bg-red-100 text-red-800 border-red-300'
        }
    }
  }

  // Calculer le % d'accord par catégorie
  const getCategoryAgreement = (category: string) => {
    const categoryQuestions = questionsByCategory[category]
    if (!categoryQuestions) return 0

    let perfectCount = 0
    categoryQuestions.forEach(q => {
      const creatorResp = creatorResponses.find(r => r.questionId === q.id)
      const partnerResp = partnerResponses.find(r => r.questionId === q.id)
      
      if (creatorResp && partnerResp) {
        const { level } = calculateAgreement(q, creatorResp.value, partnerResp.value)
        if (level === 'perfect') perfectCount++
      }
    })

    return Math.round((perfectCount / categoryQuestions.length) * 100)
  }

  // Toggle catégorie
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }))
  }

  // Formater la valeur de réponse
  const formatValue = (question: Question, value: boolean | number): string => {
    if (question.type === 'boolean') {
      return value ? '✓ Oui' : '✗ Non'
    }
    return `${value}/5`
  }

  return (
    <div className="space-y-4">
      {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => {
        const agreementPercent = getCategoryAgreement(category)
        const isExpanded = expandedCategories[category]

        return (
          <div key={category} className="border border-gray-200 rounded-lg overflow-hidden">
            {/* En-tête de catégorie */}
            <button
              onClick={() => toggleCategory(category)}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
                <span className="text-sm text-gray-600">
                  {categoryQuestions.length} questions
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        agreementPercent >= 80 ? 'bg-green-500' :
                        agreementPercent >= 60 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${agreementPercent}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {agreementPercent}% accord
                  </span>
                </div>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </button>

            {/* Questions de la catégorie */}
            {isExpanded && (
              <div className="divide-y divide-gray-100">
                {categoryQuestions.map((question) => {
                  const creatorResp = creatorResponses.find(r => r.questionId === question.id)
                  const partnerResp = partnerResponses.find(r => r.questionId === question.id)

                  if (!creatorResp || !partnerResp) return null

                  const { level, difference } = calculateAgreement(
                    question,
                    creatorResp.value,
                    partnerResp.value
                  )
                  const badgeConfig = getBadgeConfig(level)

                  return (
                    <div key={question.id} className="px-6 py-4 bg-white hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <p className="text-gray-800 font-medium flex-1 pr-4">
                          {question.text}
                        </p>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border whitespace-nowrap ${badgeConfig.className}`}>
                          {badgeConfig.text}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Réponse du créateur */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold text-sm">
                            {creatorName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{creatorName}</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatValue(question, creatorResp.value)}
                            </p>
                          </div>
                        </div>

                        {/* Réponse du partenaire */}
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-semibold text-sm">
                            {partnerName[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">{partnerName}</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatValue(question, partnerResp.value)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {difference !== undefined && difference > 0 && (
                        <p className="mt-2 text-xs text-gray-500 italic">
                          Écart de {difference} point{difference > 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
