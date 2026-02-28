'use client'

import { useEffect } from 'react'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function CoupleError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Dashboard couple error:', error)
  }, [error])

  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center py-16">
        <Card className="max-w-md w-full border-amber-200 dark:border-amber-800">
          <CardContent className="pt-8 pb-6 text-center">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
              Une erreur est survenue
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Impossible de charger cette page. Veuillez réessayer.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => reset()} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Réessayer
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Tableau de bord
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
