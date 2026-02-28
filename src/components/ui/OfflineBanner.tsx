'use client'

import { useEffect } from 'react'
import { WifiOff } from 'lucide-react'
import { toast } from 'sonner'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'

export function OfflineBanner() {
  const { isOnline, wasOffline, clearWasOffline } = useNetworkStatus()

  useEffect(() => {
    if (isOnline && wasOffline) {
      toast.success('Connexion rétablie', {
        description: 'Vous êtes de nouveau en ligne.',
        duration: 3000,
      })
      clearWasOffline()
    }
  }, [isOnline, wasOffline, clearWasOffline])

  if (isOnline) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 dark:bg-amber-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2 shadow-md">
      <WifiOff className="w-4 h-4" />
      <span>Vous êtes hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.</span>
    </div>
  )
}
