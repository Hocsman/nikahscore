'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface EmailModalProps {
  isOpen: boolean
  onClose: () => void
  resultData: {
    globalScore: number
    axisScores: Array<{
      axis: string
      percentage: number
      questionCount: number
      dealbreakers: number
      dealbreakersPassed: number
    }>
    dealbreakersTotal: number
    dealbreakersPassed: number
    recommendations: string[]
    strengths: string[]
    concerns: string[]
  }
}

export default function EmailModal({ isOpen, onClose, resultData }: EmailModalProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name,
          ...resultData
        })
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          onClose()
          setSuccess(false)
          setEmail('')
          setName('')
        }, 2000)
      } else {
        setError(result.error || 'Erreur lors de l\'envoi')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl">
        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✅</span>
            </div>
            <h2 className="text-xl font-semibold text-green-800 mb-2">Email Envoyé !</h2>
            <p className="text-green-600">
              Vos résultats ont été envoyés à votre adresse email.
            </p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                📧 Recevoir mes résultats
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{resultData.globalScore >= 80 ? '🎉' : resultData.globalScore >= 65 ? '👍' : resultData.globalScore >= 50 ? '📊' : '📈'}</span>
                <div>
                  <div className="font-bold text-blue-800">Score: {resultData.globalScore}%</div>
                  <div className="text-sm text-blue-600">
                    {resultData.dealbreakersPassed}/{resultData.dealbreakersTotal} critères essentiels
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleSendEmail}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom (optionnel)
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Votre prénom..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !email}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Envoi...
                    </>
                  ) : (
                    '📧 Envoyer'
                  )}
                </Button>
              </div>
            </form>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Votre email ne sera utilisé que pour l'envoi de ces résultats.<br/>
              Aucun spam, données protégées.
            </div>
          </>
        )}
      </Card>
    </div>
  )
}
