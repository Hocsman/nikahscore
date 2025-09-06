'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [envCheck, setEnvCheck] = useState<any>(null)

  // Test des variables d'environnement
  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/env-check')
      const data = await response.json()
      setEnvCheck(data)
    } catch (error) {
      console.error('Erreur check env:', error)
    }
  }

  // Test d'inscription avec un email factice
  const testInscription = async () => {
    setLoading(true)
    setResult(null)

    const testUser = {
      name: "Test User",
      email: `test-${Date.now()}@example.com`, // Email unique
      password: "test123456"
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      
      setResult({
        status: response.status,
        ok: response.ok,
        data: data,
        testUser: testUser
      })

    } catch (error) {
      setResult({
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <Card>
          <CardHeader>
            <CardTitle>🧪 Tests de Fonctionnement</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            
            {/* Test des variables d'environnement */}
            <div>
              <Button onClick={checkEnvironment} className="mb-4">
                🔍 Vérifier les Variables d'Environnement
              </Button>
              
              {envCheck && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">Variables d'environnement :</h3>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(envCheck, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Test d'inscription */}
            <div>
              <Button 
                onClick={testInscription} 
                disabled={loading}
                className="mb-4"
              >
                {loading ? '⏳ Test en cours...' : '📝 Tester l\'Inscription'}
              </Button>
              
              {result && (
                <div className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-bold mb-2">
                    Résultat du test : 
                    <span className={`ml-2 ${result.ok ? 'text-green-600' : 'text-red-600'}`}>
                      {result.ok ? '✅ SUCCÈS' : '❌ ÉCHEC'}
                    </span>
                  </h3>
                  <pre className="text-sm overflow-x-auto">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              )}
            </div>

          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>📋 Checklist de Vérification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 Variables Vercel à configurer :</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• <code>NEXT_PUBLIC_SITE_URL</code> = https://votre-app.vercel.app</li>
                  <li>• <code>RESEND_API_KEY</code> = votre_clé_resend</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">✅ Tests à effectuer :</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Variables d'environnement présentes</li>
                  <li>• API d'inscription fonctionnelle</li>
                  <li>• Email de bienvenue envoyé</li>
                  <li>• URL de redirection correcte</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
