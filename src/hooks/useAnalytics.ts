import { useEffect, useCallback, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export interface AnalyticsEventData {
  event: string
  sessionId: string
  timestamp: number
  userId?: string | null
  properties?: Record<string, any>
  userPlan?: string
}

// Générer un ID de session unique
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('nikahscore-session-id')
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`
    sessionStorage.setItem('nikahscore-session-id', sessionId)
  }
  return sessionId
}

export const useAnalytics = () => {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  // Récupérer l'utilisateur courant
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  const trackEvent = useCallback(async (
    eventType: string, 
    properties: Record<string, any> = {}
  ) => {
    try {
      const eventData: AnalyticsEventData = {
        event: eventType,
        sessionId: getSessionId(),
        timestamp: Date.now(),
        userId: user?.id || null,
        properties,
        userPlan: user?.user_metadata?.plan || 'gratuit'
      }

      // Envoyer l'événement à l'API
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      console.log('📊 Event tracked:', eventType, properties)

    } catch (error) {
      console.error('❌ Analytics tracking error:', error)
    }
  }, [user])

  // Track page view automatiquement
  useEffect(() => {
    trackEvent('page_view', {
      page: window.location.pathname,
      referrer: document.referrer || 'direct'
    })
  }, [trackEvent])

  return { trackEvent }
}
