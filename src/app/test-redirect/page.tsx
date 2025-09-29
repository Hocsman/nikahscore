'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function TestRedirect() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [attempts, setAttempts] = useState(0)

  useEffect(() => {
    console.log('🧪 Test page - Auth state:', { user: !!user, loading, email: user?.email })
  }, [user, loading])

  const testRedirect = async () => {
    const attempt = attempts + 1
    setAttempts(attempt)
    console.log(`🔄 Test redirection #${attempt}`)
    
    try {
      await router.push('/questionnaire')
      console.log('✅ Redirection test réussie')
    } catch (err: any) {
      console.error('❌ Erreur test redirection:', err)
    }
  }

  const testHardRedirect = () => {
    console.log('🔄 Test redirection forcée')
    window.location.href = '/questionnaire'
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">🧪 Test Redirection</h1>
        
        <div className="space-y-4">
          <div className="border p-4 rounded">
            <h3 className="font-semibold mb-2">État d'authentification</h3>
            <div className="text-sm space-y-1">
              <div>Utilisateur: {user ? '✅ Connecté' : '❌ Non connecté'}</div>
              <div>Email: {user?.email || 'N/A'}</div>
              <div>Loading: {loading ? '⏳ Oui' : '✅ Non'}</div>
              <div>ID: {user?.id || 'N/A'}</div>
            </div>
          </div>

          <button 
            onClick={testRedirect}
            className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            🔄 Test Router Push ({attempts})
          </button>

          <button 
            onClick={testHardRedirect}
            className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            🚀 Test Window.location
          </button>

          <a 
            href="/questionnaire"
            className="block w-full text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            🔗 Lien normal
          </a>

          <a 
            href="/auth?mode=login"
            className="block w-full text-center bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            ← Retour auth
          </a>
        </div>
      </div>
    </div>
  )
}