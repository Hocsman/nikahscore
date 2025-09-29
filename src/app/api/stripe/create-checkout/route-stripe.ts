import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

console.log('🔥 API Stripe create-checkout chargée !')

// Debug des variables d'environnement
console.log('🔑 STRIPE_SECRET_KEY exists:', !!process.env.STRIPE_SECRET_KEY)
console.log('🔑 STRIPE_SECRET_KEY length:', process.env.STRIPE_SECRET_KEY?.length)
console.log('🔑 STRIPE_SECRET_KEY preview:', process.env.STRIPE_SECRET_KEY?.substring(0, 12) + '...')

// Initialiser Stripe seulement si la clé API existe
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-07-30.basil'
    })
  : null

console.log('🔑 Stripe initialisé:', !!stripe)

const PLAN_PRICES = {
  premium: {
    amount: 999,
    name: 'Premium',
    features: ['Analyse détaillée', 'Rapport PDF', 'Graphiques avancés']
  },
  conseil: {
    amount: 4999,
    name: 'Conseil',
    features: ['Consultation expert', 'Support personnalisé', 'Questions sur mesure']
  }
}

export async function POST(request: NextRequest) {
  console.log(' API POST appelée pour create-checkout')
  
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: 'Stripe non configuré - clé API manquante' },
        { status: 500 }
      )
    }

    const { plan, userId, email, successUrl, cancelUrl } = await request.json()

    if (!plan || !userId || !email) {
      return NextResponse.json(
        { error: 'Données manquantes: plan, userId et email requis' },
        { status: 400 }
      )
    }

    if (!PLAN_PRICES[plan as keyof typeof PLAN_PRICES]) {
      return NextResponse.json(
        { error: 'Plan invalide' },
        { status: 400 }
      )
    }

    const planConfig = PLAN_PRICES[plan as keyof typeof PLAN_PRICES]
    const supabase = await createClient()

    const { data: user, error: userError } = await supabase
      .from('profiles')
      .select('id, email')
      .eq('id', userId)
      .single()

    if (userError || !user) {
      console.log(' Utilisateur non trouvé:', userError)
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      )
    }

    let customerId: string

    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      customerId = existingCustomer.stripe_customer_id
    } else {
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: userId,
          nikahscore_user: 'true'
        }
      })

      customerId = customer.id

      await supabase
        .from('stripe_customers')
        .insert([{
          user_id: userId,
          stripe_customer_id: customerId,
          email: email
        }])
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `NikahScore ${planConfig.name}`,
              description: planConfig.features.join(', ')
            },
            recurring: {
              interval: 'month'
            },
            unit_amount: planConfig.amount
          },
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/pricing`,
      metadata: {
        userId: userId,
        plan: plan,
        nikahscore_upgrade: 'true'
      },
      subscription_data: {
        metadata: {
          userId: userId,
          plan: plan
        }
      }
    })

    await supabase
      .from('analytics_events')
      .insert([{
        event_type: 'checkout_session_created',
        user_id: userId,
        session_id: `stripe_${Date.now()}`,
        timestamp: new Date().toISOString(),
        properties: {
          plan: plan,
          amount: planConfig.amount,
          stripe_session_id: session.id
        }
      }])

    return NextResponse.json({
      success: true,
      checkoutUrl: session.url,
      sessionId: session.id
    })

  } catch (error) {
    console.error('Erreur création session Stripe:', error)
    return NextResponse.json(
      { 
        error: 'Erreur création session de paiement',
        details: error instanceof Error ? error.message : 'Erreur inconnue'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const plans = Object.entries(PLAN_PRICES).map(([key, config]) => ({
      id: key,
      name: config.name,
      price: config.amount / 100,
      priceDisplay: `${(config.amount / 100).toFixed(2)}€`,
      features: config.features,
      recommended: key === 'premium',
      popular: key === 'conseil'
    }))

    return NextResponse.json({
      success: true,
      plans: plans
    })

  } catch (error) {
    console.error('Erreur récupération plans:', error)
    return NextResponse.json(
      { error: 'Erreur récupération des plans' },
      { status: 500 }
    )
  }
}
