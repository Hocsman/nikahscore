'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, CreditCard, Crown, Star } from 'lucide-react'
import { useUser } from '@/hooks/useUser'
import { useAnalytics } from '@/lib/analytics'
import { useRouter } from 'next/navigation'

interface StripeCheckoutProps {
  plan: 'premium' | 'conseil'
  isAnnual?: boolean
  children?: React.ReactNode
  className?: string
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
}

export default function StripeCheckout({ 
  plan, 
  isAnnual = false, 
  children, 
  className,
  size = 'default',
  variant = 'default'
}: StripeCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const { user, loading: userLoading } = useUser()
  const { trackEvent } = useAnalytics()
  const router = useRouter()

  const planDetails = {
    premium: {
      name: 'Premium',
      icon: <Star className="w-4 h-4" />,
      price: isAnnual ? '6,67€/mois' : '9,99€/mois'
    },
    conseil: {
      name: 'Conseil',
      icon: <Crown className="w-4 h-4" />,
      price: isAnnual ? '41,67€/mois' : '49,99€/mois'
    }
  }

  const handleCheckout = async () => {
    if (userLoading) return

    if (!user) {
      // Rediriger vers l'inscription avec le plan en paramètre
      trackEvent('upgrade_attempt', {
        plan,
        billing: isAnnual ? 'annual' : 'monthly',
        error: 'user_not_authenticated',
        redirect: 'auth'
      })
      
      // Utiliser useRouter pour une navigation client-side fiable
      const authUrl = `/auth?redirect=/pricing&plan=${plan}&billing=${isAnnual ? 'annual' : 'monthly'}`
      router.push(authUrl)
      return
    }

    try {
      setLoading(true)
      
      // Track l'événement de démarrage de checkout
      trackEvent('checkout_started', {
        plan,
        billing: isAnnual ? 'annual' : 'monthly',
        userId: user.id,
        source: 'pricing_page'
      })

      // Créer la session Stripe
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan,
          userId: user.id,
          email: user.email,
          isAnnual,
          successUrl: `${window.location.origin}/success?plan=${plan}&billing=${isAnnual ? 'annual' : 'monthly'}`,
          cancelUrl: window.location.href
        })
      })

      const data = await response.json()

      if (data.success && data.checkoutUrl) {
        // Track succès de création de session
        trackEvent('checkout_session_created', {
          plan,
          billing: isAnnual ? 'annual' : 'monthly',
          sessionId: data.sessionId,
          userId: user.id
        })
        
        // Rediriger vers Stripe Checkout
        window.location.href = data.checkoutUrl
      } else {
        throw new Error(data.error || 'Erreur création session')
      }

    } catch (error) {
      console.error('Erreur checkout:', error)
      
      // Track l'erreur
      trackEvent('checkout_error', {
        plan,
        billing: isAnnual ? 'annual' : 'monthly',
        error: error instanceof Error ? error.message : 'unknown_error',
        userId: user?.id
      })
      
      // Afficher l'erreur à l'utilisateur
      alert(`Erreur lors de la création du paiement: ${error instanceof Error ? error.message : 'Erreur inconnue'}`)
    } finally {
      setLoading(false)
    }
  }

  const isDisabled = loading || userLoading

  return (
    <Button
      onClick={handleCheckout}
      disabled={isDisabled}
      size={size}
      variant={variant}
      className={className}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <CreditCard className="w-4 h-4 mr-2" />
      )}
      
      {children || (
        <>
          {loading ? 'Redirection...' : `Souscrire ${planDetails[plan].name}`}
          {!loading && (
            <span className="ml-1 opacity-75">
              • {planDetails[plan].price}
            </span>
          )}
        </>
      )}
    </Button>
  )
}

// Hook personnalisé pour vérifier si l'utilisateur a déjà un plan actif
export function useUserSubscription() {
  const { user } = useUser()
  
  const hasActivePlan = user?.subscription_status === 'active' && 
    user?.subscription_plan && 
    user?.subscription_plan !== 'gratuit'
  
  const isPremium = user?.subscription_plan === 'premium' && hasActivePlan
  const isConseil = user?.subscription_plan === 'conseil' && hasActivePlan
  
  return {
    hasActivePlan,
    isPremium,
    isConseil,
    currentPlan: user?.subscription_plan || 'gratuit',
    subscriptionStatus: user?.subscription_status || 'inactive'
  }
}
