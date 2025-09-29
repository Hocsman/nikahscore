'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AuthFixed() {
  const [email, setEmail] = useState('test.demo@example.com')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const supabase = createClient()

  const handleRegister = async () => {
    setLoading(true)
    setMessage('')

    try {
      console.log('📝 Inscription avec:', email)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: 'Demo User'
          }
        }
      })

      if (error) throw error

      console.log('✅ Inscription réussie')
      setMessage('✅ Compte créé ! Vous pouvez maintenant vous connecter.')
      
    } catch (error: any) {
      console.error('❌ Erreur inscription:', error.message)
      setMessage(`❌ Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async () => {
    setLoading(true)
    setMessage('')

    try {
      console.log('🔑 Connexion avec:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      console.log('✅ Connexion réussie:', data.user?.email)
      setMessage('✅ Connexion réussie ! Redirection immédiate...')
      
      // Redirection simple et directe
      console.log('🚀 Redirection vers /questionnaire')
      
      // Méthode la plus fiable
      setTimeout(() => {
        window.location.replace('/questionnaire')
      }, 500)
      
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error.message)
      
      if (error.message.includes('Invalid login credentials')) {
        setMessage('❌ Email ou mot de passe incorrect. Essayez de créer le compte d\'abord.')
      } else {
        setMessage(`❌ Erreur: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const testDirect = () => {
    console.log('🧪 Test redirection directe')
    window.location.href = '/questionnaire'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          🔧 Test Authentification Fixée
        </h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleRegister}
              disabled={loading}
              className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '⏳' : '📝'} S'inscrire
            </button>
            
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              {loading ? '⏳' : '🔑'} Se connecter
            </button>
          </div>
          
          <button
            onClick={testDirect}
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            🧪 Test redirection directe
          </button>
        </div>
        
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center transition-all ${
            message.includes('✅') 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <h3 className="font-semibold mb-2">💡 Instructions :</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Cliquez sur "S'inscrire" pour créer le compte</li>
            <li>Puis cliquez sur "Se connecter" pour tester la redirection</li>
            <li>La redirection devrait fonctionner en 0.5 seconde</li>
          </ol>
        </div>
      </div>
    </div>
  )
}