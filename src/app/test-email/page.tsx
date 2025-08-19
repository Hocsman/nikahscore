'use client'

import { useState } from 'react'

export default function TestEmailPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const testEmail = async () => {
    setLoading(true)
    setStatus('')

    try {
      const response = await fetch('/api/send-results', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: 'Test User',
          globalScore: 85,
          axisScores: [
            { axis: 'Test Axis', percentage: 85, questionCount: 5, dealbreakers: 0, dealbreakersPassed: 0 }
          ],
          dealbreakersTotal: 0,
          dealbreakersPassed: 0,
          recommendations: ['Test recommendation'],
          strengths: ['Test strength'],
          concerns: ['Test concern']
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        setStatus(`✅ SUCCESS: ${data.message} ${data.demo ? '(Mode démo)' : '(Email réel)'} - ID: ${data.emailId}`)
      } else {
        setStatus(`❌ ERROR: ${data.error} ${data.details ? '- ' + data.details : ''}`)
      }
    } catch (error) {
      setStatus(`❌ NETWORK ERROR: ${error}`)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Email System</h1>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Adresse email de test:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="votre@email.com"
          />
        </div>

        <button
          onClick={testEmail}
          disabled={!email || loading}
          className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-medium disabled:bg-gray-400"
        >
          {loading ? 'Envoi en cours...' : 'Tester l\'envoi d\'email'}
        </button>

        {status && (
          <div className={`p-4 rounded-lg ${
            status.includes('SUCCESS') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            <pre className="whitespace-pre-wrap text-sm">{status}</pre>
          </div>
        )}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Instructions:</h3>
        <ol className="text-sm space-y-1">
          <li>1. Entrez votre adresse email</li>
          <li>2. Cliquez sur "Tester l'envoi d'email"</li>
          <li>3. Regardez le message de retour</li>
          <li>4. Vérifiez vos emails (et spam)</li>
        </ol>
      </div>
    </div>
  )
}
