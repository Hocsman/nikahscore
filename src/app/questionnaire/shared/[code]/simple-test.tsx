'use client'

import { useState, useEffect } from 'react'

interface SharedQuestionnairePageProps {
  params: Promise<{
    code: string
  }>
}

export default function SharedQuestionnairePage({ params }: SharedQuestionnairePageProps) {
  const [resolvedParams, setResolvedParams] = useState<{ code: string } | null>(null)

  useEffect(() => {
    const resolveParams = async () => {
      const resolved = await params
      setResolvedParams(resolved)
    }
    resolveParams()
  }, [params])

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Questionnaire Partagé - Test Simple
          </h1>
          <p className="text-gray-600">
            Code: {resolvedParams?.code || 'Chargement...'}
          </p>
        </div>
      </div>
    </div>
  )
}