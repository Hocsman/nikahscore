import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <Heart className="w-16 h-16 text-pink-400 dark:text-pink-500 mx-auto mb-6" />
        <h1 className="text-6xl font-bold text-gray-300 dark:text-gray-600 mb-2">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
          Page introuvable
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild>
            <Link href="/">Retour à l'accueil</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/questionnaire">Questionnaire</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
