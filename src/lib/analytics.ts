'use client'

// Types pour les événements analytics
export type AnalyticsEvent = 
  | 'page_view'
  | 'questionnaire_started'
  | 'questionnaire_completed'
  | 'premium_feature_clicked'
  | 'upgrade_button_clicked'
  | 'pdf_download_attempted'
  | 'email_share_attempted'
  | 'detailed_analysis_clicked'
  | 'plan_upgrade_started'
  | 'plan_upgrade_completed'
  | 'plan_upgrade_error'
  | 'user_registered'
  | 'user_login'
  | 'payment_succeeded'
  | 'payment_failed'
  | 'subscription_cancelled'
  // Nouveaux événements Stripe
  | 'upgrade_attempt'
  | 'checkout_started'
  | 'checkout_session_created'
  | 'checkout_error'
  | 'plan_purchased'
  | 'subscription_activated'

export interface AnalyticsEventData {
  event: AnalyticsEvent
  userId?: string
  sessionId: string
  timestamp: number
  properties?: Record<string, any>
  userPlan?: 'free' | 'premium' | 'conseil'
}

// Configuration des métriques clés
export const CONVERSION_FUNNEL_STEPS = [
  'landing_page_visit',
  'registration_started',
  'registration_completed', 
  'questionnaire_started',
  'questionnaire_completed',
  'results_viewed',
  'premium_feature_clicked',
  'upgrade_button_clicked',
  'checkout_started',
  'checkout_session_created',
  'payment_started',
  'payment_completed',
  'subscription_activated'
] as const

export type FunnelStep = typeof CONVERSION_FUNNEL_STEPS[number]

class AnalyticsManager {
  private events: AnalyticsEventData[] = []
  private sessionId: string
  private userId?: string

  constructor() {
    this.sessionId = this.generateSessionId()
    this.initializeSession()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private initializeSession() {
    if (typeof window !== 'undefined') {
      // Récupérer l'ID utilisateur si connecté
      const userData = localStorage.getItem('nikahscore-user')
      if (userData) {
        try {
          const user = JSON.parse(userData)
          this.userId = user.id
        } catch (e) {
          console.error('Erreur parsing user data:', e)
        }
      }
    }
  }

  // Tracker un événement
  track(event: AnalyticsEvent, properties?: Record<string, any>) {
    const eventData: AnalyticsEventData = {
      event,
      userId: this.userId,
      sessionId: this.sessionId,
      timestamp: Date.now(),
      properties: {
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        ...properties
      }
    }

    this.events.push(eventData)
    this.sendToServer(eventData)
    
    // Log en développement
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', eventData)
    }
  }

  // Tracker les conversions premium
  trackPremiumConversion(feature: string, currentPlan: string, requiredPlan: string) {
    this.track('premium_feature_clicked', {
      feature,
      currentPlan,
      requiredPlan,
      conversionOpportunity: true
    })
  }

  // Tracker l'entonnoir de conversion
  trackFunnelStep(step: FunnelStep, properties?: Record<string, any>) {
    this.track('page_view', {
      funnelStep: step,
      ...properties
    })
  }

  // Envoyer au serveur (Supabase ou service externe)
  private async sendToServer(eventData: AnalyticsEventData) {
    try {
      // Option 1: Envoyer à Supabase
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })
    } catch (error) {
      console.error('Erreur envoi analytics:', error)
      // Stocker localement en cas d'échec
      this.storeLocally(eventData)
    }
  }

  private storeLocally(eventData: AnalyticsEventData) {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nikahscore-analytics') || '[]'
      const events = JSON.parse(stored)
      events.push(eventData)
      
      // Garder seulement les 100 derniers événements
      const recentEvents = events.slice(-100)
      localStorage.setItem('nikahscore-analytics', JSON.stringify(recentEvents))
    }
  }

  // Récupérer les métriques pour le dashboard
  getMetrics() {
    return {
      totalEvents: this.events.length,
      sessionId: this.sessionId,
      userId: this.userId,
      recentEvents: this.events.slice(-10)
    }
  }

  // Calculer les taux de conversion
  calculateConversionRates() {
    const eventCounts = this.events.reduce((acc, event) => {
      acc[event.event] = (acc[event.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      questionnaire_completion_rate: this.calculateRate('questionnaire_started', 'questionnaire_completed'),
      premium_click_rate: this.calculateRate('questionnaire_completed', 'premium_feature_clicked'),
      upgrade_rate: this.calculateRate('premium_feature_clicked', 'upgrade_button_clicked'),
      payment_conversion_rate: this.calculateRate('upgrade_button_clicked', 'plan_upgrade_completed')
    }
  }

  private calculateRate(numeratorEvent: string, denominatorEvent: string): number {
    const numerator = this.events.filter(e => e.event === numeratorEvent).length
    const denominator = this.events.filter(e => e.event === denominatorEvent).length
    
    return denominator > 0 ? (numerator / denominator) * 100 : 0
  }
}

// Instance singleton
export const analytics = new AnalyticsManager()

// Hook React pour utiliser les analytics
export function useAnalytics() {
  const trackEvent = (event: AnalyticsEvent, properties?: Record<string, any>) => {
    analytics.track(event, properties)
  }

  const trackPremiumClick = (feature: string, currentPlan: string, requiredPlan: string) => {
    analytics.trackPremiumConversion(feature, currentPlan, requiredPlan)
  }

  const trackFunnelStep = (step: FunnelStep, properties?: Record<string, any>) => {
    analytics.trackFunnelStep(step, properties)
  }

  return {
    trackEvent,
    trackPremiumClick,
    trackFunnelStep,
    getMetrics: () => analytics.getMetrics(),
    getConversionRates: () => analytics.calculateConversionRates()
  }
}

// Fonctions utilitaires pour les métriques business
export const BusinessMetrics = {
  // Calculer la LTV (Lifetime Value)
  calculateLTV: (monthlyPrice: number, churnRate: number): number => {
    return monthlyPrice / churnRate
  },

  // Calculer le CAC (Customer Acquisition Cost)
  calculateCAC: (marketingSpend: number, newCustomers: number): number => {
    return marketingSpend / newCustomers
  },

  // Calculer l'ARR (Annual Recurring Revenue)
  calculateARR: (monthlySubscriptions: Record<string, number>): number => {
    const planPrices = { premium: 9.99, family: 17.99, conseil: 49.99 }
    return Object.entries(monthlySubscriptions).reduce((total, [plan, count]) => {
      const price = planPrices[plan as keyof typeof planPrices] || 0
      return total + (price * count * 12)
    }, 0)
  },

  // Calculer le taux de conversion freemium
  calculateFreemiumConversion: (freeUsers: number, paidUsers: number): number => {
    return (paidUsers / (freeUsers + paidUsers)) * 100
  }
}
