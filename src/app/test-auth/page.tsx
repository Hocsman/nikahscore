'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [status, setStatus] = useState('Test en cours...')
  const [user, setUser] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testConnection = async () => {
      try {
        const supabase = createClient()
        
        // Test 1: Vérifier la connexion
        setStatus('🔄 Test de connexion Supabase...')
        const { data: session, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
          setError(`Erreur session: ${sessionError.message}`)
          return
        }
        
        setStatus('✅ Connexion Supabase OK')
        setUser(session?.session?.user || null)
        
        // Test 2: Test de requête simple
        setStatus('🔄 Test de requête à la base...')
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('count')
          .limit(1)
        
        if (profilesError) {
          setError(`Erreur requête: ${profilesError.message}`)
          return
        }
        
        setStatus('✅ Tous les tests sont OK!')
        
      } catch (err) {
        setError(`Erreur inattendue: ${err}`)
      }
    }
    
    testConnection()
  }, [])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test d'Authentification</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h3 className="font-semibold">Statut:</h3>
          <p>{status}</p>
        </div>
        
        {error && (
          <div className="p-4 border border-red-300 bg-red-50 rounded">
            <h3 className="font-semibold text-red-800">Erreur:</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {user && (
          <div className="p-4 border border-green-300 bg-green-50 rounded">
            <h3 className="font-semibold text-green-800">Utilisateur connecté:</h3>
            <pre className="text-sm text-green-700">{JSON.stringify(user, null, 2)}</pre>
          </div>
        )}
        
        {!user && !error && (
          <div className="p-4 border border-gray-300 bg-gray-50 rounded">
            <p>Aucun utilisateur connecté</p>
          </div>
        )}
      </div>
    </div>
  )
}