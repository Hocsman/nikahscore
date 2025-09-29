'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function AuthSimple() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      console.log('🔑 Tentative de connexion avec:', email)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        throw error
      }

      console.log('✅ Connexion réussie:', data.user?.email)
      setMessage('✅ Connexion réussie ! Redirection...')
      
      // Redirection immédiate
      console.log('🔄 Redirection vers /questionnaire...')
      window.location.href = '/questionnaire'
      
    } catch (error: any) {
      console.error('❌ Erreur connexion:', error.message)
      setMessage(`❌ Erreur: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const testRedirect = () => {
    console.log('🧪 Test redirection directe')
    window.location.href = '/questionnaire'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">🔐 Test Connexion</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="test2@exemple.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '⏳ Connexion...' : '🔑 Se connecter'}
          </button>
        </form>
        
        <button
          onClick={testRedirect}
          className="w-full mt-4 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
        >
          🧪 Test Redirection
        </button>
        
        {message && (
          <div className={`mt-4 p-3 rounded-lg text-center ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        )}
        
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Suggestions d'emails de test :</p>
          <p>• test2@exemple.com</p>
          <p>• test@example.com</p>
        </div>
      </div>
    </div>
  )
}