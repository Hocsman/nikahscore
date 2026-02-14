'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Page error:', error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Une erreur est survenue
        </h2>
        <p className="text-gray-600 mb-8">
          Nous sommes désolés, quelque chose s'est mal passé. Veuillez réessayer.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            Réessayer
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            Retour à l'accueil
          </Button>
        </div>
      </div>
    </div>
  )
}
