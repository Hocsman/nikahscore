'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthDiagnostic() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const addResult = (test: string, result: any, success: boolean) => {
    setResults(prev => [...prev, {
      test,
      result: typeof result === 'object' ? JSON.stringify(result, null, 2) : result,
      success,
      timestamp: new Date().toLocaleTimeString()
    }])
  }

  const testSupabaseConnection = async () => {
    setLoading(true)
    addResult('Connexion Supabase', 'En cours...', true)
    
    try {
      const supabase = createClient()
      
      // Test 1: Session actuelle
      const { data: session, error: sessionError } = await supabase.auth.getSession()
      addResult('Session actuelle', { session: !!session.session, error: sessionError?.message }, !sessionError)
      
      // Test 2: Requête simple à la DB
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('count', { count: 'exact', head: true })
      
      addResult('Requête DB profiles', { count: profiles, error: profileError?.message }, !profileError)
      
    } catch (error: any) {
      addResult('Connexion Supabase', error.message, false)
    } finally {
      setLoading(false)
    }
  }

  const testInscription = async () => {
    setLoading(true)
    const email = `test${Date.now()}@example.com`
    
    addResult('Test inscription', `Création avec email: ${email}`, true)
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: email,
          password: 'test123456'
        })
      })

      const result = await response.json()
      addResult(`API Inscription (${response.status})`, result, response.ok)
      
    } catch (error: any) {
      addResult('API Inscription', error.message, false)
    } finally {
      setLoading(false)
    }
  }

  const testConnexion = async () => {
    setLoading(true)
    addResult('Test connexion', 'Tentative avec credentials existants...', true)
    
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com', // Email existant
        password: 'test123456'
      })

      addResult('Connexion Supabase', { 
        user: !!data.user, 
        session: !!data.session,
        error: error?.message 
      }, !error)
      
    } catch (error: any) {
      addResult('Connexion Supabase', error.message, false)
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => setResults([])

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">🔧 Diagnostic Authentification</h1>
          
          {/* Boutons de test */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={testSupabaseConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              🔌 Test Connexion
            </button>
            
            <button 
              onClick={testInscription}
              disabled={loading}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              ✍️ Test Inscription
            </button>
            
            <button 
              onClick={testConnexion}
              disabled={loading}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              🔑 Test Login
            </button>
            
            <button 
              onClick={clearResults}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              🗑️ Vider
            </button>
          </div>

          {loading && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2">Test en cours...</p>
            </div>
          )}

          {/* Résultats */}
          <div className="space-y-4">
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`border rounded-lg p-4 ${
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`font-semibold ${result.success ? 'text-green-800' : 'text-red-800'}`}>
                    {result.success ? '✅' : '❌'} {result.test}
                  </h3>
                  <span className="text-sm text-gray-500">{result.timestamp}</span>
                </div>
                <pre className="text-sm overflow-auto bg-gray-100 p-2 rounded">
                  {result.result}
                </pre>
              </div>
            ))}
            
            {results.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Aucun test exécuté. Cliquez sur un bouton pour commencer.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}